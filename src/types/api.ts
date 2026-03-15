export type RoleRef = {
  id: string;
  key: string;
  name: string;
};

export type UserRef = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
};

export type UserSetting = {
  timezone: string | null;
  locale: string | null;
  sidebarCollapsed: boolean;
  updatedAt?: string;
};

export type SidebarItem = {
  label: string;
  path: string;
  permission: string;
};

export type CurrentUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: string;
  managerId: string | null;
  mustChangePassword: boolean;
  permissionVersion: number;
  role: RoleRef;
  settings: UserSetting;
};

export type AuthPermissions = {
  all: string[];
  pages: string[];
  actions: string[];
};

export type AuthPayload = {
  accessToken: string;
  accessTokenExpiresIn: number;
  user: CurrentUser;
  permissions: AuthPermissions;
  routes: string[];
  sidebarItems: SidebarItem[];
  currentSessionId: string;
};

export type RouteContext = {
  authenticated: boolean;
  user?: {
    id: string;
    email: string;
    status: string;
    permissionVersion: number;
    role: RoleRef;
  };
  pagePermissions: string[];
  routes: string[];
  sidebarItems: SidebarItem[];
  currentSessionId?: string | null;
};

export type Paginated<T> = {
  items: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

export type UserListItem = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  status: string;
  managerId: string | null;
  permissionVersion: number;
  lastLoginAt: string | null;
  createdAt: string;
  role: RoleRef;
  manager: UserRef | null;
};

export type UserDetail = UserListItem & {
  mustChangePassword: boolean;
  suspendedAt: string | null;
  bannedAt: string | null;
  userSetting?: UserSetting | null;
  createdByUser?: UserRef | null;
};

export type ActivityItem = {
  id: string;
  module: string;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
  actorUser?: UserRef | null;
  targetUser?: UserRef | null;
};

export type PermissionCatalogItem = {
  id: string;
  key: string;
  module: string;
  type: string;
  route: string | null;
  label: string;
  description: string | null;
};

export type PermissionOverride = {
  id: string;
  effect: "allow" | "deny";
  expiresAt?: string | null;
  createdAt: string;
  permission: PermissionCatalogItem;
  grantedByUser?: UserRef | null;
};

export type AccessUserResponse = {
  user: CurrentUser;
  permissions: AuthPermissions;
  routes: string[];
  sidebarItems: SidebarItem[];
  overrides: PermissionOverride[];
};

export type Lead = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  manager?: UserRef | null;
  assignedToUser?: UserRef | null;
  customer?: UserRef | null;
};

export type Task = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignedToUser?: UserRef | null;
  lead?: Lead | null;
  customer?: UserRef | null;
};

export type DashboardSummary = {
  counts: {
    users: number;
    leads: number;
    tasks: number;
    recentAuditCount: number;
  };
  highlights: {
    pendingTasks: number;
    activeLeads: number;
  };
};

export type ReportsOverview = {
  usersByStatus: Array<{ status: string; _count: { _all: number } }>;
  usersByRole: Array<{ roleId: string; roleKey?: string; roleName?: string; count?: number; _count?: { _all: number } }>;
  leadsByStatus: Array<{ status: string; _count: { _all: number } }>;
  tasksByStatus: Array<{ status: string; _count: { _all: number } }>;
};

export type UsersReport = {
  usersByRole: Array<{ roleId: string; _count: { _all: number } }>;
  usersByStatus: Array<{ status: string; _count: { _all: number } }>;
};

export type LeadsReport = {
  leadsByStatus: Array<{ status: string; _count: { _all: number } }>;
  leadsByAssignee: Array<{ assignedToUserId: string | null; _count: { _all: number } }>;
};

export type TasksReport = {
  tasksByStatus: Array<{ status: string; _count: { _all: number } }>;
  tasksByPriority: Array<{ priority: string; _count: { _all: number } }>;
  overdueTasks: number;
};

export type SessionItem = {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string;
  isCurrent: boolean;
};

export type ProfileSettings = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  status: string;
  userSetting: UserSetting;
};

export type AppSettingItem = {
  key: string;
  value: Record<string, unknown>;
  updatedAt: string;
  updatedByUser?: UserRef | null;
};

export type PortalOverview = {
  profile: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    status: string;
    createdAt: string;
    userSetting?: UserSetting | null;
  };
  counts: {
    tasks: number;
    leads: number;
  };
  recentActivity: ActivityItem[];
};
