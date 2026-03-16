import { DataTable } from "@/components/data-table";
import { CreateFormSheet } from "@/components/forms/create-form-sheet";
import { EmptyState } from "@/components/empty-state";
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

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Linked tasks" value={formatCompactNumber(overview.counts.tasks)} detail="Current customer-visible work items." />
        <MetricCard label="Linked leads" value={formatCompactNumber(overview.counts.leads)} detail="Leads associated with this portal account." />
        <MetricCard label="Email" value={overview.profile.email} detail="Primary portal login email." />
        <MetricCard label="Status" value={overview.profile.status} detail="Current lifecycle state for this customer." />
      </section>

      <FormSection
        title="Update your profile"
        description="Customers can update only their own self-service profile fields."
        actions={
          <CreateFormSheet
            triggerLabel="Edit profile"
            title="Update your profile"
            description="Update self-service profile fields from a dedicated panel without disrupting the portal view."
          >
            <PortalProfileForm profile={profile} />
          </CreateFormSheet>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="surface-panel gap-5 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Assigned tasks</h2>
          {tasks.items.length ? (
            <DataTable
              rows={tasks.items}
              getRowKey={(task) => task.id}
              columns={[
                { header: "Task", render: (task) => task.title },
                { header: "Status", render: (task) => <StatusBadge value={task.status} /> },
                { header: "Priority", render: (task) => <StatusBadge value={task.priority} /> },
                { header: "Due", render: (task) => formatDate(task.dueAt) },
              ]}
            />
          ) : (
            <EmptyState
              title="No assigned tasks"
              description="Customer-visible tasks will appear here as soon as they are linked to this portal account."
            />
          )}
        </div>
        <div className="surface-panel gap-5 p-5 sm:p-6">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Recent activity</h2>
          {activity.items.length ? (
            <DataTable
              rows={activity.items}
              getRowKey={(row) => row.id}
              columns={[
                { header: "Module", render: (row) => row.module },
                { header: "Action", render: (row) => row.action },
                { header: "Created", render: (row) => formatDate(row.createdAt) },
              ]}
            />
          ) : (
            <EmptyState
              title="No recent portal activity"
              description="Activity entries will show up here when protected customer-visible actions happen in this workspace."
            />
          )}
        </div>
      </div>
    </div>
  );
}
