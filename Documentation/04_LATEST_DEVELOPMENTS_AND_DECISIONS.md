# 04. Latest Developments & Architecture Decisions
### Chronological Log of System Evolution & Technical Decisions

---

## 📅 October 2026: Major Platform Modernization

During the latest sprint, several legacy prototypes were overhauled to transition TickleTrail from a static prototype into a scalable, dynamic platform.

---

### Decision 1: Elevation of "App Notification" to a Platform-Wide Channel

#### The Problem:
* In earlier builds, the **App Notification** channel was artificially locked inside a single 14-day habit journey (`journey-member-app`).
* It was completely missing from the **Templates Studio (`Templates.jsx`)**, meaning curriculum coordinators could not create reusable push notification blueprints.
* Standard journeys (Cold Lead Nurture, Renewal Reminders, Discontinued Winback) were unable to leverage in-app mobile push.

#### The Implementation:
1. **Templates Studio (`Templates.jsx`):**
   * Added `App Notification` to the primary channel filter tabs (`["All", "WhatsApp", "Email", "Call", "Gift", "App Notification"]`).
   * Added `App Notification` into the channel dropdown selector.
   * Built a high-fidelity **Smartphone Lock-Screen Push Preview** showing the app icon (`TR`), notification title, body, and clickable in-app deep link badge (`tr://activity/...`).
2. **Central Blueprint Library (`mockData.js`):**
   * Added seeded App Notification templates (`tpl-app-activity-spark`, `tpl-app-bedtime-story`, `tpl-app-habit-badge`) to `seededTemplates`.
3. **Journey Inspector (`Journey.jsx`):**
   * Enabled attaching and previewing App Notification templates on *any* standard sequential step across all journeys.

---

### Decision 2: Elimination of "Random Drop"

#### The Problem:
* A legacy flag `isRandomDrop: boolean` existed on communication objects, representing "surprise micro-bursts".
* It cluttered the UI with checkboxes, badges, and confusing labels without having any backend cron logic to execute random delivery.

#### The Implementation:
* Completely purged `isRandomDrop` from `mockData.js`, `Journey.jsx`, `StackedDayPanel`, `StackedDayNodeShell`, `journeySpreadsheet.js`, and `ImportJourneyModal.jsx`.
* All communications now follow explicit, predictable operational schedules.

---

### Decision 3: Removal of "Time of the Day" Categorical Labels

#### The Problem:
* Communications stored redundant `timeOfDay: "morning" | "afternoon" | "night"` strings purely to display sun ☀️, sparkles ✨, and moon 🌙 icons in tab buttons.
* This created duplicate state that frequently fell out of sync when a user changed the trigger time.

#### The Implementation:
* Removed `timeOfDay` across all data schemas.
* Replaced cosmetic sun/moon icons with a clean, standardized `<Clock size={11} className="text-slate-500" />` component paired with the configured trigger timestamp (e.g. `10:00 AM`, `04:30 PM`) or drop index (`Drop 1`, `Drop 2`).

---

### Decision 4: Elimination of Hardcoded 9:00 AM & 10:00 PM Slots

#### The Problem:
* The companion habit journey had hardcoded defaults locking users into 09:00 AM and 10:00 PM slots, failing if an afternoon activity was desired.

#### The Implementation:
* Trigger times are now fully dynamic. Users can type or select any time format without rigid slot restrictions.

---

### Decision 5: Excel Import/Export Reality Check

#### Architectural Finding:
* The previous 10-column Excel exporter (`journeySpreadsheet.js`) attempted to force non-linear graph topologies (with conditions, delays, and dynamic variables) into flat push-notification columns.
* This caused fake data insertion (such as assigning `tr://app` deep links to counsellor phone calls).

#### Roadmap & Strategy:
* **Short-Term:** Cleaned up spreadsheet export columns to match the simplified schema (removed `Time of Day` and `Random Drop`).
* **Long-Term Plan:** Implement a native JSON/YAML graph serialization format for full journey import/export, keeping Excel strictly for tabular contact reports.

---

*Next Document: [05_DEVELOPER_AND_AI_GUIDE.md](./05_DEVELOPER_AND_AI_GUIDE.md)*
