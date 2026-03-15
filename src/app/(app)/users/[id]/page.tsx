import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { FormSection } from "@/components/forms/form-section";
import { UserEditForm } from "@/components/forms/user-edit-form";
import { UserStatusForm } from "@/components/forms/user-status-form";
import { getUser, getUserActivity, getUsers } from "@/lib/data";
import { formatDate } from "@/lib/format";

type UserDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserDetailPage({ params }: UserDetailPageProps) {
  const { id } = await params;
  const [user, activity, users] = await Promise.all([getUser(id), getUserActivity(id), getUsers()]);
  const managers = users.items.filter((item) => item.role.key === "manager" || item.role.key === "admin");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="User detail"
        title={`${user.firstName} ${user.lastName}`}
        description="Edit profile attributes, update lifecycle status, and review recent linked activity."
        badge={user.role.name}
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          ["Email", user.email],
          ["Status", user.status],
          ["Permission version", String(user.permissionVersion)],
          ["Last login", formatDate(user.lastLoginAt)],
        ].map(([label, value]) => (
          <div key={label} className="surface-panel gap-2 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-neutral-400">{label}</p>
            <p className="text-base font-semibold text-neutral-900">{value}</p>
          </div>
        ))}
      </div>

      <FormSection title="Profile settings" description="Update editable profile and role fields.">
        <UserEditForm user={user} managers={managers} />
      </FormSection>

      <FormSection title="Status and manager controls" description="Apply scoped lifecycle changes and team reassignment rules.">
        <UserStatusForm user={user} managers={managers} />
      </FormSection>

      <div className="surface-panel gap-6 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-neutral-950">Recent activity</h2>
            <p className="text-sm text-neutral-500">Latest audit rows where this user is actor or target.</p>
          </div>
          <Link href={`/users/${user.id}/permissions`} className="rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800">
            Open permission editor
          </Link>
        </div>
        <DataTable
          rows={activity.items}
          columns={[
            { header: "Action", render: (row) => row.action },
            { header: "Module", render: (row) => row.module },
            { header: "Actor", render: (row) => row.actorUser ? `${row.actorUser.firstName} ${row.actorUser.lastName}` : "System" },
            { header: "Time", render: (row) => formatDate(row.createdAt) },
          ]}
        />
      </div>
    </div>
  );
}
