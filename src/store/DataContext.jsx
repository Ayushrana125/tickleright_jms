import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { computeSegmentMembers, initialData } from "../data/mockData";

const STORAGE_KEY = "tickle-right-jms-data-v10";
const DataContext = createContext(null);

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : initialData;
    if (!parsed?.members || !parsed?.segments || !parsed?.templates || !parsed?.journeys) {
      return initialData;
    }
    // Always ensure all seed journeys from initialData are present and up to date
    const savedJourneys = parsed.journeys || [];
    const mergedJourneys = initialData.journeys.map((seedJourney) => {
      const found = savedJourneys.find((j) => j.id === seedJourney.id);
      if (!found || !found.nodes?.length) return seedJourney;
      return {
        ...seedJourney,
        name: seedJourney.name,
        tag: seedJourney.tag,
        nodes: seedJourney.nodes,
        edges: seedJourney.edges,
        status: found.status || seedJourney.status,
      };
    });
    return {
      ...parsed,
      events: parsed.events || initialData.events,
      members: initialData.members,
      segments: initialData.segments,
      templates: initialData.templates,
      actionTasks: initialData.actionTasks,
      journeys: mergedJourneys,
    };
  } catch {
    return initialData;
  }
};

export function DataProvider({ children }) {
  const [data, setData] = useState(loadData);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const actions = useMemo(
    () => ({
      updateJourney(journeyId, patch) {
        setData((current) => ({
          ...current,
          journeys: current.journeys.map((journey) =>
            journey.id === journeyId
              ? { ...journey, ...patch, modifiedAt: new Date().toISOString().slice(0, 10) }
              : journey
          ),
        }));
      },
      updateJourneyNode(journeyId, nodeId, nodeData) {
        setData((current) => ({
          ...current,
          journeys: current.journeys.map((journey) =>
            journey.id === journeyId
              ? {
                  ...journey,
                  modifiedAt: new Date().toISOString().slice(0, 10),
                  nodes: journey.nodes.map((node) =>
                    node.id === nodeId ? { ...node, data: { ...node.data, ...nodeData } } : node
                  ),
                }
              : journey
          ),
        }));
      },
      updateJourneyGraph(journeyId, nodes, edges) {
        setData((current) => ({
          ...current,
          journeys: current.journeys.map((journey) =>
            journey.id === journeyId
              ? { ...journey, nodes, edges, modifiedAt: new Date().toISOString().slice(0, 10) }
              : journey
          ),
        }));
      },
      addJourney(journey) {
        setData((current) => ({
          ...current,
          journeys: [
            {
              ...journey,
              modifiedAt: new Date().toISOString().slice(0, 10),
              baselineCompletion: 65,
            },
            ...current.journeys,
          ],
        }));
      },
      addTemplate(template) {
        setData((current) => ({
          ...current,
          templates: [
            {
              ...template,
              id: template.id || `tpl-${Date.now()}`,
              variables: [...template.content.matchAll(/{{(.*?)}}/g)].map((match) => match[1]),
              lastEdited: new Date().toISOString().slice(0, 10),
            },
            ...current.templates,
          ],
        }));
      },
      updateTemplate(templateId, patch) {
        setData((current) => ({
          ...current,
          templates: current.templates.map((template) =>
            template.id === templateId
              ? {
                  ...template,
                  ...patch,
                  variables:
                    patch.content !== undefined
                      ? [...patch.content.matchAll(/{{(.*?)}}/g)].map((match) => match[1])
                      : template.variables,
                  lastEdited: new Date().toISOString().slice(0, 10),
                }
              : template
          ),
        }));
      },
      addSegment(segment) {
        setData((current) => {
          const count = computeSegmentMembers(current.members, segment.criteria).length;
          return {
            ...current,
            segments: [{ ...segment, id: `seg-${Date.now()}`, count }, ...current.segments],
          };
        });
      },
      addExclusion(exclusion) {
        setData((current) => ({
          ...current,
          exclusions: [
            { ...exclusion, id: `ex-${Date.now()}`, createdAt: new Date().toISOString().slice(0, 10) },
            ...current.exclusions,
          ],
        }));
      },
      removeExclusion(exclusionId) {
        setData((current) => ({
          ...current,
          exclusions: current.exclusions.filter((item) => item.id !== exclusionId),
        }));
      },
      removeSegment(segmentId) {
        setData((current) => ({
          ...current,
          segments: current.segments.filter((item) => item.id !== segmentId),
        }));
      },
      updateSegment(segmentId, patch) {
        setData((current) => ({
          ...current,
          segments: current.segments.map((segment) =>
            segment.id === segmentId
              ? {
                  ...segment,
                  ...patch,
                  count: patch.criteria
                    ? Math.round(computeSegmentMembers(current.members, patch.criteria).length * (6420 / current.members.length))
                    : segment.count,
                }
              : segment
          ),
        }));
      },
      deleteTemplate(templateId) {
        setData((current) => ({
          ...current,
          templates: current.templates.filter((item) => item.id !== templateId),
        }));
      },
      updateTask(taskId, patch) {
        setData((current) => ({
          ...current,
          actionTasks: current.actionTasks.map((task) =>
            task.id === taskId ? { ...task, ...patch } : task
          ),
        }));
      },
      addEvent(event) {
        setData((current) => ({
          ...current,
          events: [
            {
              ...event,
              id: event.id || `ev-${Date.now()}`,
              linkedJourneys: event.linkedJourneys || [],
              status: "Active",
            },
            ...current.events,
          ],
        }));
      },
      updateEvent(eventId, patch) {
        setData((current) => ({
          ...current,
          events: current.events.map((ev) =>
            ev.id === eventId ? { ...ev, ...patch } : ev
          ),
        }));
      },
      deleteEvent(eventId) {
        setData((current) => ({
          ...current,
          events: current.events.filter((ev) => ev.id !== eventId),
        }));
      },
    }),
    []
  );

  const value = useMemo(() => ({ data, ...actions }), [data, actions]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
