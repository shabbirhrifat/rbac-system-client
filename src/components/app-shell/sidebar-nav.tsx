"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { SidebarItem } from "@/types/api";
import { sidebarItemMeta } from "@/components/app-shell/sidebar-nav.shared";

export function SidebarNav({ items }: { items: SidebarItem[] }) {
  const pathname = usePathname();

  return (
    <>
      <nav className="hidden w-full flex-col gap-2 lg:flex">
        {items.map((item) => {
          const Icon = sidebarItemMeta[item.path as keyof typeof sidebarItemMeta]?.icon ??
            sidebarItemMeta.fallback.icon;
          const active = pathname === item.path || pathname.startsWith(`${item.path}/`);

          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "group flex min-w-0 items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                active
                  ? "bg-neutral-950 text-white shadow-[0_16px_40px_-24px_rgba(17,24,39,0.8)]"
                  : "text-neutral-500 hover:bg-white/80 hover:text-neutral-900",
              )}
            >
              <span className={cn("shrink-0 rounded-xl p-2", active ? "bg-white/15" : "bg-white text-brand-600 ring-1 ring-neutral-200")}>
                <Icon className="size-4" />
              </span>
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="fixed bottom-5 left-4 z-40 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              type="button"
              size="icon-lg"
              className="size-14 rounded-full bg-neutral-950 text-white shadow-[0_28px_60px_-28px_rgba(15,23,42,0.7)] hover:bg-neutral-900"
            >
              <Menu className="size-5" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(92vw,380px)] gap-0 p-0 sm:max-w-[380px]">
            <SheetHeader className="pr-14">
              <SheetTitle>Navigation</SheetTitle>
              <SheetDescription>
                Move between modules from a focused mobile sidebar.
              </SheetDescription>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
              <nav className="flex flex-col gap-2">
                {items.map((item) => {
                  const meta =
                    sidebarItemMeta[item.path as keyof typeof sidebarItemMeta] ??
                    sidebarItemMeta.fallback;
                  const Icon = meta.icon;
                  const active = pathname === item.path || pathname.startsWith(`${item.path}/`);

                  return (
                    <SheetClose asChild key={item.path}>
                      <Link
                        href={item.path}
                        className={cn(
                          "group flex items-center gap-3 rounded-[20px] px-4 py-3.5 text-sm font-medium transition-all",
                          active
                            ? "bg-neutral-950 text-white shadow-[0_16px_40px_-24px_rgba(17,24,39,0.8)]"
                            : "bg-white text-neutral-600 ring-1 ring-neutral-200 hover:text-neutral-950",
                        )}
                      >
                        <span
                          className={cn(
                            "rounded-xl p-2.5",
                            active
                              ? "bg-white/12"
                              : "bg-brand-50 text-brand-600 ring-1 ring-brand-100",
                          )}
                        >
                          <Icon className="size-4" />
                        </span>
                        <span className="flex-1">{item.label}</span>
                        {active ? <X className="size-4 rotate-45 text-white/60" /> : null}
                      </Link>
                    </SheetClose>
                  );
                })}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
