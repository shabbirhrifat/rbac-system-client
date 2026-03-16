"use client";

import { LoaderCircle } from "lucide-react";
import { updateUserManagerAction, updateUserStatusAction } from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { useFormAction } from "@/lib/use-form-action";
import type { UserDetail, UserListItem } from "@/types/api";

export function UserStatusForm({ user, managers }: { user: UserDetail; managers: UserListItem[] }) {
  const statusAction = useFormAction(updateUserStatusAction);
  const managerAction = useFormAction(updateUserManagerAction);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form action={statusAction.formAction} className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5">
        <input type="hidden" name="id" value={user.id} />
        <label className="space-y-2">
          <span className="field-label">Account status</span>
          <Select name="status" defaultValue={user.status}>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </Select>
        </label>
        <Button type="submit" variant="outline" disabled={statusAction.pending} className="w-full sm:w-fit">
          {statusAction.pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
          {statusAction.pending ? "Updating..." : "Update status"}
        </Button>
      </form>

      <form action={managerAction.formAction} className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5">
        <input type="hidden" name="id" value={user.id} />
        <label className="space-y-2">
          <span className="field-label">Assigned manager</span>
          <Select name="managerId" defaultValue={user.managerId ?? ""}>
            <option value="">No manager</option>
            {managers.map((manager) => (
              <option key={manager.id} value={manager.id}>
                {manager.firstName} {manager.lastName}
              </option>
            ))}
          </Select>
        </label>
        <Button type="submit" variant="outline" disabled={managerAction.pending} className="w-full sm:w-fit">
          {managerAction.pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
          {managerAction.pending ? "Reassigning..." : "Reassign manager"}
        </Button>
      </form>
    </div>
  );
}
