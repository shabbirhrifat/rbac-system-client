import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { CreateFormSheet } from "@/components/forms/create-form-sheet";
import { LeadCreateForm } from "@/components/forms/lead-create-form";
import { getLeads, getUsers, listPageMeta } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getCurrentUser } from "@/lib/server-api";

type LeadsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const filters = await searchParams;
  const me = await getCurrentUser();
  const canCreateLead = me.permissions.actions.includes("leads.create");
  const canReadUsers = me.permissions.actions.includes("users.read");
  const emptyUsers = {
    items: [],
    meta: { page: 1, limit: 0, total: 0, totalPages: 1 },
  };

  const [leads, users] = await Promise.all([
    getLeads(filters),
    canCreateLead && canReadUsers ? getUsers() : Promise.resolve(emptyUsers),
  ]);
  const customers = users.items.filter((user) => user.role.key === "customer");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Leads"
        title="Work the scoped pipeline"
        description="Track origin, assignment, and status progression for the leads your current role is allowed to see."
        badge={listPageMeta(leads)}
        actions={
          canCreateLead ? (
            <CreateFormSheet
              triggerLabel="Create lead"
              title="Create lead"
              description="Create records inside your scope and link them to customers or assignees when available."
            >
              <LeadCreateForm users={users.items} customers={customers} />
            </CreateFormSheet>
          ) : null
        }
      />

      <div className="surface-panel gap-6 p-5 sm:p-6">
        {leads.items.length ? (
          <DataTable
            rows={leads.items}
            getRowKey={(lead) => lead.id}
            columns={[
              {
                header: "Lead",
                render: (lead) => (
                  <div className="space-y-1">
                    <Link
                      href={`/leads/${lead.id}`}
                      className="font-medium text-neutral-900 hover:text-brand-600"
                    >
                      {lead.name}
                    </Link>
                    <p className="text-xs text-neutral-500">
                      {lead.company ?? lead.email ?? "No company"}
                    </p>
                  </div>
                ),
              },
              {
                header: "Status",
                render: (lead) => <StatusBadge value={lead.status} />,
              },
              {
                header: "Assignee",
                render: (lead) =>
                  lead.assignedToUser
                    ? `${lead.assignedToUser.firstName} ${lead.assignedToUser.lastName}`
                    : "Unassigned",
              },
              {
                header: "Customer",
                render: (lead) =>
                  lead.customer
                    ? `${lead.customer.firstName} ${lead.customer.lastName}`
                    : "-",
              },
              { header: "Updated", render: (lead) => formatDate(lead.updatedAt) },
            ]}
          />
        ) : (
          <EmptyState
            title="No leads available yet"
            description="Once leads exist inside your visible scope, you will be able to review their status, ownership, and recent updates here."
          />
        )}
      </div>
    </div>
  );
}
