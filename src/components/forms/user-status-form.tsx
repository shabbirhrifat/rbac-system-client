import { updateUserManagerAction, updateUserStatusAction } from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { UserDetail, UserListItem } from "@/types/api";

export function UserStatusForm({ user, managers }: { user: UserDetail; managers: UserListItem[] }) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <form action={updateUserStatusAction} className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4">
        <input type="hidden" name="id" value={user.id} />
        <label className="space-y-2">
          <span className="field-label">Account status</span>
          <Select name="status" defaultValue={user.status}>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </Select>
        </label>
        <Button type="submit" variant="outline" className="w-full md:w-fit">Update status</Button>
      </form>

      <form action={updateUserManagerAction} className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4">
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
        <Button type="submit" variant="outline" className="w-full md:w-fit">Reassign manager</Button>
      </form>
    </div>
  );
}
