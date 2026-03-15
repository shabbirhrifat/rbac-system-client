import { backendRequest } from "@/lib/server-api";
import type {
  AccessUserResponse,
  ActivityItem,
  AppSettingItem,
  DashboardSummary,
  Lead,
  LeadsReport,
  Paginated,
  PermissionCatalogItem,
  PortalOverview,
  ProfileSettings,
  ReportsOverview,
  SessionItem,
  Task,
  TasksReport,
  UserDetail,
  UserListItem,
  UsersReport,
} from "@/types/api";

type SearchParams = Record<string, string | string[] | undefined>;

export function buildQuery(searchParams?: SearchParams) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(searchParams ?? {})) {
    if (typeof value === "string" && value.trim()) {
      params.set(key, value);
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

export function listPageMeta<T extends { meta: { total: number; page: number; totalPages: number } }>(data: T) {
  return `${data.meta.total} total · page ${data.meta.page} of ${Math.max(data.meta.totalPages, 1)}`;
}

export function getDashboardSummary() {
  return backendRequest<DashboardSummary>("/dashboard/summary");
}

export function getDashboardActivity() {
  return backendRequest<{ items: ActivityItem[] }>("/dashboard/activity");
}

export function getUsers(searchParams?: SearchParams) {
  return backendRequest<Paginated<UserListItem>>(`/users${buildQuery(searchParams)}`);
}

export function getUser(id: string) {
  return backendRequest<UserDetail>(`/users/${id}`);
}

export function getUserActivity(id: string) {
  return backendRequest<{ items: ActivityItem[] }>(`/users/${id}/activity`);
}

export function getRoles() {
  return backendRequest<{
    items: Array<{
      id: string;
      key: string;
      name: string;
      level: number;
      isSystem: boolean;
      permissions: Array<{ id: string; key: string; label: string }>;
    }>;
  }>("/access/roles");
}

export function getPermissionCatalog() {
  return backendRequest<{ items: PermissionCatalogItem[]; grouped: Record<string, PermissionCatalogItem[]> }>("/access/catalog");
}

export function getGrantablePermissions() {
  return backendRequest<{ items: PermissionCatalogItem[] }>("/access/grantable");
}

export function getUserAccess(id: string) {
  return backendRequest<AccessUserResponse>(`/access/users/${id}`);
}

export function getLeads(searchParams?: SearchParams) {
  return backendRequest<Paginated<Lead>>(`/leads${buildQuery(searchParams)}`);
}

export function getLead(id: string) {
  return backendRequest<Lead>(`/leads/${id}`);
}

export function getTasks(searchParams?: SearchParams) {
  return backendRequest<Paginated<Task>>(`/tasks${buildQuery(searchParams)}`);
}

export function getTask(id: string) {
  return backendRequest<Task>(`/tasks/${id}`);
}

export function getReportsOverview(searchParams?: SearchParams) {
  return backendRequest<ReportsOverview>(`/reports/overview${buildQuery(searchParams)}`);
}

export function getUsersReport(searchParams?: SearchParams) {
  return backendRequest<UsersReport>(`/reports/users${buildQuery(searchParams)}`);
}

export function getLeadsReport(searchParams?: SearchParams) {
  return backendRequest<LeadsReport>(`/reports/leads${buildQuery(searchParams)}`);
}

export function getTasksReport(searchParams?: SearchParams) {
  return backendRequest<TasksReport>(`/reports/tasks${buildQuery(searchParams)}`);
}

export function getAuditLogs(searchParams?: SearchParams) {
  return backendRequest<Paginated<ActivityItem>>(`/audit-logs${buildQuery(searchParams)}`);
}

export function getSettingsProfile() {
  return backendRequest<ProfileSettings>("/settings/profile");
}

export function getAppSettings() {
  return backendRequest<{ items: AppSettingItem[] }>("/settings/app");
}

export function getPortalOverview() {
  return backendRequest<PortalOverview>("/portal/overview");
}

export function getPortalProfile() {
  return backendRequest<ProfileSettings>("/portal/profile");
}

export function getPortalTasks() {
  return backendRequest<{ items: Task[] }>("/portal/tasks");
}

export function getPortalActivity() {
  return backendRequest<{ items: ActivityItem[] }>("/portal/activity");
}

export function getSessions() {
  return backendRequest<{ sessions: SessionItem[] }>("/auth/sessions");
}
