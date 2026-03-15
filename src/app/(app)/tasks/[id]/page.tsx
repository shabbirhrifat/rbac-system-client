import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { FormSection } from "@/components/forms/form-section";
import { TaskEditForm } from "@/components/forms/task-edit-form";
import { getLeads, getTask, getUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";

type TaskDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function TaskDetailPage({ params }: TaskDetailPageProps) {
  const { id } = await params;
  const [task, users, leads] = await Promise.all([getTask(id), getUsers(), getLeads({ limit: "100" })]);
  const customers = users.items.filter((user) => user.role.key === "customer");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Task detail"
        title={task.title}
        description="Edit content, reassign ownership, and move the task through completion states."
        badge={task.assignedToUser ? `${task.assignedToUser.firstName} ${task.assignedToUser.lastName}` : "Unassigned"}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-panel gap-2 p-5"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Status</p><StatusBadge value={task.status} /></div>
        <div className="surface-panel gap-2 p-5"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Priority</p><StatusBadge value={task.priority} /></div>
        <div className="surface-panel gap-2 p-5"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Due at</p><p className="text-base font-semibold text-neutral-900">{formatDate(task.dueAt)}</p></div>
        <div className="surface-panel gap-2 p-5"><p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Completed</p><p className="text-base font-semibold text-neutral-900">{formatDate(task.completedAt)}</p></div>
      </div>

      <FormSection title="Task controls" description="Status and assignment are audited and permission-guarded by the backend.">
        <TaskEditForm task={task} users={users.items} leads={leads.items} customers={customers} />
      </FormSection>
    </div>
  );
}
