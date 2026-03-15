import { redirect } from "next/navigation";
import { getSessionRouteContext } from "@/lib/server-api";
import { getDefaultRoute } from "@/lib/routes";

export default async function HomePage() {
  const context = await getSessionRouteContext();

  if (!context.authenticated) {
    redirect("/login");
  }

  redirect(getDefaultRoute(context.routes, context.sidebarItems));
}
