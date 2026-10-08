import { useMemo, useState } from "react";
import {
  Check,
  Filter,
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldMinus,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { computeSegmentMembers, optionSets } from "../data/mockData.js";
import { useData } from "../store/DataContext.jsx";

export default function Audience() {
  const { data, addSegment, updateSegment, removeSegment, addExclusion, removeExclusion } = useData();
  const [criteria, setCriteria] = useState({});
  const [segmentName, setSegmentName] = useState("");
  const [activeSegmentId, setActiveSegmentId] = useState("seg-all");
  const [editingSegmentId, setEditingSegmentId] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [stageFilter, setStageFilter] = useState("All");
  const [exclusion, setExclusion] = useState({ memberId: "", scope: "Global", reason: "" });
  const [memberSearchTerm, setMemberSearchTerm] = useState("");
  const [segmentSavedNotice, setSegmentSavedNotice] = useState(false);

  // Active selected segment
  const activeSegment = useMemo(() => {
    return data.segments.find((s) => s.id === activeSegmentId) || data.segments[0];
  }, [data.segments, activeSegmentId]);

  // Combined criteria: from active segment + any ad-hoc criteria
  const effectiveCriteria = useMemo(() => {
    if (activeSegmentId && activeSegment?.criteria) {
      return { ...activeSegment.criteria, ...criteria };
    }
    return criteria;
  }, [activeSegmentId, activeSegment, criteria]);

  const filteredMembers = useMemo(() => {
    let list = computeSegmentMembers(data.members, effectiveCriteria);
    if (stageFilter !== "All") {
      list = list.filter((m) => m.lifecycleStage === stageFilter);
    }
    if (memberSearchTerm.trim()) {
      const term = memberSearchTerm.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(term) ||
          m.childName.toLowerCase().includes(term) ||
          m.id.toLowerCase().includes(term) ||
          m.city.toLowerCase().includes(term) ||
          m.centre.toLowerCase().includes(term)
      );
    }
    return list;
  }, [data.members, effectiveCriteria, stageFilter, memberSearchTerm]);

  const handleSelectSegment = (segmentId) => {
    setActiveSegmentId(segmentId);
    setCriteria({});
  };

  const handleResetFilters = () => {
    setCriteria({});
    setActiveSegmentId("seg-all");
    setStageFilter("All");
    setMemberSearchTerm("");
  };

  const setCriterion = (key, value) => {
    setCriteria((current) => ({ ...current, [key]: value || undefined }));
  };

  const handleEditSegment = (segment) => {
    setEditingSegmentId(segment.id);
    setSegmentName(segment.name);
    setCriteria(segment.criteria ? { ...segment.criteria } : {});
    setShowBuilder(true);
  };

  const handleOpenNewSegment = () => {
    if (showBuilder && !editingSegmentId) {
      setShowBuilder(false);
    } else {
      setEditingSegmentId(null);
      setSegmentName("");
      setCriteria({});
      setShowBuilder(true);
    }
  };

  const handleSaveSegment = () => {
    if (!segmentName.trim()) return;
    if (editingSegmentId) {
      updateSegment(editingSegmentId, { name: segmentName, criteria });
      setActiveSegmentId(editingSegmentId);
    } else {
      const newId = `seg-${Date.now()}`;
      addSegment({ id: newId, name: segmentName, criteria });
      setActiveSegmentId(newId);
    }
    setSegmentSavedNotice(true);
    setTimeout(() => {
      setSegmentSavedNotice(false);
      setSegmentName("");
      setCriteria({});
      setEditingSegmentId(null);
      setShowBuilder(false);
    }, 1000);
  };

  const activeFilterCount = Object.values(criteria).filter(Boolean).length;

  return (
    <div className="page">
      <PageHeader
        title="Audience & Segments"
        subtitle="Manage 6,420 active enrolled families, configure reusable lifecycle cohorts, and enforce global exclusion rules."
        actions={
          <div className="flex items-center gap-2">
            {(activeFilterCount > 0 || activeSegmentId !== "seg-all" || stageFilter !== "All") && (
              <button className="btn btn-ghost" onClick={handleResetFilters}>
                <RotateCcw size={15} /> Reset Filters
              </button>
            )}
            <button
              className="btn btn-primary shadow-soft"
              onClick={handleOpenNewSegment}
            >
              <Plus size={16} /> Build New Segment
            </button>
          </div>
        }
      />

      {/* ========================================================================= */}
      {/* COMPACT SEGMENTS CARD GRID WITH DIRECT EDIT OPTION */}
      {/* ========================================================================= */}
      <div className="mb-6">
        <div className="mb-2.5 flex items-center justify-between">
          <div className="text-xs font-black uppercase tracking-wider text-slate-500">
            Lifecycle Cohorts & Saved Segments ({data.segments.length})
          </div>
          <span className="text-xs font-bold text-slate-400">Click card to filter table • Click Edit to adjust rules</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {data.segments.map((segment) => {
            const isSelected = activeSegmentId === segment.id;
            const isCustom = segment.id.startsWith("seg-") && Number(segment.id.replace("seg-", "")) > 1000;

            const badgeColor =
              segment.id === "seg-all" || segment.id === "seg-active"
                ? "bg-emerald-50 text-emerald-700"
                : segment.id === "seg-graduated"
                ? "bg-purple-50 text-purple-700"
                : segment.id.includes("discontinued")
                ? "bg-rose-50 text-rose-700"
                : "bg-sky-50 text-sky-700";

            const ruleCount = Object.keys(segment.criteria || {}).length;
            const scopeLabel =
              segment.id === "seg-all"
                ? "Global • 67 Centres"
                : segment.id === "seg-active"
                ? "100% Enrolled Retention"
                : segment.id === "seg-graduated"
                ? "Year 1+ Right-Brain Alumni"
                : segment.id.includes("discontinued")
                ? "Winback Target Pool"
                : ruleCount
                ? `${ruleCount} filter rule${ruleCount > 1 ? "s" : ""}`
                : "Dynamic cohort";

            return (
              <div
                key={segment.id}
                onClick={() => handleSelectSegment(segment.id)}
                className={`group relative cursor-pointer rounded-2xl p-3.5 text-left transition hover:shadow-md hover:-translate-y-0.5 border ${
                  isSelected
                    ? "border-coral-500 bg-coral-50/30 ring-2 ring-coral-400/20 shadow-xs"
                    : "border-slate-200/90 bg-white hover:border-coral-200 shadow-2xs"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-extrabold text-slate-800 truncate" title={segment.name}>
                        {segment.name}
                      </h4>
                      {isSelected && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-coral-500" title="Active selection" />
                      )}
                    </div>
                    <p className="text-[11px] font-semibold text-slate-400 truncate mt-0.5">{scopeLabel}</p>
                  </div>
                  <span className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-black ${badgeColor}`}>
                    {segment.id === "seg-all" ? "All" : segment.criteria?.lifecycleStage || "Cohort"}
                  </span>
                </div>

                {/* Metric + Edit Action Row */}
                <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-2.5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-coral-600">
                      {segment.count.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-bold text-slate-400">families</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditSegment(segment);
                      }}
                      className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 shadow-2xs hover:border-coral-300 hover:bg-coral-50 hover:text-coral-600 transition"
                      title="Edit segment rules and criteria"
                    >
                      <Pencil size={11} />
                      <span>Edit</span>
                    </button>

                    {isCustom && removeSegment && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSegment(segment.id);
                          if (activeSegmentId === segment.id) setActiveSegmentId("seg-all");
                        }}
                        className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete segment"
                      >
                        <Trash2 size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* COLLAPSIBLE SEGMENT BUILDER / EDITOR */}
      {/* ========================================================================= */}
      {showBuilder && (
        <div className="mb-6 panel rounded-3xl p-5 border-2 border-coral-300 bg-white shadow-lg animate-in fade-in duration-200">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal size={20} className="text-coral-500" />
              <div>
                <div className="text-base font-black text-slate-800">
                  {editingSegmentId ? `Edit Segment: ${segmentName || "Cohort"}` : "Build New Demographic Segment"}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  {editingSegmentId
                    ? "Modify filter criteria or rename this cohort. Changes apply to automated journeys instantly."
                    : "Combine stage, age, centre, and staff filters to define a reusable automated journey audience."}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowBuilder(false);
                setEditingSegmentId(null);
              }}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              title="Close builder"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Lifecycle & Age Demographics
              </div>
              <div className="grid grid-cols-3 gap-3">
                <Select
                  label="Lifecycle Stage"
                  value={criteria.lifecycleStage || ""}
                  onChange={(val) => setCriterion("lifecycleStage", val)}
                  options={optionSets.stages}
                />
                <label className="block text-sm font-extrabold text-slate-700">
                  Age Min
                  <input
                    className="field mt-1"
                    type="number"
                    placeholder="e.g. 3"
                    value={criteria.ageMin || ""}
                    onChange={(e) => setCriterion("ageMin", e.target.value)}
                  />
                </label>
                <label className="block text-sm font-extrabold text-slate-700">
                  Age Max
                  <input
                    className="field mt-1"
                    type="number"
                    placeholder="e.g. 7"
                    value={criteria.ageMax || ""}
                    onChange={(e) => setCriterion("ageMax", e.target.value)}
                  />
                </label>
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Centre & Location
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="City"
                  value={criteria.city || ""}
                  onChange={(val) => setCriterion("city", val)}
                  options={optionSets.cities}
                />
                <Select
                  label="Centre Location"
                  value={criteria.centre || ""}
                  onChange={(val) => setCriterion("centre", val)}
                  options={optionSets.centres}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Staff Assignment
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Select
                  label="Trainer"
                  value={criteria.trainer || ""}
                  onChange={(val) => setCriterion("trainer", val)}
                  options={optionSets.trainers}
                />
                <Select
                  label="Counsellor"
                  value={criteria.counsellor || ""}
                  onChange={(val) => setCriterion("counsellor", val)}
                  options={optionSets.counsellors}
                />
              </div>
            </div>

            {/* Segment Save Bar */}
            <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-coral-50/80 p-4 border border-coral-200">
              <div className="flex items-center gap-3">
                <div className="grid h-12 min-w-16 px-2.5 place-items-center rounded-2xl bg-coral-500 font-black text-white text-base shadow-sm">
                  {Math.round(filteredMembers.length * (6420 / data.members.length)).toLocaleString()}
                </div>
                <div>
                  <div className="text-base font-black text-slate-800">
                    Matching Base Families
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    across 6,420 active enrolled student base
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  className="field !w-72"
                  placeholder="Segment Name (e.g. Bandra Active Age 3-5)"
                  value={segmentName}
                  onChange={(e) => setSegmentName(e.target.value)}
                />
                <button
                  className="btn btn-primary whitespace-nowrap shadow-soft"
                  onClick={handleSaveSegment}
                >
                  {segmentSavedNotice ? (
                    <>
                      <Check size={16} /> {editingSegmentId ? "Updated Cohort!" : "Saved to Cards!"}
                    </>
                  ) : editingSegmentId ? (
                    "Update Segment"
                  ) : (
                    "Save & Add to Cards"
                  )}
                </button>
                {editingSegmentId && (
                  <button
                    className="btn btn-ghost whitespace-nowrap"
                    onClick={() => {
                      setEditingSegmentId(null);
                      setShowBuilder(false);
                    }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MEMBER DIRECTORY & EXCLUSION SAFEGUARDS */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-[1fr_360px] gap-6 items-start">
        {/* Main Member Directory Table */}
        <section className="space-y-4">
          <div className="panel rounded-3xl p-5 shadow-sm">
            {/* Table Header Controls */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="text-base font-black text-slate-800">
                  {activeSegment ? activeSegment.name : "All Families"}
                </div>
                <span className="rounded-full bg-coral-50 px-2.5 py-0.5 text-xs font-black text-coral-600">
                  {filteredMembers.length} previewed
                </span>
              </div>

              {/* Quick Stage Filter Pills */}
              <div className="flex items-center gap-1.5">
                {["All", "Active Member", "Lead", "Graduated", "Discontinued"].map((st) => {
                  const isActive = stageFilter === st;
                  return (
                    <button
                      key={st}
                      onClick={() => setStageFilter(st)}
                      className={`rounded-xl px-2.5 py-1 text-xs font-extrabold transition ${
                        isActive
                          ? "bg-coral-500 text-white shadow-soft"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                      }`}
                    >
                      {st}
                    </button>
                  );
                })}
              </div>

              {/* Keyword Search */}
              <div className="relative w-60">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  className="field !pl-9 !py-1 text-xs font-bold"
                  placeholder="Search student, parent, city..."
                  value={memberSearchTerm}
                  onChange={(e) => setMemberSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Table */}
            <div className="max-h-[500px] overflow-auto rounded-2xl border border-slate-100">
              <table className="w-full text-left text-sm">
                <thead className="sticky top-0 bg-slate-50/95 backdrop-blur-xs z-10">
                  <tr className="border-b text-xs font-black text-slate-500">
                    <th className="py-2.5 px-3">Child & Parent</th>
                    <th className="py-2.5 px-2">Age</th>
                    <th className="py-2.5 px-2">Location</th>
                    <th className="py-2.5 px-2">Stage</th>
                    <th className="py-2.5 px-2">Trainer</th>
                    <th className="py-2.5 px-2">Phone</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.slice(0, 80).map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-slate-100 font-semibold hover:bg-slate-50/60 transition"
                    >
                      <td className="py-2.5 px-3">
                        <span className="font-black text-slate-800">{member.childName}</span>
                        <br />
                        <span className="text-xs text-slate-400 font-bold">
                          {member.id} • {member.name}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 font-bold">{member.age} yrs</td>
                      <td className="py-2.5 px-2 text-slate-700">
                        {member.city} / <span className="text-slate-400 font-bold">{member.centre}</span>
                      </td>
                      <td className="py-2.5 px-2">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                            member.lifecycleStage === "Active Member"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : member.lifecycleStage === "Lead"
                              ? "bg-coral-50 text-coral-700 border border-coral-200"
                              : member.lifecycleStage === "Graduated"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {member.lifecycleStage}
                        </span>
                      </td>
                      <td className="py-2.5 px-2 text-slate-700 font-medium">{member.trainer}</td>
                      <td className="py-2.5 px-2 text-xs font-mono text-slate-500 font-bold">
                        {member.phone}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs font-bold text-slate-400 pt-2 border-t border-slate-100">
              <span>Showing {Math.min(filteredMembers.length, 80)} of {filteredMembers.length} sample records</span>
              <span>Scaled Database: 6,420 Enrolled Families</span>
            </div>
          </div>
        </section>

        {/* Manual Exclusions Safeguards Sidebar */}
        <aside className="panel rounded-3xl p-5 shadow-sm sticky top-6">
          <div className="mb-2 flex items-center gap-2 text-base font-black text-slate-800">
            <ShieldMinus size={18} className="text-rose-500" />
            <span>Manual Exclusions</span>
          </div>
          <p className="mb-3 text-[11px] font-bold leading-relaxed text-slate-400">
            Explicitly remove families from automated journeys regardless of cohort qualification.
          </p>

          <div className="space-y-2.5">
            <label className="block text-[11px] font-black uppercase text-slate-500">
              Member to Exclude
              <input
                className="field mt-1 text-xs font-bold"
                list="member-picker"
                placeholder="Search by ID or child name..."
                value={exclusion.memberId}
                onChange={(e) => setExclusion({ ...exclusion, memberId: e.target.value })}
              />
              <datalist id="member-picker">
                {data.members.slice(0, 100).map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.childName} ({m.name}) • {m.city}
                  </option>
                ))}
              </datalist>
            </label>

            <label className="block text-[11px] font-black uppercase text-slate-500">
              Scope
              <select
                className="field mt-1 font-bold text-xs"
                value={exclusion.scope}
                onChange={(e) => setExclusion({ ...exclusion, scope: e.target.value })}
              >
                <option>Global (All Journeys)</option>
                <option>Member Journey Only</option>
                <option>Promotional Broadcasts Only</option>
              </select>
            </label>

            <label className="block text-[11px] font-black uppercase text-slate-500">
              Reason / Internal Note
              <textarea
                className="field mt-1 min-h-16 text-xs"
                placeholder="e.g. Parent requested opt-out / Active support ticket"
                value={exclusion.reason}
                onChange={(e) => setExclusion({ ...exclusion, reason: e.target.value })}
              />
            </label>

            <button
              className="btn btn-primary w-full shadow-soft text-xs"
              onClick={() => {
                if (exclusion.memberId && exclusion.reason) {
                  addExclusion(exclusion);
                  setExclusion({ memberId: "", scope: "Global", reason: "" });
                }
              }}
            >
              Add to Exclusion List
            </button>
          </div>

          {/* List of active exclusions */}
          <div className="mt-4 space-y-2 border-t border-slate-100 pt-3">
            <div className="text-[11px] font-black text-slate-500">
              Active Safeguards ({data.exclusions.length})
            </div>
            {data.exclusions.map((item) => {
              const member = data.members.find((m) => m.id === item.memberId);
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-100 bg-white p-2.5 text-xs font-semibold shadow-2xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-slate-800 text-[11px]">
                      {member?.childName ? `${member.childName} (${member.name})` : item.memberId}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-extrabold text-rose-700">
                        {item.scope}
                      </span>
                      <button
                        type="button"
                        title="Remove exclusion"
                        onClick={() => removeExclusion(item.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-0.5"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-1 text-[11px] text-slate-400 italic font-medium">{item.reason}</div>
                </div>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="block text-sm font-extrabold text-slate-700">
      {label}
      <select className="field mt-1 text-xs font-bold" value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
