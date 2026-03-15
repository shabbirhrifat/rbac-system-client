import { Activity, ShieldCheck, Users } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { formatCompactNumber, formatDate, sentenceCase } from "@/lib/format";
import { getDashboardActivity, getDashboardSummary } from "@/lib/data";

export default async function DashboardPage() {
  const [summary, activity] = await Promise.all([getDashboardSummary(), getDashboardActivity()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Operational visibility at a glance"
        description="Track scoped users, active leads, pending tasks, and audit movement from a single permission-aware dashboard."
        badge="Live scope summary"
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Users in scope" value={formatCompactNumber(summary.counts.users)} detail="Accessible people records for your current role." />
        <MetricCard label="Leads" value={formatCompactNumber(summary.counts.leads)} detail={`${summary.highlights.activeLeads} currently active across the funnel.`} />
        <MetricCard label="Tasks" value={formatCompactNumber(summary.counts.tasks)} detail={`${summary.highlights.pendingTasks} still need attention.`} />
        <MetricCard label="Recent audit events" value={formatCompactNumber(summary.counts.recentAuditCount)} detail="Protected actions recorded in the latest window." />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="surface-panel gap-5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Recent activity</p>
              <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Latest audit timeline</h2>
            </div>
            <Activity className="size-5 text-brand-600" />
          </div>

          {activity.items.length ? (
            <DataTable
              rows={activity.items}
              columns={[
                {
                  header: "Action",
                  render: (row) => (
                    <div className="space-y-1">
                      <p className="font-medium text-neutral-900">{sentenceCase(row.action)}</p>
                      <p className="text-xs text-neutral-500">{sentenceCase(row.module)}</p>
                    </div>
                  ),
                },
                {
                  header: "Actor",
                  render: (row) => row.actorUser ? `${row.actorUser.firstName} ${row.actorUser.lastName}` : "System",
                },
                {
                  header: "Target",
                  render: (row) => row.targetUser ? `${row.targetUser.firstName} ${row.targetUser.lastName}` : row.entityId ?? "-",
                },
                {
                  header: "Created",
                  render: (row) => formatDate(row.createdAt),
                },
              ]}
            />
          ) : (
            <EmptyState title="No audit rows yet" description="Once protected actions happen in your scope, this timeline will populate automatically." />
          )}
        </div>

        <div className="grid gap-4">
          <div className="surface-panel gap-4 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-brand-50 p-3 text-brand-700"><Users className="size-5" /></div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Team pulse</p>
                <p className="text-sm text-neutral-500">Use the Users module for CRUD, manager reassignment, and status updates.</p>
              </div>
            </div>
            <StatusBadge value="active" />
          </div>

          <div className="surface-panel gap-4 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-neutral-950 p-3 text-white"><ShieldCheck className="size-5" /></div>
              <div>
                <p className="text-sm font-semibold text-neutral-900">Permission-aware navigation</p>
                <p className="text-sm text-neutral-500">Only routes granted by resolved page permissions are surfaced in the shell and middleware.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
