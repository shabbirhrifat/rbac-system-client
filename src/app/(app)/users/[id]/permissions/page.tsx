import { PageHeader } from "@/components/page-header";
import { FormSection } from "@/components/forms/form-section";
import { CreateFormSheet } from "@/components/forms/create-form-sheet";
import { PermissionOverridesForm } from "@/components/forms/permission-overrides-form";
import { StatusBadge } from "@/components/status-badge";
import { getGrantablePermissions, getUserAccess } from "@/lib/data";
import { formatDate, sentenceCase } from "@/lib/format";

type UserPermissionsPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserPermissionsPage({ params }: UserPermissionsPageProps) {
  const { id } = await params;
  const [userAccess, grantable] = await Promise.all([getUserAccess(id), getGrantablePermissions()]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Permissions"
        title={`Resolved access for ${userAccess.user.firstName} ${userAccess.user.lastName}`}
        description="Review effective permissions, available grant ceiling, and replace per-user allow or deny overrides in one transaction."
        badge={`${userAccess.permissions.all.length} effective permissions`}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="surface-panel gap-3 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Pages</p>
          <p className="text-3xl font-semibold text-neutral-950">{userAccess.permissions.pages.length}</p>
        </div>
        <div className="surface-panel gap-3 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Actions</p>
          <p className="text-3xl font-semibold text-neutral-950">{userAccess.permissions.actions.length}</p>
        </div>
        <div className="surface-panel gap-3 p-5 sm:p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Sidebar routes</p>
          <p className="text-3xl font-semibold text-neutral-950">{userAccess.sidebarItems.length}</p>
        </div>
      </div>

      {/* Current overrides */}
      {userAccess.overrides.length > 0 ? (
        <div className="surface-panel gap-4 p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold tracking-tight text-neutral-950">
            Active overrides ({userAccess.overrides.length})
          </h2>
          <div className="divide-y divide-neutral-100 rounded-2xl border border-neutral-200">
            {userAccess.overrides.map((override) => (
              <div key={override.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-neutral-800 truncate">{override.permission.label || override.permission.key}</p>
                  <p className="text-xs text-neutral-400">{sentenceCase(override.permission.module)}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge value={override.effect} />
                  {override.expiresAt ? (
                    <span className="text-xs text-neutral-400">expires {formatDate(override.expiresAt)}</span>
                  ) : null}
                  {override.grantedByUser ? (
                    <span className="text-xs text-neutral-400">
                      by {override.grantedByUser.firstName} {override.grantedByUser.lastName}
                    </span>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <FormSection
        title="Replace permission overrides"
        description="The backend increments permission version and validates every override against your current grantable surface."
        actions={
          <CreateFormSheet
            triggerLabel="Edit overrides"
            title="Replace permission overrides"
            description="Review grantable permissions and replace user-specific overrides in one audited update."
          >
            <PermissionOverridesForm userAccess={userAccess} grantable={grantable.items} />
          </CreateFormSheet>
        }
      />
    </div>
  );
}
