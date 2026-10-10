import { useEffect, useState } from "react";
import {
  Sparkles,
  X,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Users,
  Smartphone,
  Phone,
  MessageCircle,
  Gift,
  AlertTriangle,
  ArrowRight,
  Layers,
  HeartHandshake,
} from "lucide-react";

export default function WhyTickleTrailModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("philosophy");

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
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-coral-500 text-white font-black shadow-md">
              <Sparkles size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">Why TickleTrail?</span>
                <span className="rounded-full bg-coral-500/20 border border-coral-400/30 px-2 py-0.5 text-[10px] font-black text-coral-300">
                  Core Purpose & Architecture
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">
                Moving institutional intelligence out of people's heads and directly into the system.
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

        {/* Modal Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-6 py-2.5 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab("philosophy")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition font-black ${
              activeTab === "philosophy"
                ? "bg-white text-coral-600 shadow-xs border border-slate-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Brain size={15} />
            <span>1. Core Philosophy: In System, Not In Head</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("transformation")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition font-black ${
              activeTab === "transformation"
                ? "bg-white text-coral-600 shadow-xs border border-slate-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Layers size={15} />
            <span>2. Before vs With TickleTrail</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("mission")}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 transition font-black ${
              activeTab === "mission"
                ? "bg-white text-coral-600 shadow-xs border border-slate-200"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <HeartHandshake size={15} />
            <span>3. Right-Brain Parent Journey</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "philosophy" && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Highlight Quote Banner */}
              <div className="rounded-3xl border-2 border-coral-200 bg-coral-50/50 p-6 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-coral-500 text-white font-black shadow-xs">
                    💡
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 tracking-tight">
                      "This helps us to keep things in the system, and not in our heads."
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-semibold">
                      When an educational organization scales across <strong>67+ centres</strong>, individual counsellors and centre heads cannot rely on mental memory, personal WhatsApp notes, or scattered Google sheets to decide when to call parents, what game to send, or which milestone to celebrate.
                    </p>
                    <p className="mt-2 text-xs text-slate-700 leading-relaxed font-semibold">
                      <strong>TickleTrail</strong> is the institutional brain of Tickle Right: every parent touchpoint, cadence rule, festive blackout, and developmental cue is codified into an automated, auditable system that runs reliably 365 days a year.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Core Problems It Solves */}
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-rose-50 text-rose-600 font-bold">
                      <AlertTriangle size={15} />
                    </div>
                    <span className="text-xs font-black text-slate-900">Zero Tribal Memory</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    If a counsellor leaves or changes centres, parents don't fall through the cracks. The entire communication timeline continues without missing a beat.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-600 font-bold">
                      <Smartphone size={15} />
                    </div>
                    <span className="text-xs font-black text-slate-900">Omnichannel Sync</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    App push notifications, WhatsApp messages, counsellor calls, and physical kits work together in orchestrated harmony instead of competing for attention.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-4.5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 font-bold">
                      <ShieldCheck size={15} />
                    </div>
                    <span className="text-xs font-black text-slate-900">Guaranteed Respect</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-600 leading-relaxed">
                    Built-in autopilot guardrails automatically roll Sunday morning messages forward and hold touches during national festivals—protecting parent goodwill.
                  </p>
                </div>
              </div>

              {/* Why Centralization Matters */}
              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-5">
                <div className="text-xs font-black uppercase tracking-wider text-indigo-900 mb-2">
                  Unified Quality Across 67+ Centres
                </div>
                <div className="text-xs font-medium text-slate-700 leading-relaxed space-y-1.5">
                  <div>Whether a family joins Tickle Right in <strong>Mumbai, Delhi, Bengaluru, Pune, or Dubai</strong>, their developmental touchpoint experience is scientifically curated, consistently timed, and deeply personalized.</div>
                  <div>Leadership has full transparency into active journeys, touchpoint open rates, counsellor action queues, and retention attribution from a single unified hub.</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "transformation" && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="text-xs font-black uppercase tracking-wider text-slate-500 mb-1">
                Before TickleTrail vs. With TickleTrail
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Before Column */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-rose-800 text-xs font-black">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-200 text-rose-800 text-[10px]">✕</span>
                    Before TickleTrail (Ad-Hoc / Mental)
                  </div>
                  <ul className="text-xs space-y-2.5 font-semibold text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Counsellors kept mental reminders for parent follow-ups and trial check-ins.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Uncoordinated messages sent on WhatsApp, often overlapping with app alerts.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Parents woken up or disturbed on Sunday mornings and Diwali holidays.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>80% of counsellor time was drained by routine copy-pasting of identical reminders.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>Zero visibility for founders into drop-offs, open rates, or retention levers.</span>
                    </li>
                  </ul>
                </div>

                {/* With TickleTrail Column */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 text-xs font-black">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-200 text-emerald-800 text-[10px]">✓</span>
                    With TickleTrail (Institutional System)
                  </div>
                  <ul className="text-xs space-y-2.5 font-semibold text-slate-700">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>Visual autopilot canvas executes journeys automatically based on enrollment dates and events.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>Daily stacked touchpoints orchestrate morning visual micro-games and nighttime audio tales.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>Autopilot Guardrails auto-roll touches away from Sundays and hold national holidays.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>Action Queue filters high-touch counsellor calls so staff spend 100% of time on high-impact parent conversations.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>Real-time Analytics dashboard tracks enrollment traction waves, drop-offs, and renewals.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Omnichannel Architecture Pill Matrix */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-black text-slate-800 mb-2.5">
                  Synchronized Omnichannel Execution
                </div>
                <div className="grid grid-cols-5 gap-2 text-center">
                  <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-2.5">
                    <Smartphone size={16} className="mx-auto text-indigo-600 mb-1" />
                    <div className="text-[11px] font-black text-indigo-900">App Push</div>
                    <div className="text-[9px] font-bold text-slate-500">Daily Micro-Games</div>
                  </div>
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50/60 p-2.5">
                    <MessageCircle size={16} className="mx-auto text-emerald-600 mb-1" />
                    <div className="text-[11px] font-black text-emerald-900">WhatsApp</div>
                    <div className="text-[9px] font-bold text-slate-500">Official Updates</div>
                  </div>
                  <div className="rounded-xl border border-orange-200 bg-orange-50/60 p-2.5">
                    <Phone size={16} className="mx-auto text-orange-600 mb-1" />
                    <div className="text-[11px] font-black text-orange-900">Counsellor Call</div>
                    <div className="text-[9px] font-bold text-slate-500">1-on-1 Guidance</div>
                  </div>
                  <div className="rounded-xl border border-sky-200 bg-sky-50/60 p-2.5">
                    <div className="text-sky-600 font-black text-sm mb-1">✉️</div>
                    <div className="text-[11px] font-black text-sky-900">Email</div>
                    <div className="text-[9px] font-bold text-slate-500">Milestone Reports</div>
                  </div>
                  <div className="rounded-xl border border-pink-200 bg-pink-50/60 p-2.5">
                    <Gift size={16} className="mx-auto text-pink-600 mb-1" />
                    <div className="text-[11px] font-black text-pink-900">Gift Kit</div>
                    <div className="text-[9px] font-bold text-slate-500">Welcome Packages</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "mission" && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5">
                <div className="flex items-center gap-2.5 mb-2">
                  <Brain size={18} className="text-indigo-600" />
                  <span className="text-sm font-black text-indigo-950">
                    The Right-Brain Developmental Mission
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700 leading-relaxed">
                  Tickle Right's proprietary right-brain curriculum is built on photographic memory, rapid visual scanning, rhythm echo, and sensory empathy. These neural connections form through <strong>frequent, joyful daily micro-activities</strong>—not just once-a-week physical classroom attendance.
                </p>
              </div>

              {/* 3 Pillars of Parent Habit Formation */}
              <div className="space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-800 font-black text-xs">
                    ☀️
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">09:00 AM Morning Micro-Nudge (2 Minutes)</div>
                    <div className="text-[11px] font-medium text-slate-600 mt-0.5 leading-relaxed">
                      Parents receive a quick 2-minute visual scanning game (e.g., <em>"Color Radar: Find 3 things brighter than a lemon"</em>) to stimulate eidetic memory while getting ready for the day.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-100 text-indigo-800 font-black text-xs">
                    🌙
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">10:00 PM Bedtime Audio Story (Relaxation & Bonding)</div>
                    <div className="text-[11px] font-medium text-slate-600 mt-0.5 leading-relaxed">
                      A soothing, guided right-brain bedtime audio tale (e.g., <em>"Oliver Owl’s Moonlit Glide"</em>) gently calms nighttime resistance, turning bedtime into a cherished bonding ritual.
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-orange-100 text-orange-800 font-black text-xs">
                    📞
                  </div>
                  <div>
                    <div className="text-xs font-black text-slate-900">Transition Week Counsellor Connection</div>
                    <div className="text-[11px] font-medium text-slate-600 mt-0.5 leading-relaxed">
                      At Days 7, 14, and 30, the system automatically routes the family to the counsellor's Action Queue for a personal conversation to answer parenting questions and celebrate child progress.
                    </div>
                  </div>
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
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
