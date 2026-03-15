"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { backendRequestWithResponse } from "@/lib/server-api";

export async function createUserAction(formData: FormData) {
  await backendRequestWithResponse("/users", {
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

  revalidatePath("/users");
  redirect("/users");
}

export async function updateUserAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/users/${id}`, {
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

  revalidatePath(`/users/${id}`);
  revalidatePath("/users");
  redirect(`/users/${id}`);
}

export async function updateUserStatusAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/users/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: getString(formData, "status") }),
  });

  revalidatePath(`/users/${id}`);
  revalidatePath("/users");
  redirect(`/users/${id}`);
}

export async function updateUserManagerAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/users/${id}/manager`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ managerId: getOptionalString(formData, "managerId") }),
  });

  revalidatePath(`/users/${id}`);
  revalidatePath("/users");
  redirect(`/users/${id}`);
}

export async function replaceUserOverridesAction(formData: FormData) {
  const id = getString(formData, "id");
  const overrides = parseOverrides(String(formData.get("overrides") ?? ""));

  await backendRequestWithResponse(`/access/users/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ overrides }),
  });

  revalidatePath(`/users/${id}/permissions`);
  redirect(`/users/${id}/permissions`);
}

export async function createLeadAction(formData: FormData) {
  await backendRequestWithResponse("/leads", {
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

  revalidatePath("/leads");
  redirect("/leads");
}

export async function updateLeadAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/leads/${id}`, {
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

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/leads/${id}`);
}

export async function updateLeadStatusAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/leads/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: getString(formData, "status") }),
  });

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/leads/${id}`);
}

export async function assignLeadAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/leads/${id}/assign`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ assignedToUserId: getOptionalString(formData, "assignedToUserId") }),
  });

  revalidatePath(`/leads/${id}`);
  revalidatePath("/leads");
  redirect(`/leads/${id}`);
}

export async function createTaskAction(formData: FormData) {
  await backendRequestWithResponse("/tasks", {
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

  revalidatePath("/tasks");
  redirect("/tasks");
}

export async function updateTaskAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/tasks/${id}`, {
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

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
  redirect(`/tasks/${id}`);
}

export async function updateTaskStatusAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/tasks/${id}/status`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ status: getString(formData, "status") }),
  });

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
  redirect(`/tasks/${id}`);
}

export async function assignTaskAction(formData: FormData) {
  const id = getString(formData, "id");
  await backendRequestWithResponse(`/tasks/${id}/assign`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ assignedToUserId: getOptionalString(formData, "assignedToUserId") }),
  });

  revalidatePath(`/tasks/${id}`);
  revalidatePath("/tasks");
  redirect(`/tasks/${id}`);
}

export async function updateSettingsProfileAction(formData: FormData) {
  await backendRequestWithResponse("/settings/profile", {
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

  revalidatePath("/settings");
  redirect("/settings");
}

export async function updateAppSettingAction(formData: FormData) {
  const key = getString(formData, "key");
  const value = String(formData.get("value") ?? "{}").trim();

  await backendRequestWithResponse(`/settings/app/${key}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ value: JSON.parse(value || "{}") }),
  });

  revalidatePath("/settings");
  redirect("/settings");
}

export async function updatePortalProfileAction(formData: FormData) {
  await backendRequestWithResponse("/portal/profile", {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: getOptionalString(formData, "firstName"),
      lastName: getOptionalString(formData, "lastName"),
      phone: getOptionalString(formData, "phone"),
    }),
  });

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
