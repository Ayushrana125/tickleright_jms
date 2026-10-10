import { useEffect, useState } from "react";
import {
  BookOpen,
  X,
  Compass,
  MapPin,
  Users,
  Zap,
  FileText,
  ListTodo,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Sparkles,
  Smartphone,
  Phone,
  MessageCircle,
  Clock,
  Play,
} from "lucide-react";

export default function TickleTrailGuideModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("modules");

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative flex h-[90vh] max-h-[850px] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4.5 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-indigo-600 text-white font-black shadow-md">
              <BookOpen size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">TickleTrail Guide</span>
                <span className="rounded-full bg-indigo-500/20 border border-indigo-400/30 px-2 py-0.5 text-[10px] font-black text-indigo-300">
                  Quickstart & Modules
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">
                Complete guide to every module and how to build parent journeys in minutes.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Close modal (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-6 py-2.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("modules")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition font-black ${
              activeTab === "modules"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Compass size={15} />
            <span>1. What Each Module Does</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("setup")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition font-black ${
              activeTab === "setup"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers size={15} />
            <span>2. How to Setup a Journey (4 Steps)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("guardrails")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition font-black ${
              activeTab === "guardrails"
                ? "bg-white text-indigo-600 shadow-xs border border-slate-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <ShieldCheck size={15} />
            <span>3. Autopilot Guardrails</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "modules" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                The 6 Core Modules of TickleTrail
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* 1. Journey */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-coral-50 text-coral-600 font-bold">
                      🗺️
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Journey (Visual Builder)</div>
                      <div className="text-[10px] font-bold text-slate-400">Autopilot Canvas</div>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    The core visual node-graph canvas where parent journeys are designed. Connect starting triggers, delays, and <strong>stacked day drops</strong>. Run simulations, zoom/pan the timeline, and auto-enforce guardrails.
                  </p>
                </div>

                {/* 2. Audience */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-sky-50 text-sky-600 font-bold">
                      👥
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Audience (Segmentation)</div>
                      <div className="text-[10px] font-bold text-slate-400">Dynamic Cohorts</div>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    Filter and segment parent cohorts across all <strong>67+ centres</strong>. Track enrollment stages (Enrolled, Trial, Lapsed, Franchise Investors) and inspect live parent profiles.
                  </p>
                </div>

                {/* 3. Events */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600 font-bold">
                      ⚡
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Events (Triggers & Hooks)</div>
                      <div className="text-[10px] font-bold text-slate-400">Real-Time & Date-Based</div>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    Event triggers that kick off journeys: date columns (<code>creation_date</code>, <code>graduation_date</code>) or real-time webhooks (<em>App Installed</em>, <em>Class Attended</em>, <em>Attendance Missed</em>).
                  </p>
                </div>

                {/* 4. Templates */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 font-bold">
                      📋
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Templates (Omnichannel Copy)</div>
                      <div className="text-[10px] font-bold text-slate-400">Centralized Message Library</div>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    Pre-approved templates for WhatsApp, App Push, Email, SMS, Counsellor Call scripts, and Welcome Gift cards with dynamic tags (<code>{`{{parent_name}}`}</code>, <code>{`{{child_age}}`}</code>).
                  </p>
                </div>

                {/* 5. Action Queue */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-purple-50 text-purple-600 font-bold">
                      📥
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Action Queue (Human-in-Loop)</div>
                      <div className="text-[10px] font-bold text-slate-400">Counsellor Call Tasks</div>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    Counsellor task cockpit for high-touch personal phone calls and review approvals. Keeps automation respectful by injecting human empathy at pivotal moments.
                  </p>
                </div>

                {/* 6. Analytics */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-indigo-300 transition">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-teal-50 text-teal-600 font-bold">
                      📊
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Analytics (Attribution)</div>
                      <div className="text-[10px] font-bold text-slate-400">Lifecycle Intelligence</div>
                    </div>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    Conversion funnels, YouTube-style touchpoint response waves, drop-off hotspots, and renewal rates across individual journeys and communication channels.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "setup" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                How to Build a Journey in 4 Simple Steps
              </div>

              <div className="space-y-3">
                {/* Step 1 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-4 shadow-2xs">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500 text-white font-black text-sm">
                    1
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                      <span>Pick Starting Event & Target Cohort</span>
                      <span className="rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 text-[10px] font-black">
                        Trigger Node
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 mt-1 leading-relaxed">
                      Every journey begins with a <strong>Journey Trigger</strong>. Choose whether parents enter automatically upon enrollment (e.g., <em>Time-based: Enrollment Day 1</em>) or via a milestone event (e.g., <em>Trial Completed</em> or <em>Attendance Missed</em>).
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-4 shadow-2xs">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-indigo-600 text-white font-black text-sm">
                    2
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                      <span>Add Touchpoints or Stack Daily Drops</span>
                      <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 text-[10px] font-black">
                        + Stack Day
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 mt-1 leading-relaxed">
                      Click <strong>+ Step</strong> to add standard single touchpoints, or click <strong>+ Stack Day</strong> to bundle multiple drops into one day (e.g., 09:00 AM visual scan game on App Push + 10:00 PM calming bedtime tale). You can also add counsellor phone calls or WhatsApp follow-ups.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-4 shadow-2xs">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-emerald-600 text-white font-black text-sm">
                    3
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                      <span>Configure Autopilot Guardrails</span>
                      <span className="rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 text-[10px] font-black">
                        Auto-Enforced
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 mt-1 leading-relaxed">
                      Select each step and toggle on guardrails in the right drawer: <strong>Avoid Sundays</strong> (rolls touches forward to Monday morning) and <strong>Festive Guard</strong> (suspends messages during national holidays like Diwali or Eid).
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-start gap-4 shadow-2xs">
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-coral-500 text-white font-black text-sm">
                    4
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-black text-slate-900 flex items-center justify-between">
                      <span>Simulate Timing & Activate Journey</span>
                      <span className="rounded-full bg-coral-50 text-coral-700 border border-coral-200 px-2 py-0.5 text-[10px] font-black">
                        Live Autopilot
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-slate-600 mt-1 leading-relaxed">
                      Switch to the <strong>Simulation</strong> tab in the drawer to preview how messages look across channels for a real parent. Once satisfied, hit <strong>Active</strong> in the header—the system takes over execution!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "guardrails" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                Autopilot Guardrails Architecture
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-amber-600 font-black text-sm">☀️</span>
                    <span className="text-xs font-black text-slate-900">Avoid Sundays (Auto-Roll)</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                    Sundays are sacred family rest days. If a milestone or Day offset lands on a Sunday, the autopilot automatically rolls the message forward to Monday at 09:30 AM without skipping sequence integrity.
                  </p>
                </div>

                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-rose-600 font-black text-sm">🎆</span>
                    <span className="text-xs font-black text-slate-900">Festive Guard (National & Cultural Holidays)</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                    During gazetted holidays (Diwali, Christmas, Eid, Independence Day), promotional and routine reminders are paused. Parents only receive warm festive greetings, preventing brand friction.
                  </p>
                </div>

                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-4">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-indigo-600 font-black text-sm">🛡️</span>
                    <span className="text-xs font-black text-slate-900">Content Guard (Message De-duplication)</span>
                  </div>
                  <p className="text-[11px] font-medium text-slate-700 leading-relaxed">
                    Prevents bombarding a parent enrolled in multiple programs. Automatically caps communications across channels to a maximum of 2 touchpoints per 24 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5">
          <div className="text-xs font-bold text-slate-500">
            TickleTrail • Enterprise Journey Management System v2.4
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary !px-5 !py-2 text-xs font-black"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
}
