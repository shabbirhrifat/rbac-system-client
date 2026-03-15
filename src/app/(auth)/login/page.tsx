import { ArrowRight, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import { LoginForm } from "@/app/(auth)/login/login-form";
import { getDefaultRoute } from "@/lib/routes";
import { getSessionRouteContext } from "@/lib/server-api";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const context = await getSessionRouteContext();

  if (context.authenticated) {
    redirect(getDefaultRoute(context.routes, context.sidebarItems));
  }

  const resolvedSearchParams = await searchParams;
  const next = typeof resolvedSearchParams.next === "string" ? resolvedSearchParams.next : undefined;

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(255,98,62,0.18),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(17,24,39,0.14),_transparent_30%),linear-gradient(180deg,_#fff8f5_0%,_#f4f7fb_100%)] px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-[1480px] gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="surface-muted relative overflow-hidden p-8 md:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top_left,_rgba(255,98,62,0.24),_transparent_60%)]" />
          <div className="relative flex h-full flex-col justify-between gap-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-neutral-600 ring-1 ring-neutral-200">
                <Sparkles className="size-4 text-brand-600" />
                Secure workflow orchestration
              </div>

              <div className="space-y-5">
                <h2 className="max-w-2xl font-display text-5xl font-semibold tracking-[-0.07em] text-neutral-950 md:text-6xl lg:text-7xl">
                  Route every team with <span className="text-brand-600">precision</span> and proof.
                </h2>
                <p className="max-w-xl text-base leading-8 text-neutral-500">
                  A focused command surface for auth, scoped records, permission overrides, audit history, and customer self-service.
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                { label: "Resolved routes", value: "8 core modules" },
                { label: "Session controls", value: "refresh rotation" },
                { label: "Audit certainty", value: "append-only trail" },
              ].map((item) => (
                <div key={item.label} className="rounded-[28px] bg-neutral-950 px-5 py-5 text-white shadow-[0_30px_70px_-40px_rgba(17,24,39,0.9)]">
                  <p className="text-xs uppercase tracking-[0.24em] text-white/50">{item.label}</p>
                  <p className="mt-4 font-display text-2xl tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                "Permission-aware sidebar and page gating",
                "Cookie-backed auth with session visibility",
                "Scoped user, lead, task, and report workflows",
                "Audit-safe admin and manager actions",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-[24px] bg-white/80 px-4 py-4 ring-1 ring-white/70">
                  <CheckCircle2 className="size-5 text-brand-600" />
                  <span className="text-sm text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative flex items-center justify-center">
          <div className="absolute right-8 top-10 hidden rounded-full bg-white/85 px-4 py-2 text-sm font-medium text-neutral-600 ring-1 ring-neutral-200 md:flex md:items-center md:gap-2">
            <ShieldCheck className="size-4 text-brand-600" />
            Protected by scoped access
          </div>
          <div className="w-full max-w-xl space-y-6">
            <LoginForm next={next} />
            <div className="flex items-center justify-between rounded-[28px] bg-white/80 px-5 py-4 text-sm text-neutral-500 ring-1 ring-white/70">
              <span>Need a fresh permission baseline?</span>
              <span className="inline-flex items-center gap-2 font-medium text-neutral-900">
                Contact an admin
                <ArrowRight className="size-4" />
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
