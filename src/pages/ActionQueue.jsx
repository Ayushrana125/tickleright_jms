import PageHeader from "../components/PageHeader.jsx";
import { useData } from "../store/DataContext.jsx";

export default function ActionQueue() {
  const { data, updateTask } = useData();
  const pendingCount = data.actionTasks.filter((task) => task.status !== "Completed").length;

  return (
    <div className="page">
      <PageHeader
        title="Action Queue"
        subtitle="Human-executed Call and Gift steps assigned to the current stakeholder."
      />
      <div className="mb-5 grid grid-cols-3 gap-4">
        <div className="panel rounded-2xl p-5">
          <div className="text-sm font-extrabold text-slate-500">Pending Tasks</div>
          <div className="mt-2 text-4xl font-black text-coral-600">{pendingCount}</div>
        </div>
        <div className="panel rounded-2xl p-5">
          <div className="text-sm font-extrabold text-slate-500">Completed</div>
          <div className="mt-2 text-4xl font-black text-green-600">
            {data.actionTasks.filter((task) => task.status === "Completed").length}
          </div>
        </div>
        <div className="panel rounded-2xl p-5">
          <div className="text-sm font-extrabold text-slate-500">Logged-in Stakeholder</div>
          <div className="mt-2 text-xl font-black">Aarav Mehta</div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {data.actionTasks.map((task) => {
          const member = data.members.find((item) => item.id === task.memberId);
          const journey = data.journeys.find((item) => item.id === task.journeyId);
          const step = journey?.nodes.find((node) => node.id === task.stepId);
          return (
            <div key={task.id} className="panel rounded-2xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-black">{member?.childName} {member?.name}</div>
                  <div className="text-sm font-bold text-slate-500">{journey?.name} - {step?.data.label}</div>
                </div>
                <span className="rounded-full bg-orange-50 px-2 py-1 text-xs font-extrabold text-orange-700">{task.status}</span>
              </div>
              <div className="mt-3 text-sm font-bold text-slate-600">{task.dueContext}</div>
              <textarea
                className="field mt-3 min-h-24"
                placeholder="End-of-day outcome"
                value={task.comment}
                onChange={(event) => updateTask(task.id, { comment: event.target.value })}
              />
              <button className="btn btn-primary mt-3 w-full" onClick={() => updateTask(task.id, { status: "Completed" })}>
                Mark Completed
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
