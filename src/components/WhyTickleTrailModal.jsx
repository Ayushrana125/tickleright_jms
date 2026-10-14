import { useEffect, useState } from "react";
import {
  Sparkles,
  X,
  Brain,
  ShieldCheck,
  Users,
  Smartphone,
  Phone,
  MessageCircle,
  Gift,
  AlertTriangle,
  Layers,
  TrendingUp,
  Share2,
  MessageSquareHeart,
  Smile,
  Check,
  Target,
  Clock,
  Sparkle,
  Sun,
  Moon,
  Compass,
  Plane,
  Mic,
  Video,
  Palette,
  Trophy,
  HeartHandshake,
} from "lucide-react";

const TOUCHPOINTS_14 = [
  // 1. Daily Rituals
  {
    num: "01",
    cat: "rituals",
    icon: Sun,
    badgeBg: "bg-amber-100 text-amber-800",
    channel: "App Push",
    channelBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    title: "Morning Micro-Game (09:00 AM)",
    desc: "2-minute living-room visual scanning and memory exercises (e.g. 'The Disappearing Object') training eidetic recall during breakfast.",
  },
  {
    num: "02",
    cat: "rituals",
    icon: Moon,
    badgeBg: "bg-indigo-100 text-indigo-800",
    channel: "App Audio",
    channelBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    title: "Bedtime Theta Audio Tale (10:00 PM)",
    desc: "3-minute guided audio stories designed to calm active toddler brainwaves, easing bedtime resistance for exhausted parents.",
  },
  {
    num: "03",
    cat: "rituals",
    icon: Compass,
    badgeBg: "bg-emerald-100 text-emerald-800",
    channel: "App & WhatsApp",
    channelBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Weekend Family Challenge",
    desc: "A fun Saturday morning sensory activity using everyday household items that gets parents and kids exploring together.",
  },
  {
    num: "04",
    cat: "rituals",
    icon: Plane,
    badgeBg: "bg-sky-100 text-sky-800",
    channel: "Printable PDF",
    channelBg: "bg-sky-50 text-sky-700 border-sky-200",
    title: "Holiday & Travel Right-Brain Pack",
    desc: "Compact printable car/flight memory games sent before vacations so the child's cognitive momentum never breaks while traveling.",
  },

  // 2. Classroom & Trainer Continuity
  {
    num: "05",
    cat: "classroom",
    icon: Clock,
    badgeBg: "bg-coral-100 text-coral-800",
    channel: "WhatsApp",
    channelBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Pre-Class Sneak Peek (48h prior)",
    desc: "A 15-second teaser of upcoming Saturday themes ('Deep Ocean & Rhythm Echo') with a curiosity question to prime the child.",
  },
  {
    num: "06",
    cat: "classroom",
    icon: Sparkles,
    badgeBg: "bg-amber-100 text-amber-800",
    channel: "WhatsApp",
    channelBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Post-Class Living Room Carryover",
    desc: "Sent 2 hours after Saturday class with a dinnertime conversation prompt to reinforce newly forged neural pathways at home.",
  },
  {
    num: "07",
    cat: "classroom",
    icon: Mic,
    badgeBg: "bg-pink-100 text-pink-800",
    channel: "Trainer Voice",
    channelBg: "bg-pink-50 text-pink-700 border-pink-200",
    title: "Personal Trainer Audio Note",
    desc: "A warm 20-second voice note from their classroom teacher sharing a specific breakthrough: 'Vivaan caught the high pitch on first try today!'",
  },
  {
    num: "08",
    cat: "classroom",
    icon: Video,
    badgeBg: "bg-indigo-100 text-indigo-800",
    channel: "Video Byte",
    channelBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
    title: "'Behind the Method' Mini-Explainer",
    desc: "30-second clips demystifying the neuroscience behind fast-paced flashcard speed, mandalas, and musical pitch training.",
  },

  // 3. Physical Surprises & Offline Community
  {
    num: "09",
    cat: "physical",
    icon: Gift,
    badgeBg: "bg-emerald-100 text-emerald-800",
    channel: "Physical Delivery",
    channelBg: "bg-pink-50 text-pink-700 border-pink-200",
    title: "Milestone Surprise Kits & Flashcards",
    desc: "Physical right-brain materials, tactile flashcards, and learning toys unannounced at their doorstep to delight child and parent.",
  },
  {
    num: "10",
    cat: "physical",
    icon: Users,
    badgeBg: "bg-orange-100 text-orange-800",
    channel: "Centre Event",
    channelBg: "bg-orange-50 text-orange-700 border-orange-200",
    title: "Sensory Playdates & Centre Meetups",
    desc: "Casual weekend gatherings at the centre where children play right-brain games and parents connect locally over coffee.",
  },
  {
    num: "11",
    cat: "physical",
    icon: HeartHandshake,
    badgeBg: "bg-coral-100 text-coral-800",
    channel: "Centre Event",
    channelBg: "bg-orange-50 text-orange-700 border-orange-200",
    title: "'Bring Dad & Grandparents' Sessions",
    desc: "Special weekend classes designed to involve fathers and grandparents who usually miss regular weekday schedules.",
  },

  // 4. Progress, Recognition & Two-Way Listening
  {
    num: "12",
    cat: "progress",
    icon: Palette,
    badgeBg: "bg-sky-100 text-sky-800",
    channel: "WhatsApp Photo",
    channelBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "Classroom Artwork & Mandala Snaps",
    desc: "High-res photos of the child's completed symmetry mandalas and pattern puzzles with teacher praise, ready for family albums.",
  },
  {
    num: "13",
    cat: "progress",
    icon: Trophy,
    badgeBg: "bg-amber-100 text-amber-800",
    channel: "Classroom Privilege",
    channelBg: "bg-amber-50 text-amber-800 border-amber-200",
    title: "Classroom Privileges for Home Streaks",
    desc: "Consistent 5-day home practice unlocks being the 'Classroom Leader' or ringing the welcome chime on Saturday.",
  },
  {
    num: "14",
    cat: "progress",
    icon: Phone,
    badgeBg: "bg-emerald-100 text-emerald-800",
    channel: "Action Queue Call",
    channelBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    title: "1-Tap Weekly Pulse & Counsellor Check-ins",
    desc: "Quick 1-tap emoji feedback checks paired with scheduled 1-on-1 counsellor calls to answer questions and celebrate growth.",
  },
];

export default function WhyTickleTrailModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("community");
  const [communityFilter, setCommunityFilter] = useState("all");

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

  const filteredTouchpoints =
    communityFilter === "all"
      ? TOUCHPOINTS_14
      : TOUCHPOINTS_14.filter((t) => t.cat === communityFilter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative flex h-[92vh] max-h-[880px] w-full max-w-5xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-8 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-coral-500 text-white font-black shadow-md">
              <Sparkles size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">Why TickleTrail?</span>
                <span className="rounded-full bg-coral-500/20 border border-coral-400/30 px-2 py-0.5 text-[10px] font-black text-coral-300">
                  Business & Community Blueprint
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">
                Building an enduring Brand community through thoughtful guidance, surprises, and systematic retention.
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

        {/* Modal Tabs (Sleek Segmented Bar - Strictly 0 Horizontal Scrollbars) */}
        <div className="border-b border-slate-200 bg-slate-50/80 px-8 py-2.5">
          <div className="grid grid-cols-4 gap-2 bg-slate-200/70 p-1 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab("community")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs transition font-black cursor-pointer ${
                activeTab === "community"
                  ? "bg-white text-coral-600 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <MessageSquareHeart size={14} className="shrink-0" />
              <span className="truncate">1. Community</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("roi")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs transition font-black cursor-pointer ${
                activeTab === "roi"
                  ? "bg-white text-coral-600 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <TrendingUp size={14} className="shrink-0" />
              <span className="truncate">2. Business ROI</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("philosophy")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs transition font-black cursor-pointer ${
                activeTab === "philosophy"
                  ? "bg-white text-coral-600 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Brain size={14} className="shrink-0" />
              <span className="truncate">3. System, Not Head</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("transformation")}
              className={`flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-xs transition font-black cursor-pointer ${
                activeTab === "transformation"
                  ? "bg-white text-coral-600 shadow-xs border border-slate-200/60"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
              }`}
            >
              <Layers size={14} className="shrink-0" />
              <span className="truncate">4. Transformation</span>
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 pt-6 pb-12 space-y-6">
          {/* TAB 1: COMMUNITY VS TRANSACTIONS */}
          {activeTab === "community" && (
            <div className="w-full space-y-6 animate-in fade-in duration-200">
              {/* Highlight Quote Banner */}
              <div className="rounded-3xl border-2 border-coral-200 bg-coral-50/50 p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-coral-500 text-white font-black shadow-xs text-base">
                    💬
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      "Connected — not just showing up for registration, fees, feedback, or renewals."
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-semibold">
                      Think about why families revere iconic Brands like <strong>Lego, Apple, and Nike</strong>: it’s because of their thoughtful guidance, meaningful surprises, and daily inspiration. They never feel like cold, transactional corporations because they cultivate an emotional bond and positive daily lifestyle long before asking for a transaction.
                    </p>
                    <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-semibold">
                      <strong>That is what community actually is.</strong> At Tickle Right, automated journeys transform us from an educational service provider into an irreplaceable, cherished Brand in a parent’s daily life.
                    </p>
                  </div>
                </div>
              </div>

              {/* The Contrast: Transactional Trap vs TickleTrail Connection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                {/* Red Card: Transactional Trap */}
                <div className="rounded-2xl border border-rose-200/90 bg-rose-50/40 p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="grid h-6 w-6 place-items-center rounded-lg bg-rose-100 text-rose-700 font-black">
                      <X size={13} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-black text-rose-950">
                      The "Transactional Trap" (How Outdated Brands Fail)
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-700 font-semibold leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                        <X size={10} strokeWidth={3} />
                      </div>
                      <span>Only reaches out when demanding something: fee collections, survey forms, attendance check-ins, or renewal payment links.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                        <X size={10} strokeWidth={3} />
                      </div>
                      <span>Zero connection between weekly classes. Parents wonder: <em>"Is this working? Should we renew?"</em></span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                        <X size={10} strokeWidth={3} />
                      </div>
                      <span>Parents start ignoring WhatsApp messages and dreading counsellor calls as sales spam.</span>
                    </li>
                  </ul>
                </div>

                {/* Green Card: TickleTrail Model */}
                <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="grid h-6 w-6 place-items-center rounded-lg bg-emerald-100 text-emerald-800 font-black">
                      <Check size={13} strokeWidth={3} />
                    </div>
                    <span className="text-xs font-black text-emerald-950">
                      The "TickleTrail Model" (Beloved Brands Playbook)
                    </span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-700 font-semibold leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Give 10x value first:</strong> 2-minute memory games, bedtime audio adventures, and pediatric right-brain guidance.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Thoughtful surprises:</strong> Unannounced milestone celebrations, developmental brain-byte insights, and personalized parenting encouragement.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span>When renewal time arrives, goodwill is already banked. Parents renew with gratitude, not hesitation.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* 14 CONNECTION TOUCHPOINTS DIRECTORY */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <Smile size={18} className="text-coral-500" />
                    <span className="text-sm font-black text-slate-900">
                      14 Connection Formats Built Into TickleTrail
                    </span>
                    <span className="rounded-full bg-coral-50 text-coral-700 font-black text-[10px] px-2 py-0.5 border border-coral-200">
                      Curriculum-Anchored
                    </span>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                    {[
                      { id: "all", label: "All 14 Touchpoints" },
                      { id: "rituals", label: "🏠 Daily Rituals (4)" },
                      { id: "classroom", label: "🏫 Classroom Continuity (4)" },
                      { id: "physical", label: "🎁 Physical & Offline (3)" },
                      { id: "progress", label: "📈 Progress & Feedback (3)" },
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setCommunityFilter(f.id)}
                        className={`rounded-xl px-2.5 py-1 transition text-[11px] font-extrabold cursor-pointer whitespace-nowrap ${
                          communityFilter === f.id
                            ? "bg-slate-900 text-white shadow-xs"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 14 Cards Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full">
                  {filteredTouchpoints.map((t) => {
                    const IconComp = t.icon;
                    return (
                      <div
                        key={t.num}
                        className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs hover:border-slate-300 transition"
                      >
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className={`grid h-7 w-7 shrink-0 place-items-center rounded-xl font-black ${t.badgeBg}`}>
                              <IconComp size={15} />
                            </div>
                            <span className="text-xs font-black text-slate-900">{t.title}</span>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-[10px] font-black text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              #{t.num}
                            </span>
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${t.channelBg}`}>
                              {t.channel}
                            </span>
                          </div>
                        </div>
                        <p className="text-xs font-semibold text-slate-600 leading-relaxed pl-9.5">
                          {t.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LONG-TERM BUSINESS ROI */}
          {activeTab === "roi" && (
            <div className="w-full space-y-6 animate-in fade-in duration-200">
              {/* Highlight Quote Banner */}
              <div className="rounded-3xl border-2 border-indigo-200 bg-indigo-50/50 p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-indigo-600 text-white font-black shadow-xs">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      "The decision to renew isn't made on Day 89. It is won across 90 daily micro-moments."
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-semibold">
                      In early childhood right-brain training, synaptogenesis and photographic memory are invisible day-to-day. If communication only happens once a week during physical classes, doubts arise. Effective journeys make developmental progress tangible every single day in the family's living room.
                    </p>
                  </div>
                </div>
              </div>

              {/* 4 Pillars of Compounding Business ROI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-100 text-emerald-700 font-black">
                      <TrendingUp size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Compounding Retention & LTV</div>
                      <div className="text-[10px] font-bold text-emerald-700">80%+ Re-enrollment Rate</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    When parents use our morning games and bedtime tales daily, Tickle Right becomes an indispensable family habit. When term ends, parents don't ask <em>"should we continue?"</em>—it’s already part of their toddler’s life.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-coral-100 text-coral-700 font-black">
                      <Share2 size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Organic Referrals (Lower CAC)</div>
                      <div className="text-[10px] font-bold text-coral-700">Word-of-Mouth Engine</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    When an exhausted mother plays our soothing bedtime story and her 2-year-old drifts off peacefully, she screenshots it and sends it to her preschool mommy WhatsApp groups. That generates warm inbound leads without Meta ad spend.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-orange-100 text-orange-700 font-black">
                      <Phone size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Zero-Friction Counsellor Calls</div>
                      <div className="text-[10px] font-bold text-orange-700">High Trust Conversations</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Because the journey has already established warmth and consistency, counsellor calls in the Action Queue feel like supportive check-ins with an expert mentor rather than aggressive sales pitches.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-indigo-100 text-indigo-700 font-black">
                      <ShieldCheck size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Unassailable Competitive Moat</div>
                      <div className="text-[10px] font-bold text-indigo-700">Lifestyle vs Classroom</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Competitors only offer a 45-minute physical classroom session. Tickle Right offers a 24/7 developmental ecosystem. Parents will gladly pay premium pricing for a Brand that supports them every single day.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PHILOSOPHY - IN SYSTEM, NOT IN HEAD */}
          {activeTab === "philosophy" && (
            <div className="w-full space-y-6 animate-in fade-in duration-200">
              {/* Highlight Quote Banner */}
              <div className="rounded-3xl border-2 border-coral-200 bg-coral-50/50 p-5 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-coral-500 text-white font-black shadow-xs text-base">
                    💡
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      "This helps us to keep things in the system, and not in our heads."
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-semibold">
                      When an educational organization scales across <strong>67+ centres</strong>, individual counsellors and centre heads cannot rely on mental memory, personal WhatsApp notes, or scattered Google sheets to decide when to call parents, what game to send, or which milestone to celebrate.
                    </p>
                    <p className="mt-1.5 text-xs text-slate-700 leading-relaxed font-semibold">
                      <strong>TickleTrail</strong> is the institutional brain of Tickle Right: every parent touchpoint, cadence rule, festive blackout, and developmental cue is codified into an automated, auditable system that runs reliably 365 days a year.
                    </p>
                  </div>
                </div>
              </div>

              {/* 3 Core Problems It Solves */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5 w-full">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-rose-50 text-rose-600 font-bold">
                      <AlertTriangle size={15} />
                    </div>
                    <span className="text-xs font-black text-slate-900">Zero Tribal Memory</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    If a superstar counsellor leaves, their best practices don't vanish with them. Every sequence, timing nuance, and tone guideline is safely baked into the journey canvas.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-50 text-indigo-600 font-bold">
                      <ShieldCheck size={15} />
                    </div>
                    <span className="text-xs font-black text-slate-900">Autopilot Guardrails</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    No human error spamming parents at 11 PM or during Diwali. Built-in frequency caps, time-of-day locks, and Sunday blackouts protect parent goodwill automatically.
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xs">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-50 text-emerald-600 font-bold">
                      <Users size={15} />
                    </div>
                    <span className="text-xs font-black text-slate-900">Equal Quality Everywhere</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">
                    Whether a child joins in Mumbai, Bengaluru, or Ahmedabad, their family receives the exact same gold-standard onboarding, tips, and personal phone check-ins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OPERATIONAL TRANSFORMATION */}
          {activeTab === "transformation" && (
            <div className="w-full space-y-6 animate-in fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
                {/* Before Column */}
                <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-5">
                  <div className="flex items-center gap-2 text-rose-800 font-black text-xs uppercase tracking-wider mb-3">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-rose-200 text-rose-900 text-[10px]">
                      <X size={11} strokeWidth={3} />
                    </span>
                    <span>Before TickleTrail (Mental Memory)</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-700 font-semibold leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                        <X size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Scattered Google Sheets:</strong> Counsellors manually checking rows and forgetting who joined 7 days ago.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                        <X size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Inconsistent Touchpoints:</strong> Some parents receive 4 WhatsApp messages in a day, while others hear nothing for 3 weeks.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                        <X size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Accidental Holiday Spam:</strong> Promotional pings accidentally dispatched on Sunday mornings or national festivals.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
                        <X size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Staff Dependent:</strong> Experience drops whenever a branch changes staff or gets busy with admissions.</span>
                    </li>
                  </ul>
                </div>

                {/* With TickleTrail Column */}
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-5">
                  <div className="flex items-center gap-2 text-emerald-800 font-black text-xs uppercase tracking-wider mb-3">
                    <span className="grid h-5 w-5 place-items-center rounded-full bg-emerald-200 text-emerald-900 text-[10px]">
                      <Check size={11} strokeWidth={3} />
                    </span>
                    <span>With TickleTrail (Automated System)</span>
                  </div>

                  <ul className="space-y-3 text-xs text-slate-700 font-semibold leading-relaxed">
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Day-Zero Cadence:</strong> As soon as `members.creation_date` triggers, the visual journey executes step-by-step.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Stacked Day Cards:</strong> Morning games (09:00 AM) and bedtime tales (10:00 PM) organized cleanly into a single card.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Smart Guardrails:</strong> Sunday deferrals, festival calendar checks, and random surprise drops run seamlessly.</span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <div className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span><strong>Action Queue Routing:</strong> Human calls are automatically staged with parent context and guidance scripts.</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Omnichannel Architecture Pill Matrix */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="text-xs font-black text-slate-800 mb-2.5">
                  Synchronized Omnichannel Execution Across Channels
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 w-full text-center">
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
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-8 py-4">
          <div className="text-xs font-bold text-slate-500">
            TickleTrail • Enterprise Journey Management System v2.4
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary !px-6 !py-2 text-xs font-black cursor-pointer shadow-xs"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
