import { NavLink, Route, Routes, Navigate } from "react-router-dom";
import { BarChart3, Blocks, ClipboardList, GitBranch, UsersRound } from "lucide-react";
import Audience from "./pages/Audience.jsx";
import Templates from "./pages/Templates.jsx";
import Journey from "./pages/Journey.jsx";
import Analytics from "./pages/Analytics.jsx";
import ActionQueue from "./pages/ActionQueue.jsx";
import { useData } from "./store/DataContext.jsx";

const nav = [
  { to: "/audience", label: "Audience", icon: UsersRound },
  { to: "/templates", label: "Templates", icon: Blocks },
  { to: "/journey", label: "Journey", icon: GitBranch },
  { to: "/actions", label: "Action Queue", icon: ClipboardList },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export default function App() {
  const { data } = useData();
  const pendingTasks = data.actionTasks.filter((task) => task.status !== "Completed").length;

  return (
    <div className="min-h-screen bg-[#fff9f4] text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-coral-100 bg-white/95 px-4 py-5 shadow-soft">
        <div className="mb-7 flex items-center gap-3 px-2">
          <div className="grid h-11 w-11 place-items-center rounded-2xl bg-coral-500 font-black text-white">TR</div>
          <div>
            <div className="text-lg font-extrabold leading-tight">Tickle Right</div>
            <div className="text-sm font-semibold text-slate-500">Journey Management</div>
          </div>
        </div>
        <nav className="space-y-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
                  isActive ? "bg-coral-50 text-coral-600" : "text-slate-600 hover:bg-slate-50"
                }`
              }
            >
              <Icon size={18} />
              <span className="flex-1">{label}</span>
              {to === "/actions" && (
                <span className="grid min-h-6 min-w-6 place-items-center rounded-full bg-coral-500 px-1.5 text-xs font-black text-white">
                  {pendingTasks}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <div className="text-sm font-extrabold">Logged in</div>
          <div className="text-sm text-slate-600">Aarav Mehta, Counsellor</div>
        </div>
      </aside>
      <main className="ml-64 min-h-screen">
        <Routes>
          <Route path="/" element={<Navigate to="/journey" replace />} />
          <Route path="/audience" element={<Audience />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/journey" element={<Journey />} />
          <Route path="/actions" element={<ActionQueue />} />
          <Route path="/analytics" element={<Analytics />} />
        </Routes>
      </main>
    </div>
  );
}
