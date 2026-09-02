import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { computeSegmentMembers, initialData } from "../data/mockData";

const STORAGE_KEY = "tickle-right-jms-data-v1";
const DataContext = createContext(null);

const loadData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : initialData;
    if (!parsed?.members || !parsed?.segments || !parsed?.templates || !parsed?.journeys) {
      return initialData;
    }
    let upgraded = parsed;
    if (parsed.members.length < initialData.members.length) {
      upgraded = {
        ...parsed,
        members: initialData.members,
        segments: parsed.segments.map((segment) => {
          const seeded = initialData.segments.find((item) => item.id === segment.id);
          return seeded ? { ...segment, count: seeded.count } : segment;
        }),
      };
    }
    upgraded = {
      ...upgraded,
      actionTasks:
        upgraded.actionTasks.length < initialData.actionTasks.length
          ? initialData.actionTasks
          : upgraded.actionTasks,
      journeys: upgraded.journeys.map((journey) =>
        journey.id === "journey-member"
          ? {
              ...journey,
              nodes: initialData.journeys[0].nodes,
              edges: initialData.journeys[0].edges,
            }
          : journey
      ),
    };
    const existingJourneyIds = new Set(upgraded.journeys.map((journey) => journey.id));
    const missingSeedJourneys = initialData.journeys.filter((journey) => !existingJourneyIds.has(journey.id));
    if (missingSeedJourneys.length) {
      upgraded = { ...upgraded, journeys: [...upgraded.journeys, ...missingSeedJourneys] };
    }
    return upgraded;
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
      updateTask(taskId, patch) {
        setData((current) => ({
          ...current,
          actionTasks: current.actionTasks.map((task) =>
            task.id === taskId ? { ...task, ...patch } : task
          ),
        }));
      },
    }),
    []
  );

  const value = useMemo(() => ({ data, ...actions }), [data, actions]);
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
