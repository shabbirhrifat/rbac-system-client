import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { FormSection } from "@/components/forms/form-section";
import { TaskCreateForm } from "@/components/forms/task-create-form";
import { getLeads, getTasks, getUsers, listPageMeta } from "@/lib/data";
import { formatDate } from "@/lib/format";

type TasksPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TasksPage({ searchParams }: TasksPageProps) {
  const filters = await searchParams;
  const [tasks, users, leads] = await Promise.all([getTasks(filters), getUsers(), getLeads({ limit: "100" })]);
  const customers = users.items.filter((user) => user.role.key === "customer");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Tasks"
        title="Coordinate work items"
        description="Manage assigned tasks with due dates, linked leads or customers, and status progression."
        badge={listPageMeta(tasks)}
      />

      <div className="surface-panel gap-6 p-6">
        <DataTable
          rows={tasks.items}
          columns={[
            {
              header: "Task",
              render: (task) => (
                <div className="space-y-1">
                  <Link href={`/tasks/${task.id}`} className="font-medium text-neutral-900 hover:text-brand-600">{task.title}</Link>
                  <p className="text-xs text-neutral-500">{task.description ?? "No description"}</p>
                </div>
              ),
            },
            { header: "Status", render: (task) => <StatusBadge value={task.status} /> },
            { header: "Priority", render: (task) => <StatusBadge value={task.priority} /> },
            { header: "Assignee", render: (task) => task.assignedToUser ? `${task.assignedToUser.firstName} ${task.assignedToUser.lastName}` : "Unassigned" },
            { header: "Due", render: (task) => formatDate(task.dueAt) },
          ]}
        />
      </div>

      <FormSection title="Create task" description="Create scoped work items and attach them to leads or customers when relevant.">
        <TaskCreateForm users={users.items} leads={leads.items} customers={customers} />
      </FormSection>
    </div>
  );
}
