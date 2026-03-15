import Link from "next/link";
import { Download } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
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
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Users" value={formatCompactNumber(totalUsers)} detail="Grouped by role and status." />
        <MetricCard label="Leads" value={formatCompactNumber(totalLeads)} detail="Grouped by status and assignee." />
        <MetricCard label="Tasks" value={formatCompactNumber(totalTasks)} detail="Grouped by status and priority." />
        <MetricCard label="Overdue tasks" value={formatCompactNumber(tasksReport.overdueTasks)} detail="Tasks past due date in current scope." />
      </section>

      <div className="flex justify-end">
        <Link href="/api/reports/export" className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800">
          <Download className="size-4" />
          Download CSV
        </Link>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="surface-panel gap-5 p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Users overview</h2>
          <DataTable rows={overview.usersByStatus} columns={[{ header: "Status", render: (row) => sentenceCase(row.status) }, { header: "Count", render: (row) => row._count._all }]} />
        </div>
        <div className="surface-panel gap-5 p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Leads overview</h2>
          <DataTable rows={overview.leadsByStatus} columns={[{ header: "Status", render: (row) => sentenceCase(row.status) }, { header: "Count", render: (row) => row._count._all }]} />
        </div>
        <div className="surface-panel gap-5 p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Tasks overview</h2>
          <DataTable rows={overview.tasksByStatus} columns={[{ header: "Status", render: (row) => sentenceCase(row.status) }, { header: "Count", render: (row) => row._count._all }]} />
        </div>
        <div className="surface-panel gap-5 p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Task priorities</h2>
          <DataTable rows={tasksReport.tasksByPriority} columns={[{ header: "Priority", render: (row) => sentenceCase(row.priority) }, { header: "Count", render: (row) => row._count._all }]} />
        </div>
      </div>
    </div>
  );
}
