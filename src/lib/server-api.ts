import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE_NAME, getApiBaseUrl, REFRESH_COOKIE_NAME } from "@/lib/config";
import type { AuthPayload, RouteContext } from "@/types/api";

type ApiRequestOptions = {
  auth?: boolean;
  raw?: boolean;
  redirectOnUnauthorized?: boolean;
};

export class ApiError extends Error {
  status: number;
  payload: unknown;

  constructor(message: string, status: number, payload: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildRefreshCookieHeader(refreshToken?: string) {
  return refreshToken ? `${REFRESH_COOKIE_NAME}=${refreshToken}` : undefined;
}

export async function backendRequest<T>(
  path: string,
  init: RequestInit = {},
  options: ApiRequestOptions = {},
): Promise<T> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE_NAME)?.value;
  const refreshToken = cookieStore.get(REFRESH_COOKIE_NAME)?.value;

  const headers = new Headers(init.headers);
  const authEnabled = options.auth ?? true;

  if (authEnabled && accessToken) {
    headers.set("authorization", `Bearer ${accessToken}`);
  }

  const refreshCookie = buildRefreshCookieHeader(refreshToken);

  if (refreshCookie) {
    headers.set("cookie", refreshCookie);
  }

  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  if (options.raw) {
    return response as T;
  }

  // ── Auto-refresh on 401: try to get a new access token and retry ──
  if (response.status === 401 && refreshToken && authEnabled) {
    const retryResult = await refreshAndRetry<T>(path, init, refreshToken);
    if (retryResult !== null) return retryResult;

    // Refresh failed — clear stale cookies if possible, then redirect or throw
    try {
      const cs = await cookies();
      cs.delete(ACCESS_COOKIE_NAME);
      cs.delete(REFRESH_COOKIE_NAME);
    } catch {
      // cookie mutation not allowed during rendering — proxy handles it
    }

    if (options.redirectOnUnauthorized) {
      redirect("/login");
    }

    const payload = await parseResponse(response);
    throw new ApiError(getErrorMessage(payload), response.status, payload);
  }

  if (!response.ok) {
    const payload = await parseResponse(response);

    if (response.status === 401 && options.redirectOnUnauthorized) {
      redirect("/login");
    }

    throw new ApiError(getErrorMessage(payload), response.status, payload);
  }

  return (await parseResponse(response)) as T;
}

async function refreshAndRetry<T>(
  path: string,
  init: RequestInit,
  refreshToken: string,
): Promise<T | null> {
  try {
    const refreshResponse = await fetch(`${getApiBaseUrl()}/auth/refresh`, {
      method: "POST",
      headers: { cookie: `${REFRESH_COOKIE_NAME}=${refreshToken}` },
      cache: "no-store",
    });

    if (!refreshResponse.ok) return null;

    const data = await refreshResponse.json();
    if (!data.accessToken) return null;

    // Persist the new access token cookie (best-effort; fails during rendering)
    try {
      const cookieStore = await cookies();
      cookieStore.set(ACCESS_COOKIE_NAME, data.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: data.accessTokenExpiresIn ?? 900,
      });
    } catch {
      // Not in a mutable context — the proxy will handle cookie persistence
    }

    // Retry the original request with the fresh access token
    const retryHeaders = new Headers(init.headers);
    retryHeaders.set("authorization", `Bearer ${data.accessToken}`);

    const retryRefreshCookie = buildRefreshCookieHeader(refreshToken);
    if (retryRefreshCookie) {
      retryHeaders.set("cookie", retryRefreshCookie);
    }

    const retryResponse = await fetch(`${getApiBaseUrl()}${path}`, {
      ...init,
      headers: retryHeaders,
      cache: "no-store",
    });

    if (!retryResponse.ok) return null;

    return (await parseResponse(retryResponse)) as T;
  } catch {
    return null;
  }
}

export async function backendRequestWithResponse(
  path: string,
  init: RequestInit = {},
  options: Omit<ApiRequestOptions, "raw"> = {},
) {
  return backendRequest<Response>(path, init, { ...options, raw: true });
}

export async function getSessionRouteContext(): Promise<RouteContext> {
  try {
    return await backendRequest<RouteContext>("/auth/route-context", {
      method: "GET",
    });
  } catch {
    return {
      authenticated: false,
      pagePermissions: [],
      routes: [],
      sidebarItems: [],
    };
  }
}

export async function getCurrentUser(redirectOnUnauthorized = false) {
  return backendRequest<Omit<AuthPayload, "accessToken" | "accessTokenExpiresIn">>(
    "/auth/me",
    {},
    { redirectOnUnauthorized },
  );
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

function getErrorMessage(payload: unknown) {
  if (typeof payload === "string") {
    return payload;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    typeof payload.message === "string"
  ) {
    return payload.message;
  }

  if (
    payload &&
    typeof payload === "object" &&
    "message" in payload &&
    Array.isArray(payload.message)
  ) {
    return payload.message.join(", ");
  }

  return "Request failed";
}
