import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDefaultRoute } from "@/lib/routes";
import { getSessionRouteContext } from "@/lib/server-api";
import { ACCESS_COOKIE_NAME, REFRESH_COOKIE_NAME } from "@/lib/config";
import { LoginPageContent } from "@/app/(auth)/login/login-page-content";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const cookieStore = await cookies();
  const hasSessionCookie =
    cookieStore.has(ACCESS_COOKIE_NAME) || cookieStore.has(REFRESH_COOKIE_NAME);
  const context = hasSessionCookie
    ? await getSessionRouteContext()
    : {
        authenticated: false,
        pagePermissions: [],
        routes: [],
        sidebarItems: [],
      };

  if (context.authenticated) {
    redirect(getDefaultRoute(context.routes, context.sidebarItems));
  }

  const resolvedSearchParams = await searchParams;
  const next = typeof resolvedSearchParams.next === "string" ? resolvedSearchParams.next : undefined;

  return <LoginPageContent next={next} />;
}
