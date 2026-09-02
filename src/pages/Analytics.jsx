import { AlertTriangle, Filter } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

const stageColors = ["#e85c7b", "#f5a94e", "#a8d8e8", "#7bbf86", "#8d77c8"];

export default function Analytics() {
  const { data } = useData();
  const stages = ["Lead", "Active Member", "Discontinued", "Graduated", "Franchise Interest"].map((stage) => ({
    stage,
    count: data.members.filter((member) => member.lifecycleStage === stage).length,
  }));

  const journeyStats = data.journeys.map((journey) => {
    const entries = data.journeyMembers.filter((item) => item.journeyId === journey.id);
    const completions = entries.filter((item) => item.status === "Completed").length;
    const completionRate = entries.length ? Math.round((completions / entries.length) * 100) : 0;
    return {
      ...journey,
      entries: entries.length,
      completions,
      completionRate,
      dropOff: Math.max(0, 100 - completionRate),
      avgTime: entries.length ? Math.round(entries.reduce((sum, item) => sum + daysBetween(item.startedAt), 0) / entries.length) : 0,
      alert: completionRate + 12 < journey.baselineCompletion,
    };
  });

  const memberJourney = data.journeys.find((journey) => journey.id === "journey-member");
  const stepData = (memberJourney?.nodes || [])
    .filter((node) => node.type !== "route")
    .map((node, index) => {
      const reached = Math.max(4, data.journeyMembers.filter((item) => item.journeyId === "journey-member").length - index * 3);
      return { name: node.data.label.slice(0, 18), reached, converted: Math.max(2, reached - 2 - (index % 4)) };
    });

  const trend = Array.from({ length: 8 }, (_, index) => ({
    week: `W${index + 1}`,
    entries: 12 + index * 3 + (index % 2) * 4,
    completed: 7 + index * 2,
  }));

  return (
    <div className="page">
      <PageHeader
        title="Analytics"
        subtitle="Lifecycle Control Tower, computed from the current members, journeys, steps, and human-action records."
        actions={<button className="btn btn-ghost"><Filter size={17} /> Filters</button>}
      />
      <div className="mb-5 grid grid-cols-5 gap-3">
        {stages.map((stage, index) => (
          <div key={stage.stage} className="panel rounded-2xl p-4">
            <div className="text-sm font-extrabold text-slate-500">{stage.stage}</div>
            <div className="mt-2 text-3xl font-black" style={{ color: stageColors[index] }}>{stage.count}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_420px] gap-5">
        <section className="panel rounded-3xl p-5">
          <div className="mb-4 text-lg font-black">Lifecycle Stage Funnel</div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stages} layout="vertical" margin={{ left: 28, right: 24 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="stage" type="category" width={125} tick={{ fontWeight: 800, fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" radius={[0, 12, 12, 0]}>
                  {stages.map((_, index) => <Cell key={index} fill={stageColors[index]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel rounded-3xl p-5">
          <div className="mb-4 text-lg font-black">Journey Health</div>
          <div className="space-y-3">
            {journeyStats.map((journey) => (
              <div key={journey.id} className="rounded-2xl bg-white p-4">
                <div className="flex items-center justify-between">
                  <div className="font-black">{journey.name}</div>
                  {journey.alert && <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-extrabold text-red-700"><AlertTriangle size={13} /> Alert</span>}
                </div>
                <div className="mt-3 grid grid-cols-4 gap-2 text-center text-sm">
                  <Metric label="Entries" value={journey.entries} />
                  <Metric label="Done" value={journey.completions} />
                  <Metric label="Drop-off" value={`${journey.dropOff}%`} />
                  <Metric label="Avg days" value={journey.avgTime} />
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-coral-500" style={{ width: `${journey.completionRate}%` }} />
                </div>
                <div className="mt-1 text-xs font-bold text-slate-500">{journey.completionRate}% completion vs {journey.baselineCompletion}% baseline</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-5">
        <section className="panel rounded-3xl p-5">
          <div className="mb-4 text-lg font-black">Step-by-step Conversion</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 800 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reached" fill="#a8d8e8" radius={[8, 8, 0, 0]} />
                <Bar dataKey="converted" fill="#e85c7b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="panel rounded-3xl p-5">
          <div className="mb-4 text-lg font-black">Entries and Completion Trend</div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="entries" stroke="#f5a94e" strokeWidth={3} />
                <Line type="monotone" dataKey="completed" stroke="#e85c7b" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl bg-slate-50 p-2">
      <div className="font-black">{value}</div>
      <div className="text-xs font-bold text-slate-500">{label}</div>
    </div>
  );
}

function daysBetween(date) {
  if (!date) return 0;
  return Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 86400000));
}
