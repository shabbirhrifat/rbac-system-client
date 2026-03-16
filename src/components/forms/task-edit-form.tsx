"use client";

import { LoaderCircle } from "lucide-react";
import {
  assignTaskAction,
  updateTaskAction,
  updateTaskStatusAction,
} from "@/actions/resources";
import { useSheetAutoClose } from "@/components/forms/create-form-sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/lib/use-form-action";
import type { Lead, Task, UserListItem } from "@/types/api";

export function TaskEditForm({
  task,
  users,
  leads,
  customers,
  canEditTask,
  canChangeStatus,
  canAssignTask,
}: {
  task: Task;
  users: UserListItem[];
  leads: Lead[];
  customers: UserListItem[];
  canEditTask: boolean;
  canChangeStatus: boolean;
  canAssignTask: boolean;
}) {
  const sheet = useSheetAutoClose();
  const editAction = useFormAction(updateTaskAction, {
    onSuccess: () => sheet?.close(),
  });
  const statusAction = useFormAction(updateTaskStatusAction, {
    onSuccess: () => sheet?.close(),
  });
  const assignAction = useFormAction(assignTaskAction, {
    onSuccess: () => sheet?.close(),
  });

  return (
    <div className="grid gap-5">
      {canEditTask ? (
        <form
          action={editAction.formAction}
          className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5"
        >
          <input type="hidden" name="id" value={task.id} />
          <div className="form-grid">
            <label className="space-y-2">
              <span className="field-label">Title</span>
              <Input name="title" defaultValue={task.title} required />
            </label>
            <label className="space-y-2">
              <span className="field-label">Priority</span>
              <Select name="priority" defaultValue={task.priority}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </Select>
            </label>
            <label className="space-y-2">
              <span className="field-label">Due at</span>
              <Input
                name="dueAt"
                type="datetime-local"
                defaultValue={task.dueAt ? task.dueAt.slice(0, 16) : ""}
              />
            </label>
            <label className="space-y-2">
              <span className="field-label">Lead link</span>
              <Select name="leadId" defaultValue={task.lead?.id ?? ""}>
                <option value="">No lead</option>
                {leads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2">
              <span className="field-label">Customer link</span>
              <Select name="customerId" defaultValue={task.customer?.id ?? ""}>
                <option value="">No customer</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="field-label">Description</span>
              <Textarea
                name="description"
                defaultValue={task.description ?? ""}
              />
            </label>
          </div>
          <Button
            type="submit"
            disabled={editAction.pending}
            className="w-full sm:w-fit"
          >
            {editAction.pending ? (
              <LoaderCircle className="size-4 animate-spin mr-2" />
            ) : null}
            {editAction.pending ? "Saving..." : "Save task changes"}
          </Button>
        </form>
      ) : null}

      {canChangeStatus || canAssignTask ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {canChangeStatus ? (
            <form
              action={statusAction.formAction}
               className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5"
            >
              <input type="hidden" name="id" value={task.id} />
              <label className="space-y-2">
                <span className="field-label">Status</span>
                <Select name="status" defaultValue={task.status}>
                  <option value="todo">To do</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </label>
              <Button
                type="submit"
                variant="outline"
                disabled={statusAction.pending}
                 className="w-full sm:w-fit"
              >
                {statusAction.pending ? (
                  <LoaderCircle className="size-4 animate-spin mr-2" />
                ) : null}
                {statusAction.pending ? "Updating..." : "Update status"}
              </Button>
            </form>
          ) : null}

          {canAssignTask ? (
            <form
              action={assignAction.formAction}
               className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4 sm:p-5"
            >
              <input type="hidden" name="id" value={task.id} />
              <label className="space-y-2">
                <span className="field-label">Assignee</span>
                <Select
                  name="assignedToUserId"
                  defaultValue={task.assignedToUser?.id ?? ""}
                >
                  <option value="">Unassigned</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName} {user.lastName}
                    </option>
                  ))}
                </Select>
              </label>
              <Button
                type="submit"
                variant="outline"
                disabled={assignAction.pending}
                 className="w-full sm:w-fit"
              >
                {assignAction.pending ? (
                  <LoaderCircle className="size-4 animate-spin mr-2" />
                ) : null}
                {assignAction.pending ? "Assigning..." : "Assign task"}
              </Button>
            </form>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
