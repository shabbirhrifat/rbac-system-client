import Link from "next/link";
import { Bell, ChevronRight, LogOut, Shield } from "lucide-react";
import { logoutAction } from "@/actions/auth";
import { SidebarNav } from "@/components/app-shell/sidebar-nav";
import { Badge } from "@/components/ui/badge";
import { initials } from "@/lib/format";
import type { CurrentUser, SidebarItem } from "@/types/api";

type AppShellProps = {
  currentUser: CurrentUser;
  sidebarItems: SidebarItem[];
  children: React.ReactNode;
};

export function AppShell({ currentUser, sidebarItems, children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,98,62,0.12),_transparent_30%),linear-gradient(180deg,_#fffdfa_0%,_#f7f8fb_42%,_#f3f5f8_100%)] text-neutral-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-4 md:px-6 lg:flex-row lg:px-8">
        <aside className="surface-muted flex h-fit flex-col gap-6 p-5 lg:sticky lg:top-6 lg:w-[300px] lg:self-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-950 text-white shadow-[0_20px_50px_-30px_rgba(17,24,39,0.9)]">
                <Shield className="size-5" />
              </div>
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-neutral-950">RBAC Control</p>
                <p className="text-sm text-neutral-500">Permission-aware ops center</p>
              </div>
            </div>
            <div className="rounded-[24px] bg-neutral-950 px-4 py-4 text-white">
              <p className="text-xs uppercase tracking-[0.24em] text-white/55">Signed in as</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 font-semibold text-white">
                  {initials(currentUser.firstName, currentUser.lastName)}
                </div>
                <div>
                  <p className="font-medium">{currentUser.firstName} {currentUser.lastName}</p>
                  <p className="text-sm text-white/65">{currentUser.role.name}</p>
                </div>
              </div>
            </div>
          </div>

          <SidebarNav items={sidebarItems} />

          <div className="mt-auto rounded-[24px] border border-dashed border-neutral-200 bg-white/80 p-4">
            <p className="text-sm font-semibold text-neutral-900">Grant ceiling active</p>
            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Every screen respects resolved permissions, scoped ownership, and audit-safe workflows.
            </p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-6">
          <header className="surface-muted flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-sm text-neutral-500">
              <Link href="/dashboard" className="font-medium text-neutral-900">Workspace</Link>
              <ChevronRight className="size-4" />
              <span>Permission-aware operations</span>
            </div>
            <div className="flex items-center gap-3">
              <Badge tone="brand">{currentUser.role.name}</Badge>
              <button className="inline-flex size-10 items-center justify-center rounded-2xl bg-white text-neutral-600 ring-1 ring-neutral-200 transition hover:text-neutral-950">
                <Bell className="size-4" />
              </button>
              <Link href="/settings" className="inline-flex items-center gap-3 rounded-2xl bg-white px-3 py-2 ring-1 ring-neutral-200 transition hover:ring-neutral-300">
                <span className="flex size-9 items-center justify-center rounded-xl bg-brand-50 font-semibold text-brand-700">
                  {initials(currentUser.firstName, currentUser.lastName)}
                </span>
                <span className="hidden text-left md:block">
                  <span className="block text-sm font-semibold text-neutral-900">{currentUser.firstName} {currentUser.lastName}</span>
                  <span className="block text-xs text-neutral-500">{currentUser.email}</span>
                </span>
              </Link>
              <form action={logoutAction}>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800">
                  <LogOut className="size-4" />
                  Logout
                </button>
              </form>
            </div>
          </header>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}
