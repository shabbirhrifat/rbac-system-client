import { PageHeader } from "@/components/page-header";
import { FormSection } from "@/components/forms/form-section";
import { PermissionOverridesForm } from "@/components/forms/permission-overrides-form";
import { getGrantablePermissions, getUserAccess } from "@/lib/data";

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

      <div className="grid gap-4 md:grid-cols-3">
        <div className="surface-panel gap-3 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Pages</p>
          <p className="text-3xl font-semibold text-neutral-950">{userAccess.permissions.pages.length}</p>
        </div>
        <div className="surface-panel gap-3 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Actions</p>
          <p className="text-3xl font-semibold text-neutral-950">{userAccess.permissions.actions.length}</p>
        </div>
        <div className="surface-panel gap-3 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">Sidebar routes</p>
          <p className="text-3xl font-semibold text-neutral-950">{userAccess.sidebarItems.length}</p>
        </div>
      </div>

      <FormSection title="Replace permission overrides" description="The backend increments permission version and validates every override against your current grantable surface.">
        <PermissionOverridesForm userAccess={userAccess} grantable={grantable.items} />
      </FormSection>
    </div>
  );
}
