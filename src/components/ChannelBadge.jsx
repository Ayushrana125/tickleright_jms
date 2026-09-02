import { Gift, Mail, MessageCircle, Phone } from "lucide-react";

const icons = { WhatsApp: MessageCircle, Email: Mail, Call: Phone, Gift };
const colors = {
  WhatsApp: "bg-green-50 text-green-700 border-green-100",
  Email: "bg-sky-50 text-sky-700 border-sky-100",
  Call: "bg-orange-50 text-orange-700 border-orange-100",
  Gift: "bg-pink-50 text-pink-700 border-pink-100",
};

export default function ChannelBadge({ channel }) {
  const Icon = icons[channel] || MessageCircle;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-extrabold ${colors[channel]}`}>
      <Icon size={14} />
      {channel}
    </span>
  );
}
