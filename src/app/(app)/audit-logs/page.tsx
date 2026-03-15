import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";
import { getAuditLogs, listPageMeta } from "@/lib/data";
import { formatDate, sentenceCase } from "@/lib/format";

type AuditLogsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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

      {auditLogs.items.length ? (
        <div className="surface-panel gap-6 p-6">
          <DataTable
            rows={auditLogs.items}
            columns={[
              { header: "Action", render: (row) => sentenceCase(row.action) },
              { header: "Module", render: (row) => sentenceCase(row.module) },
              { header: "Actor", render: (row) => row.actorUser ? `${row.actorUser.firstName} ${row.actorUser.lastName}` : "System" },
              { header: "Target", render: (row) => row.targetUser ? `${row.targetUser.firstName} ${row.targetUser.lastName}` : row.entityId ?? "-" },
              { header: "Created", render: (row) => formatDate(row.createdAt) },
            ]}
          />
        </div>
      ) : (
        <EmptyState title="No audit data found" description="When protected updates happen inside your scope, the audit log will show them here." />
      )}
    </div>
  );
}
