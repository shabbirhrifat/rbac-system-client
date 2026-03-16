import Link from "next/link";
import { Download } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { formatCompactNumber, sentenceCase } from "@/lib/format";
import { getLeadsReport, getReportsOverview, getTasksReport, getUsersReport } from "@/lib/data";

type ReportsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const filters = await searchParams;
  const [overview, usersReport, leadsReport, tasksReport] = await Promise.all([
    getReportsOverview(filters),
    getUsersReport(filters),
    getLeadsReport(filters),
    getTasksReport(filters),
  ]);

  const totalUsers = usersReport.usersByStatus.reduce((sum, item) => sum + item._count._all, 0);
  const totalLeads = leadsReport.leadsByStatus.reduce((sum, item) => sum + item._count._all, 0);
  const totalTasks = tasksReport.tasksByStatus.reduce((sum, item) => sum + item._count._all, 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Reports"
        title="Cross-module reporting"
        description="Review grouped user, lead, and task metrics inside your allowed scope, then export the overview as CSV."
        badge="Aggregated analytics"
        actions={
          <Link href="/api/reports/export" className="w-full sm:w-auto">
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              <Download className="size-4" />
              Download CSV
            </Button>
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Users" value={formatCompactNumber(totalUsers)} detail="Grouped by role and status." />
        <MetricCard label="Leads" value={formatCompactNumber(totalLeads)} detail="Grouped by status and assignee." />
        <MetricCard label="Tasks" value={formatCompactNumber(totalTasks)} detail="Grouped by status and priority." />
        <MetricCard label="Overdue tasks" value={formatCompactNumber(tasksReport.overdueTasks)} detail="Tasks past due date in current scope." />
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-panel gap-5 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Users overview</h2>
          <DataTable rows={overview.usersByStatus} getRowKey={(row, index) => `users-${row.status}-${index}`} columns={[{ header: "Status", render: (row) => sentenceCase(row.status) }, { header: "Count", render: (row) => row._count._all }]} />
        </div>
        <div className="surface-panel gap-5 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Leads overview</h2>
          <DataTable rows={overview.leadsByStatus} getRowKey={(row, index) => `leads-${row.status}-${index}`} columns={[{ header: "Status", render: (row) => sentenceCase(row.status) }, { header: "Count", render: (row) => row._count._all }]} />
        </div>
        <div className="surface-panel gap-5 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Tasks overview</h2>
          <DataTable rows={overview.tasksByStatus} getRowKey={(row, index) => `tasks-${row.status}-${index}`} columns={[{ header: "Status", render: (row) => sentenceCase(row.status) }, { header: "Count", render: (row) => row._count._all }]} />
        </div>
        <div className="surface-panel gap-5 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Task priorities</h2>
          <DataTable rows={tasksReport.tasksByPriority} getRowKey={(row, index) => `priority-${row.priority}-${index}`} columns={[{ header: "Priority", render: (row) => sentenceCase(row.priority) }, { header: "Count", render: (row) => row._count._all }]} />
        </div>
      </div>
    </div>
  );
}
