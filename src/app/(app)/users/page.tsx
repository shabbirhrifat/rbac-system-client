import Link from "next/link";
import { DataTable } from "@/components/data-table";
import { EmptyState } from "@/components/empty-state";
import { ListFilters } from "@/components/list-filters";
import { ListPagination } from "@/components/list-pagination";
import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { CreateFormSheet } from "@/components/forms/create-form-sheet";
import { UserCreateForm } from "@/components/forms/user-create-form";
import { getUsers, listPageMeta } from "@/lib/data";
import { formatDate } from "@/lib/format";

type UsersPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Suspended", value: "suspended" },
  { label: "Banned", value: "banned" },
];

const roleOptions = [
  { label: "Admin", value: "admin" },
  { label: "Manager", value: "manager" },
  { label: "Agent", value: "agent" },
  { label: "Customer", value: "customer" },
];

export default async function UsersPage({ searchParams }: UsersPageProps) {
  const filters = await searchParams;
  const users = await getUsers(filters);
  const managers = users.items.filter((user) => user.role.key === "manager" || user.role.key === "admin");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Users"
        title="Manage scoped identities"
        description="Review the people available in your scope, create new accounts, and open detail pages for profile and permission work."
        badge={listPageMeta(users)}
        actions={
          <CreateFormSheet
            triggerLabel="Create user"
            title="Create a new user"
            description="The backend enforces role ceilings, manager rules, and scoped creation."
          >
            <UserCreateForm managers={managers} />
          </CreateFormSheet>
        }
      />

      <div className="surface-panel gap-6 p-5 sm:p-6">
        <ListFilters
          searchKey="search"
          searchPlaceholder="Search by name or email..."
          filters={[
            { key: "status", label: "All statuses", options: statusOptions },
            { key: "role", label: "All roles", options: roleOptions },
          ]}
        />

        {users.items.length ? (
          <>
            <DataTable
              rows={users.items}
              getRowKey={(user) => user.id}
              columns={[
                {
                  header: "Person",
                  render: (user) => (
                    <div className="space-y-1">
                      <Link href={`/users/${user.id}`} className="font-medium text-neutral-900 hover:text-brand-600">
                        {user.firstName} {user.lastName}
                      </Link>
                      <p className="text-xs text-neutral-500">{user.email}</p>
                    </div>
                  ),
                },
                { header: "Role", render: (user) => user.role.name },
                { header: "Status", render: (user) => <StatusBadge value={user.status} /> },
                {
                  header: "Manager",
                  render: (user) => user.manager ? `${user.manager.firstName} ${user.manager.lastName}` : "-",
                },
                { header: "Last login", render: (user) => formatDate(user.lastLoginAt) },
              ]}
            />
            <ListPagination page={users.meta.page} totalPages={users.meta.totalPages} total={users.meta.total} />
          </>
        ) : (
          <EmptyState
            title="No users in scope yet"
            description="When your role can access or create people records, they will appear here with status and manager details."
          />
        )}
      </div>
    </div>
  );
}
