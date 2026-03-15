import type { SidebarItem } from "@/types/api";

export const PAGE_ROUTE_PERMISSIONS = [
  { prefix: "/dashboard", permission: "page.dashboard.view" },
  { prefix: "/users", permission: "page.users.view" },
  { prefix: "/leads", permission: "page.leads.view" },
  { prefix: "/leads/", permission: "page.leads.view" },
  { prefix: "/tasks", permission: "page.tasks.view" },
  { prefix: "/tasks/", permission: "page.tasks.view" },
  { prefix: "/reports", permission: "page.reports.view" },
  { prefix: "/audit-logs", permission: "page.audit.view" },
  { prefix: "/portal", permission: "page.customer_portal.view" },
  { prefix: "/settings", permission: "page.settings.view" },
] as const;

export function getPagePermission(pathname: string) {
  if (/^\/users\/[^/]+\/permissions$/.test(pathname)) {
    return "page.permissions.view";
  }

  const match = PAGE_ROUTE_PERMISSIONS.find((item) =>
    pathname === item.prefix || pathname.startsWith(item.prefix),
  );

  return match?.permission ?? null;
}

export function getDefaultRoute(routes: string[], sidebarItems: SidebarItem[]) {
  return routes[0] ?? sidebarItems[0]?.path ?? "/dashboard";
}
