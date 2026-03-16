import {
  BarChart3,
  FileClock,
  Gauge,
  LifeBuoy,
  Settings,
  ShieldCheck,
  SquareUserRound,
  Users,
} from "lucide-react";

export const sidebarItemMeta = {
  "/dashboard": { icon: Gauge },
  "/users": { icon: Users },
  "/leads": { icon: SquareUserRound },
  "/tasks": { icon: ShieldCheck },
  "/reports": { icon: BarChart3 },
  "/audit-logs": { icon: FileClock },
  "/portal": { icon: LifeBuoy },
  "/settings": { icon: Settings },
  fallback: { icon: ShieldCheck },
} as const;
