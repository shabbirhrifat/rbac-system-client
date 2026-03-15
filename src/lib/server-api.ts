import { cookies } from "next/headers";
import { ACCESS_COOKIE_NAME, getApiBaseUrl, REFRESH_COOKIE_NAME } from "@/lib/config";
import type { AuthPayload, RouteContext } from "@/types/api";

type ApiRequestOptions = {
  auth?: boolean;
  raw?: boolean;
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

  if (!response.ok) {
    const payload = await parseResponse(response);
    throw new ApiError(getErrorMessage(payload), response.status, payload);
  }

  return (await parseResponse(response)) as T;
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

export async function getCurrentUser() {
  return backendRequest<Omit<AuthPayload, "accessToken" | "accessTokenExpiresIn">>(
    "/auth/me",
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
