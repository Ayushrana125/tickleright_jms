const cities = ["Mumbai", "Delhi", "Bengaluru", "Pune", "Hyderabad", "Chennai", "Ahmedabad"];
const centres = ["Bandra", "Andheri", "Powai", "Koramangala", "Indiranagar", "Adyar", "Hitech City"];
const trainers = ["Riya Shah", "Neha Iyer", "Meera Nair", "Kabir Sethi", "Ananya Rao"];
const counsellors = ["Aarav Mehta", "Sara Dsouza", "Priya Menon", "Vikram Jain"];
const stages = ["Lead", "Active Member", "Discontinued", "Graduated", "Franchise Interest"];
const firstNames = ["Aanya", "Vivaan", "Kiara", "Reyansh", "Ira", "Kabir", "Myra", "Aarav", "Anika", "Vihaan"];
const lastNames = ["Shah", "Mehta", "Rao", "Nair", "Kapoor", "Iyer", "Jain", "Sethi", "Menon", "Patel"];
const sources = ["Instagram", "Referral", "Website", "School Event", "Walk-in", "Parent Webinar"];

const daysAgo = (days) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString().slice(0, 10);
};

const makeMembers = () =>
  Array.from({ length: 570 }, (_, index) => {
    const city = cities[index % cities.length];
    // Realistic funnel weighting: Lead ~40%, Active ~35%, Graduated ~14%, Discontinued ~8%, Franchise ~3%
    const rand = (index * 13) % 100;
    const stage =
      rand < 40
        ? "Lead"
        : rand < 75
        ? "Active Member"
        : rand < 89
        ? "Graduated"
        : rand < 97
        ? "Discontinued"
        : "Franchise Interest";
    const child = firstNames[index % firstNames.length];
    const parent = `${firstNames[(index + 3) % firstNames.length]} ${lastNames[index % lastNames.length]}`;
    return {
      id: `MEM-${String(index + 1).padStart(4, "0")}`,
      name: parent,
      parentName: parent,
      childName: child,
      age: 3 + (index % 8),
      city,
      centre: centres[index % centres.length],
      lifecycleStage: stage,
      joiningDate: daysAgo(20 + index * 3),
      joiningCohort: `202${3 + (index % 4)} Q${1 + (index % 4)}`,
      trainer: trainers[index % trainers.length],
      counsellor: counsellors[index % counsellors.length],
      phone: `+91 98${String(70000000 + index * 7919).slice(0, 8)}`,
      email: `${child.toLowerCase()}.${lastNames[index % lastNames.length].toLowerCase()}@example.com`,
      leadSource: sources[index % sources.length],
      campaign: ["Summer Spark", "Right Brain Week", "Festive Fun", "Trial Class"][index % 4],
    };
  });

export const seededTemplates = [
  {
    id: "tpl-welcome",
    name: "Welcome & Onboarding",
    channel: "WhatsApp",
    contentType: "Image + Text",
    content:
      "Hi {{parent_name}}, welcome to Tickle Right. We are excited to begin {{child_name}}'s right-brain journey at {{centre_name}}.",
    variables: ["parent_name", "child_name", "centre_name"],
    image: "Confetti welcome card",
    lastEdited: daysAgo(2),
  },
  {
    id: "tpl-trainer-intro",
    name: "Trainer Introduction",
    channel: "WhatsApp",
    contentType: "Text only",
    content:
      "Hello {{parent_name}}, meet {{trainer_name}}, who will guide {{child_name}} through the next learning milestones.",
    variables: ["parent_name", "trainer_name", "child_name"],
    lastEdited: daysAgo(4),
  },
  {
    id: "tpl-call-checkin",
    name: "Personal check-in call",
    channel: "Call",
    contentType: "Instructions",
    content:
      "Ask how the first week felt, note parent observations, and flag any scheduling or comfort concerns.",
    stakeholderNotes: "Counsellor should complete the call by end of day and mark outcome.",
    variables: [],
    lastEdited: daysAgo(3),
  },
  {
    id: "tpl-progress-resource",
    name: "Learning Resource Share",
    channel: "WhatsApp",
    contentType: "Image + Text",
    content:
      "Sharing a small home activity for {{child_name}}. Try this 5-minute memory game before the next class.",
    variables: ["child_name"],
    image: "Home activity visual",
    lastEdited: daysAgo(6),
  },
  {
    id: "tpl-parent-checkin",
    name: "Parent Check-in",
    channel: "Email",
    contentType: "Text only",
    content:
      "Subject: First month reflections for {{child_name}}\n\nHere is what we have noticed so far, plus what to expect in the coming weeks.",
    variables: ["child_name"],
    lastEdited: daysAgo(8),
  },
  {
    id: "tpl-gift-small",
    name: "Send a small gift",
    channel: "Gift",
    contentType: "Instructions",
    content:
      "Send a small appreciation gift via local delivery. Confirm address before dispatch.",
    stakeholderNotes: "Upload delivery note and comment once delivered.",
    variables: [],
    lastEdited: daysAgo(9),
  },
  {
    id: "tpl-annual",
    name: "Annual Connection",
    channel: "WhatsApp",
    contentType: "Text only",
    content:
      "{{child_name}} has completed a beautiful year with Tickle Right. Here is a warm note from the team.",
    variables: ["child_name"],
    lastEdited: daysAgo(12),
  },
  {
    id: "tpl-discontinued-pause",
    name: "Pause Promotional Communication",
    channel: "WhatsApp",
    contentType: "Text only",
    content: "We have paused regular updates for now. We are still here if you need anything.",
    variables: [],
    lastEdited: daysAgo(14),
  },
  {
    id: "tpl-discontinued-call",
    name: "Discontinued Personal Check-in",
    channel: "Call",
    contentType: "Instructions",
    content: "Call gently, understand context, avoid pressure, and record the reason clearly.",
    stakeholderNotes: "Escalate unresolved concerns to centre head.",
    variables: [],
    lastEdited: daysAgo(13),
  },
  {
    id: "tpl-discontinued-reason",
    name: "Understand Discontinuation Reason",
    channel: "Email",
    contentType: "Text only",
    content: "A short note asking what changed and whether there is anything we can improve.",
    variables: [],
    lastEdited: daysAgo(11),
  },
  {
    id: "tpl-recovery-community",
    name: "Gentle Community Connection",
    channel: "WhatsApp",
    contentType: "Text only",
    content: "You are always welcome at Tickle Right community events and parent circles.",
    variables: [],
    lastEdited: daysAgo(10),
  },
  {
    id: "tpl-grad-recognition",
    name: "Graduation Recognition",
    channel: "WhatsApp",
    contentType: "Image + Text",
    content: "Congratulations {{child_name}}. We are celebrating this milestone with your family.",
    variables: ["child_name"],
    image: "Graduation card",
    lastEdited: daysAgo(5),
  },
  {
    id: "tpl-alumni-resources",
    name: "Alumni Learning Resources",
    channel: "Email",
    contentType: "Text only",
    content: "Curated learning resources for alumni families to keep the practice alive.",
    variables: [],
    lastEdited: daysAgo(5),
  },
  {
    id: "tpl-community-trainer",
    name: "Trainer and Community Connection",
    channel: "Call",
    contentType: "Instructions",
    content: "Invite family to alumni circle and ask trainer to share one memory.",
    stakeholderNotes: "Record parent preference for alumni updates.",
    variables: [],
    lastEdited: daysAgo(7),
  },
  {
    id: "tpl-events-referrals",
    name: "Events and Referrals",
    channel: "WhatsApp",
    contentType: "Text only",
    content: "A warm invite to upcoming events and referral opportunities.",
    variables: [],
    lastEdited: daysAgo(7),
  },
];

export const journeyNodes = [
  {
    id: "start",
    type: "start",
    position: { x: 50, y: 300 },
    data: {
      label: "Member Joined the Program",
      triggerKind: "Event-based",
      triggerEvent: "Member Joined the Program",
      audienceSegmentId: "seg-active",
      exclusions: ["MEM-0019"],
    },
  },
  ...[
    ["n1", "Welcome & Onboarding", 1, "tpl-welcome", 370, 300],
    ["n5", "Trainer Introduction", 5, "tpl-trainer-intro", 690, 300],
    ["n9", "Personal check-in call", 9, "tpl-call-checkin", 1010, 300],
    ["n17", "Learning Resource Share", 17, "tpl-progress-resource", 1330, 300],
    ["n30", "Parent Check-in", 30, "tpl-parent-checkin", 1650, 300],
    ["n100", "Send a small gift", 100, "tpl-gift-small", 1970, 300],
    ["n367", "Annual Connection", 367, "tpl-annual", 2290, 300],
  ].map(([id, label, offset, templateId, x, y]) => ({
    id,
    type: ["tpl-call-checkin", "tpl-gift-small"].includes(templateId) ? "human" : "step",
    position: { x, y },
    data: {
      label,
      offset,
      unit: "Days",
      templateId,
      avoidSundays: true,
      checkFestivalCalendar: true,
      checkContentCalendar: true,
    },
  })),
  {
    id: "d-event",
    type: "event",
    position: { x: 2610, y: 490 },
    data: {
      label: "Discontinued",
      triggerKind: "Event-based",
      triggerEvent: "Member status changed to Discontinued",
      reference: "D",
      audienceSegmentId: "seg-discontinued-30",
      exclusions: [],
    },
  },
  {
    id: "g-event",
    type: "event",
    position: { x: 2610, y: 110 },
    data: {
      label: "Graduate",
      triggerKind: "Event-based",
      triggerEvent: "Member Graduated",
      reference: "G",
      audienceSegmentId: "seg-graduated",
      exclusions: [],
    },
  },
  ...[
    ["d3", "Personal check-in", 3, "tpl-discontinued-call", 2930, 490, "D"],
    ["d7", "Understand the reason", 7, "tpl-discontinued-reason", 3250, 490, "D"],
    ["d30", "Recovery or community connection", 30, "tpl-recovery-community", 3570, 490, "D"],
    ["g0", "Graduation recognition", 0, "tpl-grad-recognition", 2930, 110, "G"],
    ["g7", "Alumni learning resources", 7, "tpl-alumni-resources", 3250, 110, "G"],
    ["g30", "Trainer and community connection", 30, "tpl-community-trainer", 3570, 110, "G"],
    ["g90", "Events and referrals", 90, "tpl-events-referrals", 3890, 110, "G"],
  ].map(([id, label, offset, templateId, x, y, ref]) => ({
    id,
    type: ["tpl-discontinued-call", "tpl-community-trainer"].includes(templateId) ? "human" : "step",
    position: { x, y },
    data: {
      label,
      offset,
      unit: "Days",
      reference: ref,
      templateId,
      avoidSundays: true,
      checkFestivalCalendar: true,
      checkContentCalendar: true,
    },
  })),
  {
    id: "community",
    type: "end",
    position: { x: 4210, y: 300 },
    data: { label: "Tickle Right Community", description: "Ongoing alumni meetups, community events, referrals, and advocacy." },
  },
];

export const journeyEdges = [
  ["start", "n1"],
  ["n1", "n5"],
  ["n5", "n9"],
  ["n9", "n17"],
  ["n17", "n30"],
  ["n30", "n100"],
  ["n100", "n367"],
  ["n367", "d-event"],
  ["d-event", "d3"],
  ["d3", "d7"],
  ["d7", "d30"],
  ["d30", "community"],
  ["n367", "g-event"],
  ["g-event", "g0"],
  ["g0", "g7"],
  ["g7", "g30"],
  ["g30", "g90"],
  ["g90", "community"],
].map(([source, target], index) => ({
  id: `e-${source}-${target}`,
  source,
  target,
  animated: index > 7,
  type: "smoothstep",
}));

const members = makeMembers();

const makeStarterJourney = ({ id, name, status, tag, event, reference, modifiedDays, baselineCompletion, steps }) => {
  const startNode = {
    id: `${id}-start`,
    type: "start",
    position: { x: 50, y: 300 },
    data: {
      label: event,
      triggerKind: "Event-based",
      triggerEvent: event,
      reference,
      audienceSegmentId: "seg-all",
      exclusions: [],
    },
  };

  const stepNodes = (steps || []).map((step, idx) => ({
    id: `${id}-s${idx + 1}`,
    type: step.isHuman ? "human" : "step",
    position: { x: 370 + idx * 320, y: 300 },
    data: {
      label: step.label,
      offset: step.offset,
      unit: "Days",
      reference,
      templateId: step.templateId,
      avoidSundays: true,
      checkFestivalCalendar: true,
      checkContentCalendar: true,
    },
  }));

  const allNodes = [startNode, ...stepNodes];
  const edges = [];
  for (let i = 0; i < allNodes.length - 1; i++) {
    edges.push({
      id: `e-${allNodes[i].id}-${allNodes[i + 1].id}`,
      source: allNodes[i].id,
      target: allNodes[i + 1].id,
      type: "smoothstep",
      animated: status === "Active",
    });
  }

  return {
    id,
    name,
    status,
    tag,
    modifiedAt: daysAgo(modifiedDays),
    trigger: { type: "Event-based", event, reference },
    nodes: allNodes,
    edges,
    baselineCompletion,
  };
};

export const seededEvents = [
  {
    id: "ev-member-join",
    name: "Member Joined the Program",
    reference: "M",
    triggerType: "Date / Database Column",
    dbField: "members.creation_date",
    segmentId: "seg-all",
    description: "Fires when a new member record is inserted or creation_date matches today. Starts the foundational onboarding sequence.",
    linkedJourneys: ["Member Journey"],
    status: "Active",
  },
  {
    id: "ev-trial-inquiry",
    name: "New Trial Inquiry",
    reference: "L",
    triggerType: "Real-time API / Webhook",
    dbField: "leads.created_at",
    segmentId: "seg-all",
    description: "Triggered instantly via website form webhook when a parent requests a right-brain demo class.",
    linkedJourneys: ["Cold Lead Nurture"],
    status: "Active",
  },
  {
    id: "ev-renewal-30",
    name: "Renewal Due (30 Days Out)",
    reference: "R",
    triggerType: "Scheduled Cron Query",
    dbField: "subscriptions.expiry_date - 30 days",
    segmentId: "seg-active",
    description: "Daily 6:00 AM cron query matching active enrolled families whose term expires in exactly 30 calendar days.",
    linkedJourneys: ["Renewal Reminder Journey"],
    status: "Active",
  },
  {
    id: "ev-consecutive-absent",
    name: "Child Absent 2 Consecutive Classes",
    reference: "A",
    triggerType: "Operational / Trainer Log",
    dbField: "attendance.consecutive_missed >= 2",
    segmentId: "seg-active",
    description: "Fires automatically when centre trainer marks 2 consecutive unattended sessions on the tablet.",
    linkedJourneys: [],
    status: "Active",
  },
  {
    id: "ev-milestone-100",
    name: "100-Day Right-Brain Milestone",
    reference: "K",
    triggerType: "Scheduled Cron Query",
    dbField: "members.enrollment_date + 100 days",
    segmentId: "seg-active",
    description: "Calculates enrolled tenure daily to dispatch milestone physical gifts and congratulatory cards.",
    linkedJourneys: ["Member Journey"],
    status: "Active",
  },
  {
    id: "ev-graduation",
    name: "Program Graduation / Alumni",
    reference: "G",
    triggerType: "Date / Database Column",
    dbField: "members.graduation_date",
    segmentId: "seg-graduated",
    description: "Triggered on official course graduation date to transition family into the alumni circle.",
    linkedJourneys: ["Alumni Community Circle"],
    status: "Active",
  },
  {
    id: "ev-birthday",
    name: "Child Birthday (7 Days Prior)",
    reference: "B",
    triggerType: "Scheduled Cron Query",
    dbField: "children.dob - 7 days",
    segmentId: "seg-all",
    description: "Annual anniversary cron scanning child date of birth 7 days in advance for personalized surprise greeting.",
    linkedJourneys: [],
    status: "Active",
  },
  {
    id: "ev-discontinued",
    name: "Member Discontinued",
    reference: "D",
    triggerType: "State Transition / CRM",
    dbField: "members.status = 'Discontinued'",
    segmentId: "seg-discontinued-30",
    description: "Fired when counsellor marks family as discontinued to initiate gentle winback & feedback collection.",
    linkedJourneys: ["Winback & Feedback Journey"],
    status: "Active",
  },
];

export const initialData = {
  members,
  events: seededEvents,
  segments: [
    { id: "seg-all", name: "All Enrolled Members", criteria: {}, count: 6420 },
    { id: "seg-active", name: "Active Members", criteria: { lifecycleStage: "Active Member" }, count: 6420 },
    { id: "seg-graduated", name: "Graduated Alumni", criteria: { lifecycleStage: "Graduated" }, count: 2850 },
    { id: "seg-age-4-6", name: "Age 4-6 Cohort", criteria: { ageMin: 4, ageMax: 6 }, count: 2410 },
    { id: "seg-mumbai", name: "Mumbai Centres", criteria: { city: "Mumbai" }, count: 2568 },
    { id: "seg-bengaluru", name: "Bengaluru Centres", criteria: { city: "Bengaluru" }, count: 1155 },
    { id: "seg-discontinued-30", name: "Discontinued - Winback Target", criteria: { lifecycleStage: "Discontinued" }, count: 980 },
  ],
  exclusions: [
    { id: "ex-1", memberId: "MEM-0019", scope: "Global", reason: "Requested opt-out", createdAt: daysAgo(6) },
    { id: "ex-2", memberId: "MEM-0084", scope: "Member Journey", reason: "Complaint raised", createdAt: daysAgo(2) },
  ],
  templates: seededTemplates,
  journeys: [
    {
      id: "journey-member",
      name: "Member Journey",
      status: "Active",
      tag: "Member Journey",
      modifiedAt: daysAgo(1),
      trigger: { type: "Event-based", event: "Member Joined the Program", reference: "M" },
      nodes: journeyNodes,
      edges: journeyEdges,
      baselineCompletion: 74,
    },
    makeStarterJourney({
      id: "journey-cold-lead",
      name: "Cold Lead Nurture",
      status: "Draft",
      tag: "Cold Lead Journey",
      event: "New Trial Inquiry",
      reference: "L",
      modifiedDays: 5,
      baselineCompletion: 61,
      steps: [
        { label: "Welcome & Demo Video", offset: 1, templateId: "tpl-welcome" },
        { label: "Trainer Introduction", offset: 3, templateId: "tpl-trainer-intro" },
        { label: "Counsellor Discovery Call", offset: 6, templateId: "tpl-call-checkin", isHuman: true },
        { label: "Learning Resource Share", offset: 10, templateId: "tpl-progress-resource" },
      ],
    }),
    makeStarterJourney({
      id: "journey-renewal",
      name: "Renewal Reminder Journey",
      status: "Active",
      tag: "Renewal Journey",
      event: "Renewal Due (30 Days Out)",
      reference: "R",
      modifiedDays: 3,
      baselineCompletion: 69,
      steps: [
        { label: "First Month Reflections", offset: 1, templateId: "tpl-parent-checkin" },
        { label: "Personal Check-in Call", offset: 7, templateId: "tpl-call-checkin", isHuman: true },
        { label: "Milestone Appreciation Gift", offset: 14, templateId: "tpl-gift-small", isHuman: true },
        { label: "Annual Connection & Re-enrollment", offset: 21, templateId: "tpl-annual" },
      ],
    }),
    makeStarterJourney({
      id: "journey-discontinued",
      name: "Discontinued Winback",
      status: "Paused",
      tag: "Discontinued Journey",
      event: "Member Discontinued",
      reference: "D",
      modifiedDays: 4,
      baselineCompletion: 48,
      steps: [
        { label: "Pause Promotional Updates", offset: 1, templateId: "tpl-discontinued-pause" },
        { label: "Counsellor Feedback Call", offset: 4, templateId: "tpl-discontinued-call", isHuman: true },
        { label: "Understand Reason Note", offset: 10, templateId: "tpl-discontinued-reason" },
        { label: "Gentle Community Circle", offset: 25, templateId: "tpl-recovery-community" },
      ],
    }),
    makeStarterJourney({
      id: "journey-graduate",
      name: "Graduate Alumni Loop",
      status: "Active",
      tag: "Graduate Journey",
      event: "Member Graduated",
      reference: "G",
      modifiedDays: 6,
      baselineCompletion: 76,
      steps: [
        { label: "Graduation Celebration Card", offset: 0, templateId: "tpl-grad-recognition" },
        { label: "Alumni Resource Pack", offset: 7, templateId: "tpl-alumni-resources" },
        { label: "Send Milestone Gift", offset: 20, templateId: "tpl-gift-small", isHuman: true },
        { label: "Trainer & Community Connect", offset: 45, templateId: "tpl-community-trainer", isHuman: true },
        { label: "Events & Referral Privilege", offset: 90, templateId: "tpl-events-referrals" },
      ],
    }),
    makeStarterJourney({
      id: "journey-franchise",
      name: "Franchise Investor Lead",
      status: "Draft",
      tag: "Franchise Investor Lead Journey",
      event: "Franchise Enquiry Received",
      reference: "F",
      modifiedDays: 8,
      baselineCompletion: 42,
      steps: [
        { label: "Welcome & Onboarding", offset: 1, templateId: "tpl-welcome" },
        { label: "Counsellor Introductory Call", offset: 3, templateId: "tpl-call-checkin", isHuman: true },
        { label: "Parent Check-in Dossier", offset: 7, templateId: "tpl-parent-checkin" },
      ],
    }),
  ],
  journeyMembers: Array.from({ length: 38 }, (_, index) => ({
    id: `JM-${index + 1}`,
    journeyId: "journey-member",
    memberId: members[(index * 5 + 1) % members.length].id,
    currentNodeId: ["n1", "n5", "n9", "n17", "n30", "n100", "n367", "d3", "g30"][index % 9],
    enteredAt: daysAgo(1 + index * 2),
    status: index % 8 === 0 ? "Completed" : "In progress",
    startedAt: daysAgo(35 + index * 4),
  })),
  actionTasks: Array.from({ length: 15 }, (_, index) => {
    const taskTypes = [
      { stepId: "n9", context: "First-week personal check-in" },
      { stepId: "n100", context: "100-day appreciation gift" },
      { stepId: "d3", context: "Discontinued parent check-in" },
      { stepId: "g30", context: "Alumni community call" },
    ];
    const task = taskTypes[index % taskTypes.length];
    return {
      id: `task-${index + 1}`,
      journeyMemberId: `JM-${(index % 38) + 1}`,
      journeyId: "journey-member",
      memberId: members[(index * 13 + 11) % members.length].id,
      stepId: task.stepId,
      assignee: "Ayush Rana",
      status: "Pending",
      dueContext: task.context,
      comment: "",
    };
  }),
};

export const computeSegmentMembers = (membersList, criteria = {}) =>
  membersList.filter((member) => {
    if (criteria.lifecycleStage && member.lifecycleStage !== criteria.lifecycleStage) return false;
    if (criteria.city && member.city !== criteria.city) return false;
    if (criteria.centre && member.centre !== criteria.centre) return false;
    if (criteria.trainer && member.trainer !== criteria.trainer) return false;
    if (criteria.counsellor && member.counsellor !== criteria.counsellor) return false;
    if (criteria.cohort && member.joiningCohort !== criteria.cohort) return false;
    if (criteria.ageMin && member.age < Number(criteria.ageMin)) return false;
    if (criteria.ageMax && member.age > Number(criteria.ageMax)) return false;
    return true;
  });

export const optionSets = { cities, centres, trainers, counsellors, stages, sources };
