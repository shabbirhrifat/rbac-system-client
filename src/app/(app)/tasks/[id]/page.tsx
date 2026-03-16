import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { FormSection } from "@/components/forms/form-section";
import { CreateFormSheet } from "@/components/forms/create-form-sheet";
import { TaskEditForm } from "@/components/forms/task-edit-form";
import { getLeads, getTask, getUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getCurrentUser } from "@/lib/server-api";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const me = await getCurrentUser();
  const canEditTask = me.permissions.actions.includes("tasks.update");
  const canChangeStatus = me.permissions.actions.includes(
    "tasks.change_status",
  );
  const canAssignTask = me.permissions.actions.includes("tasks.assign");
  const canReadUsers = me.permissions.actions.includes("users.read");
  const canReadLeads = me.permissions.actions.includes("leads.read");

  const emptyUsers = {
    items: [],
    meta: { page: 1, limit: 0, total: 0, totalPages: 1 },
  };
  const emptyLeads = {
    items: [],
    meta: { page: 1, limit: 0, total: 0, totalPages: 1 },
  };

  const [task, users, leads] = await Promise.all([
    getTask(id),
    canAssignTask && canReadUsers ? getUsers() : Promise.resolve(emptyUsers),
    canEditTask && canReadLeads
      ? getLeads({ limit: "100" })
      : Promise.resolve(emptyLeads),
  ]);
  const customers = users.items.filter((user) => user.role.key === "customer");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Task detail"
        title={task.title}
        description="Edit content, reassign ownership, and move the task through completion states."
        badge={
          task.assignedToUser
            ? `${task.assignedToUser.firstName} ${task.assignedToUser.lastName}`
            : "Unassigned"
        }
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-panel gap-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Status
          </p>
          <StatusBadge value={task.status} />
        </div>
        <div className="surface-panel gap-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Priority
          </p>
          <StatusBadge value={task.priority} />
        </div>
        <div className="surface-panel gap-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Due at
          </p>
          <p className="text-base font-semibold text-neutral-900">
            {formatDate(task.dueAt)}
          </p>
        </div>
        <div className="surface-panel gap-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Completed
          </p>
          <p className="text-base font-semibold text-neutral-900">
            {formatDate(task.completedAt)}
          </p>
        </div>
      </div>

      {canEditTask || canChangeStatus || canAssignTask ? (
        <FormSection
          title="Task controls"
          description="Status and assignment are audited and permission-guarded by the backend."
          actions={
            <CreateFormSheet
              triggerLabel="Open controls"
              title="Task controls"
              description="Edit task details, reassignment, and status changes in a wider right-side panel."
            >
              <TaskEditForm
                task={task}
                users={users.items}
                leads={leads.items}
                customers={customers}
                canEditTask={canEditTask}
                canChangeStatus={canChangeStatus}
                canAssignTask={canAssignTask}
              />
            </CreateFormSheet>
          }
        >
        </FormSection>
      ) : null}
    </div>
  );
}
