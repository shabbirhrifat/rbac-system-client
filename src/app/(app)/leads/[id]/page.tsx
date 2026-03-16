import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { FormSection } from "@/components/forms/form-section";
import { LeadEditForm } from "@/components/forms/lead-edit-form";
import { getLead, getUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { getCurrentUser } from "@/lib/server-api";

type LeadDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params;
  const me = await getCurrentUser();
  const canEditLead = me.permissions.actions.includes("leads.update");
  const canChangeStatus = me.permissions.actions.includes(
    "leads.change_status",
  );
  const canAssignLead = me.permissions.actions.includes("leads.assign");
  const canReadUsers = me.permissions.actions.includes("users.read");
  const emptyUsers = {
    items: [],
    meta: { page: 1, limit: 0, total: 0, totalPages: 1 },
  };

  const [lead, users] = await Promise.all([
    getLead(id),
    canAssignLead && canReadUsers ? getUsers() : Promise.resolve(emptyUsers),
  ]);
  const customers = users.items.filter((user) => user.role.key === "customer");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Lead detail"
        title={lead.name}
        description="Update lead profile details, lifecycle status, customer links, and assignment from one scoped workspace."
        badge={lead.company ?? "No company"}
      />

      <div className="grid gap-4 md:grid-cols-4">
        <div className="surface-panel gap-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Status
          </p>
          <StatusBadge value={lead.status} />
        </div>
        <div className="surface-panel gap-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Source
          </p>
          <p className="text-base font-semibold text-neutral-900">
            {lead.source ?? "-"}
          </p>
        </div>
        <div className="surface-panel gap-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Updated
          </p>
          <p className="text-base font-semibold text-neutral-900">
            {formatDate(lead.updatedAt)}
          </p>
        </div>
        <div className="surface-panel gap-2 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">
            Assignee
          </p>
          <p className="text-base font-semibold text-neutral-900">
            {lead.assignedToUser
              ? `${lead.assignedToUser.firstName} ${lead.assignedToUser.lastName}`
              : "Unassigned"}
          </p>
        </div>
      </div>

      {canEditLead || canChangeStatus || canAssignLead ? (
        <FormSection
          title="Lead controls"
          description="The backend validates assignment scope and customer-role links."
        >
          <LeadEditForm
            lead={lead}
            users={users.items}
            customers={customers}
            canEditLead={canEditLead}
            canChangeStatus={canChangeStatus}
            canAssignLead={canAssignLead}
          />
        </FormSection>
      ) : null}
    </div>
  );
}
