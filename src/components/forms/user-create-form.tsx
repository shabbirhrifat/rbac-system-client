"use client";

import { LoaderCircle } from "lucide-react";
import { createUserAction } from "@/actions/resources";
import { useSheetAutoClose } from "@/components/forms/create-form-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useFormAction } from "@/lib/use-form-action";
import type { UserListItem } from "@/types/api";

export function UserCreateForm({ managers }: { managers: UserListItem[] }) {
  const sheet = useSheetAutoClose();
  const { formAction, pending } = useFormAction(createUserAction, {
    onSuccess: () => sheet?.close(),
  });

  return (
    <form action={formAction} className="grid gap-5">
      <div className="form-grid">
        <label className="space-y-2">
          <span className="field-label">First name</span>
          <Input name="firstName" required />
        </label>
        <label className="space-y-2">
          <span className="field-label">Last name</span>
          <Input name="lastName" required />
        </label>
        <label className="space-y-2">
          <span className="field-label">Email</span>
          <Input name="email" type="email" required />
        </label>
        <label className="space-y-2">
          <span className="field-label">Phone</span>
          <Input name="phone" />
        </label>
        <label className="space-y-2">
          <span className="field-label">Password</span>
          <Input name="password" type="password" required />
        </label>
        <label className="space-y-2">
          <span className="field-label">Role</span>
          <Select name="roleKey" defaultValue="agent">
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </Select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Manager</span>
          <Select name="managerId" defaultValue="">
            <option value="">No manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName}
              </option>
            ))}
          </Select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Status</span>
          <Select name="status" defaultValue="active">
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </Select>
        </label>
      </div>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Creating..." : "Create user"}
      </Button>
    </form>
  );
}
