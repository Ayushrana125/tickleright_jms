# TickleTrail • Journey Management System (JMS)
### Complete Engineering, Product & Architecture Documentation

Welcome to the **TickleTrail Journey Management System (JMS)** documentation hub. This repository contains the frontend platform built for **Tickle Right Education** to orchestrate, automate, and visualize end-to-end parent learning journeys across multiple digital and human communication channels.

---

## 📚 Documentation Sitemap

| Document | Purpose & Audience |
|---|---|
| [**01_WHAT_IS_TICKLETRAIL.md**](./01_WHAT_IS_TICKLETRAIL.md) | **Product Vision & Philosophy:** What TickleTrail is, the problem it solves for Tickle Right, and core value propositions. |
| [**02_ARCHITECTURE_AND_DATA_MODEL.md**](./02_ARCHITECTURE_AND_DATA_MODEL.md) | **Technical Architecture:** Stack overview, data structures, state management (`DataContext`), and entity schemas (`Journeys`, `Templates`, `Members`, `Events`). |
| [**03_MODULES_AND_FEATURES.md**](./03_MODULES_AND_FEATURES.md) | **Module Deep Dive:** How each of the 6 core modules functions (`Journey Builder`, `Templates Studio`, `Audience Segments`, `Event Triggers`, `Action Queue`, `Analytics`). |
| [**04_LATEST_DEVELOPMENTS_AND_DECISIONS.md**](./04_LATEST_DEVELOPMENTS_AND_DECISIONS.md) | **Recent Evolution & Decisions:** Why App Notification was expanded to all journeys, removal of legacy clutter (`Random Drop`, `Time of Day`, hardcoded hours), and Excel import status. |
| [**05_DEVELOPER_AND_AI_GUIDE.md**](./05_DEVELOPER_AND_AI_GUIDE.md) | **Developer & AI Onboarding:** Setup instructions, coding conventions, adding new node types/channels, and rules for AI pair programmers. |

---

## ⚡ Quickstart for Developers

### Prerequisites
* **Node.js** (v18.x or v20.x recommended)
* **npm** or **yarn**

### Local Development Setup
```bash
# 1. Navigate to the project root
cd "d:/-- Ayush Rana --/-- Tickle Right/Journey Management System"

# 2. Install dependencies (if fresh clone)
npm install

# 3. Start local development server
npm run dev

# 4. Build for production
npm run build
```

---

## 🧭 System at a Glance

* **Frontend Framework:** React 18 + Vite
* **Visual Graph Engine:** React Flow (`@xyflow/react`)
* **Styling:** Tailwind CSS + Vanilla Utility Tokens (Tickle Right signature brand palette: `#e85c7b` coral, `#4f46e5` indigo, `#10b981` emerald)
* **Icons:** `lucide-react`
* **Spreadsheet Engine:** `exceljs` + `xlsx`
* **Routing:** `react-router-dom` v6

---

*Documentation maintained by Ayush Rana & the Tickle Right Engineering Team.*
