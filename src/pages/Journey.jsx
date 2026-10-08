import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  ClipboardList,
  Clock,
  Cog,
  Gift,
  GitBranch,
  Image,
  Mail,
  Maximize2,
  MessageCircle,
  MessageSquare,
  Minimize2,
  Minus,
  Pause,
  Phone,
  Play,
  Plus,
  Redo2,
  Save,
  Scan,
  Square,
  Sun,
  Undo2,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import ChannelBadge from "../components/ChannelBadge.jsx";
import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

const metricLabels = [
  ["On Stage", "onStage"],
  ["Sent", "sent"],
  ["Opened", "opened"],
];

const STEP_OPTIONS = [
  {
    type: "event",
    channel: null,
    title: "Event",
    icon: Zap,
    tone: "bg-amber-50 text-amber-600 border-amber-200",
    badge: "Trigger",
    desc: "Fork lifecycle trigger branch (Graduation, Winback, Milestone)",
  },
  {
    type: "step",
    channel: "WhatsApp",
    title: "WhatsApp",
    icon: MessageCircle,
    tone: "bg-emerald-50 text-emerald-600 border-emerald-200",
    badge: "Direct Chat",
    desc: "Send automated WhatsApp template, demo video, or brochure",
  },
  {
    type: "human",
    channel: "Call",
    title: "Call",
    icon: Phone,
    tone: "bg-orange-50 text-orange-600 border-orange-200",
    badge: "Counsellor Task",
    desc: "Assign a discovery, attendance check, or retention call",
  },
  {
    type: "step",
    channel: "Email",
    title: "Mail",
    icon: Mail,
    tone: "bg-sky-50 text-sky-600 border-sky-200",
    badge: "Formal Letter",
    desc: "Deliver curriculum resources, progress report, or schedule",
  },
  {
    type: "human",
    channel: "Gift",
    title: "Gift",
    icon: Gift,
    tone: "bg-pink-50 text-pink-600 border-pink-200",
    badge: "Physical Pack",
    desc: "Dispatch milestone physical reward, learning kit, or certificate",
  },
  {
    type: "step",
    channel: "SMS",
    title: "SMS Flash",
    icon: MessageSquare,
    tone: "bg-blue-50 text-blue-600 border-blue-200",
    badge: "High Open",
    desc: "Urgent flash alert, class reminder link, or gatepass OTP",
  },
  {
    type: "step",
    channel: "Form",
    title: "Survey / Feedback",
    icon: ClipboardList,
    tone: "bg-teal-50 text-teal-600 border-teal-200",
    badge: "Parent Input",
    desc: "Collect parent review, trial class NPS, or progress survey",
  },
  {
    type: "delay",
    channel: "Delay",
    title: "Wait Period",
    icon: Clock,
    tone: "bg-amber-50/80 text-amber-700 border-amber-200",
    badge: "Timeline Pacing",
    desc: "Hold sequence for specific days or wait until preferred time",
  },
  {
    type: "route",
    channel: "Condition",
    title: "Condition (If / Else)",
    icon: GitBranch,
    tone: "bg-indigo-50 text-indigo-600 border-indigo-200",
    badge: "Branching Rule",
    desc: "Split path based on demo attendance, clicks, or replies",
  },
];

const stripNodeUiData = (node) => {
  const {
    template,
    metrics,
    audienceCount,
    isLeaf,
    isSelected,
    onAddAfter,
    onToggleMenu,
    isMenuOpen,
    onSelectStepOption,
    onSelectNode,
    nodeId,
    ...data
  } = node.data;
  return { ...node, data };
};

function getNodeStyle(type, channel) {
  if (type === "start" || type === "event") {
    return { tone: "node-start", icon: <Zap size={15} className="text-amber-500 fill-amber-400" /> };
  }
  if (channel === "WhatsApp") {
    return { tone: "node-whatsapp", icon: <MessageCircle size={15} className="text-emerald-600" /> };
  }
  if (channel === "Email") {
    return { tone: "node-email", icon: <Mail size={15} className="text-sky-600" /> };
  }
  if (channel === "Call" || type === "human") {
    return { tone: "node-call", icon: <Phone size={15} className="text-purple-600" /> };
  }
  if (channel === "Gift") {
    return { tone: "node-gift", icon: <Gift size={15} className="text-amber-600" /> };
  }
  if (channel === "SMS") {
    return { tone: "node-email", icon: <MessageSquare size={15} className="text-blue-600" /> };
  }
  if (channel === "Form") {
    return { tone: "node-whatsapp", icon: <ClipboardList size={15} className="text-teal-600" /> };
  }
  if (type === "delay" || channel === "Delay") {
    return { tone: "node-start", icon: <Clock size={15} className="text-amber-600" /> };
  }
  if (type === "route" || channel === "Condition") {
    return { tone: "node-route", icon: <GitBranch size={15} className="text-indigo-600" /> };
  }
  if (type === "end") {
    return { tone: "node-end", icon: <CheckCircle2 size={15} className="text-rose-600" /> };
  }
  return { tone: "node-whatsapp", icon: <Cog size={15} className="text-slate-600" /> };
}

function NodeShell({ data, type }) {
  const isEvent = type === "start" || type === "event";
  const { tone, icon } = getNodeStyle(type, data.template?.channel);

  return (
    <div
      onClick={(e) => {
        if (e.target.closest("button") || e.target.closest(".menu-flyout")) return;
        data.onSelectNode?.(data.nodeId);
      }}
      className={`node-card cursor-pointer transition-all duration-150 relative ${
        isEvent
          ? "!border-2 !border-amber-400 !bg-amber-50/40 shadow-md rounded-2xl"
          : `${tone} rounded-2xl`
      } ${
        data.isSelected
          ? isEvent
            ? "!ring-3 !ring-amber-500 !shadow-2xl scale-[1.02]"
            : "!ring-3 !ring-coral-500 !shadow-2xl scale-[1.02]"
          : "hover:shadow-lg"
      }`}
    >
      <Handle type="target" position={Position.Left} />

      {/* Standout Event Card Header Ribbon (Solid amber, clean and flat) */}
      {isEvent ? (
        <div className="-mx-4 -mt-4 mb-3 flex items-center justify-between rounded-t-xl bg-amber-500 px-3.5 py-1.5 text-white shadow-2xs">
          <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider">
            <Zap size={12} className="fill-white text-white" />
            {type === "start" ? "Journey Trigger" : "Event Fork"}
          </span>
          <span className="rounded-full bg-amber-600/90 px-2 py-0.2 text-[9px] font-black">
            Ref [{data.reference || "M"}]
          </span>
        </div>
      ) : (
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-0.5 text-xs font-black text-slate-700 shadow-xs">
            {icon}
            {data.reference || "M"}
            {data.offset !== undefined ? `+${data.offset}` : ""}
          </span>
          {data.template?.channel ? (
            <ChannelBadge channel={data.template.channel} />
          ) : type === "end" ? (
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black text-rose-800">Destination</span>
          ) : null}
        </div>
      )}

      {/* Sub-label for event cards */}
      {isEvent && (
        <div className="mb-2 flex items-center justify-between">
          <span className="flex items-center gap-1.5 rounded-md bg-amber-100/90 px-2 py-0.5 text-[11px] font-black text-amber-900 border border-amber-200">
            {icon}
            Trigger
          </span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-extrabold text-amber-800 border border-amber-200 shadow-2xs">
            {data.triggerKind || "Event-based"}
          </span>
        </div>
      )}

      <div className={`text-sm leading-snug ${isEvent ? "font-black text-slate-900" : "font-extrabold text-slate-800"}`}>
        {data.label}
      </div>
      <div className="mt-1 line-clamp-1 text-xs font-bold text-slate-500">
        {data.triggerKind || data.condition || data.template?.name || data.description}
      </div>

      {/* Autopilot Guardrail Badges (Step cards only) */}
      {!isEvent && (data.avoidSundays || data.checkFestivalCalendar) && (
        <div className="mt-2 flex flex-wrap gap-1">
          {data.avoidSundays && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-amber-100/80 px-1.5 py-0.5 text-[10px] font-black text-amber-900">
              ☀️ No Sundays
            </span>
          )}
          {data.checkFestivalCalendar && (
            <span className="inline-flex items-center gap-0.5 rounded-md bg-sky-100/80 px-1.5 py-0.5 text-[10px] font-black text-sky-900">
              📅 Festive Guard
            </span>
          )}
        </div>
      )}

      {/* Footer Metrics: Audience Count Only for Event Card, 3 metrics for normal steps */}
      {isEvent ? (
        <div className="mt-3 flex items-center justify-between rounded-xl bg-amber-100/70 p-2.5 border border-amber-200">
          <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
            Audience Count
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-black text-slate-900">
              {(data.audienceCount || data.metrics?.onSteps || 6420).toLocaleString()}
            </span>
            <span className="text-[10px] font-extrabold text-amber-700/80">enrolled</span>
          </div>
        </div>
      ) : (
        data.metrics && (
          <div className="mt-2.5 grid grid-cols-3 gap-1 border-t border-slate-200/60 pt-2">
            {metricLabels.map(([label, key]) => (
              <div key={key} className="rounded-lg bg-white/80 px-1 py-1 text-center shadow-xs">
                <div className="text-[9px] font-black text-slate-400">{label}</div>
                <div className="text-xs font-black text-slate-800">{data.metrics[key]}</div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Quick Add Step Button with Vertical Popup on the Right */}
      {data.isLeaf && (
        <div className="absolute -right-4 top-1/2 z-30 -translate-y-1/2">
          <button
            type="button"
            className={`add-step-trigger grid h-8 w-8 place-items-center rounded-full border-2 border-white text-white shadow-soft transition hover:scale-110 ${
              data.isMenuOpen ? "bg-slate-800 rotate-45" : "bg-coral-500 hover:bg-coral-600"
            }`}
            title="Add next step or trigger"
            onClick={(event) => {
              event.stopPropagation();
              data.onToggleMenu?.(data.nodeId);
            }}
          >
            <Plus size={16} />
          </button>

          {/* Vertical Medium Size Popup on Right Side of Plus Icon */}
          {data.isMenuOpen && (
            <div
              className="nowheel nodrag menu-flyout absolute left-full top-1/2 -translate-y-1/2 ml-3 w-80 max-h-[460px] overflow-y-auto overscroll-contain rounded-2xl border border-coral-100 bg-white shadow-2xl p-2.5 select-none z-50 text-left animate-in fade-in zoom-in-95 duration-100 cursor-default"
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100">
                <span className="text-xs font-black text-slate-800">Add to Journey</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    data.onToggleMenu?.(null);
                  }}
                  className="grid h-5 w-5 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={13} />
                </button>
              </div>

              <div className="space-y-1">
                {STEP_OPTIONS.map((opt) => (
                  <button
                    key={opt.title}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      data.onSelectStepOption?.(data.nodeId, opt);
                    }}
                    className="group flex items-start gap-2.5 w-full rounded-xl p-2 transition text-left hover:bg-coral-50/60 hover:ring-1 hover:ring-coral-200"
                  >
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${opt.tone} shadow-2xs group-hover:scale-105 transition`}>
                      <opt.icon size={15} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-black text-slate-800 group-hover:text-coral-600 transition truncate">
                          {opt.title}
                        </span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                          {opt.badge}
                        </span>
                      </div>
                      <p className="text-[11px] font-semibold text-slate-500 leading-snug mt-0.5 line-clamp-2">
                        {opt.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      <Handle type="source" position={Position.Right} />
    </div>
  );
}

const nodeTypes = {
  start: (props) => <NodeShell {...props} type="start" />,
  event: (props) => <NodeShell {...props} type="event" />,
  step: (props) => <NodeShell {...props} type="step" />,
  human: (props) => <NodeShell {...props} type="human" />,
  route: (props) => <NodeShell {...props} type="route" />,
  end: (props) => <NodeShell {...props} type="end" />,
};

function makeNodeMetrics(node, index) {
  if (!node || node.type === "route" || node.type === "end") return null;
  const BASE_ACTIVE = 6420;
  if (node.type === "start") {
    return { onStage: BASE_ACTIVE, sent: 0, opened: 0 };
  }
  if (node.type === "event") {
    const onStage = node.data?.reference === "D" || node.id?.includes("discontinued") ? 980 : 2850;
    return { onStage, sent: 0, opened: 0 };
  }
  if (node.data?.reference === "D") {
    const stage = Math.max(120, 980 - (index - 7) * 140);
    const sent = Math.max(stage, Math.round(stage * 0.98));
    const opened = Math.round(sent * 0.78);
    return { onStage: stage, sent, opened };
  }
  if (node.data?.reference === "G") {
    const stage = Math.max(480, 2850 - (index - 7) * 220);
    const sent = Math.max(stage, Math.round(stage * 0.97));
    const opened = Math.round(sent * 0.86);
    return { onStage: stage, sent, opened };
  }
  // Main sequence (Day 1 to Day 367)
  const drops = [0, 40, 210, 470, 580, 700, 960, 1530];
  const decay = drops[Math.min(index, drops.length - 1)] || index * 180;
  const stage = Math.max(1200, BASE_ACTIVE - decay);
  const sent = Math.round(stage * 0.99);
  const opened = Math.round(sent * (0.88 - (index % 4) * 0.03));
  return { onStage: stage, sent, opened };
}

function renderHighlightedMessage(text) {
  if (!text) return <span className="italic text-slate-400">No content configured</span>;
  const parts = text.split(/(\{\{[^}]+\}\})/g);
  return parts.map((part, index) => {
    if (part.startsWith("{{") && part.endsWith("}}")) {
      const varName = part.slice(2, -2).trim();
      return (
        <span
          key={index}
          className="mx-0.5 inline-block rounded-md bg-coral-100 px-1.5 py-0.2 text-[11px] font-black text-coral-700"
        >
          {varName}
        </span>
      );
    }
    return part;
  });
}

export default function Journey() {
  const { data, addJourney, addTemplate, updateTemplate, updateJourney, updateJourneyNode, updateJourneyGraph } = useData();
  const [selectedJourneyId, setSelectedJourneyId] = useState(null);
  const selectedJourney = data.journeys.find((journey) => journey.id === selectedJourneyId);
  const childCount = data.members.length;
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodeId, setSelectedNodeId] = useState("start");
  const nodesRef = useRef([]);
  const edgesRef = useRef([]);
  const pastStackRef = useRef([]);
  const futureStackRef = useRef([]);
  const isUndoingOrRedoingRef = useRef(false);

  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  useEffect(() => {
    edgesRef.current = edges;
  }, [edges]);

  const saveHistorySnapshot = useCallback(() => {
    if (isUndoingOrRedoingRef.current) return;
    const currentSnapshot = {
      nodes: nodesRef.current.map(stripNodeUiData),
      edges: edgesRef.current.map((e) => ({ ...e })),
      selectedNodeId,
    };
    const last = pastStackRef.current[pastStackRef.current.length - 1];
    if (
      last &&
      JSON.stringify(last.nodes) === JSON.stringify(currentSnapshot.nodes) &&
      JSON.stringify(last.edges) === JSON.stringify(currentSnapshot.edges)
    ) {
      return;
    }
    pastStackRef.current = [...pastStackRef.current.slice(-30), currentSnapshot];
    futureStackRef.current = [];
  }, [selectedNodeId]);

  const [activeMenuNodeId, setActiveMenuNodeId] = useState(null);

  const handleSelectStepOption = useCallback(
    (sourceNodeId, opt) => {
      saveHistorySnapshot();
      setActiveMenuNodeId(null);
      if (!selectedJourney) return;

      const id = `node-${Date.now()}`;
      const currentNodes = nodesRef.current;
      const currentEdges = edgesRef.current;
      const outgoing = new Set(currentEdges.map((edge) => edge.source));

      let sourceNode = null;
      if (sourceNodeId) {
        sourceNode = currentNodes.find((node) => node.id === sourceNodeId);
      } else if (selectedNodeId) {
        sourceNode = currentNodes.find((node) => node.id === selectedNodeId);
      } else {
        sourceNode = [...currentNodes].reverse().find((node) => !outgoing.has(node.id)) || currentNodes[currentNodes.length - 1];
      }

      // Check existing outgoing edges from this node to offset Y for clean visual branching
      const existingOutgoingCount = sourceNode ? currentEdges.filter((edge) => edge.source === sourceNode.id).length : 0;
      const yOffset = existingOutgoingCount > 0 ? (existingOutgoingCount % 2 === 1 ? existingOutgoingCount * 190 : -existingOutgoingCount * 190) : 0;
      const posX = (sourceNode?.position?.x ?? 200) + 320;
      const posY = (sourceNode?.position?.y ?? 300) + yOffset;

      let newNode;
      if (opt.type === "event") {
        const ev = data.events?.[0] || { name: "Program Graduation / Alumni", reference: "G", segmentId: "seg-graduated" };
        newNode = {
          id,
          type: "event",
          position: { x: posX, y: posY },
          data: {
            label: ev.name,
            reference: ev.reference || "E",
            triggerKind: "Event-based",
            triggerEvent: ev.name,
            audienceSegmentId: ev.segmentId || "seg-all",
            exclusions: [],
            avoidSundays: true,
            checkFestivalCalendar: true,
            checkContentCalendar: true,
          },
        };
      } else if (opt.type === "delay") {
        newNode = {
          id,
          type: "step",
          position: { x: posX, y: posY },
          data: {
            label: "Wait 3 Days",
            offset: 3,
            unit: "Days",
            reference: sourceNode?.data?.reference || "M",
            description: "Pacing delay between sequential touchpoints",
            avoidSundays: true,
            checkFestivalCalendar: true,
            checkContentCalendar: true,
          },
        };
      } else if (opt.type === "route") {
        newNode = {
          id,
          type: "route",
          position: { x: posX, y: posY },
          data: {
            label: "Demo Attendance Split",
            condition: "Demo Attendance == Attended",
            reference: sourceNode?.data?.reference || "M",
            routes: [
              { id: "yes", label: "Attended (Yes)" },
              { id: "no", label: "No Show (Else)" },
            ],
          },
        };
      } else {
        const channelKey = opt.channel === "Mail" ? "Email" : opt.channel;
        const matchingTemplate = data.templates.find(
          (t) => t.channel?.toLowerCase() === channelKey?.toLowerCase()
        ) || data.templates[0];

        newNode = {
          id,
          type: opt.type || "step",
          position: { x: posX, y: posY },
          data: {
            label: `${opt.title} Follow-up`,
            offset: 2,
            unit: "Days",
            reference: sourceNode?.data?.reference || "M",
            templateId: matchingTemplate?.id,
            template: matchingTemplate ? { ...matchingTemplate, channel: channelKey } : undefined,
            avoidSundays: true,
            checkFestivalCalendar: true,
            checkContentCalendar: true,
          },
        };
      }

      const newEdge = sourceNode
        ? {
            id: `e-${sourceNode.id}-${id}`,
            source: sourceNode.id,
            target: id,
            type: "smoothstep",
            animated: selectedJourney.status === "Active",
          }
        : null;

      const nextNodes = [...currentNodes, newNode];
      const nextEdges = newEdge ? addEdge(newEdge, currentEdges) : currentEdges;
      setNodes(nextNodes);
      setEdges(nextEdges);
      updateJourneyGraph(selectedJourney.id, nextNodes.map(stripNodeUiData), nextEdges);
      setSelectedNodeId(id);
      setSideTab("settings");
    },
    [selectedNodeId, selectedJourney, data.events, data.templates, setEdges, setNodes, updateJourneyGraph, saveHistorySnapshot]
  );

  const hydrateNode = useCallback(
    (node, index, outgoing, activeSelectedId = selectedNodeId, activeMenuId = activeMenuNodeId) => {
      const template = data.templates.find((item) => item.id === node.data?.templateId);
      const seg = data.segments.find((s) => s.id === node.data?.audienceSegmentId);
      const audienceCount = seg?.count || (node.id === "d-event" ? 980 : 6420);
      return {
        ...node,
        data: {
          ...node.data,
          template,
          audienceCount,
          metrics: makeNodeMetrics(node, index),
          nodeId: node.id,
          isLeaf: outgoing ? !outgoing.has(node.id) : true,
          isSelected: node.id === activeSelectedId,
          isMenuOpen: activeMenuId === node.id,
          onToggleMenu: (id) => setActiveMenuNodeId((curr) => (curr === id ? null : id)),
          onSelectStepOption: handleSelectStepOption,
          onSelectNode: (id) => {
            setSelectedNodeId(id);
            setSideTab("settings");
          },
        },
      };
    },
    [data.templates, data.segments, selectedNodeId, activeMenuNodeId, handleSelectStepOption]
  );

  const handleUndo = useCallback(() => {
    if (!selectedJourney || pastStackRef.current.length === 0) return;
    const previous = pastStackRef.current.pop();
    if (!previous) return;

    const currentSnapshot = {
      nodes: nodesRef.current.map(stripNodeUiData),
      edges: edgesRef.current.map((e) => ({ ...e })),
      selectedNodeId,
    };
    futureStackRef.current.push(currentSnapshot);

    isUndoingOrRedoingRef.current = true;
    const outgoing = new Set(previous.edges.map((e) => e.source));
    const targetSelected = previous.selectedNodeId || selectedNodeId;
    const rehydrated = previous.nodes.map((n, i) => hydrateNode(n, i, outgoing, targetSelected));

    setNodes(rehydrated);
    setEdges(previous.edges);
    updateJourneyGraph(selectedJourney.id, previous.nodes, previous.edges);
    if (previous.selectedNodeId) {
      setSelectedNodeId(previous.selectedNodeId);
    }
    setTimeout(() => {
      isUndoingOrRedoingRef.current = false;
    }, 60);
  }, [selectedJourney, selectedNodeId, setEdges, setNodes, updateJourneyGraph, hydrateNode]);

  const handleRedo = useCallback(() => {
    if (!selectedJourney || futureStackRef.current.length === 0) return;
    const next = futureStackRef.current.pop();
    if (!next) return;

    const currentSnapshot = {
      nodes: nodesRef.current.map(stripNodeUiData),
      edges: edgesRef.current.map((e) => ({ ...e })),
      selectedNodeId,
    };
    pastStackRef.current.push(currentSnapshot);

    isUndoingOrRedoingRef.current = true;
    const outgoing = new Set(next.edges.map((e) => e.source));
    const targetSelected = next.selectedNodeId || selectedNodeId;
    const rehydrated = next.nodes.map((n, i) => hydrateNode(n, i, outgoing, targetSelected));

    setNodes(rehydrated);
    setEdges(next.edges);
    updateJourneyGraph(selectedJourney.id, next.nodes, next.edges);
    if (next.selectedNodeId) {
      setSelectedNodeId(next.selectedNodeId);
    }
    setTimeout(() => {
      isUndoingOrRedoingRef.current = false;
    }, 60);
  }, [selectedJourney, selectedNodeId, setEdges, setNodes, updateJourneyGraph, hydrateNode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || document.activeElement?.isContentEditable) {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && (e.key === "y" || e.key === "Y")) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    if (!activeMenuNodeId) return;
    const handleClickOutside = (e) => {
      if (e.target.closest(".menu-flyout") || e.target.closest(".add-step-trigger")) {
        return;
      }
      setActiveMenuNodeId(null);
    };
    window.addEventListener("pointerdown", handleClickOutside);
    return () => window.removeEventListener("pointerdown", handleClickOutside);
  }, [activeMenuNodeId]);

  const handleNodesChange = useCallback(
    (changes) => {
      if (changes.some((c) => c.type === "remove")) {
        saveHistorySnapshot();
      }
      onNodesChange(changes);
    },
    [onNodesChange, saveHistorySnapshot]
  );

  const handleEdgesChange = useCallback(
    (changes) => {
      if (changes.some((c) => c.type === "remove")) {
        saveHistorySnapshot();
      }
      onEdgesChange(changes);
    },
    [onEdgesChange, saveHistorySnapshot]
  );

  const hydratedNodes = useMemo(() => {
    const outgoing = new Set((selectedJourney?.edges || []).map((e) => e.source));
    return (selectedJourney?.nodes || []).map((node, index) =>
      hydrateNode(node, index, outgoing, selectedNodeId, activeMenuNodeId)
    );
  }, [selectedJourney?.id, selectedJourney?.nodes, selectedJourney?.edges, hydrateNode, selectedNodeId, activeMenuNodeId]);

  const [logs, setLogs] = useState([]);
  const [simulating, setSimulating] = useState(false);
  const [speed, setSpeed] = useState("1 day = 1 minute");
  const [sideTab, setSideTab] = useState("settings");
  const [canvasFullscreen, setCanvasFullscreen] = useState(false);

  useEffect(() => {
    setNodes(hydratedNodes);
    setEdges((selectedJourney?.edges || []).map((edge) => ({ ...edge, animated: selectedJourney?.status === "Active" })));
    setSelectedNodeId((current) => {
      if (current && (selectedJourney?.nodes || []).some((n) => n.id === current)) {
        return current;
      }
      return (hydratedNodes[0] || {}).id;
    });
  }, [hydratedNodes, selectedJourney?.id, selectedJourney?.status, setEdges, setNodes]);

  useEffect(() => {
    const outgoing = new Set(edges.map((edge) => edge.source));
    setNodes((current) =>
      current.map((node, index) =>
        hydrateNode(node, index, outgoing, selectedNodeId, activeMenuNodeId)
      )
    );
  }, [edges, selectedNodeId, activeMenuNodeId, hydrateNode, setNodes]);

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
    (params) => {
      saveHistorySnapshot();
      setEdges((eds) => addEdge({ ...params, type: "smoothstep", animated: selectedJourney?.status === "Active" }, eds));
    },
    [selectedJourney?.status, setEdges, saveHistorySnapshot]
  );
  const counts = selectedJourney ? data.journeyMembers.filter((jm) => jm.journeyId === selectedJourney.id) : [];

  const getCleanGraph = () => {
    return { nodes: nodes.map(stripNodeUiData), edges };
  };

  const saveGraph = () => {
    if (!selectedJourney) return;
    const cleanGraph = getCleanGraph();
    updateJourneyGraph(selectedJourney.id, cleanGraph.nodes, cleanGraph.edges);
  };

  const addStep = () => {
    setActiveMenuNodeId((curr) => (curr === "header" ? null : "header"));
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
          position: { x: 80, y: 300 },
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

  const eventNodes = nodes.filter((node) => node.type === "start" || node.type === "event");
  const actionNodes = nodes.filter((node) => node.type !== "start" && node.type !== "event");
  const eventCount = eventNodes.length;
  const stepCount = actionNodes.length;

  const canvas = (
    <div className={`panel relative overflow-hidden rounded-3xl bg-[#faf8f5] border border-coral-100 shadow-sm ${canvasFullscreen ? "h-full" : ""}`}>
      {/* Top Left Canvas Badge: Shows Event Counts & Steps */}
      <div className="absolute left-4 top-4 z-10 flex items-center gap-2 select-none pointer-events-none">
        <div className="flex items-center gap-2 rounded-2xl bg-white/95 px-3 py-1.5 shadow-soft border border-coral-200/80 backdrop-blur-md pointer-events-auto">
          <span className="flex items-center gap-1.5 rounded-xl bg-amber-50 px-2.5 py-1 text-xs font-black text-amber-700 border border-amber-200 shadow-2xs">
            <Zap size={13} className="text-amber-500 fill-amber-400" />
            {eventCount} {eventCount === 1 ? "Event" : "Events"}
          </span>
          <span className="text-[10px] font-bold text-slate-300">•</span>
          <span className="text-xs font-black text-slate-700 px-1">
            {stepCount} {stepCount === 1 ? "Step" : "Steps"}
          </span>
          {eventCount > 1 ? (
            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700 border border-emerald-200">
              Multi-Journey Active
            </span>
          ) : (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-500">
              Single Sequence
            </span>
          )}
        </div>
      </div>

      <ReactFlow
        key={`${selectedJourney?.id || "journey-list"}-${canvasFullscreen ? "full" : "normal"}`}
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={handleEdgesChange}
        onConnect={onConnect}
        onPaneClick={() => setActiveMenuNodeId(null)}
        nodeTypes={nodeTypes}
        onNodeClick={(_, node) => {
          setSelectedNodeId(node.id);
          setSideTab("settings");
        }}
        zoomOnScroll={true}
        panOnScroll={false}
        zoomOnPinch={true}
        defaultViewport={{ x: 50, y: 100, zoom: 0.8 }}
        minZoom={0.25}
        maxZoom={1.8}
        fitViewOptions={{ padding: 0.16 }}
        proOptions={{ hideAttribution: true }}
      >
        <CanvasToolbar
          canvasFullscreen={canvasFullscreen}
          setCanvasFullscreen={setCanvasFullscreen}
          onUndo={handleUndo}
          onRedo={handleRedo}
        />
        {/* n8n-Style Minimalist Dot Matrix Canvas */}
        <Background
          variant="dots"
          gap={20}
          size={1.2}
          color="rgba(148, 163, 184, 0.45)"
          bgColor="#faf8f5"
        />
        {/* Styled Visual Mini-Map */}
        <MiniMap
          pannable
          zoomable
          nodeStrokeWidth={3}
          nodeColor={(node) => {
            if (node.type === "start" || node.type === "event") return "#fbbf24";
            if (node.data?.template?.channel === "WhatsApp") return "#34d399";
            if (node.data?.template?.channel === "Email") return "#38bdf8";
            if (node.data?.template?.channel === "Call") return "#c084fc";
            if (node.data?.template?.channel === "Gift") return "#fb923c";
            return "#94a3b8";
          }}
          maskColor="rgba(250, 248, 245, 0.75)"
          className="shadow-md rounded-2xl overflow-hidden border border-coral-200/80 bg-white/95"
        />
        <Controls position="bottom-left" showInteractive={false} />
      </ReactFlow>
    </div>
  );

  const getJourneyAudience = (journeyId) => {
    switch (journeyId) {
      case "journey-member":
        return 6420;
      case "journey-cold-lead":
        return 18540;
      case "journey-renewal":
        return 3120;
      case "journey-discontinued":
        return 980;
      case "journey-graduate":
        return 2850;
      case "journey-franchise":
        return 380;
      default:
        return 500;
    }
  };

  function JourneyTractionWave({ journey, enrolledCount }) {
    const [hoverIndex, setHoverIndex] = useState(null);
    const containerRef = useRef(null);

    const nodes = journey.nodes || [];
    const stepCount = Math.max(nodes.length, 3);
    const total = enrolledCount || 1000;

    // Determine 1 or 2 spikes for this journey
    const { steps, spikeIndices } = useMemo(() => {
      let spikes = [];
      if (journey.id === "journey-member") {
        spikes = [
          { index: 1, ratio: 0.45 }, // Step 2 (Orientation & Welcome - Qatar/Metro)
          { index: 8, ratio: 0.28 }, // Step 9 (100-Day Milestone)
        ];
      } else if (journey.id === "journey-cold-lead") {
        spikes = [
          { index: 0, ratio: 0.65 }, // Step 1 (Trial Inquiry - Qatar)
          { index: 1, ratio: 0.22 }, // Step 2 (Curriculum brochure)
        ];
      } else if (journey.id === "journey-renewal") {
        spikes = [
          { index: 2, ratio: 0.72 }, // Step 3 (30-Day Critical Notice)
        ];
      } else if (journey.id === "journey-discontinued") {
        spikes = [
          { index: 1, ratio: 0.70 }, // Step 2 (Feedback Call)
        ];
      } else if (journey.id === "journey-graduate") {
        spikes = [
          { index: 0, ratio: 0.62 }, // Step 1 (Grad celebration)
          { index: 3, ratio: 0.24 }, // Step 4 (Alumni meetup)
        ];
      } else if (journey.id === "journey-franchise") {
        spikes = [
          { index: 0, ratio: 0.75 }, // Step 1 (Pitch deck)
        ];
      } else {
        if (stepCount >= 7) {
          spikes = [
            { index: 1, ratio: 0.50 },
            { index: Math.floor(stepCount / 2), ratio: 0.28 },
          ];
        } else {
          spikes = [{ index: 0, ratio: 0.68 }];
        }
      }

      const spikeSum = spikes.reduce((sum, s) => sum + s.ratio, 0);
      const remainingRatio = Math.max(0.04, 1 - spikeSum);
      const nonSpikeCount = Math.max(1, stepCount - spikes.length);
      const baselineRatio = remainingRatio / nonSpikeCount;

      const list = [];
      for (let i = 0; i < stepCount; i++) {
        const node = nodes[i];
        const spike = spikes.find((s) => s.index === i);
        const ratio = spike ? spike.ratio : baselineRatio;
        const count = Math.round(total * ratio);
        const label = node?.data?.label || (i === 0 ? "Start" : `Step ${i + 1}`);

        list.push({
          stepNumber: i + 1,
          label,
          count,
          pct: Math.round(ratio * 100),
          isSpike: Boolean(spike),
        });
      }
      return { steps: list, spikeIndices: spikes };
    }, [journey.id, nodes, stepCount, total]);

    const svgWidth = 280;
    const svgHeight = 36;
    const baselineY = 28;
    const maxSpikeHeight = 22;

    // Generate smooth curve with 1 or 2 narrow spikes and very flat baseline
    const { areaPath, linePath, stepCoords } = useMemo(() => {
      const padding = 12;
      const usableWidth = svgWidth - 2 * padding;

      // Coordinate for each step along the axis
      const coords = steps.map((s, i) => {
        const x = padding + (i / Math.max(1, stepCount - 1)) * usableWidth;
        return { ...s, x, stepIdx: i };
      });

      // Spike width sigma: tight bell curve so only spike step shoots up and rest is flat
      const stepGap = usableWidth / Math.max(1, stepCount - 1);
      const sigma = Math.max(7, stepGap * 0.48);
      const maxRatio = Math.max(...spikeIndices.map((s) => s.ratio), 0.5);

      const sampleCount = 90;
      const sampled = [];
      for (let j = 0; j <= sampleCount; j++) {
        const x = (j / sampleCount) * svgWidth;
        let peakOffset = 0;

        spikeIndices.forEach((spike) => {
          const spikeX = coords[spike.index]?.x ?? (padding + (spike.index / Math.max(1, stepCount - 1)) * usableWidth);
          const dist = x - spikeX;
          const gauss = Math.exp(-(dist * dist) / (2 * sigma * sigma));
          peakOffset += (spike.ratio / maxRatio) * maxSpikeHeight * gauss;
        });

        const y = Math.max(6, baselineY - peakOffset);
        sampled.push({ x, y });
      }

      let line = `M ${sampled[0].x.toFixed(1)} ${sampled[0].y.toFixed(1)}`;
      for (let j = 1; j < sampled.length; j++) {
        line += ` L ${sampled[j].x.toFixed(1)} ${sampled[j].y.toFixed(1)}`;
      }
      const area = `${line} L ${svgWidth} ${baselineY} L 0 ${baselineY} Z`;

      return { areaPath: area, linePath: line, stepCoords: coords };
    }, [steps, stepCount, spikeIndices]);

    const handleMouseMove = (e) => {
      if (!containerRef.current || !stepCoords.length) return;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const targetSvgX = (mouseX / rect.width) * svgWidth;

      let closestIdx = 0;
      let minDiff = 9999;
      stepCoords.forEach((s, idx) => {
        const diff = Math.abs(s.x - targetSvgX);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });
      setHoverIndex(closestIdx);
    };

    const activeStep = hoverIndex !== null ? stepCoords[hoverIndex] : null;
    const gradId = `subtle-grad-${journey.id}`;

    return (
      <div
        className="mt-3 border-t border-slate-100 pt-2 relative select-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle, understated header */}
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
          <span className="flex items-center gap-1.5">
            <Activity size={11} className="text-slate-400" />
            <span>Member Distribution</span>
          </span>
          <span className="text-[10px] font-semibold text-slate-400">
            {stepCount} Steps
          </span>
        </div>

        {/* Minimalist Traction Graph */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="relative mt-1.5 h-10 w-full cursor-pointer"
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.16" />
                <stop offset="70%" stopColor="#fb7185" stopOpacity="0.04" />
                <stop offset="100%" stopColor="#fb7185" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Baseline axis rule */}
            <line
              x1="0"
              y1={baselineY}
              x2={svgWidth}
              y2={baselineY}
              stroke="#e2e8f0"
              strokeWidth="1"
            />

            {/* Step tick markers on the baseline */}
            {stepCoords.map((s, idx) => {
              const isHovered = hoverIndex === idx;
              return (
                <line
                  key={`tick-${idx}`}
                  x1={s.x}
                  y1={baselineY - 2}
                  x2={s.x}
                  y2={baselineY + 3}
                  stroke={isHovered ? "#e11d48" : s.isSpike ? "#fda4af" : "#cbd5e1"}
                  strokeWidth={isHovered ? 1.5 : 1}
                />
              );
            })}

            {/* Faint subtle area fill */}
            {areaPath && <path d={areaPath} fill={`url(#${gradId})`} />}

            {/* Soft, non-aggressive curve line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#fda4af"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-colors hover:stroke-rose-400"
              />
            )}

            {/* Spike indicator dots */}
            {stepCoords.map((s, idx) => {
              if (!s.isSpike && hoverIndex !== idx) return null;
              return (
                <circle
                  key={`dot-${idx}`}
                  cx={s.x}
                  cy={s.isSpike ? 8 : baselineY}
                  r={hoverIndex === idx ? 3 : 2}
                  className={hoverIndex === idx ? "fill-rose-600" : "fill-rose-400"}
                />
              );
            })}
          </svg>

          {/* Interactive Tooltip & Scrubber Line on Hover */}
          {activeStep && (
            <>
              <div
                className="absolute top-0 bottom-1 w-[1px] bg-rose-400/80 pointer-events-none"
                style={{ left: `${(activeStep.x / svgWidth) * 100}%` }}
              />
              <div
                className="absolute h-2.5 w-2.5 -ml-[5px] -mt-[5px] rounded-full bg-white border-2 border-rose-600 shadow-xs pointer-events-none"
                style={{
                  left: `${(activeStep.x / svgWidth) * 100}%`,
                  top: activeStep.isSpike ? "22%" : "70%",
                }}
              />
              <div
                className="absolute bottom-full mb-1.5 -translate-x-1/2 rounded-lg bg-slate-900/90 text-white px-2.5 py-1 text-[11px] shadow-lg pointer-events-none z-30 whitespace-nowrap border border-slate-700/50"
                style={{
                  left: `${Math.max(16, Math.min(84, (activeStep.x / svgWidth) * 100))}%`,
                }}
              >
                <div className="font-bold text-slate-300">
                  Step {activeStep.stepNumber}: <span className="text-white font-extrabold">{activeStep.label}</span>
                </div>
                <div className="text-coral-300 font-black text-[10px] mt-0.5">
                  {activeStep.count.toLocaleString()} members ({activeStep.pct}%)
                  {activeStep.isSpike && <span className="ml-1 text-amber-300 font-extrabold">• High Traction</span>}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Axis markers equal to number of steps */}
        <div className="relative mt-1 h-3.5 w-full text-[9px] font-bold text-slate-400 select-none">
          {stepCount <= 7 ? (
            // Small step count: Label each step
            stepCoords.map((s, idx) => (
              <span
                key={idx}
                style={{ left: `${(s.x / svgWidth) * 100}%` }}
                className={`absolute -translate-x-1/2 ${
                  hoverIndex === idx
                    ? "text-rose-600 font-black"
                    : s.isSpike
                    ? "text-slate-600 font-extrabold"
                    : "text-slate-400"
                }`}
              >
                {s.stepNumber}
              </span>
            ))
          ) : (
            // Large step count (e.g. 18 steps): Show first, key milestones, and last
            <>
              <span
                style={{ left: `${(stepCoords[0].x / svgWidth) * 100}%` }}
                className="absolute -translate-x-1/2"
              >
                1
              </span>
              <span
                style={{ left: `${(stepCoords[Math.floor(stepCount / 2)].x / svgWidth) * 100}%` }}
                className="absolute -translate-x-1/2 text-slate-400"
              >
                {Math.floor(stepCount / 2) + 1}
              </span>
              <span
                style={{ left: `${(stepCoords[stepCount - 1].x / svgWidth) * 100}%` }}
                className="absolute -translate-x-1/2"
              >
                {stepCount}
              </span>
            </>
          )}
        </div>
      </div>
    );
  }

  if (!selectedJourney) {
    return (
      <div className="page">
        <PageHeader
          title="Autopilot Journeys"
          subtitle="Design, automate, and orchestrate parent lifecycles. Set rules once and let autopilot handle omnichannel execution."
          actions={<button className="btn btn-primary" onClick={createJourney}><Plus size={17} /> New Journey</button>}
        />
        <div className="grid grid-cols-3 gap-5">
          {data.journeys.map((journey) => (
            <div
              key={journey.id}
              role="button"
              tabIndex={0}
              onClick={() => setSelectedJourneyId(journey.id)}
              className="panel group rounded-3xl p-5 text-left transition hover:-translate-y-1 hover:ring-2 hover:ring-coral-300 hover:shadow-lg cursor-pointer"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="text-lg font-black text-slate-800">{journey.name}</div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-black ${journey.status === "Active" ? "bg-emerald-50 text-emerald-700" : journey.status === "Draft" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                  {journey.status}
                </span>
              </div>
              <div className="mt-1 text-xs font-bold text-slate-400">{journey.tag}</div>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-coral-50/80 p-3 border border-coral-100">
                  <div className="text-2xl font-black text-coral-600">
                    {getJourneyAudience(journey.id).toLocaleString()}
                  </div>
                  <div className="text-[11px] font-extrabold text-slate-500">enrolled base</div>
                </div>
                <div className="rounded-2xl bg-sky-50/80 p-3 border border-sky-100">
                  <div className="text-2xl font-black text-sky-700">{journey.nodes?.length || 0}</div>
                  <div className="text-[11px] font-extrabold text-slate-500">journey steps</div>
                </div>
              </div>

              {/* YouTube-Style Member Traction Wave */}
              <JourneyTractionWave
                journey={journey}
                enrolledCount={getJourneyAudience(journey.id)}
              />

              <div className="mt-4 flex items-center justify-between text-xs font-bold text-slate-400 border-t border-slate-100 pt-3">
                <span>Updated {journey.modifiedAt}</span>
                <span className="text-coral-600 font-extrabold group-hover:underline">Open Visual Canvas →</span>
              </div>
            </div>
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
            <div className="relative">
              <button
                className={`add-step-trigger btn btn-ghost ${activeMenuNodeId === "header" ? "bg-coral-100/80 text-coral-600 ring-2 ring-coral-300" : ""}`}
                onClick={addStep}
              >
                <Plus size={17} /> Step
              </button>
              {activeMenuNodeId === "header" && (
                <div
                  className="menu-flyout nowheel nodrag absolute right-0 top-full mt-2 w-80 max-h-[460px] overflow-y-auto overscroll-contain rounded-2xl border border-coral-100 bg-white shadow-2xl p-2.5 select-none z-50 text-left animate-in fade-in zoom-in-95 duration-100 cursor-default"
                  onClick={(e) => e.stopPropagation()}
                  onWheel={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-2 pb-2 mb-1 border-b border-slate-100">
                    <span className="text-xs font-black text-slate-800">Add to Journey</span>
                    <button
                      type="button"
                      onClick={() => setActiveMenuNodeId(null)}
                      className="grid h-5 w-5 place-items-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <X size={13} />
                    </button>
                  </div>
                  <div className="space-y-1">
                    {STEP_OPTIONS.map((opt) => (
                      <button
                        key={opt.title}
                        type="button"
                        onClick={() => handleSelectStepOption(null, opt)}
                        className="group flex items-start gap-2.5 w-full rounded-xl p-2 transition text-left hover:bg-coral-50/60 hover:ring-1 hover:ring-coral-200"
                      >
                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl border ${opt.tone} shadow-2xs group-hover:scale-105 transition`}>
                          <opt.icon size={15} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-black text-slate-800 group-hover:text-coral-600 transition truncate">
                              {opt.title}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
                              {opt.badge}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 leading-snug mt-0.5 line-clamp-2">
                            {opt.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button className="btn btn-ghost" onClick={saveGraph}><Save size={17} /> Save</button>
            <button
              className="btn btn-primary"
              onClick={() => {
                const nextStatus = selectedJourney.status === "Active" ? "Paused" : "Active";
                setEdges((current) => current.map((edge) => ({ ...edge, animated: nextStatus === "Active" })));
                const cleanGraph = getCleanGraph();
                updateJourney(selectedJourney.id, { status: nextStatus, nodes: cleanGraph.nodes, edges: cleanGraph.edges });
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

      <div className="grid h-[calc(100vh-210px)] min-h-[640px] grid-cols-[minmax(0,1fr)_360px] gap-4">
        {!canvasFullscreen && canvas}

        <aside className="nowheel panel flex min-h-0 flex-col overflow-hidden rounded-3xl" onWheel={(e) => e.stopPropagation()}>
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
                events={data.events}
                templates={data.templates}
                segments={data.segments}
                members={data.members}
                addTemplate={addTemplate}
                updateTemplate={updateTemplate}
                onChange={(patch) => {
                  saveHistorySnapshot();
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

function CanvasToolbar({ canvasFullscreen, setCanvasFullscreen, onUndo, onRedo }) {
  const { fitView } = useReactFlow();

  return (
    <div className="absolute right-4 top-4 z-10 flex items-center gap-2">
      <button
        className="btn btn-ghost !h-9 !px-2.5 text-xs font-black bg-white/95 shadow-xs border border-coral-100 hover:bg-coral-50 flex items-center gap-1.5"
        title="Undo action (Ctrl+Z)"
        onClick={onUndo}
      >
        <Undo2 size={14} /> Undo
      </button>
      <button
        className="btn btn-ghost !h-9 !px-2.5 text-xs font-black bg-white/95 shadow-xs border border-coral-100 hover:bg-coral-50 flex items-center gap-1.5"
        title="Redo action (Ctrl+Y or Ctrl+Shift+Z)"
        onClick={onRedo}
      >
        <Redo2 size={14} /> Redo
      </button>
      <button
        className="btn btn-ghost !h-9 !px-3 text-xs font-black bg-white/95 shadow-xs border border-coral-100 hover:bg-coral-50"
        title="Fit entire timeline on screen"
        onClick={() => fitView({ duration: 320, padding: 0.16 })}
      >
        <Scan size={14} /> Fit Timeline
      </button>
      <button
        className="btn btn-ghost !h-9 !w-9 !p-0 bg-white/95 shadow-xs border border-coral-100 hover:bg-coral-50"
        title={canvasFullscreen ? "Exit fullscreen" : "Fullscreen canvas"}
        onClick={() => setCanvasFullscreen((value) => !value)}
      >
        {canvasFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
      </button>
    </div>
  );
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

function NodePanel({ node, events, templates, segments, members, addTemplate, updateTemplate, onChange }) {
  const [nodeSubTab, setNodeSubTab] = useState("timing"); // "timing" | "content"

  if (!node) return <div className="p-4 text-xs font-bold text-slate-400">Select a node on the canvas</div>;
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
      content:
        channel === "Call" || channel === "Gift"
          ? "Add instructions for the counsellor/stakeholder."
          : "Hi {{parent_name}}, welcome to Tickle Right! We are excited to guide {{child_name}}.",
      stakeholderNotes: "",
      image: "",
    };
    addTemplate(template);
    onChange({ templateId: id, label: template.name });
  };

  return (
    <div className="space-y-4">
      {/* Sub-tab Navigation */}
      {isTemplateNode && (
        <div className="flex items-center rounded-xl bg-slate-100 p-1 text-xs font-black">
          <button
            type="button"
            onClick={() => setNodeSubTab("timing")}
            className={`flex-1 rounded-lg py-1.5 px-2 transition ${
              nodeSubTab === "timing"
                ? "bg-white text-coral-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            ⚙️ Timing & Safety
          </button>
          <button
            type="button"
            onClick={() => setNodeSubTab("content")}
            className={`flex-1 rounded-lg py-1.5 px-2 transition ${
              nodeSubTab === "content"
                ? "bg-white text-coral-600 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            📱 Copy & Preview
          </button>
        </div>
      )}

      {/* TAB 1: Timing & Autopilot Settings */}
      {(nodeSubTab === "timing" || !isTemplateNode) && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="text-base font-black text-slate-800">Node Properties</div>
                <div className="text-xs font-bold text-slate-400 capitalize">{node.type} step</div>
              </div>
              {node.data.reference && (
                <span className="rounded-lg bg-slate-100 px-2 py-0.5 text-xs font-black text-slate-700">
                  {node.data.reference}+{node.data.offset || 0}
                </span>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-black uppercase text-slate-500">
                Step Label
                <input
                  className="field mt-1 text-xs font-bold"
                  value={node.data.label || ""}
                  onChange={(event) => onChange({ label: event.target.value })}
                />
              </label>

              {node.type === "start" || node.type === "event" ? (
                <>
                  <label className="block text-xs font-black uppercase text-slate-500">
                    Trigger Type
                    <select
                      className="field mt-1 text-xs font-bold"
                      value={node.data.triggerKind || "Event-based"}
                      onChange={(event) => onChange({ triggerKind: event.target.value })}
                    >
                      <option>Event-based</option>
                      <option>Time-based</option>
                    </select>
                  </label>
                  <label className="block text-xs font-black uppercase text-slate-500">
                    Trigger Event
                    <select
                      className="field mt-1 text-xs font-bold"
                      value={node.data.triggerEvent || ""}
                      onChange={(e) => {
                        const selectedEvName = e.target.value;
                        const evObj = events?.find((item) => item.name === selectedEvName);
                        onChange({
                          triggerEvent: selectedEvName,
                          label: selectedEvName,
                          reference: evObj?.reference || node.data.reference || "M",
                          audienceSegmentId: evObj?.segmentId || node.data.audienceSegmentId,
                        });
                      }}
                    >
                      {(events && events.length > 0
                        ? events
                        : [
                            { id: "e1", name: "Member Joined the Program", reference: "M" },
                            { id: "e2", name: "New Trial Inquiry", reference: "L" },
                            { id: "e3", name: "Renewal Due (30 Days Out)", reference: "R" },
                            { id: "e4", name: "Member Discontinued", reference: "D" },
                            { id: "e5", name: "Program Graduation / Alumni", reference: "G" },
                          ]
                      ).map((ev) => (
                        <option key={ev.id} value={ev.name}>
                          {ev.reference ? `[${ev.reference}] ` : ""}
                          {ev.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  {/* Database Source Field Helper */}
                  {(() => {
                    const selectedEv = events?.find(
                      (item) => item.name === (node.data.triggerEvent || "Member Joined the Program")
                    );
                    if (!selectedEv) return null;
                    return (
                      <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] border border-slate-100">
                        <div className="flex items-center justify-between text-slate-500">
                          <span className="text-[10px] uppercase font-black text-slate-400">
                            DB Source:
                          </span>
                          <span className="font-mono text-coral-600 font-bold">
                            {selectedEv.dbField}
                          </span>
                        </div>
                        <div className="mt-1 text-[10px] text-slate-400 font-semibold">
                          Trigger: {selectedEv.triggerType}
                        </div>
                      </div>
                    );
                  })()}
                  <label className="block text-xs font-black uppercase text-slate-500">
                    Audience Segment
                    <select
                      className="field mt-1 text-xs font-bold"
                      value={node.data.audienceSegmentId || ""}
                      onChange={(event) => onChange({ audienceSegmentId: event.target.value })}
                    >
                      {segments.map((segment) => (
                        <option key={segment.id} value={segment.id}>
                          {segment.name} ({segment.count.toLocaleString()})
                        </option>
                      ))}
                    </select>
                  </label>
                </>
              ) : node.type !== "route" && node.type !== "end" ? (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <label className="block text-xs font-black uppercase text-slate-500">
                      Offset
                      <input
                        className="field mt-1 text-xs font-bold"
                        type="number"
                        value={node.data.offset ?? 0}
                        onChange={(event) => onChange({ offset: Number(event.target.value) })}
                      />
                    </label>
                    <label className="block text-xs font-black uppercase text-slate-500">
                      Unit
                      <select
                        className="field mt-1 text-xs font-bold"
                        value={node.data.unit || "Days"}
                        onChange={(event) => onChange({ unit: event.target.value })}
                      >
                        <option>Days</option>
                        <option>Weeks</option>
                        <option>Months</option>
                      </select>
                    </label>
                  </div>
                </>
              ) : (
                <label className="block text-xs font-black uppercase text-slate-500">
                  Routing Logic
                  <textarea
                    className="field mt-1 min-h-20 text-xs"
                    value={node.data.condition || node.data.description || ""}
                    onChange={(event) =>
                      onChange(
                        node.type === "route"
                          ? { condition: event.target.value }
                          : { description: event.target.value }
                      )
                    }
                  />
                </label>
              )}
            </div>
          </div>

          {/* Autopilot Guardrails */}
          {node.type !== "start" && node.type !== "end" && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 shadow-sm">
              <div className="mb-2.5 flex items-center justify-between">
                <span className="text-xs font-black text-amber-900">Autopilot Guardrails</span>
                <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-black text-amber-800">
                  Auto-Enforced
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { key: "avoidSundays", label: "☀️ Avoid Sundays", desc: "Rolls forward to Monday morning" },
                  { key: "checkFestivalCalendar", label: "📅 Festive Guard", desc: "Holds during national holidays" },
                  { key: "checkContentCalendar", label: "📋 Content Guard", desc: "Prevents duplicate touches" },
                ].map(({ key, label, desc }) => (
                  <label
                    key={key}
                    className="flex items-start gap-2.5 cursor-pointer rounded-xl bg-white p-2.5 border border-amber-100/80 shadow-xs"
                  >
                    <input
                      type="checkbox"
                      className="mt-0.5 accent-coral-500"
                      checked={Boolean(node.data[key])}
                      onChange={(event) => onChange({ [key]: event.target.checked })}
                    />
                    <div>
                      <div className="text-xs font-extrabold text-slate-800">{label}</div>
                      <div className="text-[10px] text-slate-500 font-semibold">{desc}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* TAB 2: Message Copy & In-Context Preview */}
      {nodeSubTab === "content" && isTemplateNode && (
        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="text-base font-black text-slate-800">Blueprint Copy</span>
              <button
                type="button"
                className="btn btn-ghost !px-2 !py-1 text-xs text-coral-600"
                onClick={createAndAttachTemplate}
              >
                <Plus size={13} /> New
              </button>
            </div>

            <label className="block text-xs font-black uppercase text-slate-500 mb-3">
              Attached Template
              <select
                className="field mt-1 text-xs font-bold"
                value={node.data.templateId || ""}
                onChange={(event) => onChange({ templateId: event.target.value })}
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} ({template.channel})
                  </option>
                ))}
              </select>
            </label>

            {selectedTemplate && (
              <div className="space-y-3 border-t border-slate-100 pt-3">
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-xs font-black uppercase text-slate-500">
                    Channel
                    <select
                      className="field mt-1 text-xs font-bold"
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
                    <label className="block text-xs font-black uppercase text-slate-500">
                      Content Type
                      <select
                        className="field mt-1 text-xs font-bold"
                        value={selectedTemplate.contentType}
                        onChange={(event) =>
                          updateTemplate(selectedTemplate.id, { contentType: event.target.value })
                        }
                      >
                        <option>Text only</option>
                        <option>Image + Text</option>
                      </select>
                    </label>
                  )}
                </div>

                <label className="block text-xs font-black uppercase text-slate-500">
                  {isHumanTemplate ? "SOP Script" : "Message Body"}
                  <textarea
                    className="field mt-1 min-h-24 text-xs font-medium leading-relaxed"
                    value={selectedTemplate.content || ""}
                    onChange={(event) => updateTemplate(selectedTemplate.id, { content: event.target.value })}
                  />
                </label>

                {isHumanTemplate && (
                  <label className="block text-xs font-black uppercase text-slate-500">
                    Counsellor SOP Notes
                    <textarea
                      className="field mt-1 min-h-16 text-xs"
                      value={selectedTemplate.stakeholderNotes || ""}
                      onChange={(event) =>
                        updateTemplate(selectedTemplate.id, { stakeholderNotes: event.target.value })
                      }
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          {/* In-Context Channel Simulation Card */}
          {selectedTemplate && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                  Customer Simulation
                </span>
                <ChannelBadge channel={selectedTemplate.channel} />
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                {selectedTemplate.image && (
                  <div className="mb-2 flex items-center gap-1.5 rounded-lg bg-coral-50 p-1.5 text-xs font-bold text-coral-600">
                    <Image size={13} /> {selectedTemplate.image}
                  </div>
                )}
                <div className="text-xs font-semibold leading-relaxed text-slate-700 whitespace-pre-line">
                  {renderHighlightedMessage(selectedTemplate.content)}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
