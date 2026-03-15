import { DataTable } from "@/components/data-table";
import { MetricCard } from "@/components/metric-card";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { FormSection } from "@/components/forms/form-section";
import { PortalProfileForm } from "@/components/forms/portal-profile-form";
import { getPortalActivity, getPortalOverview, getPortalProfile, getPortalTasks } from "@/lib/data";
import { formatCompactNumber, formatDate } from "@/lib/format";

export default async function PortalPage() {
  const [overview, profile, tasks, activity] = await Promise.all([
    getPortalOverview(),
    getPortalProfile(),
    getPortalTasks(),
    getPortalActivity(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Customer portal"
        title={`Welcome back, ${overview.profile.firstName}`}
        description="A focused self-service workspace for profile access, linked tasks, and recent activity."
        badge={overview.profile.status}
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Linked tasks" value={formatCompactNumber(overview.counts.tasks)} detail="Current customer-visible work items." />
        <MetricCard label="Linked leads" value={formatCompactNumber(overview.counts.leads)} detail="Leads associated with this portal account." />
        <MetricCard label="Email" value={overview.profile.email} detail="Primary portal login email." />
        <MetricCard label="Status" value={overview.profile.status} detail="Current lifecycle state for this customer." />
      </section>

      <FormSection title="Update your profile" description="Customers can update only their own self-service profile fields.">
        <PortalProfileForm profile={profile} />
      </FormSection>

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="surface-panel gap-5 p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Assigned tasks</h2>
          <DataTable
            rows={tasks.items}
            columns={[
              { header: "Task", render: (task) => task.title },
              { header: "Status", render: (task) => <StatusBadge value={task.status} /> },
              { header: "Priority", render: (task) => <StatusBadge value={task.priority} /> },
              { header: "Due", render: (task) => formatDate(task.dueAt) },
            ]}
          />
        </div>
        <div className="surface-panel gap-5 p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Recent activity</h2>
          <DataTable
            rows={activity.items}
            columns={[
              { header: "Module", render: (row) => row.module },
              { header: "Action", render: (row) => row.action },
              { header: "Created", render: (row) => formatDate(row.createdAt) },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
