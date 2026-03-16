import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ListFilters } from "@/components/list-filters";
import { ListPagination } from "@/components/list-pagination";
import { PageHeader } from "@/components/page-header";
import { AuditMetadataDrawer } from "@/components/audit-metadata-drawer";
import { getAuditLogs, listPageMeta } from "@/lib/data";
import { formatDate, sentenceCase } from "@/lib/format";

type AuditLogsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const moduleOptions = [
  { label: "Users", value: "users" },
  { label: "Leads", value: "leads" },
  { label: "Tasks", value: "tasks" },
];

const actionOptions = [
  { label: "Create", value: "create" },
  { label: "Update", value: "update" },
  { label: "Delete", value: "delete" },
  { label: "Status update", value: "status.update" },
  { label: "Assign", value: "assign" },
  { label: "Manager assign", value: "manager.assign" },
];

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  const filters = await searchParams;
  const auditLogs = await getAuditLogs(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audit log"
        title="Immutable admin and manager activity"
        description="Inspect protected actions by actor, module, target, and timestamp. The log is read-only by design."
        badge={listPageMeta(auditLogs)}
      />

      <div className="surface-panel gap-6 p-5 sm:p-6">
        <ListFilters
          filters={[
            { key: "module", label: "All modules", options: moduleOptions },
            { key: "action", label: "All actions", options: actionOptions },
          ]}
        />

        {auditLogs.items.length ? (
          <>
            <DataTable
              rows={auditLogs.items}
              getRowKey={(row) => row.id}
              columns={[
                { header: "Action", render: (row) => sentenceCase(row.action) },
                { header: "Module", render: (row) => sentenceCase(row.module) },
                { header: "Actor", render: (row) => row.actorUser ? `${row.actorUser.firstName} ${row.actorUser.lastName}` : "System" },
                { header: "Target", render: (row) => row.targetUser ? `${row.targetUser.firstName} ${row.targetUser.lastName}` : row.entityId ?? "-" },
                {
                  header: "Details",
                  render: (row) => row.metadata && Object.keys(row.metadata).length > 0
                    ? <AuditMetadataDrawer metadata={row.metadata} action={row.action} module={row.module} />
                    : <span className="text-neutral-300">-</span>,
                },
                { header: "Created", render: (row) => formatDate(row.createdAt) },
              ]}
            />
            <ListPagination page={auditLogs.meta.page} totalPages={auditLogs.meta.totalPages} total={auditLogs.meta.total} />
          </>
        ) : (
          <EmptyState title="No audit data found" description="When protected updates happen inside your scope, the audit log will show them here." />
        )}
      </div>
    </div>
  );
}
