import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  addEdge,
  useReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react";
import { ArrowLeft, CheckCircle2, Clock, GitBranch, Gift, Maximize2, Minimize2, Minus, Pause, Play, Plus, Save, Send, Square, Zap } from "lucide-react";
import ChannelBadge from "../components/ChannelBadge.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

const metricLabels = [
  ["On Stage", "onStage"],
  ["Sent", "sent"],
  ["Opened", "opened"],
];

function NodeShell({ data, tone, icon }) {
  return (
    <div className={`node-card ring-1 ring-slate-900/5 ${tone}`}>
      <Handle type="target" position={Position.Top} />
      <div className="mb-2 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm">{icon}{data.reference || "M"}{data.offset !== undefined ? `+${data.offset}` : ""}</span>
        {data.template?.channel && <ChannelBadge channel={data.template.channel} />}
      </div>
      <div className="text-base leading-tight">{data.label}</div>
      <div className="mt-2 text-xs font-bold text-slate-500">
        {data.triggerKind || data.condition || data.template?.name || data.description}
      </div>
      {data.metrics && (
        <div className="mt-3 grid grid-cols-3 gap-1.5 border-t border-slate-100 pt-2">
          {metricLabels.map(([label, key]) => (
            <div key={key} className="rounded-lg bg-white/70 px-1.5 py-1 text-center">
              <div className="text-[10px] font-black text-slate-400">{label}</div>
              <div className="text-sm font-black text-ink">{data.metrics[key]}</div>
            </div>
          ))}
        </div>
      )}
      {data.isLeaf && (
        <button
          className="absolute -bottom-5 left-1/2 z-20 grid h-9 w-9 -translate-x-1/2 place-items-center rounded-full border-2 border-white bg-coral-500 text-white shadow-soft transition hover:bg-coral-600"
          title="Add next step"
          onClick={(event) => {
            event.stopPropagation();
            data.onAddAfter?.(data.nodeId);
          }}
        >
          <Plus size={17} />
        </button>
      )}
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}

const nodeTypes = {
  start: ({ data }) => <NodeShell data={data} tone="bg-[#ffe58a]" icon={<Zap size={16} />} />,
  event: ({ data }) => <NodeShell data={data} tone="bg-[#ffe58a]" icon={<Zap size={16} />} />,
  step: ({ data }) => <NodeShell data={data} tone="bg-[#ffc7d5]" icon={<Send size={16} />} />,
  human: ({ data }) => <NodeShell data={data} tone="bg-[#ffc7d5]" icon={data.template?.channel === "Gift" ? <Gift size={16} /> : <Clock size={16} />} />,
  route: ({ data }) => <NodeShell data={data} tone="bg-[#ffc7d5]" icon={<GitBranch size={16} />} />,
  end: ({ data }) => <NodeShell data={data} tone="bg-[#ffc7d5]" icon={<CheckCircle2 size={16} />} />,
};

export default function Journey() {
  const { data, addJourney, addTemplate, updateTemplate, updateJourney, updateJourneyNode, updateJourneyGraph } = useData();
  const [selectedJourneyId, setSelectedJourneyId] = useState(null);
  const selectedJourney = data.journeys.find((journey) => journey.id === selectedJourneyId);
  const childCount = data.members.length;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const addStepAfter = useCallback((sourceNodeId) => {
    const id = `node-${Date.now()}`;
    const template = data.templates[0];
    setNodes((current) => {
      const sourceNode = current.find((node) => node.id === sourceNodeId);
      return [
        ...current,
        {
          id,
          type: "step",
          position: {
            x: sourceNode?.position?.x ?? 420,
            y: (sourceNode?.position?.y ?? 120) + 220,
          },
          data: {
            label: "New journey step",
            offset: 7,
            unit: "Days",
            reference: sourceNode?.data?.reference || "M",
            templateId: template?.id,
            template,
            avoidSundays: true,
            checkFestivalCalendar: false,
            checkContentCalendar: true,
          },
        },
      ];
    });
    setEdges((current) => addEdge({ id: `e-${sourceNodeId}-${id}`, source: sourceNodeId, target: id, type: "smoothstep", animated: selectedJourney?.status === "Active" }, current));
    setSelectedNodeId(id);
  }, [data.templates, selectedJourney?.status, setEdges, setNodes]);

  const hydratedNodes = useMemo(
    () => {
      const outgoing = new Set((selectedJourney?.edges || []).map((edge) => edge.source));
      return (selectedJourney?.nodes || []).map((node, index) => {
        const template = data.templates.find((item) => item.id === node.data.templateId);
        return {
          ...node,
          data: {
            ...node.data,
            template,
            metrics: makeNodeMetrics(node, index, childCount),
            nodeId: node.id,
            isLeaf: !outgoing.has(node.id),
            onAddAfter: addStepAfter,
          },
        };
      });
    },
    [selectedJourney, data.templates, childCount, addStepAfter]
  );
  const [selectedNodeId, setSelectedNodeId] = useState("start");
  const [logs, setLogs] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [speed, setSpeed] = useState("1 day = 1 minute");
  const [sideTab, setSideTab] = useState("settings");
  const [canvasFullscreen, setCanvasFullscreen] = useState(false);

  useEffect(() => {
    setNodes(hydratedNodes);
    setEdges((selectedJourney?.edges || []).map((edge) => ({ ...edge, animated: selectedJourney?.status === "Active" })));
    setSelectedNodeId((hydratedNodes[0] || {}).id);
  }, [hydratedNodes, selectedJourney?.edges, selectedJourney?.status, setEdges, setNodes]);

  useEffect(() => {
    if (!simulating) return undefined;
    let index = 0;
    if (!selectedJourney) return undefined;
    const activeMembers = data.journeyMembers.filter((jm) => jm.journeyId === selectedJourney.id).slice(0, 12);
    const ordered = nodes.filter((node) => node.type !== "route");
    const timer = setInterval(() => {
      const node = ordered[index % ordered.length];
      const memberLink = activeMembers[index % activeMembers.length];
      const member = data.members.find((item) => item.id === memberLink?.memberId);
      if (node && member) {
        const action = node.type === "human" ? "created a task for" : "would send";
        setLogs((current) => [
          {
            id: `${Date.now()}-${index}`,
            text: `${node.data.reference || "M"}+${node.data.offset || 0}: ${action} ${member.childName} ${member.name} - ${node.data.label}`,
            channel: node.data.template?.channel || "Trigger",
          },
          ...current.slice(0, 24),
        ]);
      }
      index += 1;
    }, speed.includes("30 seconds") ? 800 : 1400);
    return () => clearInterval(timer);
  }, [simulating, speed, nodes, data.journeyMembers, data.members, selectedJourney]);

  const selectedNode = nodes.find((node) => node.id === selectedNodeId);
  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, type: "smoothstep", animated: selectedJourney?.status === "Active" }, eds)),
    [selectedJourney?.status, setEdges]
  );
  const counts = selectedJourney ? data.journeyMembers.filter((jm) => jm.journeyId === selectedJourney.id) : [];

  const saveGraph = () => {
    if (!selectedJourney) return;
    const cleanNodes = nodes.map(({ data: nodeData, ...node }) => {
      const { template, metrics, isLeaf, onAddAfter, nodeId, ...rest } = nodeData;
      return { ...node, data: rest };
    });
    updateJourneyGraph(selectedJourney.id, cleanNodes, edges);
  };

  const addStep = () => {
    const id = `node-${Date.now()}`;
    setNodes((current) => [
      ...current,
      {
        id,
        type: "step",
        position: { x: 720, y: 240 },
        data: {
          label: "New journey step",
          offset: 45,
          unit: "Days",
          reference: "M",
          templateId: data.templates[0]?.id,
          template: data.templates[0],
          avoidSundays: true,
          checkFestivalCalendar: false,
          checkContentCalendar: true,
        },
      },
    ]);
    setSelectedNodeId(id);
  };

  const createJourney = () => {
    const id = `journey-${Date.now()}`;
    const startId = `${id}-start`;
    addJourney({
      id,
      name: "New Journey",
      status: "Draft",
      tag: "Member Journey",
      trigger: { type: "Event-based", event: "Member Joined the Program", reference: "M" },
      nodes: [
        {
          id: startId,
          type: "start",
          position: { x: 420, y: 40 },
          data: {
            label: "Member Joined the Program",
            triggerKind: "Event-based",
            triggerEvent: "Member Joined the Program",
            audienceSegmentId: "seg-all",
            exclusions: [],
          },
        },
      ],
      edges: [],
    });
    setSelectedJourneyId(id);
    setSelectedNodeId(startId);
  };

  const canvas = (
    <div className={`panel relative overflow-hidden rounded-3xl bg-[#fffaf0] ${canvasFullscreen ? "h-full" : ""}`}>
      <button
        className="btn btn-ghost absolute right-4 top-4 z-10 !h-10 !w-10 !p-0"
        title={canvasFullscreen ? "Exit fullscreen" : "Fullscreen canvas"}
        onClick={() => setCanvasFullscreen((value) => !value)}
      >
        {canvasFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
      </button>
      <ReactFlow
        key={`${selectedJourney?.id || "journey-list"}-${canvasFullscreen ? "full" : "normal"}`}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
          setSideTab("settings");
        }}
        defaultViewport={{ x: -250, y: 36, zoom: 1.08 }}
        minZoom={0.45}
        maxZoom={1.8}
      >
        <CanvasZoomControls />
        <Background color="#eadfe1" gap={24} />
        <MiniMap pannable zoomable nodeStrokeWidth={3} />
        <Controls />
      </ReactFlow>
    </div>
  );

  if (!selectedJourney) {
    return (
      <div className="page">
        <PageHeader
          title="Journey"
          subtitle="Choose a journey to open its visual canvas, configuration panel, simulation, and human-action queue."
          actions={<button className="btn btn-primary" onClick={createJourney}><Plus size={17} /> New Journey</button>}
        />
        <div className="grid grid-cols-3 gap-4">
          {data.journeys.map((journey) => (
            <button
              key={journey.id}
              onClick={() => setSelectedJourneyId(journey.id)}
              className="panel rounded-2xl p-5 text-left transition hover:-translate-y-0.5 hover:ring-2 hover:ring-coral-200"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-xl font-black">{journey.name}</div>
                <span className={`rounded-full px-2 py-1 text-xs font-extrabold ${journey.status === "Active" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-600"}`}>{journey.status}</span>
              </div>
              <div className="mt-2 text-sm font-bold text-slate-500">{journey.tag}</div>
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-coral-50 p-3">
                  <div className="text-2xl font-black text-coral-600">
                    {journey.id === "journey-member" ? childCount : data.journeyMembers.filter((item) => item.journeyId === journey.id).length}
                  </div>
                  <div className="font-bold text-slate-500">{journey.id === "journey-member" ? "children" : "members"}</div>
                </div>
                <div className="rounded-xl bg-sky-50 p-3">
                  <div className="text-2xl font-black text-sky-700">{journey.nodes?.length || 0}</div>
                  <div className="font-bold text-slate-500">nodes</div>
                </div>
              </div>
              <div className="mt-4 text-xs font-extrabold text-slate-400">Modified {journey.modifiedAt}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <PageHeader
        title={selectedJourney.name}
        subtitle={`${selectedJourney.tag} - ${selectedJourney.trigger.type}: ${selectedJourney.trigger.event}`}
        actions={
          <>
            <button className="btn btn-ghost" onClick={() => { setSimulating(false); setSelectedJourneyId(null); }}><ArrowLeft size={17} /> Journeys</button>
            <button className="btn btn-ghost" onClick={addStep}><Plus size={17} /> Step</button>
            <button className="btn btn-ghost" onClick={saveGraph}><Save size={17} /> Save</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const nextStatus = selectedJourney.status === "Active" ? "Paused" : "Active";
                setEdges((current) => current.map((edge) => ({ ...edge, animated: nextStatus === "Active" })));
                updateJourney(selectedJourney.id, { status: nextStatus });
              }}
            >
              {selectedJourney.status === "Active" ? <Pause size={17} /> : <Play size={17} />}
              {selectedJourney.status === "Active" ? "Pause" : "Publish"}
            </button>
          </>
        }
      />

      {canvasFullscreen && (
        <div className="fixed inset-0 z-50 bg-[#fff9f4] p-5">
          {canvas}
        </div>
      )}

      <div className="grid h-[760px] grid-cols-[minmax(0,1fr)_360px] gap-4">
        {!canvasFullscreen && canvas}

        <aside className="panel flex min-h-0 flex-col overflow-hidden rounded-3xl">
          <div className="grid grid-cols-2 border-b border-coral-100 p-2">
            <button
              className={`rounded-xl px-3 py-2 text-sm font-black ${sideTab === "settings" ? "bg-coral-50 text-coral-600" : "text-slate-500"}`}
              onClick={() => setSideTab("settings")}
            >
              Settings
            </button>
            <button
              className={`rounded-xl px-3 py-2 text-sm font-black ${sideTab === "simulation" ? "bg-coral-50 text-coral-600" : "text-slate-500"}`}
              onClick={() => setSideTab("simulation")}
            >
              Simulation
            </button>
          </div>
          {sideTab === "settings" ? (
            <div className="min-h-0 flex-1 overflow-auto p-4">
              <NodePanel
                node={selectedNode}
                templates={data.templates}
                segments={data.segments}
                members={data.members}
                addTemplate={addTemplate}
                updateTemplate={updateTemplate}
                onChange={(patch) => {
                  setNodes((current) => current.map((node) => (node.id === selectedNode.id ? { ...node, data: { ...node.data, ...patch, template: data.templates.find((template) => template.id === (patch.templateId || node.data.templateId)) } } : node)));
                  updateJourneyNode(selectedJourney.id, selectedNode.id, patch);
                }}
              />
            </div>
          ) : (
            <SimulationPanel
              counts={counts}
              logs={logs}
              simulating={simulating}
              speed={speed}
              setSpeed={setSpeed}
              toggle={() => setSimulating((value) => !value)}
              clear={() => setLogs([])}
            />
          )}
        </aside>
      </div>

    </div>
  );
}

function CanvasZoomControls() {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  return (
    <div className="absolute left-4 top-4 z-10 flex overflow-hidden rounded-xl border border-coral-100 bg-white shadow-soft">
      <button className="grid h-10 w-10 place-items-center hover:bg-coral-50" title="Zoom in" onClick={() => zoomIn({ duration: 180 })}>
        <Plus size={17} />
      </button>
      <button className="grid h-10 w-10 place-items-center border-l border-coral-100 hover:bg-coral-50" title="Zoom out" onClick={() => zoomOut({ duration: 180 })}>
        <Minus size={17} />
      </button>
      <button className="px-3 text-xs font-black text-slate-600 hover:bg-coral-50" title="Fit journey" onClick={() => fitView({ duration: 220, padding: 0.18 })}>
        Fit
      </button>
    </div>
  );
}

function makeNodeMetrics(node, index, childCount) {
  if (node.type === "route" || node.type === "end") return null;
  if (node.type === "start") {
    return { onStage: childCount, sent: 0, opened: 0 };
  }
  if (node.type === "event") {
    const onStage = node.data.reference === "D" || node.id.includes("discontinued") ? 114 : 114;
    return { onStage, sent: 0, opened: 0 };
  }
  const branchPenalty = node.data.reference === "D" ? 245 : node.data.reference === "G" ? 205 : 0;
  const stage = Math.max(24, childCount - 257 - index * 18 - branchPenalty);
  const sent = Math.max(stage + 24, childCount - 120 - index * 16 - Math.round(branchPenalty * 0.45));
  const opened = Math.max(12, Math.round(sent * (0.66 - (index % 4) * 0.025)));
  return { onStage: stage, sent, opened };
}

function SimulationPanel({ counts, logs, simulating, speed, setSpeed, toggle, clear }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <div className="text-xl font-black">Simulation</div>
          <div className="text-sm font-bold text-slate-500">{counts.length} seeded members ready</div>
        </div>
        <button className="btn btn-primary !h-11 !w-11 !p-0" onClick={toggle}>
          {simulating ? <Square size={17} /> : <Play size={17} />}
        </button>
      </div>
      <select className="field mb-3" value={speed} onChange={(event) => setSpeed(event.target.value)}>
        <option>1 day = 1 minute</option>
        <option>1 week = 7 minutes</option>
        <option>1 month = 30 seconds</option>
      </select>
      <div className="mb-3 grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-coral-50 p-3 text-center">
          <div className="text-xl font-black text-coral-600">{logs.length}</div>
          <div className="text-xs font-bold text-slate-500">events</div>
        </div>
        <div className="rounded-xl bg-sky-50 p-3 text-center">
          <div className="text-xl font-black text-sky-700">{simulating ? "Live" : "Idle"}</div>
          <div className="text-xs font-bold text-slate-500">status</div>
        </div>
        <button className="rounded-xl bg-slate-50 p-3 text-xs font-black text-slate-600" onClick={clear}>
          Clear Log
        </button>
      </div>
      <div className="min-h-0 flex-1 space-y-2 overflow-auto rounded-2xl bg-slate-50 p-3">
        {logs.length === 0 ? (
          <div className="rounded-xl bg-white p-3 text-sm font-bold text-slate-500">Press play to preview journey activity.</div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="rounded-xl border border-slate-100 bg-white p-3">
              <div className="mb-1 inline-flex rounded-full bg-coral-50 px-2 py-1 text-xs font-black text-coral-600">{log.channel}</div>
              <div className="text-sm font-bold leading-snug text-slate-600">{log.text}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function NodePanel({ node, templates, segments, members, addTemplate, updateTemplate, onChange }) {
  if (!node) return <div>Select a node</div>;
  const selectedTemplate = templates.find((template) => template.id === node.data.templateId);
  const isTemplateNode = node.type !== "start" && node.type !== "event" && node.type !== "route" && node.type !== "end";
  const isHumanTemplate = selectedTemplate?.channel === "Call" || selectedTemplate?.channel === "Gift";

  const createAndAttachTemplate = () => {
    const id = `tpl-${Date.now()}`;
    const channel = node.type === "human" ? "Call" : "WhatsApp";
    const template = {
      id,
      name: "New Journey Template",
      channel,
      contentType: channel === "Call" || channel === "Gift" ? "Instructions" : "Text only",
      content: channel === "Call" || channel === "Gift" ? "Add instructions for the stakeholder." : "Hi {{parent_name}}, add your message here.",
      stakeholderNotes: "",
      image: "",
    };
    addTemplate(template);
    onChange({ templateId: id, label: template.name });
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3">
        <div className="text-lg font-black">Node Settings</div>
        <div className="text-xs font-bold text-slate-500">{node.type} node</div>
      </div>
      <div className="space-y-3">
        <label className="block text-sm font-extrabold">Label<input className="field mt-1" value={node.data.label || ""} onChange={(event) => onChange({ label: event.target.value })} /></label>
        {node.type === "start" || node.type === "event" ? (
          <>
            <label className="block text-sm font-extrabold">Trigger Type<select className="field mt-1" value={node.data.triggerKind} onChange={(event) => onChange({ triggerKind: event.target.value })}><option>Event-based</option><option>Time-based</option></select></label>
            <label className="block text-sm font-extrabold">Event<select className="field mt-1" value={node.data.triggerEvent} onChange={(event) => onChange({ triggerEvent: event.target.value })}><option>Member Joined the Program</option><option>Renewal Due</option><option>Payment Failed</option><option>Registration</option></select></label>
            <label className="block text-sm font-extrabold">Audience<select className="field mt-1" value={node.data.audienceSegmentId} onChange={(event) => onChange({ audienceSegmentId: event.target.value })}>{segments.map((segment) => <option key={segment.id} value={segment.id}>{segment.name} ({segment.count})</option>)}</select></label>
            <label className="block text-sm font-extrabold">Specific Exclusion<input className="field mt-1" list="members" value={(node.data.exclusions || []).join(", ")} onChange={(event) => onChange({ exclusions: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} /></label>
            <datalist id="members">{members.slice(0, 40).map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</datalist>
          </>
        ) : node.type !== "route" && node.type !== "end" ? (
          <>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-sm font-extrabold">Offset<input className="field mt-1" type="number" value={node.data.offset || 0} onChange={(event) => onChange({ offset: Number(event.target.value) })} /></label>
              <label className="block text-sm font-extrabold">Unit<select className="field mt-1" value={node.data.unit || "Days"} onChange={(event) => onChange({ unit: event.target.value })}><option>Days</option><option>Weeks</option><option>Months</option></select></label>
            </div>
            <label className="block text-sm font-extrabold">Template<select className="field mt-1" value={node.data.templateId || ""} onChange={(event) => onChange({ templateId: event.target.value })}>{templates.map((template) => <option key={template.id} value={template.id}>{template.name} - {template.channel}</option>)}</select></label>
            {["avoidSundays", "checkFestivalCalendar", "checkContentCalendar"].map((key) => (
              <label key={key} className="flex items-center gap-2 text-sm font-extrabold">
                <input type="checkbox" checked={Boolean(node.data[key])} onChange={(event) => onChange({ [key]: event.target.checked })} />
                {key === "avoidSundays" ? "Avoid Sundays" : key === "checkFestivalCalendar" ? "Check festival calendar" : "Check content calendar"}
              </label>
            ))}
          </>
        ) : (
          <textarea className="field min-h-24" value={node.data.condition || node.data.description || ""} onChange={(event) => onChange(node.type === "route" ? { condition: event.target.value } : { description: event.target.value })} />
        )}
      </div>
      </section>
      {isTemplateNode && (
        <section className="rounded-2xl border border-coral-200 bg-coral-50/70 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <div className="text-lg font-black">Template</div>
              <div className="text-xs font-bold text-slate-500">Edit the selected template or attach a new one.</div>
            </div>
            <button className="btn btn-ghost !px-2 !py-1 text-xs" onClick={createAndAttachTemplate}>
              <Plus size={14} /> New
            </button>
          </div>
          {selectedTemplate ? (
            <div className="space-y-3">
              <label className="block text-sm font-extrabold">
                Template Name
                <input
                  className="field mt-1"
                  value={selectedTemplate.name}
                  onChange={(event) => {
                    updateTemplate(selectedTemplate.id, { name: event.target.value });
                    onChange({ label: event.target.value });
                  }}
                />
              </label>
              <label className="block text-sm font-extrabold">
                Channel
                <select
                  className="field mt-1"
                  value={selectedTemplate.channel}
                  onChange={(event) => {
                    const channel = event.target.value;
                    updateTemplate(selectedTemplate.id, {
                      channel,
                      contentType: channel === "Call" || channel === "Gift" ? "Instructions" : "Text only",
                    });
                  }}
                >
                  <option>WhatsApp</option>
                  <option>Email</option>
                  <option>Call</option>
                  <option>Gift</option>
                </select>
              </label>
              {!isHumanTemplate && (
                <label className="block text-sm font-extrabold">
                  Content Type
                  <select
                    className="field mt-1"
                    value={selectedTemplate.contentType}
                    onChange={(event) => updateTemplate(selectedTemplate.id, { contentType: event.target.value })}
                  >
                    <option>Text only</option>
                    <option>Image + Text</option>
                  </select>
                </label>
              )}
              <label className="block text-sm font-extrabold">
                {isHumanTemplate ? "Script / Instructions" : "Message Text"}
                <textarea
                  className="field mt-1 min-h-28"
                  value={selectedTemplate.content || ""}
                  onChange={(event) => updateTemplate(selectedTemplate.id, { content: event.target.value })}
                />
              </label>
              {isHumanTemplate ? (
                <label className="block text-sm font-extrabold">
                  Stakeholder Notes
                  <textarea
                    className="field mt-1 min-h-20"
                    value={selectedTemplate.stakeholderNotes || ""}
                    onChange={(event) => updateTemplate(selectedTemplate.id, { stakeholderNotes: event.target.value })}
                  />
                </label>
              ) : selectedTemplate.contentType === "Image + Text" ? (
                <label className="block text-sm font-extrabold">
                  Image Placeholder
                  <select
                    className="field mt-1"
                    value={selectedTemplate.image || ""}
                    onChange={(event) => updateTemplate(selectedTemplate.id, { image: event.target.value })}
                  >
                    <option value="">Choose</option>
                    <option>Confetti welcome card</option>
                    <option>Home activity visual</option>
                    <option>Graduation card</option>
                  </select>
                </label>
              ) : null}
            </div>
          ) : (
            <button className="btn btn-primary w-full" onClick={createAndAttachTemplate}>
              <Plus size={16} /> Add Template
            </button>
          )}
        </section>
      )}
    </div>
  );
}
