import { useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
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
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

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
  const [selectedJourneyId, setSelectedJourneyId] = useState("journey-renewal");
  const [performanceFilter, setPerformanceFilter] = useState("All"); // "All" | "Performing" | "At-Risk" | "Stable"
  const [selectedChannelFilter, setSelectedChannelFilter] = useState("All");

  // Executive Management Journey Performance & Risk Benchmark
  const journeyBenchmarks = useMemo(() => {
    return [
      {
        id: "journey-renewal",
        name: "Renewal Reminder Journey",
        type: "Term Transition",
        activeCount: 3120,
        actualRate: 84,
        targetRate: 70,
        variance: "+14%",
        performanceStatus: "Performing",
        waRate: 84.0,
        callRate: 79.2,
        emailRate: 62.1,
        driver: "High parental urgency; 42% renew within 72 hours of the first reminder.",
        recommendation: "Maintain 30-day notice runway; slot reservation message produces highest conversion.",
      },
      {
        id: "journey-member",
        name: "Member Journey",
        type: "Active Cohort",
        activeCount: 6420,
        actualRate: 78,
        targetRate: 65,
        variance: "+13%",
        performanceStatus: "Performing",
        waRate: 78.2,
        callRate: 82.0,
        emailRate: 56.4,
        driver: "Consistent weekly habit loop; Day 1 orientation (78%) and Day 100 kit delivery (99%) drive trust.",
        recommendation: "Mid-term check-in pulse is stable; keep home flashcard prompts active.",
      },
      {
        id: "journey-graduate",
        name: "Graduate Alumni Loop",
        type: "Alumni Network",
        activeCount: 2850,
        actualRate: 68,
        targetRate: 50,
        variance: "+18%",
        performanceStatus: "Performing",
        waRate: 68.2,
        callRate: 74.0,
        emailRate: 54.1,
        driver: "Deep brand affinity; 70% of parents attend annual circle workshops and refer peers.",
        recommendation: "Expand Level 3 speed-reading masterclasses to maintain lifelong community.",
      },
      {
        id: "journey-franchise",
        name: "Franchise Investor Lead",
        type: "Partner Pipeline",
        activeCount: 380,
        actualRate: 62,
        targetRate: 60,
        variance: "+2%",
        performanceStatus: "Stable",
        waRate: 62.0,
        callRate: 71.0,
        emailRate: 68.4,
        driver: "70% deck completion rate; discovery meetings close at a healthy 18% territory agreement rate.",
        recommendation: "Streamline territory feasibility assessment turnaround from 7 days to 4 days.",
      },
      {
        id: "journey-cold-lead",
        name: "Cold Lead Nurture",
        type: "Inquiry Pipeline",
        activeCount: 18540,
        actualRate: 34,
        targetRate: 45,
        variance: "-11%",
        performanceStatus: "At-Risk",
        waRate: 34.2,
        callRate: 46.0,
        emailRate: 31.2,
        driver: "High drop-off between brochure download (40% response) and Day 2 discovery call (only 46% connect).",
        recommendation: "Shorten first counsellor touchpoint from Day 2 to within 3 hours of brochure inquiry.",
      },
      {
        id: "journey-discontinued",
        name: "Discontinued Recovery & Winback",
        type: "Re-engagement",
        activeCount: 980,
        actualRate: 26,
        targetRate: 40,
        variance: "-14%",
        performanceStatus: "At-Risk",
        waRate: 26.4,
        callRate: 41.0,
        emailRate: 22.1,
        driver: "59% of exit feedback calls go unanswered; parents perceive calls as commercial sales pitches.",
        recommendation: "Replace outbound call with a 2-question WhatsApp poll on Day 4 to lower friction.",
      },
    ];
  }, []);

  const filteredJourneys = useMemo(() => {
    if (performanceFilter === "All") return journeyBenchmarks;
    return journeyBenchmarks.filter((j) => j.performanceStatus === performanceFilter);
  }, [journeyBenchmarks, performanceFilter]);

  // Touchpoint steps per journey
  const journeysAnalytics = useMemo(() => {
    return [
      {
        id: "journey-renewal",
        name: "Renewal Reminder Journey",
        tag: "Term Transition",
        activeCount: 3120,
        waReplyRate: 84.0,
        callConnectRate: 79.2,
        emailOpenRate: 62.1,
        giftDeliveryRate: 98.4,
        status: "Performing",
        transitionNote: "91% re-enroll · 9% pause term",
        steps: [
          {
            day: "Day -30",
            title: "30-Day Expiry Notification",
            channel: "WhatsApp",
            sent: 3120,
            responded: 2620,
            rate: 84.0,
            metricNote: "84.0% notification acknowledged",
            latency: "18m median latency",
            detail: "Early slot hold for ongoing batch schedule.",
          },
          {
            day: "Day -20",
            title: "Counsellor Batch Reservation Call",
            channel: "Call",
            sent: 1810,
            responded: 1430,
            rate: 79.0,
            metricNote: "79.0% calls connected",
            latency: "5.1m avg duration",
            detail: "Reviews continued developmental trajectory with parent.",
          },
          {
            day: "Day -10",
            title: "Alumni Continuation Privilege Note",
            channel: "Email",
            sent: 890,
            responded: 580,
            rate: 65.2,
            metricNote: "65.2% opened · 28% confirmed",
            latency: "Direct link",
            detail: "Seat reservation window before general waiting list access.",
          },
          {
            day: "Day -3",
            title: "Final Slot Confirmation Notice",
            channel: "WhatsApp",
            sent: 340,
            responded: 285,
            rate: 83.8,
            metricNote: "83.8% final responses",
            latency: "12m median latency",
            detail: "Last call before batch capacity is re-allocated.",
          },
        ],
      },
      {
        id: "journey-member",
        name: "Member Journey",
        tag: "Core Lifecycle",
        activeCount: 6420,
        waReplyRate: 78.2,
        callConnectRate: 82.0,
        emailOpenRate: 56.4,
        giftDeliveryRate: 99.1,
        status: "Performing",
        transitionNote: "86% flow into Renewal Journey · 14% to Winback",
        steps: [
          {
            day: "Day 1",
            title: "Welcome & Onboarding Orientation",
            channel: "WhatsApp",
            sent: 6420,
            responded: 5020,
            rate: 78.2,
            metricNote: "78.2% confirmation reply rate",
            latency: "14m median latency",
            detail: "Initial expectations set; parents confirm batch timing.",
          },
          {
            day: "Day 5",
            title: "Trainer Intro & Flashcard Guidance",
            channel: "WhatsApp",
            sent: 6380,
            responded: 4720,
            rate: 74.0,
            metricNote: "74.0% resource download",
            latency: "28m median latency",
            detail: "Guides parents on home right-brain practice rhythm.",
          },
          {
            day: "Day 9",
            title: "Counsellor Check-in Call",
            channel: "Call",
            sent: 6140,
            responded: 5035,
            rate: 82.0,
            metricNote: "82.0% calls connected",
            latency: "4.8m avg duration",
            detail: "Addresses early class adaptation and child focus.",
          },
          {
            day: "Day 17",
            title: "Curriculum Resources & Worksheets",
            channel: "Email",
            sent: 6020,
            responded: 3490,
            rate: 58.0,
            metricNote: "58.0% open · 32% clicked links",
            latency: "Document access",
            detail: "Downloadable memorization and speed-listening audio.",
          },
          {
            day: "Day 30",
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
            title: "Milestone Physical Kit Dispatch",
            channel: "Gift",
            sent: 5410,
            responded: 5355,
            rate: 99.0,
            metricNote: "99.0% verified delivery",
            latency: "Tracked logistics",
            detail: "Physical developmental flashcard set delivered to residence.",
          },
          {
            day: "Day 367",
            title: "Annual Term Review & Transition",
            channel: "Call",
            sent: 4850,
            responded: 4220,
            rate: 87.0,
            metricNote: "87.0% transition consultations",
            latency: "6.2m avg duration",
            detail: "Reviews 1-year progress and maps out Level 2 pathway.",
          },
        ],
      },
      {
        id: "journey-cold-lead",
        name: "Cold Lead Nurture",
        tag: "Inquiry Pipeline",
        activeCount: 18540,
        waReplyRate: 34.2,
        callConnectRate: 46.0,
        emailOpenRate: 31.2,
        giftDeliveryRate: 0,
        status: "At-Risk",
        transitionNote: "38% attend trial session · 24% enroll",
        steps: [
          {
            day: "Hour 0",
            title: "Trial Booking Confirmation & Overview",
            channel: "WhatsApp",
            sent: 18540,
            responded: 7416,
            rate: 40.0,
            metricNote: "40.0% engagement with media",
            latency: "Immediate",
            detail: "Orientation video showing demo structure and trainer profile.",
          },
          {
            day: "Day 2",
            title: "Discovery & Logistics Check Call",
            channel: "Call",
            sent: 12400,
            responded: 5704,
            rate: 46.0,
            metricNote: "46.0% call connected",
            latency: "3.8m avg duration",
            detail: "Confirms parent attendance and centre navigation details.",
          },
          {
            day: "Day 5",
            title: "Right-Brain Methodology Brief",
            channel: "WhatsApp",
            sent: 8200,
            responded: 2624,
            rate: 32.0,
            metricNote: "32.0% replies or queries",
            latency: "1.4h median latency",
            detail: "Answers standard parent queries regarding 1-3 age group.",
          },
          {
            day: "Day 10",
            title: "Weekend Batch Seat Availability",
            channel: "WhatsApp",
            sent: 5800,
            responded: 1682,
            rate: 29.0,
            metricNote: "29.0% slot requests",
            latency: "45m median latency",
            detail: "Follow-up for parents who missed their initial trial.",
          },
        ],
      },
      {
        id: "journey-discontinued",
        name: "Discontinued Recovery & Winback",
        tag: "Re-engagement",
        activeCount: 980,
        waReplyRate: 26.4,
        callConnectRate: 41.0,
        emailOpenRate: 22.1,
        giftDeliveryRate: 0,
        status: "At-Risk",
        transitionNote: "28% resume within 90 days",
        steps: [
          {
            day: "Day 2",
            title: "Promotional Pause Confirmation",
            channel: "WhatsApp",
            sent: 980,
            responded: 343,
            rate: 35.0,
            metricNote: "35.0% confirmed acknowledgment",
            latency: "Standard hold",
            detail: "Assures parent that promotional outreach is paused.",
          },
          {
            day: "Day 7",
            title: "Exit Feedback & Consultation Call",
            channel: "Call",
            sent: 980,
            responded: 402,
            rate: 41.0,
            metricNote: "41.0% calls completed",
            latency: "4.2m avg duration",
            detail: "Records exit reasons (schedule clash, relocation, medical).",
          },
          {
            day: "Day 30",
            title: "Home Practice Resource Package",
            channel: "WhatsApp",
            sent: 780,
            responded: 195,
            rate: 25.0,
            metricNote: "25.0% resource opens",
            latency: "Content only",
            detail: "Complimentary home activities without commercial push.",
          },
          {
            day: "Day 90",
            title: "Term Re-entry & Vacation Batch Notice",
            channel: "WhatsApp",
            sent: 620,
            responded: 161,
            rate: 26.0,
            metricNote: "26.0% re-activation inquiries",
            latency: "Re-activation",
            detail: "Targeted invite for parents returning from holiday schedules.",
          },
        ],
      },
      {
        id: "journey-graduate",
        name: "Graduate Alumni Loop",
        tag: "Alumni Network",
        activeCount: 2850,
        waReplyRate: 68.2,
        callConnectRate: 74.0,
        emailOpenRate: 54.1,
        giftDeliveryRate: 100,
        status: "Performing",
        transitionNote: "72% advocacy / referral activity",
        steps: [
          {
            day: "Day 0",
            title: "Course Graduation Certificate",
            channel: "Gift",
            sent: 2850,
            responded: 2850,
            rate: 100,
            metricNote: "100% conferred",
            latency: "In-centre",
            detail: "Formal graduation dossier and achievement report.",
          },
          {
            day: "Day 14",
            title: "Alumni Practice Vault Access",
            channel: "Email",
            sent: 2850,
            responded: 1710,
            rate: 60.0,
            metricNote: "60.0% vault activations",
            latency: "Digital portal",
            detail: "Extended library of speed-reading and calculation modules.",
          },
          {
            day: "Day 45",
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
            title: "Annual Alumni Circle & Peer Meet",
            channel: "WhatsApp",
            sent: 2180,
            responded: 1526,
            rate: 70.0,
            metricNote: "70.0% RSVPs / referrals",
            latency: "Community invite",
            detail: "Peer group gathering and exclusive masterclasses.",
          },
        ],
      },
      {
        id: "journey-franchise",
        name: "Franchise Investor Lead",
        tag: "Partner Pipeline",
        activeCount: 380,
        waReplyRate: 62.0,
        callConnectRate: 71.0,
        emailOpenRate: 68.4,
        giftDeliveryRate: 95.0,
        status: "Stable",
        transitionNote: "18% execute territory agreement",
        steps: [
          {
            day: "Hour 1",
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

  const activeJourney = useMemo(() => {
    return journeysAnalytics.find((j) => j.id === selectedJourneyId) || journeysAnalytics[0];
  }, [journeysAnalytics, selectedJourneyId]);

  const activeBenchmark = useMemo(() => {
    return journeyBenchmarks.find((j) => j.id === selectedJourneyId) || journeyBenchmarks[0];
  }, [journeyBenchmarks, selectedJourneyId]);

  const filteredSteps = useMemo(() => {
    if (selectedChannelFilter === "All") return activeJourney.steps;
    return activeJourney.steps.filter((s) => s.channel.toLowerCase() === selectedChannelFilter.toLowerCase());
  }, [activeJourney, selectedChannelFilter]);

  return (
    <div className="page pb-20">
      <PageHeader
        title="Lifecycle & Journey Analytics"
        subtitle="Executive management overview — identifying which lifecycles are performing, where parent engagement drops off, and channel response benchmarks."
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
          1. OMNICHANNEL PERFORMANCE KPIS (Tickle Right Brand Colors & Typography)
      ========================================================================= */}
      <section className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* WhatsApp KPI */}
        <div className="panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
            <span className="flex items-center gap-1.5 text-ink">
              <MessageSquare size={15} className="text-coral-500" />
              WhatsApp Two-Way Reply
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
            <span>22m median latency</span>
            <span className="text-ink font-extrabold">78% first-touch reply</span>
          </div>
        </div>

        {/* Call Connect KPI */}
        <div className="panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
            <span className="flex items-center gap-1.5 text-ink">
              <Phone size={15} className="text-coral-500" />
              Counsellor Call Connect
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

        {/* Resources & Email KPI */}
        <div className="panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
            <span className="flex items-center gap-1.5 text-ink">
              <Mail size={15} className="text-coral-500" />
              Curriculum & Email Access
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
            <span>34% sheet clicked</span>
            <span className="text-ink font-extrabold">68% on mobile</span>
          </div>
        </div>

        {/* Milestone Physical Kits KPI */}
        <div className="panel rounded-2xl p-5">
          <div className="flex items-center justify-between text-xs font-extrabold text-ink/70">
            <span className="flex items-center gap-1.5 text-ink">
              <Package size={15} className="text-coral-500" />
              Milestone Kit Fulfillment
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
            <span className="text-ink font-extrabold">88% receipt confirmed</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. JOURNEY PERFORMANCE & AT-RISK RADAR (EXECUTIVE MANAGEMENT LEVEL)
          Replaces individual child-level radar with macro journey performance
      ========================================================================= */}
      <section className="mb-6">
        <div className="panel rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-coral-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-ink">Journey Performance & Benchmark Radar</h2>
                <span className="rounded-full bg-coral-50 px-2.5 py-0.5 text-xs font-black text-coral-600 border border-coral-200">
                  Management Macro View
                </span>
              </div>
              <p className="text-xs font-semibold text-ink/60 mt-1">
                Comparing parent response rates vs targets across all 6 active lifecycles. Click any journey to inspect its step-by-step touchpoints below.
              </p>
            </div>

            {/* Performance Filter Tabs */}
            <div className="flex items-center gap-1.5 bg-coral-50/60 p-1 rounded-xl border border-coral-100 text-xs font-extrabold">
              {[
                { id: "All", label: "All Lifecycles", count: 6 },
                { id: "Performing", label: "Performing", count: 3 },
                { id: "At-Risk", label: "At-Risk / Lagging", count: 2 },
                { id: "Stable", label: "Stable", count: 1 },
              ].map((tab) => {
                const isActive = performanceFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPerformanceFilter(tab.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition ${
                      isActive
                        ? "bg-coral-500 text-white shadow-2xs"
                        : "text-ink/70 hover:text-ink hover:bg-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-black ${
                        isActive ? "bg-white/20 text-white" : "bg-coral-100 text-coral-600"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cards Grid: Performing vs At-Risk Lifecycles */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJourneys.map((j) => {
              const isSelected = selectedJourneyId === j.id;
              const isPerforming = j.performanceStatus === "Performing";
              const isAtRisk = j.performanceStatus === "At-Risk";
              const isStable = j.performanceStatus === "Stable";

              return (
                <div
                  key={j.id}
                  onClick={() => setSelectedJourneyId(j.id)}
                  className={`cursor-pointer rounded-2xl p-4.5 transition border text-xs flex flex-col justify-between ${
                    isSelected
                      ? "bg-white border-coral-500 shadow-soft ring-2 ring-coral-200"
                      : "bg-white border-coral-100 hover:border-coral-300 hover:shadow-2xs"
                  }`}
                >
                  <div>
                    {/* Header: Journey Name & Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-black text-ink text-sm leading-snug">{j.name}</div>
                        <div className="text-[11px] font-semibold text-ink/50 mt-0.5">
                          {j.type} • <span className="font-mono text-ink/70">{j.activeCount.toLocaleString()} families</span>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-black border ${
                          isPerforming
                            ? "bg-coral-50 text-coral-600 border-coral-200"
                            : isAtRisk
                            ? "bg-[#fff1f4] text-[#c93b58] border-[#f8c5cf]"
                            : "bg-white text-ink/70 border-coral-100"
                        }`}
                      >
                        {isPerforming && "Performing"}
                        {isAtRisk && "At-Risk"}
                        {isStable && "Stable"}
                      </span>
                    </div>

                    {/* Progress Benchmark Bar */}
                    <div className="mt-3.5 mb-3 bg-coral-50/40 p-2.5 rounded-xl border border-coral-100">
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1.5">
                        <span className="font-black text-ink">
                          Actual: {j.actualRate}%
                        </span>
                        <span className="font-semibold text-ink/60">
                          Target: {j.targetRate}% ({j.variance})
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white border border-coral-100 overflow-hidden relative">
                        {/* Target Marker */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-ink/30 z-10"
                          style={{ left: `${j.targetRate}%` }}
                          title={`Target: ${j.targetRate}%`}
                        />
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isAtRisk ? "bg-[#c93b58]" : "bg-coral-500"
                          }`}
                          style={{ width: `${j.actualRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Channel Response Pulse */}
                    <div className="grid grid-cols-3 gap-2 text-center py-2 border-y border-coral-100 font-mono text-[11px]">
                      <div>
                        <span className="text-[10px] text-ink/50 font-sans font-bold block">WhatsApp</span>
                        <span className="font-black text-ink">{j.waRate}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-ink/50 font-sans font-bold block">Calls</span>
                        <span className="font-black text-ink">{j.callRate}%</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-ink/50 font-sans font-bold block">Email</span>
                        <span className="font-black text-ink">{j.emailRate}%</span>
                      </div>
                    </div>

                    {/* Management Diagnosis & Root Cause */}
                    <div className="mt-3 text-[11px] font-semibold text-ink/80 leading-relaxed">
                      <span className="font-black text-ink block mb-0.5">
                        {isAtRisk ? "Drop-off Bottleneck:" : "Performance Driver:"}
                      </span>
                      {j.driver}
                    </div>
                  </div>

                  {/* Strategic Action & Selection Pill */}
                  <div className="mt-3 pt-2.5 border-t border-coral-100 flex items-center justify-between">
                    <span className="text-[10px] font-extrabold text-coral-600 truncate mr-2">
                      {j.recommendation}
                    </span>
                    <button
                      type="button"
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-black transition ${
                        isSelected
                          ? "bg-coral-500 text-white"
                          : "bg-coral-50 text-coral-600 hover:bg-coral-100"
                      }`}
                    >
                      {isSelected ? "Active" : "Inspect"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. DEEP DIVE: TOUCHPOINT STEP-BY-STEP WAVE (FOR SELECTED JOURNEY)
      ========================================================================= */}
      <section className="mb-6">
        <div className="panel rounded-2xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-coral-100">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-black text-ink">Touchpoint Response Wave: {activeJourney.name}</h3>
                <span className="rounded-full bg-coral-50 px-2.5 py-0.5 text-xs font-black text-coral-600 border border-coral-200">
                  {activeJourney.status}
                </span>
              </div>
              <p className="text-xs font-semibold text-ink/60 mt-1">
                Lifecycle outcome: <span className="font-black text-ink">{activeJourney.transitionNote}</span> • Base:{" "}
                <span className="font-mono font-bold text-ink">{activeJourney.activeCount.toLocaleString()} families</span>
              </p>
            </div>

            {/* Channel Filter Pills */}
            <div className="flex items-center gap-1 bg-coral-50/60 p-1 rounded-xl border border-coral-100 text-xs font-extrabold">
              {["All", "WhatsApp", "Call", "Email", "Gift"].map((ch) => (
                <button
                  key={ch}
                  type="button"
                  onClick={() => setSelectedChannelFilter(ch)}
                  className={`rounded-lg px-2.5 py-1 transition ${
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

          {/* Touchpoint Steps Table */}
          <div className="mt-4 border border-coral-100 rounded-xl overflow-hidden divide-y divide-coral-100">
            <div className="grid grid-cols-[80px_1fr_140px_130px] bg-coral-50/40 px-4 py-2.5 text-[11px] font-black text-ink">
              <span>Timeline</span>
              <span>Touchpoint & Purpose</span>
              <span>Volume & Latency</span>
              <span className="text-right">Response Rate</span>
            </div>

            <div className="divide-y divide-coral-100 bg-white">
              {filteredSteps.map((step) => {
                const isUnderperformingStep = step.rate < 50;

                return (
                  <div
                    key={step.title}
                    className="grid grid-cols-[80px_1fr_140px_130px] items-center px-4 py-3 text-xs hover:bg-coral-50/20 transition"
                  >
                    <span className="font-mono text-[11px] font-black text-ink/80">{step.day}</span>

                    <div className="pr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-black text-ink">{step.title}</span>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded-full border border-coral-100 bg-coral-50/50 text-coral-600">
                          {step.channel}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-ink/60 mt-0.5">{step.detail}</div>
                    </div>

                    <div className="text-[11px] font-mono text-ink/80">
                      <div className="font-bold">{step.responded.toLocaleString()} / {step.sent.toLocaleString()}</div>
                      <div className="text-[10px] text-ink/50 font-sans font-medium">{step.latency}</div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-black text-ink">{step.rate}%</div>
                      <div className="mt-1 h-1.5 w-full bg-coral-50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isUnderperformingStep ? "bg-[#c93b58]" : "bg-coral-500"
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

          <div className="mt-3.5 flex items-center justify-between text-xs font-bold text-ink/60">
            <span>Showing {filteredSteps.length} of {activeJourney.steps.length} touchpoints</span>
            <span className="text-coral-600 font-black">All touchpoints adhere to Quiet Hours & Sunday Shield</span>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. OPTIMAL RESPONSE WINDOWS & CENTRE EXECUTION SCORECARD
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_480px] gap-6">
        {/* Left: Golden Window Response Heatmap (Warm Monochromatic Coral Scale) */}
        <div className="panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-black text-ink">Optimal Response Windows (Day × Time)</h3>
              <p className="text-xs font-semibold text-ink/60">
                Empirical parent interaction frequency across 67 centres.
              </p>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-ink/70 font-bold">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-coral-50 border border-coral-100" /> Lower
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-2.5 rounded bg-coral-500" /> Peak (80%+)
              </span>
            </div>
          </div>

          <div className="mt-4 border border-coral-100 rounded-xl overflow-hidden divide-y divide-coral-100">
            {/* Table Header */}
            <div className="grid grid-cols-[70px_1fr_1fr_1fr_1fr] bg-coral-50/40 px-3.5 py-2 text-[11px] font-black text-ink text-center">
              <span className="text-left">Day</span>
              {timeSlotLabels.map((slot) => (
                <div key={slot.label}>
                  <div>{slot.label}</div>
                  <div className="text-[10px] text-ink/50 font-bold">{slot.hours}</div>
                </div>
              ))}
            </div>

            {/* Matrix Rows */}
            {goldenWindowHeatmap.map((row) => (
              <div key={row.day} className="grid grid-cols-[70px_1fr_1fr_1fr_1fr] items-center px-3.5 py-2 text-xs bg-white">
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

          <div className="mt-4 rounded-xl bg-coral-50/50 p-3.5 border border-coral-100 flex items-center justify-between text-xs font-bold text-ink/70">
            <span className="flex items-center gap-1.5">
              <Shield size={14} className="text-coral-500" />
              <span>Sunday Shield Policy:</span>
              <span className="text-ink font-black">Outreach is paused on Sundays; messages queue for Monday morning.</span>
            </span>
            <span className="text-coral-600 font-black">Zero complaints</span>
          </div>
        </div>

        {/* Right: Centre & Branch Execution Scorecard (67 Centres) */}
        <div className="panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-base font-black text-ink">Centre & Branch Execution</h3>
                <p className="text-xs font-semibold text-ink/60">Parent responsiveness across 67 centres</p>
              </div>
              <span className="rounded-full bg-coral-50 px-2.5 py-0.5 text-xs font-black text-coral-600 border border-coral-200">
                67 Centres
              </span>
            </div>

            <div className="mt-4 divide-y divide-coral-100 border border-coral-100 rounded-xl overflow-hidden">
              {centreScorecard.map((c) => (
                <div key={c.centre} className="p-3 text-xs flex items-center justify-between bg-white hover:bg-coral-50/20 transition">
                  <div>
                    <div className="font-black text-ink">{c.centre}</div>
                    <div className="text-[10px] font-bold text-ink/50">{c.families.toLocaleString()} enrolled families</div>
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
          </div>

          <div className="mt-4 pt-3 border-t border-coral-100 flex items-center justify-between text-xs font-bold text-ink/60">
            <span>Network Average SLA: <strong className="text-ink">2.4h</strong></span>
            <span className="text-coral-600 font-black">94.8% SLA compliance</span>
          </div>
        </div>
      </div>
    </div>
  );
}
