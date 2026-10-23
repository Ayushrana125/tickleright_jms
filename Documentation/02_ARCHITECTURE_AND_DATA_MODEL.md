# 02. Architecture & Data Model
### Frontend Architecture, State Management & Schema Reference

---

## 🏗️ 1. Technical Stack Overview

| Layer | Technology | Purpose |
|---|---|---|
| **Build Tooling & Bundler** | **Vite 6** | Ultra-fast HMR and optimized production bundling. |
| **UI Library** | **React 18** | Functional component architecture with hooks. |
| **Canvas & Flowchart Engine** | **@xyflow/react (React Flow)** | Node-based visual graph builder, smoothstep edges, drag & drop canvas. |
| **State Management** | **React Context API (`DataContext.jsx`)** | Single source of truth for journeys, templates, members, cohorts, and events. |
| **Styling & Design System** | **Tailwind CSS + Custom Palette** | Custom coral (`#e85c7b`), indigo (`#4f46e5`), emerald (`#10b981`), and soft neutral cards. |
| **Iconography** | **lucide-react** | Lightweight SVG icons used across channel badges, step options, and action queues. |
| **Spreadsheet Engine** | **ExcelJS + XLSX** | Client-side styled `.xlsx` generation and spreadsheet parsing. |

---

## 🗄️ 2. State Architecture (`DataContext.jsx`)

The entire state is centralized in `src/store/DataContext.jsx` and injected at the root of the app in `App.jsx`.

```
                  +-----------------------------------+
                  |          <DataProvider>           |
                  +-----------------+-----------------+
                                    |
     +--------------+---------------+--------------+--------------+
     |              |               |              |              |
[ Journeys ]   [ Templates ]   [ Segments ]   [ Members ]    [ Events & Tasks ]
```

### Exported Methods in `useData()`:
* **Journeys:** `updateJourneyGraph(journeyId, nodes, edges)`, `addJourney(journey)`, `updateJourney(id, patch)`
* **Templates:** `addTemplate(template)`, `updateTemplate(id, patch)`, `deleteTemplate(id)`
* **Tasks:** `updateTaskStatus(taskId, status, notes)`, `assignTask(taskId, assignee)`
* **Snapshots:** `pastStackRef` / `futureStackRef` for graph Undo/Redo

---

## 🧩 3. Graph Data Models (`Journey.jsx`)

### A. Journey Object Schema
```javascript
{
  id: "journey-member",
  name: "Member Journey",
  status: "Active", // "Active" | "Draft" | "Paused"
  tag: "Member Journey",
  modifiedAt: "2026-10-22",
  trigger: {
    type: "Event-based", // "Event-based" | "Time-based"
    event: "Member Joined the Program",
    reference: "M"
  },
  nodes: [ /* Array of Node Objects */ ],
  edges: [ /* Array of Edge Objects */ ]
}
```

### B. Node Types on Canvas
1. **`start`**: Origin of the flow; defines the trigger event or schedule.
2. **`step`**: Automated digital touchpoint (`WhatsApp`, `Email`, `App Notification`, `SMS`). References a `templateId`.
3. **`human`**: Operational task assigned to a team member (`Call`, `Gift`).
4. **`stackedDay`**: Container node representing a single calendar day with multiple sequential communications (`comms: [...]`).
5. **`delay`**: Time delay between actions (e.g. `offset: 3`, `unit: "Days"`).
6. **`route`**: Logical decision branch (e.g. `Demo Attendance == Attended` vs `No Show`).
7. **`event`**: Lifecycle milestone fork (e.g. `100-Day Milestone`, `Graduation`).

### C. Standard Step Node Schema
```javascript
{
  id: "n2",
  type: "step", // or "human"
  position: { x: 280, y: 150 },
  data: {
    label: "Trainer Introduction",
    offset: 2,
    unit: "Days",
    reference: "M",
    templateId: "tpl-trainer-intro",
    avoidSundays: true,
    checkFestivalCalendar: true,
    checkContentCalendar: true
  }
}
```

### D. Stacked Day Node Schema
Used when a single calendar day has multiple sequential touchpoints (e.g., Morning 10:00 AM Spark + Evening 07:30 PM Story):
```javascript
{
  id: "day-1",
  type: "stackedDay",
  position: { x: 100, y: 200 },
  data: {
    day: 1,
    date: "12 Oct",
    label: "Day 1 • 12 Oct",
    comms: [
      {
        id: "d1-c1",
        time: "10:00 AM",
        channel: "App Notification",
        title: "2-Min Game: The Disappearing Spoon",
        desc: "Hide 1 object under a napkin. Have your child guess what went missing.",
        deepLink: "tr://activity/disappearing-spoon"
      },
      {
        id: "d1-c2",
        time: "07:30 PM",
        channel: "App Notification",
        title: "Bedtime Tale: The Whispering Cloud",
        desc: "Calming audio tale for theta-brainwave bedtime relaxation.",
        deepLink: "tr://stories/whispering-cloud"
      }
    ],
    avoidSundays: true,
    checkFestivalCalendar: true
  }
}
```

---

## 📋 4. Template Schema (`Templates.jsx`)

Templates define reusable omnichannel communication blueprints.

```typescript
interface Template {
  id: string;               // e.g. "tpl-welcome" or "tpl-app-activity-spark"
  name: string;             // Display name, e.g. "Daily Activity Spark"
  channel: string;          // "WhatsApp" | "Email" | "Call" | "Gift" | "App Notification"
  contentType: string;      // "Text only" | "Image + Text" | "Push Notification" | "Instructions"
  content: string;          // Body copy with dynamic tags: {{parent_name}}, {{child_name}}
  variables?: string[];     // ["parent_name", "child_name", "centre_name"]
  deepLink?: string;        // In-app URI, e.g. "tr://activity/daily-spark"
  stakeholderNotes?: string;// Operational SOP for counsellors (Calls/Gifts)
  image?: string;           // Asset descriptor or image preview filename
  lastEdited: string;       // Date string
}
```

---

## 👥 5. Members & Cohorts Schema (`Audience.jsx`)

### Member Object
```javascript
{
  id: "MEM-0001",
  name: "Ira Mehta",
  parentName: "Ira Mehta",
  childName: "Vivaan",
  age: 4,
  city: "Mumbai",
  centre: "Bandra",
  lifecycleStage: "Active Member", // "Lead" | "Active Member" | "Graduated" | "Discontinued"
  joiningDate: "2026-09-15",
  joiningCohort: "2026 Q3",
  trainer: "Riya Shah",
  counsellor: "Aarav Mehta",
  phone: "+91 9870012345",
  email: "vivaan.mehta@example.com",
  leadSource: "Instagram"
}
```

---

*Next Document: [03_MODULES_AND_FEATURES.md](./03_MODULES_AND_FEATURES.md)*
