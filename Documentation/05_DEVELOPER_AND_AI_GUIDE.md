# 05. Developer & AI Environment Onboarding Guide
### Essential Instructions for Engineers and AI Agents Working on TickleTrail

---

## 🤖 1. Critical Rules for AI Agents & Developers

1. **Explicit Approval Rule:** Always propose code plans and ask for explicit approval from Ayush Rana before applying code modifications.
2. **Preserve Master Branding & Design Tokens:**
   * Primary Brand Coral: `#e85c7b` (Tailwind `coral-500` / `coral-600`)
   * App / Journey Indigo: `#4f46e5` (`indigo-600`)
   * WhatsApp Emerald: `#10b981` (`emerald-600`)
   * Warm Sand Background: `#f8f7f5` with delicate doodle background pattern.
3. **No Uncoordinated Global Edits:** Never run global string find-and-replace across multiple files. Always verify component context first.
4. **Always Verify Builds:** After every edit, execute `npm run build` to guarantee zero syntax or bundling errors.

---

## 📁 2. Codebase Directory Map

```
Journey Management System/
├── Documentation/                 <-- You are here! Master architecture docs
│   ├── README.md
│   ├── 01_WHAT_IS_TICKLETRAIL.md
│   ├── 02_ARCHITECTURE_AND_DATA_MODEL.md
│   ├── 03_MODULES_AND_FEATURES.md
│   ├── 04_LATEST_DEVELOPMENTS_AND_DECISIONS.md
│   └── 05_DEVELOPER_AND_AI_GUIDE.md
├── public/
│   ├── Doodle Background.jpg     <-- WhatsApp doodle texture for warm background
│   └── logo.png                  <-- Tickle Right / TickleTrail enterprise logo
├── src/
│   ├── App.jsx                   <-- Root routing, sidebar navigation & layout
│   ├── main.jsx                  <-- Entry mount
│   ├── index.css                 <-- Design tokens, custom scrollbars, animations
│   ├── pages/
│   │   ├── Journey.jsx           <-- Visual flowchart canvas (React Flow)
│   │   ├── Templates.jsx         <-- Omnichannel Template Studio & Simulators
│   │   ├── Audience.jsx          <-- Cohorts, segments & student directory
│   │   ├── Events.jsx            <-- DB date triggers & event bus architecture
│   │   ├── ActionQueue.jsx       <-- Human tasks queue (Calls & Gift dispatches)
│   │   └── Analytics.jsx         <-- Funnels, touchpoint response waves
│   ├── components/
│   │   ├── ChannelBadge.jsx      <-- Reusable pill badge with icon & color
│   │   ├── PageHeader.jsx        <-- Unified page banner component
│   │   ├── ImportJourneyModal.jsx<-- Spreadsheet import modal
│   │   └── TickleTrailGuideModal.jsx <-- Quickstart help dialog
│   ├── store/
│   │   └── DataContext.jsx       <-- Central state store (Journeys, Templates, etc.)
│   ├── data/
│   │   └── mockData.js           <-- Seeded journeys, templates, members & tasks
│   └── utils/
│       └── journeySpreadsheet.js <-- Excel export/import utilities (ExcelJS)
├── package.json
└── vite.config.js
```

---

## 🚀 3. How-To Developer Recipes

### Recipe A: Adding a New Channel to TickleTrail
To introduce a new communication channel (e.g. `RCS` or `In-Centre Tablet Display`):
1. **Update `src/components/ChannelBadge.jsx`:**
   * Add icon in `icons` object and Tailwind color scheme in `colors`.
2. **Update `src/pages/Journey.jsx`:**
   * Add entry to `STEP_OPTIONS` array.
   * Add channel palette to `getChannelCommStyle` for stacked day pills and beads.
3. **Update `src/pages/Templates.jsx`:**
   * Add channel string to `["All", "WhatsApp", "Email", "Call", "Gift", "App Notification", "NewChannel"]`.
   * Add `<option>` to the channel selector dropdown.
   * Add simulation preview card matching the channel's customer experience.
4. **Seed Sample Templates in `src/data/mockData.js`:**
   * Add pre-built templates so journeys can immediately reference them.

---

### Recipe B: Adding a New Custom Node Type in React Flow
1. Define the React component (e.g., `WebhookNodeShell`) inside `src/pages/Journey.jsx`.
2. Register it in `nodeTypes`:
   ```javascript
   const nodeTypes = useMemo(() => ({
     start: StartNodeShell,
     step: StepNodeShell,
     human: HumanNodeShell,
     stackedDay: StackedDayNodeShell,
     webhook: WebhookNodeShell, // <-- New node type
   }), []);
   ```
3. Update `stripNodeUiData` to ensure non-serializable UI callbacks are stripped before saving to `DataContext`.
4. Add inspector controls for the new node in `NodePanel`.

---

### Recipe C: Modifying Autopilot Safety Guardrails
All guardrails are stored directly on the node's `data` object:
* `node.data.avoidSundays: boolean` (Default: `true`)
* `node.data.checkFestivalCalendar: boolean` (Default: `true`)
* `node.data.checkContentCalendar: boolean` (Default: `true`)

When extending guardrail logic, update both `Journey.jsx` (the inspector checkboxes) and backend execution engines.

---

## 🛠️ 4. Build & Validation Commands

Always run build tests before committing changes:

```bash
# 1. Typecheck & bundle production assets
npm run build

# 2. Start local dev server
npm run dev
```

---

*End of Documentation Hub.*
