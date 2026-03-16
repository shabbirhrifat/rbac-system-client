"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backendRequestWithResponse } from "@/lib/server-api";

export type ActionState = {
  success?: string;
  error?: string;
};

const emptyState: ActionState = {};

async function safeRequest(
  path: string,
  init: RequestInit,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await backendRequestWithResponse(path, init) as unknown as Response;
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      const message = Array.isArray(payload?.message)
        ? payload.message.join(", ")
        : payload?.message ?? "Request failed";
      return { ok: false, error: message };
    }
    return { ok: true };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { ok: false, error: message };
  }
}

export async function createUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await safeRequest("/users", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: getString(formData, "email"),
      password: getString(formData, "password"),
      firstName: getString(formData, "firstName"),
      lastName: getString(formData, "lastName"),
      phone: getOptionalString(formData, "phone"),
      roleKey: getString(formData, "roleKey"),
      managerId: getOptionalString(formData, "managerId"),
      status: getOptionalString(formData, "status"),
    }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUserAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/users/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: getOptionalString(formData, "email"),
      firstName: getOptionalString(formData, "firstName"),
      lastName: getOptionalString(formData, "lastName"),
      phone: getOptionalString(formData, "phone"),
      roleKey: getOptionalString(formData, "roleKey"),
      managerId: getOptionalString(formData, "managerId"),
    }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/users/${id}`);
  revalidatePath("/users");
  redirect(`/users/${id}`);
}

export async function updateUserStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/users/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: getString(formData, "status") }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/users/${id}`);
  revalidatePath("/users");
  redirect(`/users/${id}`);
}

export async function updateUserManagerAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/users/${id}/manager`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ managerId: getOptionalString(formData, "managerId") }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/users/${id}`);
  revalidatePath("/users");
  redirect(`/users/${id}`);
}

export async function replaceUserOverridesAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const overrides = parseOverrides(String(formData.get("overrides") ?? ""));

  const result = await safeRequest(`/access/users/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ overrides }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/users/${id}/permissions`);
  redirect(`/users/${id}/permissions`);
}

export async function createLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await safeRequest("/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: getString(formData, "name"),
      email: getOptionalString(formData, "email"),
      phone: getOptionalString(formData, "phone"),
      company: getOptionalString(formData, "company"),
      source: getOptionalString(formData, "source"),
      notes: getOptionalString(formData, "notes"),
      assignedToUserId: getOptionalString(formData, "assignedToUserId"),
      customerId: getOptionalString(formData, "customerId"),
    }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/leads");
  redirect("/leads");
}

export async function updateLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/leads/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: getOptionalString(formData, "name"),
      email: getOptionalString(formData, "email"),
      phone: getOptionalString(formData, "phone"),
      company: getOptionalString(formData, "company"),
      source: getOptionalString(formData, "source"),
      notes: getOptionalString(formData, "notes"),
      customerId: getOptionalString(formData, "customerId"),
    }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/leads/${id}`);
}

export async function updateLeadStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/leads/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: getString(formData, "status") }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/leads/${id}`);
}

export async function assignLeadAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/leads/${id}/assign`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ assignedToUserId: getOptionalString(formData, "assignedToUserId") }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/leads/${id}`);
}

export async function createTaskAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await safeRequest("/tasks", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: getString(formData, "title"),
      description: getOptionalString(formData, "description"),
      priority: getOptionalString(formData, "priority"),
      dueAt: getOptionalString(formData, "dueAt"),
      assignedToUserId: getOptionalString(formData, "assignedToUserId"),
      leadId: getOptionalString(formData, "leadId"),
      customerId: getOptionalString(formData, "customerId"),
    }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function updateTaskAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/tasks/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      title: getOptionalString(formData, "title"),
      description: getOptionalString(formData, "description"),
      priority: getOptionalString(formData, "priority"),
      dueAt: getOptionalString(formData, "dueAt"),
      leadId: getOptionalString(formData, "leadId"),
      customerId: getOptionalString(formData, "customerId"),
    }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
  redirect(`/tasks/${id}`);
}

export async function updateTaskStatusAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/tasks/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: getString(formData, "status") }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
  redirect(`/tasks/${id}`);
}

export async function assignTaskAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = getString(formData, "id");
  const result = await safeRequest(`/tasks/${id}/assign`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ assignedToUserId: getOptionalString(formData, "assignedToUserId") }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
  redirect(`/tasks/${id}`);
}

export async function updateSettingsProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await safeRequest("/settings/profile", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: getOptionalString(formData, "firstName"),
      lastName: getOptionalString(formData, "lastName"),
      phone: getOptionalString(formData, "phone"),
      timezone: getOptionalString(formData, "timezone"),
      locale: getOptionalString(formData, "locale"),
      sidebarCollapsed: getBoolean(formData, "sidebarCollapsed"),
      currentPassword: getOptionalString(formData, "currentPassword"),
      newPassword: getOptionalString(formData, "newPassword"),
    }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/settings");
  redirect("/settings");
}

export async function updateAppSettingAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const key = getString(formData, "key");
  const value = String(formData.get("value") ?? "{}").trim();

  let parsed;
  try {
    parsed = JSON.parse(value || "{}");
  } catch {
    return { error: "Invalid JSON payload" };
  }

  const result = await safeRequest(`/settings/app/${key}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ value: parsed }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/settings");
  redirect("/settings");
}

export async function updatePortalProfileAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = await safeRequest("/portal/profile", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: getOptionalString(formData, "firstName"),
      lastName: getOptionalString(formData, "lastName"),
      phone: getOptionalString(formData, "phone"),
    }),
  });

  if (!result.ok) return { error: result.error };

  revalidatePath("/portal");
  redirect("/portal");
}

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function getOptionalString(formData: FormData, key: string) {
  const value = getString(formData, key);
  return value || undefined;
}

function getBoolean(formData: FormData, key: string) {
  return formData.get(key) === "on";
}

function parseOverrides(input: string) {
  return input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [permissionKey, effect, expiresAt] = line.split(":").map((item) => item.trim());
      return {
        permissionKey,
        effect,
        expiresAt: expiresAt || undefined,
      };
    });
}
