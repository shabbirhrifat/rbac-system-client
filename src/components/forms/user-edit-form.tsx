"use client";

import { LoaderCircle } from "lucide-react";
import { updateUserAction } from "@/actions/resources";
import { useSheetAutoClose } from "@/components/forms/create-form-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useFormAction } from "@/lib/use-form-action";
import type { UserDetail, UserListItem } from "@/types/api";

export function UserEditForm({ user, managers }: { user: UserDetail; managers: UserListItem[] }) {
  const sheet = useSheetAutoClose();
  const { formAction, pending } = useFormAction(updateUserAction, {
    onSuccess: () => sheet?.close(),
  });

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="id" value={user.id} />
      <div className="form-grid">
        <label className="space-y-2">
          <span className="field-label">First name</span>
          <Input name="firstName" defaultValue={user.firstName} required />
        </label>
        <label className="space-y-2">
          <span className="field-label">Last name</span>
          <Input name="lastName" defaultValue={user.lastName} required />
        </label>
        <label className="space-y-2">
          <span className="field-label">Email</span>
          <Input name="email" type="email" defaultValue={user.email} required />
        </label>
        <label className="space-y-2">
          <span className="field-label">Phone</span>
          <Input name="phone" defaultValue={user.phone ?? ""} />
        </label>
        <label className="space-y-2">
          <span className="field-label">Role</span>
          <Select name="roleKey" defaultValue={user.role.key}>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </Select>
        </label>
        <label className="space-y-2">
          <span className="field-label">Manager</span>
          <Select name="managerId" defaultValue={user.managerId ?? ""}>
            <option value="">No manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Saving..." : "Save profile changes"}
      </Button>
    </form>
  );
}
