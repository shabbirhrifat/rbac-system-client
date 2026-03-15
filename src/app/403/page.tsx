import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_rgba(255,98,62,0.14),_transparent_30%),linear-gradient(180deg,_#fffaf7_0%,_#f3f6fa_100%)] px-4">
      <div className="surface-panel max-w-2xl items-start gap-6 p-8 md:p-10">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
          <ShieldAlert className="size-6" />
        </div>
        <div className="space-y-3">
          <p className="eyebrow">Permission denied</p>
          <h1 className="font-display text-4xl font-semibold tracking-[-0.05em] text-neutral-950">You do not have access to this route.</h1>
          <p className="text-sm leading-7 text-neutral-500 md:text-base">
            Your current page permissions do not include this workspace. Use an allowed module from the sidebar or ask an administrator to update your effective permissions.
          </p>
        </div>
        <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-2xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
          <ArrowLeft className="size-4" />
          Return to dashboard
        </Link>
      </div>
    </div>
  );
}
