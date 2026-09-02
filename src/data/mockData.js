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
    const stage = stages[(index * 7) % stages.length];
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
    position: { x: 420, y: 20 },
    data: {
      label: "Member Joined the Program",
      triggerKind: "Event-based",
      triggerEvent: "Member Joined the Program",
      audienceSegmentId: "seg-active",
      exclusions: ["MEM-0019"],
    },
  },
  ...[
    ["n1", "Welcome & Onboarding", 1, "tpl-welcome", 420, 230],
    ["n5", "Trainer Introduction", 5, "tpl-trainer-intro", 420, 440],
    ["n9", "Personal check-in call", 9, "tpl-call-checkin", 420, 650],
    ["n17", "Learning Resource Share", 17, "tpl-progress-resource", 420, 860],
    ["n30", "Parent Check-in", 30, "tpl-parent-checkin", 420, 1070],
    ["n100", "Send a small gift", 100, "tpl-gift-small", 420, 1280],
    ["n367", "Annual Connection", 367, "tpl-annual", 420, 1490],
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
    position: { x: 90, y: 1710 },
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
    position: { x: 420, y: 1705 },
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
    ["d3", "Personal check-in", 3, "tpl-discontinued-call", 90, 1920, "D"],
    ["d7", "Understand the reason", 7, "tpl-discontinued-reason", 90, 2130, "D"],
    ["d30", "Recovery or community connection", 30, "tpl-recovery-community", 90, 2340, "D"],
    ["g0", "Graduation recognition", 0, "tpl-grad-recognition", 750, 1920, "G"],
    ["g7", "Alumni learning resources", 7, "tpl-alumni-resources", 750, 2130, "G"],
    ["g30", "Trainer and community connection", 30, "tpl-community-trainer", 750, 2340, "G"],
    ["g90", "Events and referrals", 90, "tpl-events-referrals", 750, 2550, "G"],
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
    position: { x: 420, y: 2780 },
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

const starterJourney = ({ id, name, status, tag, event, reference, modifiedDays, baselineCompletion }) => ({
  id,
  name,
  status,
  tag,
  modifiedAt: daysAgo(modifiedDays),
  trigger: { type: "Event-based", event, reference },
  nodes: [
    {
      id: `${id}-start`,
      type: "start",
      position: { x: 420, y: 40 },
      data: {
        label: event,
        triggerKind: "Event-based",
        triggerEvent: event,
        audienceSegmentId: "seg-all",
        exclusions: [],
      },
    },
  ],
  edges: [],
  baselineCompletion,
});

export const initialData = {
  members,
  segments: [
    { id: "seg-all", name: "All Members", criteria: {}, count: 570 },
    { id: "seg-active", name: "Active Members", criteria: { lifecycleStage: "Active Member" }, count: 114 },
    { id: "seg-graduated", name: "Graduated", criteria: { lifecycleStage: "Graduated" }, count: 114 },
    { id: "seg-age-4-6", name: "Age 4-6", criteria: { ageMin: 4, ageMax: 6 }, count: 214 },
    { id: "seg-mumbai", name: "Mumbai Centre", criteria: { city: "Mumbai" }, count: 82 },
    { id: "seg-discontinued-30", name: "Discontinued - Last 30 Days", criteria: { lifecycleStage: "Discontinued" }, count: 114 },
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
    {
      id: "journey-cold-lead",
      name: "Cold Lead Nurture",
      status: "Draft",
      tag: "Cold Lead Journey",
      modifiedAt: daysAgo(5),
      trigger: { type: "Time-based", event: "Weekly lead nurture", reference: "L" },
      nodes: [],
      edges: [],
      baselineCompletion: 61,
    },
    starterJourney({
      id: "journey-renewal",
      name: "Renewal Reminder Journey",
      status: "Active",
      tag: "Renewal Journey",
      event: "Renewal Due",
      reference: "R",
      modifiedDays: 3,
      baselineCompletion: 69,
    }),
    starterJourney({
      id: "journey-discontinued",
      name: "Discontinued Winback",
      status: "Paused",
      tag: "Discontinued Journey",
      event: "Member Discontinued",
      reference: "D",
      modifiedDays: 4,
      baselineCompletion: 48,
    }),
    starterJourney({
      id: "journey-graduate",
      name: "Graduate Alumni Loop",
      status: "Active",
      tag: "Graduate Journey",
      event: "Member Graduated",
      reference: "G",
      modifiedDays: 6,
      baselineCompletion: 76,
    }),
    starterJourney({
      id: "journey-franchise",
      name: "Franchise Investor Lead",
      status: "Draft",
      tag: "Franchise Investor Lead Journey",
      event: "Franchise Enquiry Received",
      reference: "F",
      modifiedDays: 8,
      baselineCompletion: 42,
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
      assignee: "Aarav Mehta",
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
