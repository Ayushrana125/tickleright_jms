import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  BarChart2,
  Calendar,
  CheckCircle2,
  Clock,
  Filter,
  Layers,
  Mail,
  MapPin,
  MessageSquare,
  Package,
  Phone,
  PhoneIncoming,
  RotateCcw,
  Shield,
  TrendingDown,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

// Brand theme colors from tailwind.config.js
const BRAND = {
  coral: "#e85c7b",
  coralDark: "#d84467",
  coralLight: "#fff1f4",
  coralBorder: "#ffdfe7",
  panelBorder: "#f4d1d9",
  skysoft: "#a8d8e8",
  marigold: "#f5a94e",
  ink: "#30313d",
};

// Weekly Parent Responsiveness Matrix by Time Block (Brand Monochromatic Coral Scale)
const goldenWindowHeatmap = [
  { day: "Mon", slots: [58, 64, 72, 84], peakTime: "20:00 - 21:30" },
  { day: "Tue", slots: [52, 60, 69, 81], peakTime: "20:00 - 21:30" },
  { day: "Wed", slots: [61, 66, 74, 85], peakTime: "20:00 - 21:30" },
  { day: "Thu", slots: [59, 63, 71, 82], peakTime: "20:00 - 21:30" },
  { day: "Fri", slots: [64, 68, 76, 79], peakTime: "18:00 - 20:00" },
  { day: "Sat", slots: [88, 72, 62, 54], peakTime: "10:00 - 12:30 (Morning Calls)" },
  { day: "Sun", slots: [0, 0, 0, 0], peakTime: "Sunday Shield (All Outbound Paused)" },
];

const timeSlotLabels = [
  { label: "Morning", hours: "09:00 - 12:00" },
  { label: "Afternoon", hours: "12:00 - 16:00" },
  { label: "Evening", hours: "16:00 - 19:00" },
  { label: "Night", hours: "19:30 - 21:30" },
];

// Centre & Branch Execution Scorecard (Pan-India 67 Centres)
const centreScorecard = [
  { centre: "Bandra West (HQ)", region: "Mumbai", families: 1420, replyRate: 88, callConnect: 86, slaHours: "1.4h", status: "Performing" },
  { centre: "Juhu Circle", region: "Mumbai", families: 1148, replyRate: 85, callConnect: 84, slaHours: "1.8h", status: "Performing" },
  { centre: "Qatar Doha (International)", region: "Overseas", families: 480, replyRate: 84, callConnect: 82, slaHours: "2.1h", status: "Performing" },
  { centre: "Vasant Vihar", region: "Delhi NCR", families: 890, replyRate: 81, callConnect: 78, slaHours: "2.5h", status: "Stable" },
  { centre: "Indiranagar", region: "Bengaluru", families: 760, replyRate: 79, callConnect: 76, slaHours: "3.2h", status: "Stable" },
  { centre: "Koregaon Park", region: "Pune", families: 520, replyRate: 62, callConnect: 58, slaHours: "6.4h", status: "At-Risk" },
];

export default function Analytics() {
  const { data } = useData();
  const [selectedJourneyId, setSelectedJourneyId] = useState("journey-member");
  const [selectedChannelFilter, setSelectedChannelFilter] = useState("All");
  const [bottomTab, setBottomTab] = useState("at-risk"); // "at-risk" | "centres"

  // 1. All 6 Journeys Lifecycle Matrix (Side-by-Side Comparison)
  const journeysMatrix = useMemo(() => {
    return [
      {
        id: "journey-member",
        name: "Member Journey (Core Lifecycle)",
        tag: "Core Enrolled Cohort",
        families: 6420,
        waReply: 78,
        callConnect: 82,
        emailOpen: 56,
        engagementLevel: "High Pulse 🔥",
        statusBadge: "Performing",
        transitionFlow: "86% flow into Renewal Journey → 14% into Winback/Pause",
        steps: [
          {
            day: "Day 1",
            shortName: "D+1 Welcome WA",
            title: "Welcome & Onboarding Orientation",
            channel: "WhatsApp",
            sent: 6420,
            responded: 5020,
            rate: 78.2,
            metricNote: "78.2% parents replied back",
            latency: "14m median latency",
            detail: "Expectations set; parents confirm batch timing & materials.",
          },
          {
            day: "Day 5",
            shortName: "D+5 Trainer Intro",
            title: "Trainer Intro & Flashcard Guidance",
            channel: "WhatsApp",
            sent: 6380,
            responded: 4720,
            rate: 74.0,
            metricNote: "74.0% downloaded resource",
            latency: "28m median latency",
            detail: "Guides parents on home right-brain practice rhythm.",
          },
          {
            day: "Day 9",
            shortName: "D+9 Counsellor Call",
            title: "Counsellor Check-in Call",
            channel: "Call",
            sent: 6140,
            responded: 5035,
            rate: 82.0,
            metricNote: "82.0% calls answered (avg 4.6 mins)",
            latency: "4.6m avg call duration",
            detail: "Addresses early class adaptation and child focus.",
          },
          {
            day: "Day 17",
            shortName: "D+17 Progress Sheet",
            title: "Curriculum Resources & Worksheets",
            channel: "Email",
            sent: 6020,
            responded: 3490,
            rate: 58.0,
            metricNote: "58.0% opened • 32% clicked links",
            latency: "Document access",
            detail: "Downloadable memorization and speed-listening audio.",
          },
          {
            day: "Day 30",
            shortName: "D+30 Reflection",
            title: "First Month Reflection & Progress",
            channel: "WhatsApp",
            sent: 5890,
            responded: 4360,
            rate: 74.0,
            metricNote: "74.0% parents shared feedback",
            latency: "1.2h median latency",
            detail: "Parents report early photographic recall observations.",
          },
          {
            day: "Day 100",
            shortName: "D+100 Milestone Kit",
            title: "Milestone Physical Gift Dispatch",
            channel: "Gift",
            sent: 5410,
            responded: 5355,
            rate: 99.0,
            metricNote: "99.0% delivered • 88% photo on WA",
            latency: "Tracked logistics",
            detail: "Physical developmental flashcard set delivered to residence.",
          },
          {
            day: "Day 367",
            shortName: "D+367 Annual Touch",
            title: "Annual Term Review & Transition",
            channel: "Call",
            sent: 4850,
            responded: 4220,
            rate: 87.0,
            metricNote: "87.0% consultations completed",
            latency: "6.2m avg duration",
            detail: "Reviews 1-year progress and maps out Level 2 pathway.",
          },
        ],
      },
      {
        id: "journey-renewal",
        name: "Renewal Reminder Journey",
        tag: "Term Transition",
        families: 3120,
        waReply: 84,
        callConnect: 79,
        emailOpen: 62,
        engagementLevel: "Critical Pulse 🔥",
        statusBadge: "Performing",
        transitionFlow: "91% re-enroll in next term → 9% pause term",
        steps: [
          {
            day: "Day -30",
            shortName: "D-30 Expiry Alert",
            title: "30-Day Term Expiry Notification",
            channel: "WhatsApp",
            sent: 3120,
            responded: 2620,
            rate: 84.0,
            metricNote: "84.0% notification acknowledged",
            latency: "18m median latency",
            detail: "Advance alert for upcoming term renewal and preferred batch slots.",
          },
          {
            day: "Day -15",
            shortName: "D-15 Slot Reserve",
            title: "Priority Batch Slot Reservation",
            channel: "WhatsApp",
            sent: 3050,
            responded: 2380,
            rate: 78.0,
            metricNote: "78.0% reserved slot",
            latency: "1.4h median latency",
            detail: "Guarantees student seat in existing trainer batch.",
          },
          {
            day: "Day -7",
            shortName: "D-7 Renewal Call",
            title: "Counsellor Renewal Consultation",
            channel: "Call",
            sent: 2980,
            responded: 2440,
            rate: 82.0,
            metricNote: "82.0% calls connected",
            latency: "4.1m avg duration",
            detail: "Resolves payment schedule queries and confirms batch.",
          },
          {
            day: "Day 0",
            shortName: "D+0 Term Rollover",
            title: "Term Transition & Next Level Welcome",
            channel: "WhatsApp",
            sent: 2840,
            responded: 2726,
            rate: 96.0,
            metricNote: "96.0% rollover confirmed",
            latency: "Instant",
            detail: "Celebrates milestone transition into next developmental level.",
          },
        ],
      },
      {
        id: "journey-cold-lead",
        name: "Cold Lead Nurture",
        tag: "Inquiry Pipeline",
        families: 18540,
        waReply: 31,
        callConnect: 44,
        emailOpen: 28,
        engagementLevel: "Moderate / Lagging",
        statusBadge: "At-Risk",
        transitionFlow: "24% convert to Member Journey → 76% remain in nurture",
        steps: [
          {
            day: "Day 0",
            shortName: "D+0 Brochure",
            title: "Inquiry Welcome & Curriculum Brochure",
            channel: "WhatsApp",
            sent: 18540,
            responded: 7416,
            rate: 40.0,
            metricNote: "40.0% brochure downloads",
            latency: "Instant autopilot",
            detail: "Sent within 60 seconds of initial ad inquiry / form submission.",
          },
          {
            day: "Day 2",
            shortName: "D+2 Discovery Call",
            title: "Counsellor Discovery & Child Age Profiling",
            channel: "Call",
            sent: 16200,
            responded: 7452,
            rate: 46.0,
            metricNote: "46.0% call pickups (drop-off bottleneck)",
            latency: "3.8m avg duration",
            detail: "Understanding child age window (0-3 or 3-7 yrs) and parent goals.",
          },
          {
            day: "Day 5",
            shortName: "D+5 Science Video",
            title: "Right-Brain Methodology Video",
            channel: "WhatsApp",
            sent: 12400,
            responded: 3596,
            rate: 29.0,
            metricNote: "29.0% video views",
            latency: "Media delivery",
            detail: "Visual demonstration of speed flashcards and auditory stimulation.",
          },
          {
            day: "Day 12",
            shortName: "D+12 Centre Trial",
            title: "Complimentary Centre Demo Invitation",
            channel: "WhatsApp",
            sent: 9800,
            responded: 2156,
            rate: 22.0,
            metricNote: "22.0% trial bookings",
            latency: "Calendar invite",
            detail: "Invitation to attend live interactive session at nearest centre.",
          },
          {
            day: "Day 25",
            shortName: "D+25 Check-in",
            title: "Follow-up Touch & Parenting Guide",
            channel: "Email",
            sent: 7200,
            responded: 1296,
            rate: 18.0,
            metricNote: "18.0% guide opens",
            latency: "Resource link",
            detail: "Early childhood cognitive development guide for hesitant parents.",
          },
        ],
      },
      {
        id: "journey-discontinued",
        name: "Discontinued Recovery & Winback",
        tag: "Re-engagement",
        families: 980,
        waReply: 22,
        callConnect: 38,
        emailOpen: 19,
        engagementLevel: "Needs Follow-up ⚠️",
        statusBadge: "At-Risk",
        transitionFlow: "26% re-activate enrollment → 74% long-term pause",
        steps: [
          {
            day: "Day 7",
            shortName: "D+7 Soft Check",
            title: "Exit Feedback & Transition Grace Check",
            channel: "WhatsApp",
            sent: 980,
            responded: 333,
            rate: 34.0,
            metricNote: "34.0% responses",
            latency: "Gentle tone",
            detail: "Checks if discontinuation was due to relocation, timing, or fees.",
          },
          {
            day: "Day 30",
            shortName: "D+30 Home Play",
            title: "Complimentary Home Brain Play Resources",
            channel: "Email",
            sent: 850,
            responded: 238,
            rate: 28.0,
            metricNote: "28.0% resource downloads",
            latency: "Curriculum email",
            detail: "Free home games to keep child engagement warm without sales push.",
          },
          {
            day: "Day 90",
            shortName: "D+90 Re-entry",
            title: "Vacation Batch & Term Re-entry Invite",
            channel: "WhatsApp",
            sent: 620,
            responded: 161,
            rate: 26.0,
            metricNote: "26.0% re-activation inquiries",
            latency: "Seasonal invite",
            detail: "Invitation for parents returning from vacation schedules.",
          },
        ],
      },
      {
        id: "journey-graduate",
        name: "Graduate Alumni Loop",
        tag: "Alumni Network",
        families: 2850,
        waReply: 64,
        callConnect: 71,
        emailOpen: 51,
        engagementLevel: "Active Community",
        statusBadge: "Performing",
        transitionFlow: "70% attend annual circle & refer peers to Tickle Right",
        steps: [
          {
            day: "Day 0",
            shortName: "D+0 Certificate",
            title: "Course Graduation Certificate & Dossier",
            channel: "Gift",
            sent: 2850,
            responded: 2850,
            rate: 100,
            metricNote: "100% conferred in-centre",
            latency: "In-centre",
            detail: "Formal graduation dossier and developmental progress report.",
          },
          {
            day: "Day 14",
            shortName: "D+14 Practice Vault",
            title: "Alumni Practice Vault Access",
            channel: "Email",
            sent: 2850,
            responded: 1710,
            rate: 60.0,
            metricNote: "60.0% vault activations",
            latency: "Digital portal",
            detail: "Extended library of speed-reading and calculation audio files.",
          },
          {
            day: "Day 45",
            shortName: "D+45 Trainer Check",
            title: "Trainer Milestone Check-in Call",
            channel: "Call",
            sent: 2420,
            responded: 1790,
            rate: 74.0,
            metricNote: "74.0% calls connected",
            latency: "5.8m avg duration",
            detail: "Discusses child's ongoing school performance and memory skills.",
          },
          {
            day: "Day 90",
            shortName: "D+90 Circle Meet",
            title: "Annual Alumni Circle & Peer Meet",
            channel: "WhatsApp",
            sent: 2180,
            responded: 1526,
            rate: 70.0,
            metricNote: "70.0% RSVPs / referrals",
            latency: "Community invite",
            detail: "Peer group gathering and exclusive speed-reading masterclasses.",
          },
        ],
      },
      {
        id: "journey-franchise",
        name: "Franchise Investor Lead",
        tag: "Partner Pipeline",
        families: 380,
        waReply: 62,
        callConnect: 71,
        emailOpen: 68,
        engagementLevel: "Stable Rhythm",
        statusBadge: "Stable",
        transitionFlow: "18% execute territory agreement → 82% in review",
        steps: [
          {
            day: "Hour 1",
            shortName: "H+1 Memorandum",
            title: "Franchise Information Memorandum",
            channel: "Email",
            sent: 380,
            responded: 266,
            rate: 70.0,
            metricNote: "70.0% document views",
            latency: "8.4m avg view time",
            detail: "Detailed operational model, centre unit economics, and training.",
          },
          {
            day: "Day 3",
            shortName: "D+3 Discovery Call",
            title: "Executive Leadership Discovery Call",
            channel: "Call",
            sent: 310,
            responded: 220,
            rate: 71.0,
            metricNote: "71.0% calls held",
            latency: "24m avg duration",
            detail: "Evaluates territory feasibility and partner profile.",
          },
          {
            day: "Day 7",
            shortName: "D+7 Feasibility",
            title: "Territory Feasibility & Setup Dossier",
            channel: "WhatsApp",
            sent: 190,
            responded: 124,
            rate: 65.3,
            metricNote: "65.3% territory reviews",
            latency: "Active review",
            detail: "Demographic study of catchment area and launch timeline.",
          },
        ],
      },
    ];
  }, []);

  // Currently selected journey
  const activeJourney = useMemo(() => {
    return journeysMatrix.find((j) => j.id === selectedJourneyId) || journeysMatrix[0];
  }, [journeysMatrix, selectedJourneyId]);

  // Chart data for Visual 3 (Step-by-Step Response Wave / Day-wise of Journey)
  const dayWiseChartData = useMemo(() => {
    return activeJourney.steps.map((step) => ({
      name: step.shortName,
      day: step.day,
      fullTitle: `${step.day} • ${step.title}`,
      channel: step.channel,
      sent: step.sent,
      responded: step.responded,
      rate: step.rate,
    }));
  }, [activeJourney]);

  // Channel-filtered steps
  const filteredSteps = useMemo(() => {
    if (selectedChannelFilter === "All") return activeJourney.steps;
    return activeJourney.steps.filter(
      (s) => s.channel.toLowerCase() === selectedChannelFilter.toLowerCase()
    );
  }, [activeJourney, selectedChannelFilter]);

  // Early-warning disengagement cohorts (Visual 5)
  const atRiskCohorts = useMemo(() => {
    return [
      {
        stage: "Month 3 Foundation (Member Journey)",
        familiesCount: 42,
        trigger: "Left WhatsApp unread for 14+ days • Missed last 2 counsellor check-ins",
        risk: "High Dropout Hazard before Month 4",
        action: "Counsellor personal home-visit call scheduled; offer parent coaching demo.",
      },
      {
        stage: "Day -15 Priority Renewal (Renewal Journey)",
        familiesCount: 18,
        trigger: "Slot reservation expired • Unanswered callback from centre admin",
        risk: "Imminent Batch Forfeiture",
        action: "Centre head direct WhatsApp audio note to hold slot till weekend.",
      },
      {
        stage: "Day 2 Counsellor Discovery (Cold Lead Nurture)",
        familiesCount: 128,
        trigger: "Brochure downloaded but phone call went unanswered on 2 attempts",
        risk: "Lead Cooling Off",
        action: "Switch to 2-question WhatsApp interactive poll to restart friction-free dialogue.",
      },
      {
        stage: "Day 7 Feedback (Discontinued Recovery)",
        familiesCount: 24,
        trigger: "Discontinued due to class schedule friction; no reply to weekend slot invite",
        risk: "Permanent Disengagement",
        action: "Offer weekend hybrid live online session trial.",
      },
    ];
  }, []);

  return (
    <div className="page pb-20">
      <PageHeader
        title="Lifecycle & Journey Analytics"
        subtitle="Executive management overview — omnichannel parent response rates, cross-journey lifecycle comparison, and day-wise milestone traction."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-coral-200 bg-coral-50 px-3.5 py-1.5 text-xs font-bold text-coral-600 shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-coral-500 animate-pulse" />
              Live Operational Pulse
            </span>
          </div>
        }
      />

      {/* =========================================================================
          VISUAL 1: HERO OMNICHANNEL & LIFECYCLE KPIS
          Row 1: Omnichannel Parent Response Rates (WhatsApp, Calls, Email, Kits)
          Row 2: Lifecycle Conversion & Growth Rates (Renewal %, Win-Back %, Referral %)
      ========================================================================= */}
      <section className="mb-6 space-y-4">
        {/* Row 1: Omnichannel Parent Response Rates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 💬 WhatsApp 2-Way Reply */}
          <div className="panel rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
              <span className="flex items-center gap-1.5 text-ink">
                <MessageSquare size={15} className="text-coral-500" />
                WhatsApp 2-Way Reply
              </span>
              <span className="text-[11px] font-mono text-ink/50">14,180 / 19,100</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">74.2%</span>
              <span className="text-xs font-black text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full border border-coral-100">
                Optimal
              </span>
            </div>

            <div className="mt-2.5 h-1.5 rounded-full bg-coral-50 overflow-hidden">
              <div className="h-full rounded-full bg-coral-500" style={{ width: "74.2%" }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-ink/60 font-bold border-t border-coral-100 pt-2">
              <span>22m avg response latency</span>
              <span className="text-ink font-extrabold">78% first-touch reply</span>
            </div>
          </div>

          {/* 📞 Counsellor Call Connect */}
          <div className="panel rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
              <span className="flex items-center gap-1.5 text-ink">
                <Phone size={15} className="text-coral-500" />
                Counsellor Call Pick-up
              </span>
              <span className="text-[11px] font-mono text-ink/50">4,890 / 6,140</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">79.6%</span>
              <span className="text-xs font-black text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full border border-coral-100">
                Connected
              </span>
            </div>

            <div className="mt-2.5 h-1.5 rounded-full bg-coral-50 overflow-hidden">
              <div className="h-full rounded-full bg-coral-500" style={{ width: "79.6%" }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-ink/60 font-bold border-t border-coral-100 pt-2">
              <span>4.6m avg call duration</span>
              <span className="text-ink font-extrabold">82% on 2 attempts</span>
            </div>
          </div>

          {/* ✉️ Resources & Email Open */}
          <div className="panel rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
              <span className="flex items-center gap-1.5 text-ink">
                <Mail size={15} className="text-coral-500" />
                Resource & Email Open
              </span>
              <span className="text-[11px] font-mono text-ink/50">8,420 / 16,250</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">51.8%</span>
              <span className="text-xs font-bold text-ink/70 bg-coral-50/60 px-2 py-0.5 rounded-full border border-coral-100">
                Standard
              </span>
            </div>

            <div className="mt-2.5 h-1.5 rounded-full bg-coral-50 overflow-hidden">
              <div className="h-full rounded-full bg-coral-500" style={{ width: "51.8%" }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-ink/60 font-bold border-t border-coral-100 pt-2">
              <span>34% curriculum links clicked</span>
              <span className="text-ink font-extrabold">68% on mobile</span>
            </div>
          </div>

          {/* 🎁 Milestone Physical Kits */}
          <div className="panel rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
              <span className="flex items-center gap-1.5 text-ink">
                <Package size={15} className="text-coral-500" />
                Milestone Physical Kits
              </span>
              <span className="text-[11px] font-mono text-ink/50">2,810 / 2,855</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">98.4%</span>
              <span className="text-xs font-black text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full border border-coral-100">
                Verified
              </span>
            </div>

            <div className="mt-2.5 h-1.5 rounded-full bg-coral-50 overflow-hidden">
              <div className="h-full rounded-full bg-coral-500" style={{ width: "98.4%" }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-ink/60 font-bold border-t border-coral-100 pt-2">
              <span>99.2% on-time dispatch</span>
              <span className="text-ink font-extrabold">88% photo shared on WA</span>
            </div>
          </div>
        </div>

        {/* Row 2: Lifecycle Conversion & Growth Outcomes (Renewal %, Win-Back %, Referral %) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 🔄 Renewal Rate % */}
          <div className="panel rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
              <span className="flex items-center gap-1.5 text-ink">
                <RotateCcw size={15} className="text-coral-500" />
                Term Renewal Rate
              </span>
              <span className="text-[11px] font-mono text-ink/50">2,640 / 3,120</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">84.6%</span>
              <span className="text-xs font-black text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full border border-coral-100">
                +4.6% vs Target
              </span>
            </div>

            <div className="mt-2.5 h-1.5 rounded-full bg-coral-50 overflow-hidden">
              <div className="h-full rounded-full bg-coral-500" style={{ width: "84.6%" }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-ink/60 font-bold border-t border-coral-100 pt-2">
              <span>91% retained within 14 days</span>
              <span className="text-ink font-extrabold">Avg Term: ₹34,500</span>
            </div>
          </div>

          {/* 🎯 Win Back % */}
          <div className="panel rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
              <span className="flex items-center gap-1.5 text-ink">
                <UserCheck size={15} className="text-coral-500" />
                Discontinued Win-Back Rate
              </span>
              <span className="text-[11px] font-mono text-ink/50">259 / 980</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">26.4%</span>
              <span className="text-xs font-black text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full border border-coral-100">
                Recovered
              </span>
            </div>

            <div className="mt-2.5 h-1.5 rounded-full bg-coral-50 overflow-hidden">
              <div className="h-full rounded-full bg-coral-500" style={{ width: "26.4%" }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-ink/60 font-bold border-t border-coral-100 pt-2">
              <span>42d avg re-activation cycle</span>
              <span className="text-ink font-extrabold">Top: Vacation Batch</span>
            </div>
          </div>

          {/* 👥 Referral Rate % */}
          <div className="panel rounded-2xl p-5">
            <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
              <span className="flex items-center gap-1.5 text-ink">
                <Users size={15} className="text-coral-500" />
                Parent Referral Rate
              </span>
              <span className="text-[11px] font-mono text-ink/50">2,106 / 6,420</span>
            </div>

            <div className="mt-2.5 flex items-baseline gap-2">
              <span className="text-3xl font-black tracking-tight text-ink tabular-nums">32.8%</span>
              <span className="text-xs font-black text-coral-600 bg-coral-50 px-2 py-0.5 rounded-full border border-coral-100">
                High Advocacy
              </span>
            </div>

            <div className="mt-2.5 h-1.5 rounded-full bg-coral-50 overflow-hidden">
              <div className="h-full rounded-full bg-coral-500" style={{ width: "32.8%" }} />
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] text-ink/60 font-bold border-t border-coral-100 pt-2">
              <span>1.4 referrals per active family</span>
              <span className="text-ink font-extrabold">70% Alumni Loop share</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          MIDDLE SECTION (2 COLUMNS):
          Left: VISUAL 2 - Journey Lifecycle Response Matrix (Side-by-Side Comparison)
          Right: VISUAL 3 - Step-by-Step Touchpoint Response Wave (Day-wise Deep Dive)
      ========================================================================= */}
      <section className="mb-6 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column: Visual 2 - Journey Lifecycle Response Matrix (Side-by-Side) */}
        <div className="xl:col-span-5 panel rounded-2xl p-6">
          <div className="flex items-center justify-between pb-3.5 border-b border-coral-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-ink">Journey Response Matrix</h2>
                <span className="rounded-full bg-coral-50 px-2 py-0.5 text-[10px] font-black text-coral-600 border border-coral-200">
                  Side-by-Side
                </span>
              </div>
              <p className="text-xs font-semibold text-ink/60 mt-0.5">
                Comparing parent response rates across all 6 active lifecycles. Click any journey to inspect its day-wise touchpoint chart.
              </p>
            </div>
          </div>

          {/* Matrix Journey Cards / Rows */}
          <div className="mt-4 space-y-3">
            {journeysMatrix.map((journey) => {
              const isSelected = selectedJourneyId === journey.id;
              const isHigh = journey.waReply >= 75;
              const isWarning = journey.waReply < 35;

              return (
                <div
                  key={journey.id}
                  onClick={() => setSelectedJourneyId(journey.id)}
                  className={`cursor-pointer rounded-2xl p-4 transition border text-xs ${
                    isSelected
                      ? "bg-white border-coral-500 shadow-soft ring-2 ring-coral-200"
                      : "bg-white border-coral-100 hover:border-coral-300 hover:shadow-2xs"
                  }`}
                >
                  {/* Title & Enrolled count */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-black text-ink text-sm leading-snug">{journey.name}</div>
                      <div className="text-[11px] font-semibold text-ink/50 mt-0.5">
                        {journey.tag} •{" "}
                        <strong className="font-mono text-ink/80">
                          {journey.families.toLocaleString()} families
                        </strong>
                      </div>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black border ${
                        isHigh
                          ? "bg-coral-50 text-coral-600 border-coral-200"
                          : isWarning
                          ? "bg-[#fff1f4] text-[#c93b58] border-[#f8c5cf]"
                          : "bg-coral-50/50 text-ink/70 border-coral-100"
                      }`}
                    >
                      {journey.engagementLevel}
                    </span>
                  </div>

                  {/* Channel Response Metrics Bars */}
                  <div className="mt-3 grid grid-cols-3 gap-2 bg-coral-50/30 p-2 rounded-xl border border-coral-100 text-[11px] font-mono">
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-sans font-bold text-ink/60 mb-0.5">
                        <span>WA Reply</span>
                        <span className="font-mono font-black text-ink">{journey.waReply}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-coral-100/60">
                        <div
                          className="h-full bg-coral-500 rounded-full"
                          style={{ width: `${journey.waReply}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-sans font-bold text-ink/60 mb-0.5">
                        <span>Call Connect</span>
                        <span className="font-mono font-black text-ink">{journey.callConnect}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-coral-100/60">
                        <div
                          className="h-full bg-coral-500 rounded-full"
                          style={{ width: `${journey.callConnect}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[10px] font-sans font-bold text-ink/60 mb-0.5">
                        <span>Email Open</span>
                        <span className="font-mono font-black text-ink">{journey.emailOpen}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white rounded-full overflow-hidden border border-coral-100/60">
                        <div
                          className="h-full bg-coral-500 rounded-full"
                          style={{ width: `${journey.emailOpen}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Transition Flow Note & Action */}
                  <div className="mt-2.5 pt-2 border-t border-coral-100 flex items-center justify-between text-[11px]">
                    <span className="text-ink/60 font-semibold truncate mr-2">
                      <strong className="text-ink/80">Flow:</strong> {journey.transitionFlow}
                    </span>
                    <button
                      type="button"
                      className={`shrink-0 rounded-lg px-2.5 py-0.5 text-[10px] font-black transition ${
                        isSelected
                          ? "bg-coral-500 text-white"
                          : "bg-coral-50 text-coral-600 hover:bg-coral-100"
                      }`}
                    >
                      {isSelected ? "Active View" : "Select"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Visual 3 - Step-by-Step Touchpoint Response Wave (Day-wise Chart + Table) */}
        <div className="xl:col-span-7 panel rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-coral-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-ink">
                  {activeJourney.name} — Touchpoint Response Wave
                </h2>
                <span className="rounded-full bg-coral-50 px-2 py-0.5 text-[10px] font-black text-coral-600 border border-coral-200">
                  {activeJourney.steps.length} Touchpoints
                </span>
              </div>
              <p className="text-xs font-semibold text-ink/60 mt-0.5">
                Day-wise progression showing touchpoints sent (Sky Soft) vs parent replies & call pick-ups (Coral).
              </p>
            </div>

            {/* Channel Filter Pills */}
            <div className="flex items-center gap-1 bg-coral-50/60 p-1 rounded-xl border border-coral-100 text-xs font-extrabold">
              {["All", "WhatsApp", "Call", "Email", "Gift"].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setSelectedChannelFilter(ch)}
                  className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                    selectedChannelFilter === ch
                      ? "bg-coral-500 text-white shadow-2xs"
                      : "text-ink/70 hover:text-ink hover:bg-white"
                  }`}
                >
                  {ch}
                </button>
              ))}
            </div>
          </div>

          {/* Day-Wise Response Wave Bar Chart */}
          <div className="mt-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dayWiseChartData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f4d1d9" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fontWeight: 800, fill: BRAND.ink }}
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    height={45}
                  />
                  <YAxis
                    tickFormatter={(val) => val.toLocaleString()}
                    tick={{ fontSize: 10, fontWeight: 700, fill: BRAND.ink }}
                  />
                  <Tooltip
                    formatter={(value, name) => [
                      `${value.toLocaleString()} Families`,
                      name === "sent" ? "Touchpoints Sent" : "Parent Replies / Pick-ups",
                    ]}
                    labelFormatter={(label, payload) =>
                      payload?.[0]?.payload?.fullTitle || label
                    }
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      borderRadius: "12px",
                      border: `1px solid ${BRAND.panelBorder}`,
                      boxShadow: "0 10px 25px rgba(48,49,61,0.08)",
                      fontSize: "12px",
                      fontWeight: 700,
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    align="right"
                    wrapperStyle={{ fontSize: "11px", fontWeight: 800, paddingBottom: "10px" }}
                  />
                  <Bar
                    dataKey="sent"
                    fill={BRAND.skysoft}
                    radius={[5, 5, 0, 0]}
                    name="Touchpoints Sent"
                  />
                  <Bar
                    dataKey="responded"
                    fill={BRAND.coral}
                    radius={[5, 5, 0, 0]}
                    name="Parent Replies / Pick-ups"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Chronological Step-by-Step Breakdown Table */}
          <div className="mt-5 border border-coral-100 rounded-xl overflow-hidden divide-y divide-coral-100">
            <div className="grid grid-cols-[75px_1fr_135px_120px] bg-coral-50/40 px-3.5 py-2 text-[11px] font-black text-ink">
              <span>Day</span>
              <span>Milestone & Purpose</span>
              <span>Volume & Latency</span>
              <span className="text-right">Response Rate</span>
            </div>

            <div className="divide-y divide-coral-100 bg-white max-h-[300px] overflow-auto">
              {filteredSteps.map((step) => {
                const isUnderperforming = step.rate < 45;

                return (
                  <div
                    key={step.title}
                    className="grid grid-cols-[75px_1fr_135px_120px] items-center px-3.5 py-2.5 text-xs hover:bg-coral-50/20 transition"
                  >
                    <span className="font-mono text-[11px] font-black text-ink/80">{step.day}</span>

                    <div className="pr-3">
                      <div className="flex items-center gap-1.5">
                        <span className="font-black text-ink">{step.title}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-coral-100 bg-coral-50 text-coral-600">
                          {step.channel}
                        </span>
                      </div>
                      <div className="text-[10px] font-medium text-ink/60 mt-0.5">{step.detail}</div>
                    </div>

                    <div className="text-[11px] font-mono text-ink/80">
                      <div className="font-bold">
                        {step.responded.toLocaleString()} / {step.sent.toLocaleString()}
                      </div>
                      <div className="text-[9px] text-ink/50 font-sans font-medium">{step.latency}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-ink">{step.rate}%</div>
                      <div className="mt-1 h-1.5 w-full bg-coral-50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isUnderperforming ? "bg-[#c93b58]" : "bg-coral-500"
                          }`}
                          style={{ width: `${step.rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs font-bold text-ink/60">
            <span>
              Showing {filteredSteps.length} of {activeJourney.steps.length} milestones
            </span>
            <span className="text-coral-600 font-extrabold">{activeJourney.transitionFlow}</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          BOTTOM GRID (2 COLUMNS):
          Left: VISUAL 4 - "Golden Window" Response Heatmap (Day × Time Grid)
          Right: VISUAL 5 & 6 - At-Risk Dropout Prevention Radar & Centre Scorecard
      ========================================================================= */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Bottom Left: Visual 4 - "Golden Window" Response Heatmap */}
        <div className="xl:col-span-6 panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-ink">
                    Best Time to Reach Parents (Golden Windows)
                  </h3>
                  <span className="rounded-full bg-coral-50 px-2 py-0.5 text-[10px] font-black text-coral-600 border border-coral-200">
                    Day × Time Grid
                  </span>
                </div>
                <p className="text-xs font-semibold text-ink/60 mt-0.5">
                  Parent interaction rate matrix — shows when parents actually pick up calls and reply.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[10px] text-ink/70 font-bold">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-coral-50 border border-coral-100" /> Lower
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded bg-coral-500" /> Peak (80%+)
                </span>
              </div>
            </div>

            {/* Heatmap Grid */}
            <div className="mt-4 border border-coral-100 rounded-xl overflow-hidden divide-y divide-coral-100">
              <div className="grid grid-cols-[65px_1fr_1fr_1fr_1fr] bg-coral-50/40 px-3 py-2 text-[11px] font-black text-ink text-center">
                <span className="text-left">Day</span>
                {timeSlotLabels.map((slot) => (
                  <div key={slot.label}>
                    <div>{slot.label}</div>
                    <div className="text-[9px] text-ink/50 font-bold">{slot.hours}</div>
                  </div>
                ))}
              </div>

              {goldenWindowHeatmap.map((row) => (
                <div
                  key={row.day}
                  className="grid grid-cols-[65px_1fr_1fr_1fr_1fr] items-center px-3 py-2 text-xs bg-white"
                >
                  <span className="font-black text-ink">{row.day}</span>

                  {row.slots.map((val, idx) => {
                    const isZero = val === 0;
                    const isPeak = val >= 80;
                    const isGood = val >= 65 && val < 80;

                    return (
                      <div key={idx} className="px-1">
                        <div
                          className={`py-1.5 rounded-lg text-center font-mono text-[11px] transition ${
                            isZero
                              ? "bg-coral-50/30 text-ink/30 font-bold"
                              : isPeak
                              ? "bg-coral-500 text-white font-black shadow-2xs"
                              : isGood
                              ? "bg-coral-100 text-coral-700 font-extrabold"
                              : "bg-coral-50 text-coral-600 font-bold"
                          }`}
                        >
                          {isZero ? "Paused" : `${val}%`}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Sunday Shield & Quiet Hours Banner */}
          <div className="mt-4 rounded-xl bg-coral-50/50 p-3.5 border border-coral-100 flex items-center justify-between text-xs font-bold text-ink/70">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-coral-500" />
              <span>Sunday Shield Policy:</span>
              <span className="text-ink font-black">
                Outbound reach is paused on Sundays; messages queue for Monday 9:30 AM.
              </span>
            </span>
            <span className="text-coral-600 font-black">100% Respect</span>
          </div>
        </div>

        {/* Bottom Right: Visual 5 & 6 - Retention Early Warning Radar & Centre Scorecard */}
        <div className="xl:col-span-6 panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-coral-100">
              <div>
                <h3 className="text-base font-black text-ink">
                  {bottomTab === "at-risk"
                    ? "At-Risk Parent Early-Warning Radar"
                    : "Centre & Franchise Execution Scorecard"}
                </h3>
                <p className="text-xs font-semibold text-ink/60 mt-0.5">
                  {bottomTab === "at-risk"
                    ? "Dropout prevention — identifies cooling response before parents discontinue."
                    : "67 centres leaderboard — comparing parent response rates and counsellor SLA."}
                </p>
              </div>

              {/* View Switcher Tabs */}
              <div className="flex items-center gap-1 bg-coral-50/60 p-1 rounded-xl border border-coral-100 text-xs font-extrabold">
                <button
                  type="button"
                  onClick={() => setBottomTab("at-risk")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                    bottomTab === "at-risk"
                      ? "bg-coral-500 text-white shadow-2xs"
                      : "text-ink/70 hover:text-ink hover:bg-white"
                  }`}
                >
                  Early-Warning Radar
                </button>
                <button
                  type="button"
                  onClick={() => setBottomTab("centres")}
                  className={`rounded-lg px-2.5 py-1 text-[11px] transition ${
                    bottomTab === "centres"
                      ? "bg-coral-500 text-white shadow-2xs"
                      : "text-ink/70 hover:text-ink hover:bg-white"
                  }`}
                >
                  67 Centres Scorecard
                </button>
              </div>
            </div>

            {/* TAB 1: At-Risk Parent Radar (Visual 5) */}
            {bottomTab === "at-risk" && (
              <div className="mt-4 space-y-3">
                {atRiskCohorts.map((item) => (
                  <div
                    key={item.stage}
                    className="rounded-xl border border-coral-100 bg-white p-3.5 shadow-2xs hover:border-coral-300 transition text-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-black text-ink text-xs">{item.stage}</div>
                        <div className="text-[11px] text-[#c93b58] font-bold mt-0.5">
                          Signal: {item.trigger}
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full bg-[#fff1f4] text-[#c93b58] border border-[#f8c5cf] px-2 py-0.5 text-[10px] font-black">
                        {item.familiesCount} Families
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2 border-t border-coral-100 flex items-center justify-between text-[11px]">
                      <span className="text-ink/70 font-semibold truncate mr-2">
                        <strong className="text-ink">Action:</strong> {item.action}
                      </span>
                      <span className="shrink-0 text-coral-600 font-black">Counsellor Queue</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAB 2: Centre & Franchise Execution Scorecard (Visual 6) */}
            {bottomTab === "centres" && (
              <div className="mt-4 divide-y divide-coral-100 border border-coral-100 rounded-xl overflow-hidden">
                {centreScorecard.map((c) => (
                  <div
                    key={c.centre}
                    className="p-3 text-xs flex items-center justify-between bg-white hover:bg-coral-50/20 transition"
                  >
                    <div>
                      <div className="font-black text-ink">{c.centre}</div>
                      <div className="text-[10px] font-bold text-ink/50">
                        {c.region} • {c.families.toLocaleString()} enrolled families
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] font-mono text-ink text-right">
                      <div>
                        <span className="text-[10px] text-ink/50 font-sans font-bold block">Reply</span>
                        <span className="font-black text-ink">{c.replyRate}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-ink/50 font-sans font-bold block">Connect</span>
                        <span className="font-black text-ink">{c.callConnect}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-ink/50 font-sans font-bold block">SLA</span>
                        <span className="font-black text-coral-600">{c.slaHours}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-coral-100 flex items-center justify-between text-xs font-bold text-ink/60">
            <span>
              {bottomTab === "at-risk"
                ? "Total Fading Engagement: 212 families identified across 6 lifecycles"
                : "Network Average Counsellor SLA: 2.4h across 67 centres"}
            </span>
            <span className="text-coral-600 font-black">
              {bottomTab === "at-risk" ? "Autopilot Flag Active" : "94.8% SLA Compliance"}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
