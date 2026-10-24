# 03. Modules & Features
### Complete Functional Guide to the 6 Core Modules

---

## 🗺️ 1. Autopilot Journey Builder (`/journey`)

The **Journey Canvas** (`src/pages/Journey.jsx`) is the core visual engine of TickleTrail, powered by React Flow.

```
+---------------------------------------------------------------------------------------------------+
|  [Select Journey ▼]  Active • 6,420 Enrolled   [+ Step ▼]  [Import / Export]  [Undo] [Redo]      |
+------------------------------------------------------+--------------------------------------------+
|                                                      |                                            |
|   (Start) ──► [Day 1: Welcome] ──► [Day 3: Call]     |   INSPECTOR DRAWER (Right Side)            |
|                     │                                |   ─────────────────────────────            |
|                     ▼                                |   ⏱ Schedule Tab                          |
|              [Day 7: Stacked Day]                    |   • Send After (Days / Weeks / Months)     |
|               • 10:00 AM: App Push                   |   • Autopilot Guardrails                   |
|               • 07:30 PM: Bedtime Tale               |   📩 Communication Tab                     |
|                                                      |   • New Template / Select Existing toggle  |
|                                                      |   • Channel-specific fields & file upload  |
|                                                      |   • Live channel-accurate preview          |
+------------------------------------------------------+--------------------------------------------+
```

### Key Capabilities:
* **Node Addition (`STEP_OPTIONS`):**
  * `Event`: Lifecycle milestone trigger (Graduation, Renewal, Milestone).
  * `WhatsApp`: Automated brochure, activity sheet, or video.
  * `Call`: Assigns human check-in call to counsellor, trainer, or admin queue.
  * `Email`: Curriculum resources and formal letters.
  * `Gift`: Physical milestone kit dispatch — always fulfilled by Production.
  * `SMS Flash`: Urgent reminders or gatepass OTPs.
  * `App Push / App Notification`: 2-min activity sparks, bedtime audio stories, deep links.
  * `Wait Period (Delay)`: Multi-day pacing gaps.
  * `Condition (Route)`: Split based on attendance or engagement.
* **Stacked Day Nodes (`StackedDayNodeShell` & `StackedDayPanel`):**
  * Allows scheduling multiple communications on a single calendar day (e.g., Morning spark + evening sleep story).
  * Live animated timeline spine with channel-colored pulsing beads.
  * Seamlessly toggle between a single step card and a multi-drop stacked day.
* **Interactive Right-Hand Drawer (`NodePanel`):**
  * **⏱ Schedule Tab:** Configure Send After (days/weeks/months) and guardrails (`Avoid Sundays`, `Festive Guard`, `Content Guard`). Always opens by default when a node is selected.
  * **📩 Communication Tab:** Two-button toggle — `+ New Template` (blank fields, default) or `Select Existing` (dropdown populates all fields). Each channel has purpose-built fields (see below). Includes a live channel-accurate preview that updates as you type. Always starts on `+ New Template` on node selection.
* **Undo & Redo System:**
  * Persistent snapshot history stack (`pastStackRef`, `futureStackRef`) for effortless rollback of mistakes.

---

### Communication Tab — Channel-Specific Fields

| Channel | Fields |
|---|---|
| **WhatsApp** | Message Body, Image upload (PNG/JPG/WEBP), File/Document attachment |
| **Email** | Subject Line, CC, BCC, Email Body (plain text), HTML Body toggle (raw HTML textarea), Image upload, File attachments |
| **Call** | Assign To (Counsellor / Trainer / Admin), Call Script, SOP Notes |
| **Gift** | "Fulfilled by Production" badge (read-only), Dispatch Instructions, SOP Notes |
| **App Notification** | Notification Title, Description/Body, In-App Deep Link, Rich Image upload |
| **SMS** | Message Body, live character counter (160 chars = 1 SMS) |

**Template flow:** All fields blank by default on new steps. Hitting **Save** creates a new template in the Templates library and links it to the step. Selecting from the "Select Existing" dropdown populates all fields from a previously saved template. Saving an existing template updates the original in the library.

---

## 📝 2. Templates Studio (`/templates`)

The **Templates Studio** (`src/pages/Templates.jsx`) manages the centralized omnichannel communication blueprints.

### Key Capabilities:
* **Channel Filtering:** Filter blueprints across `All`, `WhatsApp`, `Email`, `Call`, `Gift`, and `App Notification`.
* **Dynamic Personalized Placeholders:**
  * Inserts runtime variables: `{{parent_name}}`, `{{child_name}}`, `{{centre_name}}`, `{{trainer_name}}`.
* **Four Realistic Customer Experience Simulators:**
  1. 🟢 **WhatsApp:** Verified business header, bubble styling, timestamp, and read receipts (`✓✓`).
  2. ✉️ **Email Client:** Clean desktop view with From, Subject, CC, and body.
  3. 📞 **Counsellor Call Script Card:** Parent phone, child age, talking points SOP, outcome logging chips, and assignee badge.
  4. 📱 **Smartphone Push Notification:** High-fidelity lock-screen alert with app icon (`TR`), notification title, body, and clickable in-app deep link destination.

---

## 👥 3. Audience Cohorts (`/audience`)

The **Audience Module** (`src/pages/Audience.jsx`) segments over 500+ active student records into actionable lifecycle groups.

### Key Capabilities:
* **Lifecycle Filtering:** Leads, Active Members, Graduated, Discontinued, Franchise Interest.
* **Centre & City Cohorts:** Bandra, Andheri, Koramangala, Indiranagar, Adyar, Hitech City, Pune, Delhi NCR.
* **Dynamic Counts:** Live headcount tracking per segment that automatically syncs with journey enrollment totals.

---

## ⚡ 4. Event Triggers Architecture (`/events`)

The **Events Module** (`src/pages/Events.jsx`) outlines the backend triggering infrastructure.

### Two Trigger Paradigms:
1. **Database Date Triggers (Cron Polling):**
   * Periodically queries MySQL/Postgres database columns:
     * `creation_date` (New Registration / Onboarding)
     * `dob` (Birthday celebrations, 7-day lead time)
     * `graduation_date` (Alumni graduation ceremony)
     * `renewal_due_date` (30 days prior to subscription lapse)
2. **Real-Time Event Bus (API / Webhooks):**
   * Real-time listeners for trial requests, payments, or attendance punch-ins from the centre management system.

---

## 📋 5. Human Action Queue (`/actions`)

The **Action Queue** (`src/pages/ActionQueue.jsx`) handles all tasks that require human execution:
* **Counsellor Phone Calls:** 48-hour welcome call, weekly attendance check, retention outreach.
* **Physical Gift Dispatches:** Packaging milestone kits, congratulatory certificates — fulfilled by Production team.
* **Status Tracking:** Pending, In Progress, Completed, Escalated.

---

## 📊 6. Analytics Hub (`/analytics`)

The **Analytics Module** (`src/pages/Analytics.jsx`) provides high-level health metrics:
* **Conversion Funnels:** Trial inquiry ➔ Attended Demo ➔ Enrolled ➔ Retained.
* **Touchpoint Waves:** Parent response and engagement rates across individual days of a journey.
* **Channel Performance:** Comparative engagement across WhatsApp vs In-App Push vs Calls.

---

*Next Document: [04_LATEST_DEVELOPMENTS_AND_DECISIONS.md](./04_LATEST_DEVELOPMENTS_AND_DECISIONS.md)*
