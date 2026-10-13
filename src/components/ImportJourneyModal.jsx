import { useEffect, useRef, useState } from "react";
import {
  FileSpreadsheet,
  X,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  Layers,
  Calendar,
  Sparkles,
  ArrowRight,
  FileText,
  Plus,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  downloadSampleTemplate,
  downloadRowsAsExcel,
  journeyToRows,
  parseSpreadsheetFile,
  buildGraphFromRows,
  SAMPLE_TEMPLATE_ROWS,
} from "../utils/journeySpreadsheet.js";

export default function ImportJourneyModal({
  isOpen,
  onClose,
  journeys = [],
  onImportSuccess,
}) {
  const [importMode, setImportMode] = useState("new"); // "new" | "extend"
  const [selectedExistingJourneyId, setSelectedExistingJourneyId] = useState(
    journeys[0]?.id || ""
  );
  const [newJourneyName, setNewJourneyName] = useState("Extended Member Journey");
  const [newJourneyTag, setNewJourneyTag] = useState("App & WhatsApp • 30 Days");
  const [newJourneyStatus, setNewJourneyStatus] = useState("Active");

  const [uploadedFile, setUploadedFile] = useState(null);
  const [parsedRows, setParsedRows] = useState([]);
  const [parseError, setParseError] = useState("");
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset state when opening
  useEffect(() => {
    if (isOpen) {
      setUploadedFile(null);
      setParsedRows([]);
      setParseError("");
      setIsParsing(false);
      if (journeys.length > 0 && !selectedExistingJourneyId) {
        setSelectedExistingJourneyId(journeys[0].id);
      }
    }
  }, [isOpen, journeys]);

  if (!isOpen) return null;

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const processFile = async (file) => {
    setIsParsing(true);
    setParseError("");
    setUploadedFile(file);

    try {
      const rows = await parseSpreadsheetFile(file);
      setParsedRows(rows);
      // Auto-populate journey name if not customized
      if (importMode === "new") {
        const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/_/g, " ");
        if (baseName && !newJourneyName.includes("Custom")) {
          setNewJourneyName(baseName.charAt(0).toUpperCase() + baseName.slice(1));
        }
      }
    } catch (err) {
      setParseError(err.message || "Failed to parse spreadsheet file. Please check format.");
      setParsedRows([]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleDownloadExisting = (jId) => {
    const target = journeys.find((j) => j.id === jId);
    if (!target) return;
    const rows = journeyToRows(target);
    downloadRowsAsExcel(rows, `TickleTrail_${target.name.replace(/\s+/g, "_")}.xlsx`);
  };

  const handleLoadSamplePreview = () => {
    setUploadedFile({ name: "TickleRight_Sample_Template.xlsx", size: 14200 });
    setParsedRows(
      SAMPLE_TEMPLATE_ROWS.map((r) => ({
        day: Number(r["Day Number"]),
        time: r["Trigger Time"],
        timeOfDay: r["Time of Day"],
        channel: r["Channel"],
        title: r["Message Title"],
        desc: r["Message Body"],
        deepLink: r["Deep Link URL"],
        isRandomDrop: r["Random Drop"] === "Yes",
        avoidSundays: r["Avoid Sundays"] === "Yes",
        checkFestivalCalendar: r["Festive Guard"] === "Yes",
      }))
    );
    setParseError("");
  };

  // Group stats
  const uniqueDays = Array.from(new Set(parsedRows.map((r) => r.day)));
  const channelCount = Array.from(new Set(parsedRows.map((r) => r.channel)));

  const handleExecuteImport = () => {
    if (parsedRows.length === 0) return;

    if (importMode === "new") {
      const newJourneyId = `journey-imported-${Date.now()}`;
      const { nodes, edges } = buildGraphFromRows(
        parsedRows,
        newJourneyId,
        newJourneyName
      );

      const createdJourney = {
        id: newJourneyId,
        name: newJourneyName.trim() || "Imported Journey",
        status: newJourneyStatus,
        tag: newJourneyTag.trim() || `Excel Import • ${uniqueDays.length} Days`,
        modifiedAt: new Date().toISOString().slice(0, 10),
        trigger: {
          type: "Time-based",
          event: "Time-based • All Members",
          reference: "IMP",
        },
        baselineCompletion: 78,
        nodes,
        edges,
      };

      onImportSuccess({
        type: "new",
        journey: createdJourney,
        message: `Successfully created "${createdJourney.name}" with ${nodes.length} journey steps!`,
      });
    } else {
      // Extend / update existing journey
      const targetJourney = journeys.find((j) => j.id === selectedExistingJourneyId);
      if (!targetJourney) return;

      const { nodes, edges } = buildGraphFromRows(
        parsedRows,
        targetJourney.id,
        targetJourney.name
      );

      const updatedJourney = {
        ...targetJourney,
        tag: `${targetJourney.tag.split("•")[0].trim()} • ${uniqueDays.length} Days`,
        modifiedAt: new Date().toISOString().slice(0, 10),
        nodes,
        edges,
      };

      onImportSuccess({
        type: "update",
        journey: updatedJourney,
        message: `Successfully updated "${targetJourney.name}" with ${nodes.length} journey steps!`,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="relative flex h-[92vh] max-h-[880px] w-full max-w-4xl flex-col rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500 text-slate-950 font-black shadow-md">
              <FileSpreadsheet size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-black text-white">Import Journey</span>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-black text-emerald-300">
                  Excel & CSV Engine
                </span>
              </div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">
                Download an existing journey to extend it in Excel, or upload a spreadsheet to auto-generate the visual canvas.
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white transition cursor-pointer"
            title="Close modal (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Quick Template Download Bar */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-700">Need a starting template?</span>
            <button
              type="button"
              onClick={downloadSampleTemplate}
              className="inline-flex items-center gap-1.5 rounded-xl border border-coral-300 bg-coral-50 px-3 py-1.5 text-xs font-black text-coral-600 hover:bg-coral-100 transition shadow-2xs cursor-pointer"
            >
              <Download size={13} />
              Download Blank Template (.xlsx)
            </button>
            <button
              type="button"
              onClick={handleLoadSamplePreview}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-100 transition shadow-2xs cursor-pointer"
            >
              <Eye size={13} />
              Preview Sample Data
            </button>
          </div>

          {journeys.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-500">Or export existing:</span>
              <select
                className="rounded-xl border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-2xs"
                value={selectedExistingJourneyId}
                onChange={(e) => {
                  setSelectedExistingJourneyId(e.target.value);
                  handleDownloadExisting(e.target.value);
                }}
              >
                {journeys.map((j) => (
                  <option key={j.id} value={j.id}>
                    Export "{j.name}"
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setImportMode("new")}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                importMode === "new"
                  ? "border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-400/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl font-black ${
                  importMode === "new" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <Plus size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Create as New Journey</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  Generates an entirely new autopilot journey on the canvas.
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setImportMode("extend")}
              className={`flex items-start gap-3 rounded-2xl border p-3.5 text-left transition cursor-pointer ${
                importMode === "extend"
                  ? "border-emerald-500 bg-emerald-50/50 shadow-xs ring-2 ring-emerald-400/20"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl font-black ${
                  importMode === "extend" ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                <RefreshCw size={16} />
              </div>
              <div>
                <div className="text-xs font-black text-slate-900">Extend / Overwrite Existing</div>
                <div className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  Update an active journey (e.g. extending from 14 to 30 days).
                </div>
              </div>
            </button>
          </div>

          {/* Form Options based on Mode */}
          {importMode === "new" ? (
            <div className="grid grid-cols-3 gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="block text-xs font-black text-slate-700">
                Journey Name
                <input
                  type="text"
                  value={newJourneyName}
                  onChange={(e) => setNewJourneyName(e.target.value)}
                  className="field mt-1 text-xs font-bold"
                  placeholder="e.g. Toddler Companion 30-Day Loop"
                />
              </label>

              <label className="block text-xs font-black text-slate-700">
                Tag / Description
                <input
                  type="text"
                  value={newJourneyTag}
                  onChange={(e) => setNewJourneyTag(e.target.value)}
                  className="field mt-1 text-xs font-bold"
                  placeholder="e.g. App & WhatsApp • 30 Days"
                />
              </label>

              <label className="block text-xs font-black text-slate-700">
                Initial Status
                <select
                  value={newJourneyStatus}
                  onChange={(e) => setNewJourneyStatus(e.target.value)}
                  className="field mt-1 text-xs font-bold"
                >
                  <option value="Active">Active (Live Autopilot)</option>
                  <option value="Draft">Draft (Offline)</option>
                </select>
              </label>
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4">
              <label className="block text-xs font-black text-slate-700">
                Target Journey to Update
                <select
                  value={selectedExistingJourneyId}
                  onChange={(e) => setSelectedExistingJourneyId(e.target.value)}
                  className="field mt-1 text-xs font-bold"
                >
                  {journeys.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.name} ({j.nodes?.length || 0} existing steps)
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}

          {/* Upload Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center rounded-3xl border-2 border-dashed p-7 text-center transition cursor-pointer ${
              uploadedFile
                ? "border-emerald-400 bg-emerald-50/30"
                : "border-slate-300 bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <div
              className={`grid h-12 w-12 place-items-center rounded-2xl mb-3 shadow-xs font-black ${
                uploadedFile ? "bg-emerald-500 text-white" : "bg-white text-emerald-600 border border-slate-200"
              }`}
            >
              {uploadedFile ? <CheckCircle2 size={24} /> : <UploadCloud size={24} />}
            </div>

            {uploadedFile ? (
              <div>
                <div className="text-sm font-black text-slate-900 flex items-center justify-center gap-2">
                  <span>{uploadedFile.name}</span>
                  <span className="text-xs text-emerald-700 font-extrabold bg-emerald-100 px-2 py-0.5 rounded-full">
                    Ready
                  </span>
                </div>
                <div className="text-xs text-slate-500 font-semibold mt-1">
                  {(uploadedFile.size / 1024).toFixed(1)} KB • Click or drop another file to replace
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-black text-slate-800">
                  Click to browse or drag & drop your Excel file here
                </div>
                <div className="text-xs font-medium text-slate-500 mt-1">
                  Supports <strong>.xlsx</strong> and <strong>.csv</strong> spreadsheets
                </div>
              </div>
            )}
          </div>

          {/* Error Message */}
          {parseError && (
            <div className="flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-800">
              <AlertCircle size={16} className="shrink-0 text-rose-600" />
              <span>{parseError}</span>
            </div>
          )}

          {/* Parsed Results Overview & Preview Table */}
          {parsedRows.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-2">
                  <span>Parsed Spreadsheet Preview</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                    {parsedRows.length} Touchpoints
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                    {uniqueDays.length} Days Detected
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-md">
                    {channelCount.length} Channels
                  </span>
                </div>
              </div>

              {/* Scrollable Preview Table */}
              <div className="max-h-60 overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="sticky top-0 z-10 bg-coral-500 text-[11px] font-black uppercase tracking-wider text-white border-b-2 border-coral-600 shadow-sm">
                    <tr>
                      <th className="px-3.5 py-3 text-center font-black">Day Number</th>
                      <th className="px-3.5 py-3 text-center font-black">Trigger Time</th>
                      <th className="px-3.5 py-3 text-center font-black">Channel</th>
                      <th className="px-3.5 py-3 font-black">Message Title</th>
                      <th className="px-3.5 py-3 font-black">Message Body Preview</th>
                      <th className="px-3.5 py-3 text-center font-black">Guardrails</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {parsedRows.map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition">
                        <td className="px-3 py-2 font-black text-slate-800 whitespace-nowrap">
                          Day {r.day}
                        </td>
                        <td className="px-3 py-2 font-bold text-slate-600 whitespace-nowrap">
                          {r.time}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <span
                            className={`rounded-md px-1.5 py-0.5 text-[10px] font-black border ${
                              r.channel === "Call"
                                ? "bg-orange-50 text-orange-700 border-orange-200"
                                : r.channel === "WhatsApp"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : r.channel === "Email"
                                ? "bg-sky-50 text-sky-700 border-sky-200"
                                : "bg-indigo-50 text-indigo-700 border-indigo-200"
                            }`}
                          >
                            {r.channel}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-bold text-slate-800 max-w-[180px] truncate">
                          {r.title}
                        </td>
                        <td className="px-3 py-2 text-slate-500 max-w-[240px] truncate font-medium">
                          {r.desc}
                        </td>
                        <td className="px-3 py-2 text-[10px] font-bold text-slate-500 whitespace-nowrap">
                          {r.avoidSundays && "Sundays Off"}
                          {r.avoidSundays && r.checkFestivalCalendar && " • "}
                          {r.checkFestivalCalendar && "Festive Guard"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4">
          <div className="text-xs font-bold text-slate-500">
            {parsedRows.length > 0 ? (
              <span className="text-emerald-700 font-black flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                Ready to build {uniqueDays.length} visual cards on canvas
              </span>
            ) : (
              "Please upload an Excel or CSV file to continue"
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost text-xs font-bold"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={parsedRows.length === 0 || isParsing}
              onClick={handleExecuteImport}
              className={`btn btn-primary !px-5 !py-2.5 text-xs font-black flex items-center gap-2 ${
                parsedRows.length === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <Sparkles size={15} />
              Build & Open Journey Canvas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
