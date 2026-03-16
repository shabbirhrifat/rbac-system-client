import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell/app-shell";
import { getCurrentUser } from "@/lib/server-api";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser(true).catch(() => null);

  if (!me) {
    redirect("/login");
  }

  return (
    <AppShell currentUser={me.user} sidebarItems={me.sidebarItems}>
      {children}
    </AppShell>
  );
}
