"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE_NAME, getApiBaseUrl, isProduction, REFRESH_COOKIE_NAME } from "@/lib/config";
import { getDefaultRoute } from "@/lib/routes";
import { backendRequestWithResponse } from "@/lib/server-api";
import type { AuthPayload } from "@/types/api";

export type LoginActionState = {
  error?: string;
};

export async function loginAction(
  _previousState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "").trim();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message ?? "Unable to sign in.";

    return { error: message };
  }

  await persistAuthCookies(response, payload as AuthPayload);
  redirect(next || getDefaultRoute(payload.routes, payload.sidebarItems));
}

export async function logoutAction() {
  try {
    await backendRequestWithResponse("/auth/logout", { method: "POST" });
  } catch {
    // Ignore logout transport errors and still clear local cookies.
  }

  await clearAuthCookies();
  redirect("/login");
}

export async function logoutAllAction() {
  try {
    await backendRequestWithResponse("/auth/logout-all", { method: "POST" });
  } catch {
    // Ignore logout transport errors and still clear local cookies.
  }

  await clearAuthCookies();
  redirect("/login");
}

export async function revokeSessionAction(formData: FormData) {
  const sessionId = String(formData.get("sessionId") ?? "").trim();

  if (!sessionId) {
    return;
  }

  await backendRequestWithResponse(`/auth/sessions/${sessionId}`, {
    method: "DELETE",
  });
}

async function persistAuthCookies(response: Response, payload: AuthPayload) {
  const cookieStore = await cookies();
  const rawSetCookie = response.headers.get("set-cookie") ?? "";
  const refreshCookie = extractCookieFromHeader(rawSetCookie, REFRESH_COOKIE_NAME);

  cookieStore.set(ACCESS_COOKIE_NAME, payload.accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: isProduction(),
    path: "/",
    maxAge: payload.accessTokenExpiresIn,
  });

  if (refreshCookie?.value) {
    cookieStore.set(REFRESH_COOKIE_NAME, refreshCookie.value, {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction(),
      path: "/",
      maxAge: refreshCookie.maxAge,
    });
  }
}

async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE_NAME);
  cookieStore.delete(REFRESH_COOKIE_NAME);
}

function extractCookieFromHeader(header: string, cookieName: string) {
  const match = header.match(new RegExp(`${cookieName}=([^;]+)`));
  const maxAgeMatch = header.match(/Max-Age=(\d+)/i);

  if (!match) {
    return null;
  }

  return {
    value: match[1],
    maxAge: maxAgeMatch ? Number(maxAgeMatch[1]) : 60 * 60 * 24 * 7,
  };
}
