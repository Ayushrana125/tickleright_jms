import { useMemo, useState } from "react";
import { Check, CheckCircle2, Clock, Copy, Gift, Package, Phone, RotateCcw, Truck, UserCheck, Users } from "lucide-react";
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

const quickCallOutcomes = [
  "Spoke with Parent — very happy with progress",
  "Ringing / No Answer — will retry in afternoon",
  "Requested reschedule for class timing",
];

const quickGiftOutcomes = [
  "Dispatched via Zepto Express — tracking shared",
  "Confirmed delivery address with mother",
  "Delivered in-person at centre reception",
];

export default function ActionQueue() {
  const { data, updateTask } = useData();
  const [activeTab, setActiveTab] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const getTaskChannel = (task) => {
    const journey = data.journeys.find((j) => j.id === task.journeyId);
    const step = journey?.nodes.find((n) => n.id === task.stepId);
    const template = data.templates.find((t) => t.id === step?.data?.templateId);
    if (
      template?.channel === "Gift" ||
      step?.data?.label?.toLowerCase().includes("gift") ||
      task.dueContext.toLowerCase().includes("gift")
    ) {
      return "Gift";
    }
    return "Call";
  };

  const pendingTasks = useMemo(
    () => data.actionTasks.filter((task) => task.status !== "Completed"),
    [data.actionTasks]
  );
  const completedTasks = useMemo(
    () => data.actionTasks.filter((task) => task.status === "Completed"),
    [data.actionTasks]
  );

  const pendingCallsCount = useMemo(
    () => pendingTasks.filter((t) => getTaskChannel(t) === "Call").length,
    [pendingTasks, data]
  );

  const pendingGiftsCount = useMemo(
    () => pendingTasks.filter((t) => getTaskChannel(t) === "Gift").length,
    [pendingTasks, data]
  );

  const filteredTasks = useMemo(() => {
    if (activeTab === "completed") return completedTasks;
    if (activeTab === "calls") {
      return pendingTasks.filter((task) => getTaskChannel(task) === "Call");
    }
    if (activeTab === "gifts") {
      return pendingTasks.filter((task) => getTaskChannel(task) === "Gift");
    }
    return pendingTasks;
  }, [activeTab, pendingTasks, completedTasks, data]);

  const copyPhoneNumber = (phone, id) => {
    navigator.clipboard?.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="page">
      <PageHeader
        title="Action Queue"
        subtitle="Human-in-the-loop operational tasks: counsellor check-in calls and physical milestone gift dispatches. (WhatsApp updates run 100% autonomously on Autopilot)."
      />

      {/* KPI Stats */}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="panel rounded-2xl p-5 border-l-4 border-l-coral-500 shadow-xs">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Pending Human Tasks
          </div>
          <div className="mt-2 text-4xl font-black text-coral-600">{pendingTasks.length}</div>
          <div className="mt-1 text-xs font-bold text-slate-500">
            {pendingCallsCount} calls & {pendingGiftsCount} gifts queued today
          </div>
        </div>

        <div className="panel rounded-2xl p-5 border-l-4 border-l-emerald-500 shadow-xs">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Completed Outreach
          </div>
          <div className="mt-2 text-4xl font-black text-emerald-600">{completedTasks.length}</div>
          <div className="mt-1 text-xs font-bold text-slate-500">Documented in journey history</div>
        </div>

        <div className="panel rounded-2xl p-5 border-l-4 border-l-sky-500 shadow-xs">
          <div className="text-xs font-black uppercase tracking-wider text-slate-400">
            Assigned Counsellor
          </div>
          <div className="mt-2 text-xl font-black text-slate-800">Ayush Rana</div>
          <div className="mt-1 text-xs font-bold text-slate-500">Senior Parent Counsellor</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-5 flex items-center gap-2">
        {[
          { id: "all", label: "All Pending Tasks", count: pendingTasks.length },
          { id: "calls", label: "📞 Counsellor Calls", count: pendingCallsCount },
          { id: "gifts", label: "🎁 Milestone Gifts", count: pendingGiftsCount },
          { id: "completed", label: "✓ Completed", count: completedTasks.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
                isActive
                  ? "bg-coral-500 text-white shadow-soft"
                  : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-black ${
                  isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tasks Cards Grid */}
      <div className="grid grid-cols-3 gap-5">
        {filteredTasks.length === 0 ? (
          <div className="col-span-3 rounded-2xl bg-white p-16 text-center text-slate-500 shadow-sm border border-slate-100">
            <CheckCircle2 size={40} className="mx-auto text-emerald-500 mb-2" />
            <div className="text-base font-black text-slate-800">All tasks caught up</div>
            <div className="text-xs font-bold text-slate-400 mt-1">
              No pending calls or gift dispatches in this queue.
            </div>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const member = data.members.find((item) => item.id === task.memberId);
            const journey = data.journeys.find((item) => item.id === task.journeyId);
            const step = journey?.nodes.find((node) => node.id === task.stepId);
            const channel = getTaskChannel(task);
            const isGift = channel === "Gift";

            return (
              <div
                key={task.id}
                className="panel flex flex-col justify-between rounded-2xl p-4 border border-slate-200/90 shadow-2xs transition hover:border-slate-300 bg-white"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-extrabold text-slate-800 truncate">
                        {member?.childName} <span className="text-slate-400 font-semibold">({member?.name})</span>
                      </div>
                      <div className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                        {journey?.name} •{" "}
                        <span className="text-coral-600 font-extrabold">
                          {step?.data?.label || task.dueContext}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-black ${
                        task.status === "Completed"
                          ? "bg-emerald-50 text-emerald-700"
                          : isGift
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      }`}
                    >
                      {isGift ? "🎁 Gift" : "📞 Call"}
                    </span>
                  </div>

                  {/* Compact Context & Details */}
                  <div className="mt-2 rounded-lg bg-slate-50 px-2.5 py-1.5 text-[11px] border border-slate-100 flex items-center justify-between gap-2">
                    <span className="font-extrabold text-slate-800 truncate">{task.dueContext}</span>
                    <span className="shrink-0 text-slate-400 font-semibold">{member?.centre}</span>
                  </div>

                  {/* Operational Action Buttons (Dial / Zepto Dispatch) */}
                  <div className="mt-2 flex items-center gap-1.5">
                    {isGift ? (
                      <div className="flex items-center justify-between w-full rounded-lg bg-amber-50/80 px-2.5 py-1.5 border border-amber-200 text-xs">
                        <span className="flex items-center gap-1.5 font-bold text-amber-800 text-[11px]">
                          <Truck size={13} className="text-amber-600" /> Zepto / Local Dispatch
                        </span>
                        <span className="text-[10px] font-black text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded">
                          Confirm Address
                        </span>
                      </div>
                    ) : (
                      <>
                        <a
                          href={`tel:${member?.phone}`}
                          className="flex items-center justify-center gap-1.5 flex-1 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 py-1.5 px-2 text-xs font-extrabold text-purple-700 transition"
                        >
                          <Phone size={12} className="text-purple-600" /> Dial {member?.phone}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyPhoneNumber(member?.phone, task.id)}
                          className="rounded-lg border border-slate-200 px-2 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50"
                          title="Copy Phone Number"
                        >
                          {copiedId === task.id ? (
                            <Check size={12} className="text-emerald-600" />
                          ) : (
                            <Copy size={12} />
                          )}
                        </button>
                      </>
                    )}
                  </div>

                  {/* Compact Quick Preset Outcome Chips */}
                  {task.status !== "Completed" && (
                    <div className="mt-2 space-y-1.5">
                      <div className="flex flex-wrap gap-1">
                        {(isGift ? quickGiftOutcomes : quickCallOutcomes).map((preset) => {
                          const isSelected = task.comment === preset;
                          return (
                            <button
                              key={preset}
                              type="button"
                              onClick={() => updateTask(task.id, { comment: preset })}
                              className={`rounded-md px-2 py-0.5 text-[10px] font-bold transition text-left truncate max-w-full ${
                                isSelected
                                  ? "bg-coral-500 text-white font-black"
                                  : "bg-slate-100 text-slate-600 hover:bg-coral-50 hover:text-coral-700"
                              }`}
                            >
                              {preset}
                            </button>
                          );
                        })}
                      </div>

                      {/* Single-line Note Input */}
                      <input
                        className="field !py-1 !px-2.5 text-xs w-full"
                        placeholder={
                          isGift
                            ? "Log courier tracking # or handover note..."
                            : "Log call notes or next action..."
                        }
                        value={task.comment || ""}
                        onChange={(event) => updateTask(task.id, { comment: event.target.value })}
                      />
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center gap-2">
                  {task.status !== "Completed" ? (
                    <button
                      className="btn btn-primary !py-1.5 w-full text-xs font-extrabold shadow-soft"
                      onClick={() => updateTask(task.id, { status: "Completed" })}
                    >
                      <Check size={14} /> Mark Completed
                    </button>
                  ) : (
                    <button
                      className="btn btn-ghost !py-1 w-full text-xs font-bold text-slate-500"
                      onClick={() => updateTask(task.id, { status: "Pending" })}
                    >
                      <RotateCcw size={12} /> Reopen Task
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
