import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Gift,
  Image as ImageIcon,
  Mail,
  MessageCircle,
  Phone,
  Plus,
  RotateCcw,
  Save,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";
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

const sampleReplacements = {
  child_name: "Vivaan",
  parent_name: "Ira Mehta",
  centre_name: "Bandra Centre",
  trainer_name: "Riya Shah",
};

export default function Templates() {
  const { data, addTemplate, updateTemplate, deleteTemplate } = useData();
  const [selectedTemplateId, setSelectedTemplateId] = useState(null);
  const [activeChannelFilter, setActiveChannelFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [savedNotification, setSavedNotification] = useState(false);

  // Selected template object
  const selectedTemplate = useMemo(() => {
    if (!selectedTemplateId) return null;
    if (selectedTemplateId === "new") return blank;
    return data.templates.find((t) => t.id === selectedTemplateId) || blank;
  }, [data.templates, selectedTemplateId]);

  const [draft, setDraft] = useState(blank);

  // Update draft whenever selectedTemplate changes
  const handleSelectTemplate = (template) => {
    setSelectedTemplateId(template.id);
    setDraft({ ...template });
  };

  const handleNewTemplate = () => {
    setSelectedTemplateId("new");
    setDraft({ ...blank });
  };

  const isHuman = draft.channel === "Call" || draft.channel === "Gift";

  const insertVariable = (varName) => {
    setDraft((current) => ({
      ...current,
      content: `${current.content} {{${varName}}}`,
    }));
  };

  const handleSave = () => {
    if (!draft.name.trim()) return;
    if (selectedTemplateId && selectedTemplateId !== "new") {
      updateTemplate(selectedTemplateId, draft);
    } else {
      const newId = `tpl-${Date.now()}`;
      addTemplate({ ...draft, id: newId });
      setSelectedTemplateId(newId);
    }
    setSavedNotification(true);
    setTimeout(() => setSavedNotification(false), 2400);
  };

  const handleDelete = () => {
    if (selectedTemplateId && selectedTemplateId !== "new" && deleteTemplate) {
      deleteTemplate(selectedTemplateId);
      setSelectedTemplateId(null);
    }
  };

  const filteredTemplates = useMemo(() => {
    return data.templates.filter((t) => {
      const matchesChannel = activeChannelFilter === "All" || t.channel === activeChannelFilter;
      const matchesSearch =
        !searchQuery.trim() ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.stakeholderNotes && t.stakeholderNotes.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesChannel && matchesSearch;
    });
  }, [data.templates, activeChannelFilter, searchQuery]);

  // Live formatted text with real student simulation
  const renderedMessageText = useMemo(() => {
    if (!draft.content) return "Start typing template message to view live preview...";
    let text = draft.content;
    Object.entries(sampleReplacements).forEach(([key, value]) => {
      text = text.replaceAll(`{{${key}}}`, value);
    });
    return text;
  }, [draft.content]);

  // Extract subject line if email
  const emailSubject = useMemo(() => {
    if (draft.channel !== "Email") return "";
    const match = draft.content.match(/^Subject:\s*(.*)/im);
    return match ? match[1].replace(/{{child_name}}/g, "Vivaan") : `Update for ${sampleReplacements.child_name}`;
  }, [draft.channel, draft.content]);

  const emailBody = useMemo(() => {
    if (draft.channel !== "Email") return renderedMessageText;
    return renderedMessageText.replace(/^Subject:.*$/im, "").trim();
  }, [draft.channel, renderedMessageText]);

  // Find journeys referencing a template
  const getReferencingJourneys = (templateId) => {
    const list = [];
    data.journeys.forEach((j) => {
      if (j.nodes?.some((n) => n.data?.templateId === templateId)) {
        list.push(j.name);
      }
    });
    return list.length ? list.join(", ") : "Autopilot Library";
  };

  // -------------------------------------------------------------
  // VIEW 1: TEMPLATES CATALOG (Exactly like Autopilot Journeys!)
  // -------------------------------------------------------------
  if (!selectedTemplateId) {
    return (
      <div className="page">
        <PageHeader
          title="Templates & Channels"
          subtitle="Omnichannel communication blueprints: reusable WhatsApp messages, rich emails, counsellor call SOPs, and milestone gifts."
          actions={
            <button className="btn btn-primary" onClick={handleNewTemplate}>
              <Plus size={17} /> Create Template
            </button>
          }
        />

        {/* Filter and Search Bar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {["All", "WhatsApp", "Email", "Call", "Gift"].map((ch) => {
              const count =
                ch === "All"
                  ? data.templates.length
                  : data.templates.filter((t) => t.channel === ch).length;
              const isActive = activeChannelFilter === ch;
              return (
                <button
                  key={ch}
                  onClick={() => setActiveChannelFilter(ch)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${
                    isActive
                      ? "bg-coral-500 text-white shadow-soft"
                      : "bg-white text-slate-600 hover:bg-slate-50 border border-slate-200/80"
                  }`}
                >
                  <span>{ch}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-black ${
                      isActive ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="relative w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="field !pl-10 !py-2 text-xs font-bold"
              placeholder="Search blueprints or copy..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Compact Catalog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
          {filteredTemplates.map((template) => {
            return (
              <button
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className="panel group rounded-2xl p-3.5 text-left transition hover:-translate-y-0.5 hover:ring-2 hover:ring-coral-300 hover:shadow-md flex flex-col justify-between border border-slate-200/80 bg-white"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-slate-800 truncate" title={template.name}>
                        {template.name}
                      </h4>
                      <div className="text-[11px] font-semibold text-slate-400 mt-0.5 truncate">
                        {template.contentType || "Standard"} • {template.channel}
                      </div>
                    </div>
                    <ChannelBadge channel={template.channel} />
                  </div>

                  {/* Message Copy Excerpt (Clean 2-line clamp) */}
                  <p className="mt-2.5 text-xs font-medium leading-snug text-slate-600 line-clamp-2 bg-slate-50/80 rounded-lg p-2 border border-slate-100">
                    {template.content || <span className="italic text-slate-400">No content set</span>}
                  </p>

                  {/* Inline Media + Variable tags */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {template.image && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-coral-200 bg-coral-50/70 px-1.5 py-0.5 text-[10px] font-bold text-coral-700">
                        <ImageIcon size={11} />
                        <span className="truncate max-w-[100px]">{template.image}</span>
                      </span>
                    )}
                    {template.variables?.slice(0, 2).map((v) => (
                      <span
                        key={v}
                        className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500"
                      >
                        {`{{${v}}}`}
                      </span>
                    ))}
                    {template.variables?.length > 2 && (
                      <span className="text-[10px] font-bold text-slate-400">
                        +{template.variables.length - 2}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400">
                  <span>{template.lastEdited}</span>
                  <span className="text-coral-600 font-extrabold group-hover:underline">
                    Edit Studio →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="panel rounded-3xl p-16 text-center text-slate-400">
            <div className="text-base font-black text-slate-700">No templates found</div>
            <div className="text-xs font-bold mt-1">Try clearing your search query or channel filter.</div>
          </div>
        )}
      </div>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: DEDICATED TEMPLATE STUDIO (Editor + Live Simulation Side-by-Side!)
  // -------------------------------------------------------------
  return (
    <div className="page">
      <PageHeader
        title={draft.name || "New Template Blueprint"}
        subtitle={`Omnichannel Template Studio • ${draft.channel} channel`}
        actions={
          <div className="flex items-center gap-2">
            <button
              className="btn btn-ghost"
              onClick={() => setSelectedTemplateId(null)}
            >
              <ArrowLeft size={17} /> Templates
            </button>
            {selectedTemplateId !== "new" && (
              <button
                className="btn btn-ghost text-rose-600 hover:bg-rose-50"
                onClick={handleDelete}
              >
                <Trash2 size={16} /> Delete
              </button>
            )}
            <button
              className="btn btn-primary shadow-soft"
              onClick={handleSave}
            >
              {savedNotification ? (
                <>
                  <Check size={17} /> Saved!
                </>
              ) : (
                <>
                  <Save size={17} /> Save Blueprint
                </>
              )}
            </button>
          </div>
        }
      />

      {/* Spacious 2-Column Studio: Editor on Left, Simulation on Right */}
      <div className="grid grid-cols-[1.1fr_0.9fr] gap-6 items-start">
        {/* LEFT COLUMN: Blueprint Editor */}
        <div className="panel rounded-3xl p-6 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <div className="text-lg font-black text-slate-800">
              Template Configuration
            </div>
            <div className="text-xs font-bold text-slate-400">
              Define the communication blueprint, channel parameters, and dynamic personalized placeholders.
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              Template Name
              <input
                className="field mt-1 text-sm font-bold"
                placeholder="e.g. Trainer Introduction"
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Channel
                <select
                  className="field mt-1 font-bold text-sm"
                  value={draft.channel}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      channel: event.target.value,
                      contentType:
                        event.target.value === "Call" || event.target.value === "Gift"
                          ? "Instructions"
                          : "Text only",
                    })
                  }
                >
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Call</option>
                  <option>Gift</option>
                </select>
              </label>

              {!isHuman && (
                <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                  Content Type
                  <select
                    className="field mt-1 font-bold text-sm"
                    value={draft.contentType}
                    onChange={(event) => setDraft({ ...draft, contentType: event.target.value })}
                  >
                    <option>Text only</option>
                    <option>Image + Text</option>
                  </select>
                </label>
              )}
            </div>

            {/* Dynamic Tags Insertion Chips */}
            {!isHuman && (
              <div className="rounded-2xl bg-coral-50/70 p-3.5 border border-coral-100">
                <div className="mb-2 flex items-center justify-between text-xs font-extrabold text-slate-700">
                  <span className="flex items-center gap-1.5 text-coral-600">
                    <Sparkles size={14} /> Insert Dynamic Tags:
                  </span>
                  <span className="text-[11px] text-slate-400 font-bold">
                    Click to add placeholder
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["child_name", "parent_name", "centre_name", "trainer_name"].map((varName) => (
                    <button
                      key={varName}
                      type="button"
                      onClick={() => insertVariable(varName)}
                      className="rounded-xl border border-coral-200 bg-white px-2.5 py-1 text-xs font-black text-coral-600 transition hover:bg-coral-500 hover:text-white hover:border-coral-500 shadow-2xs"
                    >
                      + {`{{${varName}}}`}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
              {isHuman ? "Call Script / SOP Instructions" : "Message Copy"}
              <textarea
                className="field mt-1 min-h-36 text-sm leading-relaxed"
                value={draft.content}
                onChange={(event) => setDraft({ ...draft, content: event.target.value })}
                placeholder={
                  isHuman
                    ? "Instructions or questions for counsellor..."
                    : "Hi {{parent_name}}, welcome to Tickle Right! We are excited to begin {{child_name}}'s journey..."
                }
              />
            </label>

            {isHuman ? (
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Notes for Counsellor / Delivery Team
                <textarea
                  className="field mt-1 min-h-24 text-xs font-semibold"
                  placeholder="Log outcome in Action Queue before 6:00 PM..."
                  value={draft.stakeholderNotes}
                  onChange={(event) =>
                    setDraft({ ...draft, stakeholderNotes: event.target.value })
                  }
                />
              </label>
            ) : draft.contentType === "Image + Text" ? (
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500">
                Attachment Media
                <select
                  className="field mt-1 font-bold text-sm"
                  value={draft.image}
                  onChange={(event) => setDraft({ ...draft, image: event.target.value })}
                >
                  <option value="">Select Attachment</option>
                  <option>Confetti welcome card</option>
                  <option>Home activity visual</option>
                  <option>Graduation card</option>
                  <option>Milestone certificate</option>
                </select>
              </label>
            ) : null}

            <div className="pt-2">
              <button
                className="btn btn-primary w-full !py-3 shadow-soft"
                onClick={handleSave}
              >
                {savedNotification ? (
                  <>
                    <Check size={18} /> Blueprint Saved Successfully!
                  </>
                ) : (
                  <>
                    <Save size={18} /> Save & Apply Blueprint
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Realistic Live Simulation (Full height, never clipped!) */}
        <div className="panel rounded-3xl p-6 shadow-sm space-y-4 sticky top-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="text-base font-black text-slate-800 flex items-center gap-2">
                <span>Real-Time Customer Experience</span>
                <ChannelBadge channel={draft.channel} />
              </div>
              <div className="text-xs font-bold text-slate-400">
                Live simulation with sample parent: Ira Mehta (Child: Vivaan, 4y)
              </div>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-black text-emerald-800">
              Live Preview
            </span>
          </div>

          {/* Realistic WHATSAPP SIMULATION */}
          {draft.channel === "WhatsApp" && (
            <div className="rounded-3xl border border-emerald-100 bg-[#efeae2] p-5 shadow-inner">
              {/* WhatsApp Header */}
              <div className="mb-4 flex items-center gap-3 border-b border-emerald-900/10 pb-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-emerald-600 font-black text-white text-sm shadow-xs">
                  TR
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
                    <span>Tickle Right Education</span>
                    <CheckCircle2 size={14} className="text-emerald-600" />
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    Official Parent Channel • Verified
                  </div>
                </div>
              </div>

              {/* WhatsApp Chat Bubble */}
              <div className="max-w-[94%] rounded-2xl rounded-tl-sm bg-white p-4 shadow-sm">
                {draft.image && (
                  <div className="mb-3 flex items-center gap-2 rounded-xl bg-coral-50 p-3 text-xs font-bold text-coral-700 border border-coral-100">
                    <ImageIcon size={16} /> {draft.image}
                  </div>
                )}
                <div className="text-xs font-semibold leading-relaxed text-slate-800 whitespace-pre-line">
                  {renderedMessageText}
                </div>
                <div className="mt-2 text-right text-[11px] font-bold text-slate-400 flex items-center justify-end gap-1">
                  <span>10:30 AM</span>
                  <span className="text-sky-500 font-black">✓✓</span>
                </div>
              </div>
            </div>
          )}

          {/* Realistic EMAIL SIMULATION */}
          {draft.channel === "Email" && (
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 border-b border-slate-100 pb-3 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-16">From:</span>
                  <span className="font-extrabold text-slate-800">
                    Tickle Right &lt;updates@tickleright.com&gt;
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-16">To:</span>
                  <span className="font-semibold text-slate-700">
                    Ira Mehta &lt;ira.mehta@example.com&gt;
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-400 w-16">Subject:</span>
                  <span className="font-black text-slate-900">{emailSubject}</span>
                </div>
              </div>

              <div className="text-xs font-medium leading-relaxed text-slate-700 whitespace-pre-line p-3 bg-slate-50/60 rounded-2xl">
                {emailBody}
                <div className="mt-5 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 font-semibold">
                  Warm regards,<br />
                  <strong className="text-slate-800">The Tickle Right Team</strong><br />
                  Bandra Centre • Mumbai
                </div>
              </div>
            </div>
          )}

          {/* Realistic CALL SCRIPT CARD SIMULATION */}
          {draft.channel === "Call" && (
            <div className="rounded-3xl border border-purple-200 bg-purple-50/40 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-purple-100 shadow-xs">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-600 text-white font-black">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">
                    Calling: Ira Mehta (Mother of Vivaan, 4y)
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    +91 98700 12345 • Bandra Centre
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-purple-100 shadow-xs">
                <div className="text-xs font-black uppercase text-purple-700 tracking-wider mb-1.5">
                  Script & Talking Points:
                </div>
                <div className="text-xs font-semibold leading-relaxed text-slate-800 whitespace-pre-line">
                  {renderedMessageText}
                </div>
              </div>

              {draft.stakeholderNotes && (
                <div className="rounded-2xl bg-purple-100/70 p-3 text-xs text-purple-900 font-semibold border border-purple-200">
                  <strong>Counsellor SOP:</strong> {draft.stakeholderNotes}
                </div>
              )}

              <div className="rounded-2xl bg-white p-3 border border-purple-100">
                <div className="text-[11px] font-black uppercase text-slate-400 mb-1.5">
                  Quick Log Outcome Preview:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                    Spoke with parent
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                    No answer
                  </span>
                  <span className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-bold text-slate-600">
                    Schedule call
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Realistic GIFT DISPATCH SLIP SIMULATION */}
          {draft.channel === "Gift" && (
            <div className="rounded-3xl border border-amber-200 bg-amber-50/40 p-5 shadow-sm space-y-4">
              <div className="flex items-center gap-3 rounded-2xl bg-white p-3.5 border border-amber-100 shadow-xs">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-500 text-white font-black">
                  <Gift size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-800">
                    Dispatch: Milestone Celebration Kit
                  </div>
                  <div className="text-xs font-bold text-slate-500">
                    Recipient: Vivaan Mehta (c/o Ira Mehta)
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-4 border border-amber-100 shadow-xs">
                <div className="text-xs font-black uppercase text-amber-700 tracking-wider mb-1.5">
                  Packing & Dispatch SOP:
                </div>
                <div className="text-xs font-semibold leading-relaxed text-slate-800 whitespace-pre-line">
                  {renderedMessageText}
                </div>
              </div>

              {draft.stakeholderNotes && (
                <div className="rounded-2xl bg-amber-100/70 p-3 text-xs text-amber-900 font-semibold border border-amber-200">
                  <strong>Delivery Protocol:</strong> {draft.stakeholderNotes}
                </div>
              )}

              <div className="rounded-2xl bg-white p-3 border border-amber-100 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500">Logistics Partner:</span>
                <span className="font-black text-slate-800">Zepto Local / Centre Reception</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
