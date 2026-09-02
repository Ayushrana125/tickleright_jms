import { useState } from "react";
import { Image, Plus, Save } from "lucide-react";
import ChannelBadge from "../components/ChannelBadge.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

const blank = {
  name: "",
  channel: "WhatsApp",
  contentType: "Text only",
  content: "",
  stakeholderNotes: "",
  image: "",
};

export default function Templates() {
  const { data, addTemplate } = useData();
  const [draft, setDraft] = useState(blank);
  const isHuman = draft.channel === "Call" || draft.channel === "Gift";

  return (
    <div className="page">
      <PageHeader title="Templates" subtitle="One reusable communication unit: one message, script, or instruction set for one channel." />
      <div className="grid grid-cols-[1fr_380px] gap-5">
        <section className="panel rounded-3xl p-5">
          <div className="mb-4 flex items-center gap-2 text-lg font-black"><Plus size={18} /> Saved Templates</div>
          <div className="grid grid-cols-2 gap-4">
            {data.templates.map((template) => (
              <article key={template.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="font-black">{template.name}</div>
                  <ChannelBadge channel={template.channel} />
                </div>
                <p className="line-clamp-3 min-h-16 text-sm font-semibold text-slate-600">{template.content}</p>
                {template.image && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl bg-coral-50 p-2 text-sm font-bold text-coral-600">
                    <Image size={16} /> {template.image}
                  </div>
                )}
                <div className="mt-3 text-xs font-extrabold text-slate-400">Edited {template.lastEdited}</div>
              </article>
            ))}
          </div>
        </section>

        <aside className="panel rounded-3xl p-5">
          <div className="mb-4 text-lg font-black">Template Editor</div>
          <div className="space-y-3">
            <label className="block text-sm font-extrabold">Name<input className="field mt-1" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></label>
            <label className="block text-sm font-extrabold">Channel<select className="field mt-1" value={draft.channel} onChange={(event) => setDraft({ ...draft, channel: event.target.value, contentType: event.target.value === "Call" || event.target.value === "Gift" ? "Instructions" : "Text only" })}><option>WhatsApp</option><option>Email</option><option>Call</option><option>Gift</option></select></label>
            {!isHuman && (
              <label className="block text-sm font-extrabold">Content Type<select className="field mt-1" value={draft.contentType} onChange={(event) => setDraft({ ...draft, contentType: event.target.value })}><option>Text only</option><option>Image + Text</option></select></label>
            )}
            <label className="block text-sm font-extrabold">
              {isHuman ? "Call Script / Instructions" : "Text"}
              <textarea className="field mt-1 min-h-36" value={draft.content} onChange={(event) => setDraft({ ...draft, content: event.target.value })} placeholder="Use {{child_name}}, {{parent_name}}, {{centre_name}}" />
            </label>
            {isHuman ? (
              <label className="block text-sm font-extrabold">Notes for stakeholder<textarea className="field mt-1 min-h-24" value={draft.stakeholderNotes} onChange={(event) => setDraft({ ...draft, stakeholderNotes: event.target.value })} /></label>
            ) : draft.contentType === "Image + Text" && (
              <label className="block text-sm font-extrabold">Image Placeholder<select className="field mt-1" value={draft.image} onChange={(event) => setDraft({ ...draft, image: event.target.value })}><option value="">Choose</option><option>Confetti welcome card</option><option>Home activity visual</option><option>Graduation card</option></select></label>
            )}
            <button
              className="btn btn-primary w-full"
              onClick={() => {
                if (!draft.name.trim()) return;
                addTemplate(draft);
                setDraft(blank);
              }}
            >
              <Save size={17} /> Save Template
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
