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
  {
    id: "tpl-app-activity",
    name: "Daily 2-Min Micro-Activity (App Push)",
    channel: "App Notification",
    contentType: "In-App Push",
    content: "🧩 {{activity_title}}: {{activity_description}}",
    variables: ["activity_title", "activity_description", "child_name"],
    lastEdited: daysAgo(0),
  },
  {
    id: "tpl-app-story",
    name: "Night-Time Bedtime Tale (App Audio)",
    channel: "App Notification",
    contentType: "In-App Audio Story",
    content: "🌙 {{story_title}}: Put phone on speaker and let {{child_name}} drift into sweet dreams.",
    variables: ["story_title", "child_name"],
    lastEdited: daysAgo(0),
  },
  {
    id: "tpl-app-brain-byte",
    name: "Brain Byte / Insight (App Push)",
    channel: "App Notification",
    contentType: "In-App Nugget",
    content: "🧠 {{insight_title}}: {{insight_snippet}}",
    variables: ["insight_title", "insight_snippet"],
    lastEdited: daysAgo(1),
  },
  {
    id: "tpl-app-resource",
    name: "Weekend Resource / Printable (App Push)",
    channel: "App Notification",
    contentType: "In-App Download",
    content: "🎨 {{resource_title}}: Tap to view or download for this weekend.",
    variables: ["resource_title"],
    lastEdited: daysAgo(1),
  },
  {
    id: "tpl-app-milestone",
    name: "2-Week Habit Milestone (App Push)",
    channel: "App Notification",
    contentType: "In-App Badge",
    content: "🏆 {{child_name}} unlocked the 2-Week Habit Badge! Tap to celebrate.",
    variables: ["child_name"],
    lastEdited: daysAgo(0),
  },
];

export const appJourneyDayNodes = [
  {
    day: 1,
    date: "12 Oct",
    comms: [
      {
        id: "d1-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: The Disappearing Spoon",
        desc: "Hide 1 dinner object under a napkin. Have your child close eyes and guess what went missing. Trains eidetic memory!",
        deepLink: "tr://activity/disappearing-spoon",
      },
      {
        id: "d1-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Whispering Cloud",
        desc: "A soft 3-min audio adventure that gently guides active toddlers into deep rest and vivid imagination.",
        deepLink: "tr://stories/whispering-cloud",
      },
    ],
  },
  {
    day: 2,
    date: "13 Oct",
    comms: [
      {
        id: "d2-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Color Radar",
        desc: "Look around the room: 'Find 3 things brighter than a lemon!' Rapid visual scanning and vocabulary drill.",
        deepLink: "tr://activity/color-radar",
      },
      {
        id: "d2-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: Oliver Owl’s Moonlit Glide",
        desc: "Gentle forest rustles and deep breathing story to ease bedtime resistance.",
        deepLink: "tr://stories/oliver-owl",
      },
    ],
  },
  {
    day: 3,
    date: "14 Oct",
    comms: [
      {
        id: "d3-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Rhythm Echo",
        desc: "Tap a 3-beat rhythm on the table. Let your child mirror it back. Stimulates right-brain auditory sync.",
        deepLink: "tr://activity/rhythm-echo",
      },
      {
        id: "d3-mid",
        time: "03:30 PM",
        timeOfDay: "afternoon",
        isRandomDrop: true,
        channel: "App Notification",
        title: "Brain Byte: Why Toddlers Think in Snapshots",
        desc: "Kids under 6 process imagery at 0.05 seconds. A 20-second read on how their brain absorbs visual flashcards.",
        deepLink: "tr://brain-byte/visual-snapshots",
      },
      {
        id: "d3-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Little Star That Learned to Rest",
        desc: "Calming bedtime visualization to relax busy minds.",
        deepLink: "tr://stories/little-star",
      },
    ],
  },
  {
    day: 4,
    date: "15 Oct",
    comms: [
      {
        id: "d4-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Animal Pose Freeze",
        desc: "Call out 'Flamingo!' or 'Koala!' and hold a balance pose for 5 seconds. Builds vestibular body awareness.",
        deepLink: "tr://activity/animal-pose",
      },
      {
        id: "d4-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: Leo the Lion Finds His Soft Voice",
        desc: "A soothing audio journey into quiet confidence.",
        deepLink: "tr://stories/leo-the-lion",
      },
    ],
  },
  {
    day: 5,
    date: "16 Oct",
    comms: [
      {
        id: "d5-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Mystery Pillowcase",
        desc: "Place 2 familiar toys in a cloth pouch. Let them feel with hands only and guess. Tactile memory training.",
        deepLink: "tr://activity/mystery-pouch",
      },
      {
        id: "d5-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Sleepy Boat on Silver Lake",
        desc: "Rhythmic waves audio story for peaceful slumber.",
        deepLink: "tr://stories/sleepy-boat",
      },
    ],
  },
  {
    day: 6,
    date: "17 Oct",
    comms: [
      {
        id: "d6-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Flash Glance",
        desc: "Open a book page for 3 seconds, close it, and name two things on the page. High-speed recall drill.",
        deepLink: "tr://activity/flash-glance",
      },
      {
        id: "d6-mid",
        time: "11:15 AM",
        timeOfDay: "afternoon",
        isRandomDrop: true,
        channel: "App Notification",
        title: "Weekend DIY: 2-Ingredient Cloud Dough",
        desc: "Just flour and baby oil! A quick sensory texture play idea for Saturday morning.",
        deepLink: "tr://resources/cloud-dough",
      },
      {
        id: "d6-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Dream Balloon",
        desc: "Float across starry skies to end the week in comfort.",
        deepLink: "tr://stories/dream-balloon",
      },
    ],
  },
  {
    day: 7,
    date: "18 Oct",
    comms: [
      {
        id: "d7-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Silly Mirror Faces",
        desc: "Make a goofy surprised or proud face; let them mirror it. Emotion recognition and right-brain empathy.",
        deepLink: "tr://activity/mirror-faces",
      },
      {
        id: "d7-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Forest Sloth's Slow Day",
        desc: "A tranquil story celebrating unhurried rest and deep peace.",
        deepLink: "tr://stories/forest-sloth",
      },
    ],
  },
  {
    day: 8,
    date: "19 Oct",
    comms: [
      {
        id: "d8-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Sound Detective",
        desc: "Close eyes in the kitchen: 'Is that a spoon clinking, water tap, or paper rustling?' Auditory discrimination.",
        deepLink: "tr://activity/sound-detective",
      },
      {
        id: "d8-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Firefly That Lit the Night",
        desc: "Warm, comforting glow story to banish night fears.",
        deepLink: "tr://stories/firefly",
      },
    ],
  },
  {
    day: 9,
    date: "20 Oct",
    comms: [
      {
        id: "d9-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Two Truths & A Silly Fib",
        desc: "'Elephants can fly, carrots are orange, dogs bark.' Quick logical-intuitive sorting exercise.",
        deepLink: "tr://activity/two-truths",
      },
      {
        id: "d9-mid",
        time: "04:15 PM",
        timeOfDay: "afternoon",
        isRandomDrop: true,
        channel: "App Notification",
        title: "Brain Byte: The Alpha State Secret",
        desc: "Why positive affirmations whispered 5 minutes before sleep become lasting subconscious beliefs.",
        deepLink: "tr://brain-byte/alpha-state",
      },
      {
        id: "d9-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Moon's Soft Blanket",
        desc: "Cozy, soothing visualization for deep regenerative rest.",
        deepLink: "tr://stories/moons-blanket",
      },
    ],
  },
  {
    day: 10,
    date: "21 Oct",
    comms: [
      {
        id: "d10-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Pattern Builder",
        desc: "Lay out: Fork, Spoon, Fork, __? Have your child complete the sequence. Visual pattern recognition.",
        deepLink: "tr://activity/pattern-builder",
      },
      {
        id: "d10-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Sleepy Mountain",
        desc: "Slow, deep-breathing bedtime tale that settles busy toddlers.",
        deepLink: "tr://stories/sleepy-mountain",
      },
    ],
  },
  {
    day: 11,
    date: "22 Oct",
    comms: [
      {
        id: "d11-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Slow-Mo Robot",
        desc: "Walk across the living room in extreme slow-motion for 30 seconds without laughing. Inhibitory motor control.",
        deepLink: "tr://activity/slowmo-robot",
      },
      {
        id: "d11-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Whale’s Lullaby",
        desc: "Ocean wave background harmonies designed for restorative sleep.",
        deepLink: "tr://stories/whales-lullaby",
      },
    ],
  },
  {
    day: 12,
    date: "23 Oct",
    comms: [
      {
        id: "d12-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Opposites Tennis",
        desc: "You say 'Big', they say 'Tiny!'. Rapid semantic association drill for speed thinking.",
        deepLink: "tr://activity/opposites-tennis",
      },
      {
        id: "d12-mid",
        time: "05:30 PM",
        timeOfDay: "afternoon",
        isRandomDrop: true,
        channel: "App Notification",
        title: "Weekend Printable: 5 Speed-Observation Cards",
        desc: "Spot-the-subtle-difference cards to print or play on tablet for family fun this weekend.",
        deepLink: "tr://resources/observation-cards",
      },
      {
        id: "d12-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Star That Sang",
        desc: "Gentle celestial lullaby story for sweet dreams.",
        deepLink: "tr://stories/star-that-sang",
      },
    ],
  },
  {
    day: 13,
    date: "24 Oct",
    comms: [
      {
        id: "d13-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: Imaginary Hat",
        desc: "Put on an imaginary chef hat or wizard hat. Act it out for 1 minute. Pure symbolic right-brain play.",
        deepLink: "tr://activity/imaginary-hat",
      },
      {
        id: "d13-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Cloud Meadow",
        desc: "A cozy, soft descent into peaceful dreams.",
        deepLink: "tr://stories/cloud-meadow",
      },
    ],
  },
  {
    day: 14,
    date: "25 Oct",
    comms: [
      {
        id: "d14-am",
        time: "09:00 AM",
        timeOfDay: "morning",
        channel: "App Notification",
        title: "2-Min Game: The Memory Walk",
        desc: "Close eyes and describe 3 things in your room without looking. Spatial mental mapping.",
        deepLink: "tr://activity/memory-walk",
      },
      {
        id: "d14-mid",
        time: "12:00 PM",
        timeOfDay: "afternoon",
        isRandomDrop: true,
        channel: "App Notification",
        title: "Milestone: 2 Weeks of Joyful Moments!",
        desc: "You've unlocked 14 games and 14 bedtime tales together. Tap to view your child's 2-Week Habit Badge!",
        deepLink: "tr://milestones/2-week-badge",
      },
      {
        id: "d14-pm",
        time: "10:00 PM",
        timeOfDay: "night",
        channel: "App Notification",
        title: "Bedtime Tale: The Kingdom of Sleep",
        desc: "Celebrating two weeks of beautiful bedtime bonding with peaceful dreams.",
        deepLink: "tr://stories/kingdom-of-sleep",
      },
    ],
  },
];

export const memberAppJourney = {
  id: "journey-member-app",
  name: "Member App Companion Journey",
  status: "Active",
  tag: "App Notifications • 14 Days",
  modifiedAt: daysAgo(0),
  trigger: { type: "Time-based", event: "Time-based • All Members", reference: "APP" },
  baselineCompletion: 86,
  nodes: [
    {
      id: "app-start",
      type: "start",
      position: { x: 50, y: 260 },
      data: {
        label: "Time-based • All Members",
        triggerKind: "Time-based",
        triggerEvent: "Time-based • All Members",
        reference: "APP",
        audienceSegmentId: "seg-all",
        exclusions: [],
        avoidSundays: false,
        checkFestivalCalendar: false,
        checkContentCalendar: false,
      },
    },
    ...appJourneyDayNodes.map((dayData, idx) => ({
      id: `app-day-${dayData.day}`,
      type: "stackedDay",
      position: { x: 440 + idx * 390, y: 160 },
      data: {
        day: dayData.day,
        date: dayData.date,
        label: `Day ${dayData.day} • ${dayData.date}`,
        reference: "APP",
        comms: dayData.comms,
        offset: dayData.day,
        unit: "Days",
        avoidSundays: false,
        checkFestivalCalendar: true,
        checkContentCalendar: true,
        metrics: {
          onStage: Math.max(5100, 6420 - idx * 95),
          sent: Math.max(4900, 6380 - idx * 105),
          opened: Math.max(3800, 5200 - idx * 80),
        },
      },
    })),
  ],
  edges: [
    {
      id: "e-app-start-app-day-1",
      source: "app-start",
      target: "app-day-1",
      type: "smoothstep",
      animated: true,
    },
    ...Array.from({ length: 13 }, (_, i) => ({
      id: `e-app-day-${i + 1}-app-day-${i + 2}`,
      source: `app-day-${i + 1}`,
      target: `app-day-${i + 2}`,
      type: "smoothstep",
      animated: true,
    })),
  ],
};


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
    memberAppJourney,
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
