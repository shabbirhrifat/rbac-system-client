import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, getApiBaseUrl, REFRESH_COOKIE_NAME } from "@/lib/config";
import { getDefaultRoute, getPagePermission } from "@/lib/routes";
import type { RouteContext } from "@/types/api";

const PUBLIC_ROUTES = new Set(["/login", "/403"]);

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const context = await getRouteContext(request);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(
        context.authenticated
          ? getDefaultRoute(context.routes, context.sidebarItems)
          : "/login",
        request.url,
      ),
    );
  }

  if (pathname === "/login" && context.authenticated) {
    return NextResponse.redirect(
      new URL(getDefaultRoute(context.routes, context.sidebarItems), request.url),
    );
  }

  if (PUBLIC_ROUTES.has(pathname)) {
    return NextResponse.next();
  }

  if (!context.authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  const requiredPermission = getPagePermission(pathname);

  if (requiredPermission && !context.pagePermissions.includes(requiredPermission)) {
    return NextResponse.redirect(new URL("/403", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

async function getRouteContext(request: NextRequest): Promise<RouteContext> {
  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;
  const headers = new Headers();

  if (accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  if (refreshToken) {
    headers.set("cookie", `${REFRESH_COOKIE_NAME}=${refreshToken}`);
  }

  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/route-context`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error("Route context failed");
    }

    return (await response.json()) as RouteContext;
  } catch {
    return {
      authenticated: false,
      pagePermissions: [],
      routes: [],
      sidebarItems: [],
    };
  }
}
