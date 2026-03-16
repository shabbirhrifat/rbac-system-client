import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ACCESS_COOKIE_NAME, getApiBaseUrl, REFRESH_COOKIE_NAME } from "@/lib/config";
import { getDefaultRoute, getPagePermission } from "@/lib/routes";
import type { RouteContext } from "@/types/api";

const PUBLIC_ROUTES = new Set(["/login", "/403"]);

type RefreshResult = {
  accessToken: string;
  accessTokenExpiresIn: number;
  refreshTokenValue?: string;
  refreshTokenMaxAge?: number;
};

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  // ── Token refresh: access token expired but refresh token still valid ──
  let freshTokens: RefreshResult | null = null;

  if (!accessToken && refreshToken) {
    freshTokens = await tryRefreshTokens(refreshToken);

    if (!freshTokens) {
      // Refresh token is also invalid/expired — clear stale cookies.
      if (PUBLIC_ROUTES.has(pathname)) {
        const res = NextResponse.next();
        clearCookies(res);
        return res;
      }

      const loginUrl = new URL("/login", request.url);
      if (pathname !== "/" && pathname !== "/login") {
        loginUrl.searchParams.set("next", `${pathname}${search}`);
      }
      const res = NextResponse.redirect(loginUrl);
      clearCookies(res);
      return res;
    }
  }

  const context = await getRouteContext(request, freshTokens?.accessToken);

  // ── "/" → redirect to default route or login ──
  if (pathname === "/") {
    const target = context.authenticated
      ? getDefaultRoute(context.routes, context.sidebarItems)
      : "/login";
    const res = NextResponse.redirect(new URL(target, request.url));
    if (freshTokens) setTokenCookies(res, freshTokens);
    return res;
  }

  // ── Already authenticated on /login → redirect to app ──
  if (pathname === "/login" && context.authenticated) {
    const res = NextResponse.redirect(
      new URL(getDefaultRoute(context.routes, context.sidebarItems), request.url),
    );
    if (freshTokens) setTokenCookies(res, freshTokens);
    return res;
  }

  // ── Public routes pass through ──
  if (PUBLIC_ROUTES.has(pathname)) {
    const res = NextResponse.next();
    if (freshTokens) setTokenCookies(res, freshTokens);
    return res;
  }

  // ── Unauthenticated → redirect to login (clear stale cookies to stop loops) ──
  if (!context.authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    const res = NextResponse.redirect(loginUrl);
    if (accessToken || refreshToken) clearCookies(res);
    return res;
  }

  // ── Permission check ──
  const requiredPermission = getPagePermission(pathname);

  if (requiredPermission && !context.pagePermissions.includes(requiredPermission)) {
    const res = NextResponse.redirect(new URL("/403", request.url));
    if (freshTokens) setTokenCookies(res, freshTokens);
    return res;
  }

  const res = NextResponse.next();
  if (freshTokens) setTokenCookies(res, freshTokens);
  return res;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

// ────────────────────────── Helpers ──────────────────────────

async function tryRefreshTokens(refreshToken: string): Promise<RefreshResult | null> {
  try {
    const response = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: { cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}` },
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = await response.json();
    if (!data.accessToken) return null;

    // Extract the rotated refresh token from the Set-Cookie header
    const setCookie = response.headers.get("set-cookie") ?? "";
    const refreshMatch = setCookie.match(new RegExp(`${REFRESH_COOKIE_NAME}=([^;]+)`));
    const maxAgeMatch = setCookie.match(/Max-Age=(\d+)/i);

    return {
      accessToken: data.accessToken,
      accessTokenExpiresIn: data.accessTokenExpiresIn ?? 900,
      refreshTokenValue: refreshMatch?.[1],
      refreshTokenMaxAge: maxAgeMatch ? Number(maxAgeMatch[1]) : 7 * 24 * 60 * 60,
    };
  } catch {
    return null;
  }
}

function setTokenCookies(response: NextResponse, tokens: RefreshResult) {
  response.cookies.set(ACCESS_COOKIE_NAME, tokens.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: tokens.accessTokenExpiresIn,
  });

  if (tokens.refreshTokenValue) {
    response.cookies.set(REFRESH_COOKIE_NAME, tokens.refreshTokenValue, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: tokens.refreshTokenMaxAge ?? 7 * 24 * 60 * 60,
    });
  }
}

function clearCookies(response: NextResponse) {
  response.cookies.delete(ACCESS_COOKIE_NAME);
  response.cookies.delete(REFRESH_COOKIE_NAME);
}

async function getRouteContext(
  request: NextRequest,
  freshAccessToken?: string,
): Promise<RouteContext> {
  const accessToken = freshAccessToken ?? request.cookies.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_COOKIE_NAME)?.value;

  if (!accessToken && !refreshToken) {
    return {
      authenticated: false,
      pagePermissions: [],
      routes: [],
      sidebarItems: [],
    };
  }

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
