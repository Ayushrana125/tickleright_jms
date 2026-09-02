import { useMemo, useState } from "react";
import { ShieldMinus, SlidersHorizontal } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { computeSegmentMembers, optionSets } from "../data/mockData.js";
import { useData } from "../store/DataContext.jsx";

export default function Audience() {
  const { data, addSegment, addExclusion } = useData();
  const [criteria, setCriteria] = useState({});
  const [segmentName, setSegmentName] = useState("");
  const [exclusion, setExclusion] = useState({ memberId: "", scope: "Global", reason: "" });
  const filtered = useMemo(() => computeSegmentMembers(data.members, criteria), [data.members, criteria]);

  const setCriterion = (key, value) => setCriteria((current) => ({ ...current, [key]: value || undefined }));

  return (
    <div className="page">
      <PageHeader title="Audience" subtitle="Build reusable member segments and add manual exclusions that journeys will respect." />
      <div className="grid grid-cols-[1fr_430px] gap-5">
        <section className="panel rounded-3xl p-5">
          <div className="mb-4 flex items-center gap-2 text-lg font-black"><SlidersHorizontal size={18} /> Segment Builder</div>
          <div className="grid grid-cols-3 gap-3">
            <Select label="Lifecycle" value={criteria.lifecycleStage || ""} onChange={(value) => setCriterion("lifecycleStage", value)} options={optionSets.stages} />
            <Select label="City" value={criteria.city || ""} onChange={(value) => setCriterion("city", value)} options={optionSets.cities} />
            <Select label="Centre" value={criteria.centre || ""} onChange={(value) => setCriterion("centre", value)} options={optionSets.centres} />
            <Select label="Trainer" value={criteria.trainer || ""} onChange={(value) => setCriterion("trainer", value)} options={optionSets.trainers} />
            <Select label="Counsellor" value={criteria.counsellor || ""} onChange={(value) => setCriterion("counsellor", value)} options={optionSets.counsellors} />
            <label className="block text-sm font-extrabold">Age Min<input className="field mt-1" type="number" value={criteria.ageMin || ""} onChange={(event) => setCriterion("ageMin", event.target.value)} /></label>
            <label className="block text-sm font-extrabold">Age Max<input className="field mt-1" type="number" value={criteria.ageMax || ""} onChange={(event) => setCriterion("ageMax", event.target.value)} /></label>
            <label className="col-span-2 block text-sm font-extrabold">Segment Name<input className="field mt-1" value={segmentName} onChange={(event) => setSegmentName(event.target.value)} placeholder="e.g. Pune Active Age 4-6" /></label>
          </div>
          <div className="mt-4 flex items-center justify-between rounded-2xl bg-coral-50 p-4">
            <div>
              <div className="text-2xl font-black text-coral-600">{filtered.length}</div>
              <div className="text-sm font-bold text-slate-600">matching members</div>
            </div>
            <button className="btn btn-primary" onClick={() => { if (segmentName.trim()) { addSegment({ name: segmentName, criteria }); setSegmentName(""); } }}>Save Segment</button>
          </div>
          <div className="mt-5 max-h-96 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="sticky top-0 bg-white">
                <tr className="border-b text-xs font-black text-slate-500">
                  <th className="py-2">Member</th><th>Age</th><th>City/Centre</th><th>Stage</th><th>Trainer</th>
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 70).map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 font-semibold">
                    <td className="py-2"><span className="font-black">{member.childName}</span><br /><span className="text-xs text-slate-500">{member.id} - {member.name}</span></td>
                    <td>{member.age}</td><td>{member.city} / {member.centre}</td><td>{member.lifecycleStage}</td><td>{member.trainer}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="space-y-5">
          <div className="panel rounded-3xl p-5">
            <div className="mb-4 text-lg font-black">Saved Segments</div>
            <div className="space-y-3">
              {data.segments.map((segment) => (
                <div key={segment.id} className="flex items-center justify-between rounded-2xl bg-white p-3">
                  <div>
                    <div className="font-black">{segment.name}</div>
                    <div className="text-xs font-bold text-slate-500">{Object.keys(segment.criteria).length || "No"} filters</div>
                  </div>
                  <div className="text-lg font-black text-coral-600">{segment.count}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel rounded-3xl p-5">
            <div className="mb-4 flex items-center gap-2 text-lg font-black"><ShieldMinus size={18} /> Exclusion Lists</div>
            <input className="field" list="member-options" placeholder="Member ID" value={exclusion.memberId} onChange={(event) => setExclusion({ ...exclusion, memberId: event.target.value })} />
            <datalist id="member-options">{data.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</datalist>
            <select className="field mt-2" value={exclusion.scope} onChange={(event) => setExclusion({ ...exclusion, scope: event.target.value })}><option>Global</option><option>Member Journey</option></select>
            <textarea className="field mt-2 min-h-20" placeholder="Reason / note" value={exclusion.reason} onChange={(event) => setExclusion({ ...exclusion, reason: event.target.value })} />
            <button className="btn btn-primary mt-2 w-full" onClick={() => { if (exclusion.memberId && exclusion.reason) { addExclusion(exclusion); setExclusion({ memberId: "", scope: "Global", reason: "" }); } }}>Add Exclusion</button>
            <div className="mt-4 space-y-2">
              {data.exclusions.map((item) => (
                <div key={item.id} className="rounded-xl bg-white p-3 text-sm font-bold">
                  {item.memberId} <span className="text-slate-400">({item.scope})</span>
                  <div className="text-slate-500">{item.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-sm font-extrabold">
      {label}
      <select className="field mt-1" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Any</option>
        {options.map((option) => <option key={option}>{option}</option>)}
      </select>
    </label>
  );
}
