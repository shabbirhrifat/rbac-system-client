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

function pageRequest<T>(path: string) {
  return backendRequest<T>(path, {}, { redirectOnUnauthorized: true });
}

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
  return pageRequest<DashboardSummary>("/dashboard/summary");
}

export function getDashboardActivity() {
  return pageRequest<{ items: ActivityItem[] }>("/dashboard/activity");
}

export function getUsers(searchParams?: SearchParams) {
  return pageRequest<Paginated<UserListItem>>(`/users${buildQuery(searchParams)}`);
}

export function getUser(id: string) {
  return pageRequest<UserDetail>(`/users/${id}`);
}

export function getUserActivity(id: string) {
  return pageRequest<{ items: ActivityItem[] }>(`/users/${id}/activity`);
}

export function getRoles() {
  return pageRequest<{
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
  return pageRequest<{ items: PermissionCatalogItem[]; grouped: Record<string, PermissionCatalogItem[]> }>("/access/catalog");
}

export function getGrantablePermissions() {
  return pageRequest<{ items: PermissionCatalogItem[] }>("/access/grantable");
}

export function getUserAccess(id: string) {
  return pageRequest<AccessUserResponse>(`/access/users/${id}`);
}

export function getLeads(searchParams?: SearchParams) {
  return pageRequest<Paginated<Lead>>(`/leads${buildQuery(searchParams)}`);
}

export function getLead(id: string) {
  return pageRequest<Lead>(`/leads/${id}`);
}

export function getTasks(searchParams?: SearchParams) {
  return pageRequest<Paginated<Task>>(`/tasks${buildQuery(searchParams)}`);
}

export function getTask(id: string) {
  return pageRequest<Task>(`/tasks/${id}`);
}

export function getReportsOverview(searchParams?: SearchParams) {
  return pageRequest<ReportsOverview>(`/reports/overview${buildQuery(searchParams)}`);
}

export function getUsersReport(searchParams?: SearchParams) {
  return pageRequest<UsersReport>(`/reports/users${buildQuery(searchParams)}`);
}

export function getLeadsReport(searchParams?: SearchParams) {
  return pageRequest<LeadsReport>(`/reports/leads${buildQuery(searchParams)}`);
}

export function getTasksReport(searchParams?: SearchParams) {
  return pageRequest<TasksReport>(`/reports/tasks${buildQuery(searchParams)}`);
}

export function getAuditLogs(searchParams?: SearchParams) {
  return pageRequest<Paginated<ActivityItem>>(`/audit-logs${buildQuery(searchParams)}`);
}

export function getSettingsProfile() {
  return pageRequest<ProfileSettings>("/settings/profile");
}

export function getAppSettings() {
  return pageRequest<{ items: AppSettingItem[] }>("/settings/app");
}

export function getPortalOverview() {
  return pageRequest<PortalOverview>("/portal/overview");
}

export function getPortalProfile() {
  return pageRequest<ProfileSettings>("/portal/profile");
}

export function getPortalTasks() {
  return pageRequest<{ items: Task[] }>("/portal/tasks");
}

export function getPortalActivity() {
  return pageRequest<{ items: ActivityItem[] }>("/portal/activity");
}

export function getSessions() {
  return pageRequest<{ sessions: SessionItem[] }>("/auth/sessions");
}
