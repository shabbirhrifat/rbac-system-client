"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileClock, Gauge, LifeBuoy, Settings, ShieldCheck, SquareUserRound, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SidebarItem } from "@/types/api";

const iconMap = {
  "/dashboard": Gauge,
  "/users": Users,
  "/leads": SquareUserRound,
  "/tasks": ShieldCheck,
  "/reports": BarChart3,
  "/audit-logs": FileClock,
  "/portal": LifeBuoy,
  "/settings": Settings,
} as const;

export function SidebarNav({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden min-w-72 flex-col gap-2 lg:flex">
        {items.map((item) => {
          const Icon = iconMap[item.path as keyof typeof iconMap] ?? ShieldCheck;
          const active = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-neutral-950 text-white shadow-[0_16px_40px_-24px_rgba(17,24,39,0.8)]"
                  : "text-neutral-500 hover:bg-white/80 hover:text-neutral-900",
              )}
            >
              <span className={cn("rounded-xl p-2", active ? "bg-white/15" : "bg-white text-brand-600 ring-1 ring-neutral-200")}>
                <Icon className="size-4" />
              </span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <nav className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {items.map((item) => {
          const active = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
                active ? "bg-neutral-950 text-white" : "bg-white text-neutral-600 ring-1 ring-neutral-200",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
