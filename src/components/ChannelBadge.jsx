import { Bell, Gift, Mail, MessageCircle, Phone, Smartphone } from "lucide-react";

const icons = {
  WhatsApp: MessageCircle,
  Email: Mail,
  Call: Phone,
  Gift: Gift,
  "App Notification": Smartphone,
  "App Push": Bell,
  App: Smartphone,
};
const colors = {
  WhatsApp: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Email: "bg-sky-50 text-sky-700 border-sky-200",
  Call: "bg-orange-50 text-orange-700 border-orange-200",
  Gift: "bg-pink-50 text-pink-700 border-pink-200",
  "App Notification": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "App Push": "bg-indigo-50 text-indigo-700 border-indigo-200",
  App: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export default function ChannelBadge({ channel, className }) {
  const Icon = icons[channel] || MessageCircle;
  const colorClass = colors[channel] || "bg-slate-50 text-slate-700 border-slate-200";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-extrabold ${className || colorClass}`}>
      <Icon size={13} />
      {channel}
    </span>
  );
}

