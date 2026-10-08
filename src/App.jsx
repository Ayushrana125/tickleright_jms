import { useState, useRef, useEffect } from "react";
import { NavLink, Route, Routes, Navigate, useNavigate } from "react-router-dom";
import { BarChart3, Bell, Blocks, ClipboardList, ExternalLink, GitBranch, UsersRound, Zap } from "lucide-react";
import logoImg from "./assets/tickle-trail-logo.png";
import Audience from "./pages/Audience.jsx";
import Events from "./pages/Events.jsx";
import Templates from "./pages/Templates.jsx";
import Journey from "./pages/Journey.jsx";
import Analytics from "./pages/Analytics.jsx";
import ActionQueue from "./pages/ActionQueue.jsx";
import { useData } from "./store/DataContext.jsx";

const nav = [
  { to: "/journey", label: "Journey", icon: GitBranch },
  { to: "/audience", label: "Audience", icon: UsersRound },
  { to: "/events", label: "Events", icon: Zap },
  { to: "/templates", label: "Templates", icon: Blocks },
  { to: "/actions", label: "Action Queue", icon: ClipboardList },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

const initialNotifications = [
  {
    id: "notif-1",
    title: "High Priority Task",
    desc: "Trial follow-up call needed for Aarav Sharma (Bandra centre)",
    time: "10m ago",
    link: "/actions",
    read: false,
    badgeColor: "bg-amber-500",
  },
  {
    id: "notif-2",
    title: "Renewal Window Triggered",
    desc: "14 members entered 30-Day Renewal cycle across 7 centres",
    time: "42m ago",
    link: "/audience",
    read: false,
    badgeColor: "bg-coral-500",
  },
  {
    id: "notif-3",
    title: "Autopilot Broadcast",
    desc: "Sent 85 WhatsApp welcome messages via Autopilot",
    time: "2h ago",
    link: "/analytics",
    read: false,
    badgeColor: "bg-emerald-500",
  },
  {
    id: "notif-4",
    title: "Absence Event Fired",
    desc: "2 Consecutive Absences detected for Vivaan Mehta",
    time: "4h ago",
    link: "/actions",
    read: true,
    badgeColor: "bg-sky-500",
  },
];

export default function App() {
  const { data } = useData();
  const navigate = useNavigate();
  const pendingTasks = data.actionTasks.filter((task) => task.status !== "Completed").length;

  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const notifRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff9f4] text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-coral-100 bg-white/95 px-4 py-5 shadow-soft">
        <div className="mb-6 px-1">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Tickle Right</span>
            <span className="rounded-full bg-coral-50 px-2 py-0.5 text-[10px] font-black text-coral-600">Enterprise</span>
          </div>
          <NavLink to="/journey" className="rounded-2xl bg-white p-2 border border-coral-100 shadow-xs flex items-center justify-center transition hover:ring-2 hover:ring-coral-200">
            <img
              src={logoImg}
              alt="JMS • Journey Management System"
              className="w-full h-auto max-h-16 object-contain"
            />
          </NavLink>
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
        <div className="mt-auto px-2 py-3 text-[11px] font-bold text-slate-400 flex items-center justify-between border-t border-coral-50">
          <span>v2.4 Production</span>
          <span className="flex items-center gap-1 text-emerald-600 font-extrabold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
          </span>
        </div>
      </aside>
      <main className="ml-64 min-h-screen flex flex-col">
        {/* Global Top Bar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-coral-100/70 bg-[#fff9f4]/95 px-7 backdrop-blur-md">
          <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-black text-emerald-700 border border-emerald-200">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              Autopilot Active
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 font-bold text-xs">Global • 67 Centres</span>
          </div>

          {/* Top Right Corner Profile & Notifications */}
          <div className="flex items-center gap-3">
            {/* Notifications Tab */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications((prev) => !prev)}
                className={`relative flex items-center gap-2 rounded-2xl border px-3 py-1.5 text-xs font-black transition shadow-2xs ${
                  showNotifications
                    ? "border-coral-300 bg-coral-50 text-coral-600"
                    : "border-coral-100 bg-white text-slate-600 hover:border-coral-200 hover:bg-coral-50/50"
                }`}
                title="Notifications"
                aria-label="Notifications tab"
              >
                <div className="relative">
                  <Bell size={16} className={unreadCount > 0 ? "text-coral-500" : "text-slate-500"} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral-400 opacity-75"></span>
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-coral-500"></span>
                    </span>
                  )}
                </div>
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className="grid min-h-5 min-w-5 place-items-center rounded-full bg-coral-500 px-1 text-[10px] font-black text-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown Panel */}
              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-96 rounded-2xl border border-coral-100 bg-white shadow-2xl z-50 overflow-hidden">
                  <div className="flex items-center justify-between border-b border-coral-50 px-4 py-3 bg-[#fff9f4]">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-sm text-slate-800">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-coral-100 px-2 py-0.5 text-[10px] font-black text-coral-600">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-bold text-coral-600 hover:text-coral-700 hover:underline"
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs font-bold text-slate-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => handleNotificationClick(item)}
                          className={`flex items-start gap-3 p-3.5 transition cursor-pointer hover:bg-coral-50/40 ${
                            !item.read ? "bg-amber-50/30" : ""
                          }`}
                        >
                          <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${item.badgeColor}`} />
                          <div className="flex-1 text-left min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-slate-800 truncate">{item.title}</span>
                              <span className="text-[10px] font-bold text-slate-400 shrink-0">{item.time}</span>
                            </div>
                            <p className="text-xs font-semibold text-slate-600 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-slate-100 bg-slate-50/70 p-2 text-center">
                    <button
                      onClick={() => {
                        navigate("/actions");
                        setShowNotifications(false);
                      }}
                      className="text-xs font-black text-coral-600 hover:text-coral-700 flex items-center justify-center gap-1.5 w-full py-1.5"
                    >
                      View All Action Tasks <ExternalLink size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-coral-100 bg-white py-1.5 pl-2 pr-3.5 shadow-2xs">
              <div className="grid h-8 w-8 place-items-center rounded-xl bg-coral-500 font-black text-white text-xs shadow-2xs">
                AR
              </div>
              <div className="text-left leading-tight">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Logged in</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                </div>
                <div className="text-xs font-black text-ink">
                  Ayush Rana <span className="font-semibold text-slate-500">• Counsellor</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/journey" replace />} />
            <Route path="/audience" element={<Audience />} />
            <Route path="/events" element={<Events />} />
            <Route path="/templates" element={<Templates />} />
            <Route path="/journey" element={<Journey />} />
            <Route path="/actions" element={<ActionQueue />} />
            <Route path="/analytics" element={<Analytics />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
