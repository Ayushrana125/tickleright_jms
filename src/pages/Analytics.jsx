import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Filter, Layers, MapPin, TrendingUp, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

const stageColors = ["#e85c7b", "#f5a94e", "#a8d8e8", "#7bbf86", "#8d77c8"];

const cityScales = {
  All: { scale: 1.0, label: "Pan-India (All Centres)" },
  Mumbai: { scale: 0.40, label: "Mumbai Region" },
  Delhi: { scale: 0.22, label: "Delhi NCR Region" },
  Bengaluru: { scale: 0.18, label: "Bengaluru Region" },
  Pune: { scale: 0.12, label: "Pune Region" },
  Hyderabad: { scale: 0.08, label: "Hyderabad Region" },
};

export default function Analytics() {
  const { data } = useData();
  const [selectedCity, setSelectedCity] = useState("All");

  const scale = cityScales[selectedCity]?.scale || 1.0;

  // Real-world Tickle Right Business Scale (5k-7k active members baseline)
  const baseNumbers = {
    leads: 18540,
    active: 6420,
    graduated: 2850,
    discontinued: 980,
    franchise: 380,
  };

  const totalFamilies = Math.round(
    (baseNumbers.leads + baseNumbers.active + baseNumbers.graduated + baseNumbers.discontinued + baseNumbers.franchise) * scale
  );

  const stages = useMemo(() => {
    const raw = [
      { stage: "Lead", count: Math.round(baseNumbers.leads * scale) },
      { stage: "Active Member", count: Math.round(baseNumbers.active * scale) },
      { stage: "Graduated", count: Math.round(baseNumbers.graduated * scale) },
      { stage: "Discontinued", count: Math.round(baseNumbers.discontinued * scale) },
      { stage: "Franchise Interest", count: Math.round(baseNumbers.franchise * scale) },
    ];
    return raw.map((item) => ({
      ...item,
      pct: Math.round((item.count / totalFamilies) * 100),
    }));
  }, [scale, totalFamilies]);

  // Scaled journey performance
  const journeyStats = useMemo(() => {
    return [
      {
        id: "journey-member",
        name: "Member Journey",
        entries: Math.round(6420 * scale),
        completions: Math.round(5340 * scale),
        completionRate: 83,
        baselineCompletion: 78,
        dropOff: 17,
        avgTime: 142,
        status: "Active",
      },
      {
        id: "journey-cold-lead",
        name: "Cold Lead Nurture",
        entries: Math.round(18540 * scale),
        completions: Math.round(4635 * scale),
        completionRate: 25,
        baselineCompletion: 22,
        dropOff: 75,
        avgTime: 14,
        status: "Active",
      },
      {
        id: "journey-renewal",
        name: "Renewal Reminder Journey",
        entries: Math.round(3120 * scale),
        completions: Math.round(2714 * scale),
        completionRate: 87,
        baselineCompletion: 82,
        dropOff: 13,
        avgTime: 21,
        status: "Active",
      },
      {
        id: "journey-discontinued",
        name: "Discontinued Recovery & Winback",
        entries: Math.round(980 * scale),
        completions: Math.round(245 * scale),
        completionRate: 25,
        baselineCompletion: 20,
        dropOff: 75,
        avgTime: 42,
        status: "Active",
      },
      {
        id: "journey-alumni",
        name: "Graduate Alumni Loop",
        entries: Math.round(2850 * scale),
        completions: Math.round(2310 * scale),
        completionRate: 81,
        baselineCompletion: 75,
        dropOff: 19,
        avgTime: 90,
        status: "Active",
      },
      {
        id: "journey-franchise",
        name: "Franchise Investor Lead",
        entries: Math.round(380 * scale),
        completions: Math.round(42 * scale),
        completionRate: 11,
        baselineCompletion: 10,
        dropOff: 89,
        avgTime: 60,
        status: "Active",
      },
    ];
  }, [scale]);

  // Step by step retention for Member Journey
  const stepData = useMemo(() => {
    return [
      { name: "M+1 Welcome WA", reached: Math.round(6380 * scale), converted: Math.round(6240 * scale) },
      { name: "M+5 Trainer Intro", reached: Math.round(6180 * scale), converted: Math.round(6010 * scale) },
      { name: "M+9 Counsellor Call", reached: Math.round(5920 * scale), converted: Math.round(5680 * scale) },
      { name: "M+17 Home Activity", reached: Math.round(5810 * scale), converted: Math.round(5540 * scale) },
      { name: "M+30 Check-in Email", reached: Math.round(5690 * scale), converted: Math.round(5380 * scale) },
      { name: "M+100 Small Gift", reached: Math.round(5410 * scale), converted: Math.round(5260 * scale) },
      { name: "M+367 Annual Touch", reached: Math.round(4850 * scale), converted: Math.round(4420 * scale) },
    ];
  }, [scale]);

  // Weekly cohort throughput
  const trend = useMemo(() => {
    return [
      { week: "Wk 1", entries: Math.round(145 * scale), completed: Math.round(112 * scale) },
      { week: "Wk 2", entries: Math.round(158 * scale), completed: Math.round(124 * scale) },
      { week: "Wk 3", entries: Math.round(172 * scale), completed: Math.round(135 * scale) },
      { week: "Wk 4", entries: Math.round(164 * scale), completed: Math.round(128 * scale) },
      { week: "Wk 5", entries: Math.round(180 * scale), completed: Math.round(142 * scale) },
      { week: "Wk 6", entries: Math.round(195 * scale), completed: Math.round(155 * scale) },
      { week: "Wk 7", entries: Math.round(188 * scale), completed: Math.round(149 * scale) },
      { week: "Wk 8", entries: Math.round(204 * scale), completed: Math.round(162 * scale) },
    ];
  }, [scale]);

  return (
    <div className="page">
      <PageHeader
        title="Lifecycle Control Tower"
        subtitle="Executive operations dashboard: customer lifecycle pipeline, journey conversion health, and regional breakdown."
        actions={
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-500">Filter Region:</span>
            <select
              className="field !py-1.5 !px-3 text-xs font-bold !w-auto bg-white shadow-xs"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="All">Pan-India (All Centres)</option>
              <option value="Mumbai">Mumbai (40% base)</option>
              <option value="Delhi">Delhi NCR (22% base)</option>
              <option value="Bengaluru">Bengaluru (18% base)</option>
              <option value="Pune">Pune (12% base)</option>
              <option value="Hyderabad">Hyderabad (8% base)</option>
            </select>
          </div>
        }
      />

      {/* Lifecycle Stage Cards */}
      <div className="mb-6 grid grid-cols-5 gap-3.5">
        {stages.map((item, index) => (
          <div key={item.stage} className="panel rounded-2xl p-4.5 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-500">{item.stage}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-600">
                {item.pct}%
              </span>
            </div>
            <div className="mt-2 text-3xl font-black" style={{ color: stageColors[index] }}>
              {item.count.toLocaleString()}
            </div>
            <div className="mt-1 text-[11px] font-bold text-slate-400">
              {item.stage === "Lead"
                ? "Inquiry pipeline"
                : item.stage === "Active Member"
                ? "Enrolled students"
                : item.stage === "Graduated"
                ? "Alumni circle"
                : item.stage === "Discontinued"
                ? "Winback target"
                : "Investor leads"}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-[1fr_420px] gap-6">
        {/* Stage Funnel Chart */}
        <section className="panel rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <div className="text-base font-black text-slate-800">
                {cityScales[selectedCity]?.label} — Funnel Distribution
              </div>
              <div className="text-xs font-bold text-slate-400">
                Volume across the entire parent relationship lifecycle
              </div>
            </div>
            <span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-black text-coral-600">
              {totalFamilies.toLocaleString()} Total Families
            </span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stages} layout="vertical" margin={{ left: 24, right: 36 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tickFormatter={(val) => val.toLocaleString()} />
                <YAxis dataKey="stage" type="category" width={130} tick={{ fontWeight: 800, fontSize: 12 }} />
                <Tooltip formatter={(value) => [value.toLocaleString(), "Families"]} />
                <Bar dataKey="count" radius={[0, 10, 10, 0]}>
                  {stages.map((_, index) => (
                    <Cell key={index} fill={stageColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Journey Health Cards */}
        <section className="panel rounded-3xl p-5 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="text-base font-black text-slate-800">Journey Health & Autopilot</div>
              <span className="text-xs font-bold text-slate-500">6 Active Journeys</span>
            </div>

            <div className="space-y-2.5 max-h-[300px] overflow-auto pr-1">
              {journeyStats.map((journey) => (
                <div
                  key={journey.id}
                  className="rounded-2xl border border-slate-100 bg-white p-3 shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-extrabold text-slate-800 text-xs">{journey.name}</div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                      <CheckCircle2 size={11} /> Healthy ({journey.completionRate}%)
                    </span>
                  </div>

                  <div className="mt-2 grid grid-cols-4 gap-1 text-center text-[11px]">
                    <Metric label="Entries" value={journey.entries.toLocaleString()} />
                    <Metric label="Done" value={journey.completions.toLocaleString()} />
                    <Metric label="Drop-off" value={`${journey.dropOff}%`} />
                    <Metric label="Avg days" value={`${journey.avgTime}d`} />
                  </div>

                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-coral-500 transition-all duration-500"
                      style={{ width: `${journey.completionRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-xl bg-slate-50 p-2.5 text-center text-xs font-bold text-slate-500">
            All journeys running within historical target thresholds.
          </div>
        </section>
      </div>

      {/* Step by step drop-off & Trend */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        <section className="panel rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="mb-1 text-base font-black text-slate-800">
            Member Journey — Step-by-Step Retention
          </div>
          <div className="mb-4 text-xs font-bold text-slate-500">
            Enrolled Families Reached (Blue) vs Engaged/Converted (Coral) through 367 Days
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stepData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 10, fontWeight: 800 }}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                  height={65}
                />
                <YAxis tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip formatter={(value) => [value.toLocaleString(), "Students"]} />
                <Bar dataKey="reached" fill="#a8d8e8" radius={[6, 6, 0, 0]} name="Reached Step" />
                <Bar dataKey="converted" fill="#e85c7b" radius={[6, 6, 0, 0]} name="Engaged / Completed" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel rounded-3xl p-5 border border-slate-200/80 shadow-sm">
          <div className="mb-1 text-base font-black text-slate-800">
            Weekly Throughput & Completion Trend
          </div>
          <div className="mb-4 text-xs font-bold text-slate-500">
            Weekly new student intakes vs milestone completions across India
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fontWeight: 800 }} />
                <YAxis tickFormatter={(val) => val.toLocaleString()} />
                <Tooltip formatter={(value) => [value.toLocaleString(), "Families"]} />
                <Line type="monotone" dataKey="entries" stroke="#f5a94e" strokeWidth={3} name="Weekly Intakes" />
                <Line type="monotone" dataKey="completed" stroke="#e85c7b" strokeWidth={3} name="Milestones Done" />
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
    <div className="rounded-lg bg-slate-50 p-1 shadow-xs">
      <div className="font-black text-slate-800">{value}</div>
      <div className="text-[9px] font-bold text-slate-400">{label}</div>
    </div>
  );
}
