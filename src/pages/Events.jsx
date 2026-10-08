import { useMemo, useState } from "react";
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Database,
  ExternalLink,
  Layers,
  Pencil,
  Plus,
  Radio,
  RotateCcw,
  Search,
  Server,
  SlidersHorizontal,
  Sparkles,
  Terminal,
  Trash2,
  X,
  Zap,
} from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

const TRIGGER_TYPES = [
  "Date / Database Column",
  "Scheduled Cron Query",
  "Real-time API / Webhook",
  "Operational / Staff Action",
];

export default function Events() {
  const { data, addEvent, updateEvent, deleteEvent } = useData();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTypeFilter, setActiveTypeFilter] = useState("All");
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);
  const [showDevGuide, setShowDevGuide] = useState(false);
  const [devGuideTab, setDevGuideTab] = useState("date-cron"); // "overview" | "date-cron" | "realtime" | "delays" | "schema"
  const [copiedCodeSnippet, setCopiedCodeSnippet] = useState(null);

  const [draft, setDraft] = useState({
    name: "",
    reference: "E",
    triggerType: "Date / Database Column",
    dbField: "members.creation_date",
    segmentId: "seg-all",
    description: "",
  });

  const [savedNotification, setSavedNotification] = useState(false);

  // Copy code utility
  const handleCopyCode = (id, codeText) => {
    navigator.clipboard?.writeText(codeText);
    setCopiedCodeSnippet(id);
    setTimeout(() => setCopiedCodeSnippet(null), 2000);
  };

  const handleOpenCreate = () => {
    setEditingEventId(null);
    setDraft({
      name: "",
      reference: "E",
      triggerType: "Date / Database Column",
      dbField: "members.creation_date",
      segmentId: "seg-all",
      description: "",
    });
    setShowBuilder(true);
  };

  const handleEditEvent = (event) => {
    setEditingEventId(event.id);
    setDraft({
      name: event.name,
      reference: event.reference || "E",
      triggerType: event.triggerType || "Date / Database Column",
      dbField: event.dbField || "members.creation_date",
      segmentId: event.segmentId || "seg-all",
      description: event.description || "",
    });
    setShowBuilder(true);
  };

  const handleSaveEvent = () => {
    if (!draft.name.trim()) return;

    if (editingEventId) {
      updateEvent(editingEventId, draft);
    } else {
      addEvent({
        ...draft,
        id: `ev-${Date.now()}`,
        reference: (draft.reference || "E").toUpperCase().slice(0, 2),
      });
    }

    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
      setShowBuilder(false);
      setEditingEventId(null);
    }, 1000);
  };

  const filteredEvents = useMemo(() => {
    return (data.events || []).filter((event) => {
      const matchesType =
        activeTypeFilter === "All" || event.triggerType === activeTypeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        event.name.toLowerCase().includes(q) ||
        event.reference?.toLowerCase().includes(q) ||
        event.dbField?.toLowerCase().includes(q) ||
        event.description?.toLowerCase().includes(q);
      return matchesType && matchesSearch;
    });
  }, [data.events, activeTypeFilter, searchQuery]);

  return (
    <div className="page">
      <PageHeader
        title="Trigger Events & Signals"
        subtitle="Define operational and database triggers (e.g. creation_date, renewal_date, trial bookings) that initiate and branch automated parent journeys."
        actions={
          <div className="flex items-center gap-2.5">
            {/* Backend Development Guide Button */}
            <button
              onClick={() => setShowDevGuide(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-extrabold text-white shadow-soft transition hover:bg-slate-800 hover:shadow-md"
              title="Learn how to build this from a Backend & Database perspective"
            >
              <Code2 size={16} className="text-amber-400" />
              <span>Development Guide</span>
              <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-black uppercase text-amber-300">
                Backend POV
              </span>
            </button>

            {/* Create Event Button */}
            <button
              onClick={handleOpenCreate}
              className="btn btn-primary shadow-soft flex items-center gap-1.5"
            >
              <Plus size={16} /> Create Event
            </button>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {["All", ...TRIGGER_TYPES].map((type) => {
            const count =
              type === "All"
                ? (data.events || []).length
                : (data.events || []).filter((e) => e.triggerType === type).length;
            const isActive = activeTypeFilter === type;

            return (
              <button
                key={type}
                onClick={() => setActiveTypeFilter(type)}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-extrabold transition ${
                  isActive
                    ? "bg-coral-500 text-white shadow-soft"
                    : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
                }`}
              >
                <span>{type}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-black ${
                    isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            className="field !pl-9 !py-1.5 text-xs font-bold"
            placeholder="Search events, db columns, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Collapsible Event Builder / Editor */}
      {showBuilder && (
        <div className="mb-6 panel rounded-3xl p-5 border-2 border-coral-300 bg-white shadow-lg animate-in fade-in duration-200">
          <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-coral-50 text-coral-600">
                <Zap size={18} />
              </div>
              <div>
                <div className="text-base font-black text-slate-800">
                  {editingEventId ? `Edit Event: ${draft.name || "Event"}` : "Create New Trigger Event"}
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Define an event and its database source so it appears as a selectable Trigger Event in Journeys.
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setShowBuilder(false);
                setEditingEventId(null);
              }}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
              title="Close builder"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-[1fr_120px] gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Event Name
                </label>
                <input
                  className="field text-sm font-bold"
                  placeholder="e.g. Member Joined the Program, Trial Class Attended"
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Prefix Tag
                </label>
                <input
                  className="field text-sm font-black text-center uppercase"
                  placeholder="e.g. M"
                  maxLength={2}
                  value={draft.reference}
                  onChange={(e) =>
                    setDraft({ ...draft, reference: e.target.value.toUpperCase() })
                  }
                  title="Short letter code displayed on timeline badges like M+1, M+5"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Trigger Mechanism
                </label>
                <select
                  className="field text-xs font-bold"
                  value={draft.triggerType}
                  onChange={(e) => setDraft({ ...draft, triggerType: e.target.value })}
                >
                  {TRIGGER_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Database Field / Expression
                </label>
                <input
                  className="field font-mono text-xs font-bold text-slate-700"
                  placeholder="e.g. members.creation_date"
                  value={draft.dbField}
                  onChange={(e) => setDraft({ ...draft, dbField: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                  Default Target Cohort
                </label>
                <select
                  className="field text-xs font-bold"
                  value={draft.segmentId}
                  onChange={(e) => setDraft({ ...draft, segmentId: e.target.value })}
                >
                  {data.segments.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.count.toLocaleString()})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-slate-500 mb-1">
                Business Description & Trigger Condition
              </label>
              <textarea
                className="field text-xs font-medium min-h-16"
                placeholder="Explain when and why this event is emitted in operations..."
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs font-bold text-slate-400">
                Timeline badge preview:{" "}
                <span className="rounded-md bg-amber-100 px-2 py-0.5 font-black text-amber-800">
                  {draft.reference || "E"}+0
                </span>{" "}
                ➔{" "}
                <span className="rounded-md bg-emerald-100 px-2 py-0.5 font-black text-emerald-800">
                  {draft.reference || "E"}+5 Days
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowBuilder(false);
                    setEditingEventId(null);
                  }}
                  className="btn btn-ghost text-xs"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEvent}
                  className="btn btn-primary text-xs shadow-soft"
                >
                  {savedNotification ? (
                    <>
                      <Check size={14} /> Saved!
                    </>
                  ) : editingEventId ? (
                    "Update Event"
                  ) : (
                    "Create Event"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Compact Event Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
        {filteredEvents.map((event) => {
          const segment = data.segments.find((s) => s.id === event.segmentId);
          const isCustom = event.id.startsWith("ev-") && Number(event.id.replace("ev-", "")) > 1000;

          const typeColor =
            event.triggerType === "Date / Database Column"
              ? "bg-blue-50 text-blue-700 border-blue-200"
              : event.triggerType === "Scheduled Cron Query"
              ? "bg-purple-50 text-purple-700 border-purple-200"
              : event.triggerType === "Real-time API / Webhook"
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-amber-50 text-amber-700 border-amber-200";

          return (
            <div
              key={event.id}
              className="panel rounded-2xl p-4 border border-slate-200/90 bg-white shadow-2xs hover:shadow-md transition hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <div>
                {/* Header: Prefix Tag + Event Name + Status */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <span
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-xl bg-amber-100 font-black text-xs text-amber-900 shadow-2xs"
                      title={`Timeline reference tag: ${event.reference}`}
                    >
                      {event.reference}
                    </span>
                    <h4
                      className="text-sm font-extrabold text-slate-800 truncate"
                      title={event.name}
                    >
                      {event.name}
                    </h4>
                  </div>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
                    Active
                  </span>
                </div>

                {/* Trigger Type Badge */}
                <div className="mt-2.5 flex items-center gap-1.5">
                  <span
                    className={`rounded-md px-2 py-0.5 text-[10px] font-extrabold border ${typeColor}`}
                  >
                    {event.triggerType}
                  </span>
                </div>

                {/* Database Source Field (Monospace) */}
                <div className="mt-2 rounded-lg bg-slate-50 p-2 border border-slate-100">
                  <div className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Source Field
                  </div>
                  <div className="font-mono text-xs font-bold text-slate-700 truncate mt-0.5">
                    {event.dbField}
                  </div>
                </div>

                {/* Description Excerpt */}
                <p className="mt-2 text-xs font-medium text-slate-500 line-clamp-2 leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] font-bold text-slate-400 truncate max-w-[130px]">
                  {segment ? segment.name : "All Families"}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleEditEvent(event)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-700 shadow-2xs hover:border-coral-300 hover:bg-coral-50 hover:text-coral-600 transition"
                    title="Edit event properties"
                  >
                    <Pencil size={11} />
                    <span>Edit</span>
                  </button>

                  {isCustom && deleteEvent && (
                    <button
                      type="button"
                      onClick={() => deleteEvent(event.id)}
                      className="rounded-lg p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete event"
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

      {/* ========================================================================= */}
      {/* BACKEND DEVELOPMENT GUIDE MODAL (Comprehensive Blueprint for Engineers) */}
      {/* ========================================================================= */}
      {showDevGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="relative flex h-[90vh] max-h-[850px] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-400 text-slate-950 font-black">
                  <Terminal size={20} />
                </div>
                <div>
                  <div className="text-base font-black">
                    JMS Event Engine: Backend Development Guide
                  </div>
                  <div className="text-xs text-slate-300 font-medium">
                    How date columns (creation_date, graduation_date) and real-time triggers connect to automated journeys.
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowDevGuide(false)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigation Tabs Inside Modal */}
            <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50 px-6 py-2 text-xs font-bold">
              {[
                { id: "date-cron", label: "1. Date-Based Events (creation_date)", icon: Calendar },
                { id: "realtime", label: "2. Real-time Events & Webhooks", icon: Radio },
                { id: "delays", label: "3. Delay Engine (M+1, M+5)", icon: Clock },
                { id: "schema", label: "4. Database Schema (SQL DDL)", icon: Database },
                { id: "overview", label: "5. System Architecture", icon: Server },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = devGuideTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setDevGuideTab(tab.id)}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-2 transition ${
                      isActive
                        ? "bg-white text-coral-600 shadow-xs font-extrabold border border-slate-200"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Modal Content Scroll Area */}
            <div className="flex-1 overflow-y-auto p-6 text-sm text-slate-700 space-y-6">
              {/* TAB 1: DATE-BASED EVENTS */}
              {devGuideTab === "date-cron" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      How Date-Based Events Work in the Database
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Date events don't require external webhooks. Instead, your database already has timestamps like{" "}
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-coral-600">creation_date</code>,{" "}
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-coral-600">dob</code>, or{" "}
                      <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-coral-600">graduation_date</code>.
                      A daily background job (Cron) queries these rows and starts the appropriate journeys.
                    </p>
                  </div>

                  {/* Code Card 1: SQL Queries */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-950 p-4 text-slate-100 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                      <span>PostgreSQL / MySQL Queries</span>
                      <button
                        onClick={() =>
                          handleCopyCode(
                            "sql-1",
                            `-- 1. Member Registration (creation_date is today)\nSELECT id, child_name, phone FROM members \nWHERE DATE(creation_date) = CURRENT_DATE;\n\n-- 2. Renewal Due in 30 Days\nSELECT id, child_name, phone FROM members \nWHERE DATE(renewal_date) = CURRENT_DATE + INTERVAL '30 days';\n\n-- 3. Child Birthday in 7 Days (Annual match)\nSELECT id, child_name, dob FROM children \nWHERE TO_CHAR(dob, 'MM-DD') = TO_CHAR(CURRENT_DATE + INTERVAL '7 days', 'MM-DD');`
                          )
                        }
                        className="flex items-center gap-1 text-slate-400 hover:text-white"
                      >
                        {copiedCodeSnippet === "sql-1" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedCodeSnippet === "sql-1" ? "Copied" : "Copy SQL"}</span>
                      </button>
                    </div>
                    <pre className="overflow-x-auto text-emerald-400 font-medium">
{`-- 1. Member Joined Event (creation_date is today)
SELECT id, child_name, parent_name, phone, centre 
FROM members 
WHERE DATE(creation_date) = CURRENT_DATE;

-- 2. Renewal Due (30 Days Out)
SELECT id, child_name, phone, renewal_date 
FROM subscriptions 
WHERE DATE(expiry_date) = CURRENT_DATE + INTERVAL '30 days';

-- 3. Graduation / Alumni Date
SELECT id, child_name, graduation_date 
FROM members 
WHERE DATE(graduation_date) = CURRENT_DATE;

-- 4. Upcoming Birthday (7 Days in advance)
SELECT id, child_name, dob 
FROM children 
WHERE TO_CHAR(dob, 'MM-DD') = TO_CHAR(CURRENT_DATE + INTERVAL '7 days', 'MM-DD');`}
                    </pre>
                  </div>

                  {/* Code Card 2: Node.js Cron Runner */}
                  <div>
                    <h4 className="text-xs font-black uppercase text-slate-500 mb-2">
                      Node.js / Python Daily Cron Worker (e.g. Runs every morning at 6:00 AM)
                    </h4>
                    <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-slate-100 font-mono text-xs">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                        <span>cronWorker.js</span>
                        <button
                          onClick={() =>
                            handleCopyCode(
                              "cron-js",
                              `cron.schedule('0 6 * * *', async () => {\n  // Find new members registered today\n  const newMembers = await db.query(\n    \`SELECT id FROM members WHERE DATE(creation_date) = CURRENT_DATE\`\n  );\n  for (const m of newMembers.rows) {\n    await jmsEngine.triggerJourney('journey-member', {\n      memberId: m.id,\n      event: 'Member Joined the Program',\n      startDate: new Date()\n    });\n  }\n});`
                            )
                          }
                          className="flex items-center gap-1 text-slate-400 hover:text-white"
                        >
                          {copiedCodeSnippet === "cron-js" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                          <span>{copiedCodeSnippet === "cron-js" ? "Copied" : "Copy JS"}</span>
                        </button>
                      </div>
                      <pre className="overflow-x-auto text-sky-300 font-medium">
{`const cron = require('node-cron');
const { db, jmsEngine } = require('./services');

// Runs daily at 06:00 AM
cron.schedule('0 6 * * *', async () => {
  console.log('[JMS] Running morning date-based event scans...');

  // 1. Scan for newly created members
  const newMembers = await db.query(
    'SELECT id, phone FROM members WHERE DATE(creation_date) = CURRENT_DATE'
  );
  
  for (const member of newMembers.rows) {
    // Starts the Member Journey starting at Day 0 (M)
    await jmsEngine.enrollMemberInJourney({
      journeyId: 'journey-member',
      memberId: member.id,
      eventTrigger: 'Member Joined the Program',
      referenceDate: new Date()
    });
  }
});`}
                      </pre>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: REAL-TIME EVENTS & WEBHOOKS */}
              {devGuideTab === "realtime" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Real-time Action Events (API & Webhooks)
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      When parents book a demo class or trainers record consecutive absences on their tablets, you emit an event directly into the JMS event endpoint.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-slate-100 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                      <span>Express / FastAPI Event Receiver</span>
                      <button
                        onClick={() =>
                          handleCopyCode(
                            "api-route",
                            `app.post('/api/attendance', async (req, res) => {\n  const { memberId, consecutiveMissed } = req.body;\n  if (consecutiveMissed >= 2) {\n    await jmsEngine.emitEvent({\n      eventType: 'attendance.absent_consecutive_2',\n      memberId,\n      timestamp: new Date()\n    });\n  }\n});`
                          )
                        }
                        className="flex items-center gap-1 text-slate-400 hover:text-white"
                      >
                        {copiedCodeSnippet === "api-route" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedCodeSnippet === "api-route" ? "Copied" : "Copy Code"}</span>
                      </button>
                    </div>
                    <pre className="overflow-x-auto text-amber-300 font-medium">
{`// When trainer logs attendance or trial booked
app.post('/api/attendance', async (req, res) => {
  const { memberId, status, consecutiveMissed } = req.body;

  if (consecutiveMissed >= 2) {
    // Emit JMS event
    await jmsEngine.dispatchSignal({
      event: 'Child Absent 2 Consecutive Classes',
      memberId,
      metadata: { consecutiveMissed }
    });
  }

  res.json({ success: true });
});`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 3: DELAY ENGINE (M+1, M+5) */}
              {devGuideTab === "delays" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      How Journey Node Offsets (M+1, M+5, M+9) are Executed
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      When an event fires on Day 0 (M), the engine schedules all downstream nodes into a delayed job queue (such as Redis BullMQ or Celery).
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                    <div className="text-xs font-black uppercase text-slate-500 mb-2">
                      Execution Schedule for Event: "Member Joined" (Oct 1st)
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                        <span className="font-extrabold text-slate-800">M+0 • Oct 1st</span>
                        <span className="text-emerald-600 font-black">Event Fired (members.creation_date)</span>
                        <span className="text-slate-400">Enrolls into Member Journey</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                        <span className="font-extrabold text-slate-800">M+1 • Oct 2nd, 10:00 AM</span>
                        <span className="text-emerald-600 font-black">WhatsApp: Welcome & Onboarding</span>
                        <span className="text-slate-400">Executed autonomously by Autopilot</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                        <span className="font-extrabold text-slate-800">M+5 • Oct 6th, 11:00 AM</span>
                        <span className="text-emerald-600 font-black">WhatsApp: Trainer Introduction</span>
                        <span className="text-slate-400">Checks festive & Sunday guardrails</span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl bg-white p-2.5 border border-slate-200">
                        <span className="font-extrabold text-slate-800">M+9 • Oct 10th, 02:00 PM</span>
                        <span className="text-purple-600 font-black">Counsellor Check-in Call</span>
                        <span className="text-coral-600 font-extrabold">Appears in Action Queue</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: DATABASE SCHEMA */}
              {devGuideTab === "schema" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      PostgreSQL DDL (Database Schema Tables)
                    </h3>
                    <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                      Copy and run this in your database to persist events and active journey executions.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-900 p-4 text-slate-100 font-mono text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-[11px] text-slate-400">
                      <span>schema.sql</span>
                      <button
                        onClick={() =>
                          handleCopyCode(
                            "sql-schema",
                            `CREATE TABLE jms_events (\n  id VARCHAR(64) PRIMARY KEY,\n  name VARCHAR(255) NOT NULL,\n  reference_code VARCHAR(4) NOT NULL,\n  trigger_type VARCHAR(64) NOT NULL,\n  db_field VARCHAR(255),\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE TABLE jms_journey_executions (\n  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),\n  journey_id VARCHAR(64) NOT NULL,\n  member_id VARCHAR(64) NOT NULL,\n  event_id VARCHAR(64) REFERENCES jms_events(id),\n  current_node_id VARCHAR(64),\n  status VARCHAR(32) DEFAULT 'Running',\n  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP\n);`
                          )
                        }
                        className="flex items-center gap-1 text-slate-400 hover:text-white"
                      >
                        {copiedCodeSnippet === "sql-schema" ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        <span>{copiedCodeSnippet === "sql-schema" ? "Copied" : "Copy SQL"}</span>
                      </button>
                    </div>
                    <pre className="overflow-x-auto text-emerald-300 font-medium">
{`-- Events Table
CREATE TABLE jms_events (
  id VARCHAR(64) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  reference_code VARCHAR(4) NOT NULL,
  trigger_type VARCHAR(64) NOT NULL,
  db_field VARCHAR(255),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Active Member Journey Executions
CREATE TABLE jms_journey_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journey_id VARCHAR(64) NOT NULL,
  member_id VARCHAR(64) NOT NULL,
  event_id VARCHAR(64) REFERENCES jms_events(id),
  current_step_id VARCHAR(64),
  status VARCHAR(32) DEFAULT 'Active',
  started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`}
                    </pre>
                  </div>
                </div>
              )}

              {/* TAB 5: SYSTEM ARCHITECTURE */}
              {devGuideTab === "overview" && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <h3 className="text-base font-black text-slate-900">
                    High-Level Event-Driven Architecture
                  </h3>
                  <div className="rounded-2xl border border-slate-200 bg-slate-900 p-5 font-mono text-xs text-slate-100 overflow-x-auto">
                    <pre className="text-amber-300 leading-relaxed">
{`+-------------------------------------------------------------+
|                      DATA SOURCES                           |
|                                                             |
|  [ members.creation_date ]    [ subscriptions.renewal_date] |
|            |                               |                |
|            v                               v                |
|  +-------------------+        +---------------------------+ |
|  | Daily 06:00 Cron  |        | API / Attendance Webhooks | |
|  +-------------------+        +---------------------------+ |
+-------------------------------------------------------------+
                              |
                              v
                +----------------------------+
                |    JMS EVENT DISPATCHER    |
                |  (Matches Active Journeys) |
                +----------------------------+
                              |
                              v
                +----------------------------+
                |   DELAY QUEUE (Redis / DB) |
                |  M+1, M+5, M+9 Scheduled   |
                +----------------------------+
                 /                          \\
                v                            v
   +------------------------+    +-----------------------+
   |   AUTOPILOT CHANNELS   |    |     ACTION QUEUE      |
   | WhatsApp / Rich Emails |    | Counsellor Phone Call |
   |  (100% Autonomous)     |    | Milestone Zepto Gift  |
   +------------------------+    +-----------------------+`}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-500" />
                <span>Ready to share with your backend engineering team</span>
              </span>
              <button
                onClick={() => setShowDevGuide(false)}
                className="btn btn-primary !py-1.5 !px-4 text-xs font-black"
              >
                Done Reading
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
