"use client";

import { LoaderCircle } from "lucide-react";
import {
  assignLeadAction,
  updateLeadAction,
  updateLeadStatusAction,
} from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/lib/use-form-action";
import type { Lead, UserListItem } from "@/types/api";

export function LeadEditForm({
  lead,
  users,
  customers,
  canEditLead,
  canChangeStatus,
  canAssignLead,
}: {
  lead: Lead;
  users: UserListItem[];
  customers: UserListItem[];
  canEditLead: boolean;
  canChangeStatus: boolean;
  canAssignLead: boolean;
}) {
  const editAction = useFormAction(updateLeadAction);
  const statusAction = useFormAction(updateLeadStatusAction);
  const assignAction = useFormAction(assignLeadAction);

  return (
    <div className="grid gap-5">
      {canEditLead ? (
        <form
          action={editAction.formAction}
          className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4"
        >
          <input type="hidden" name="id" value={lead.id} />
          <div className="form-grid">
            <label className="space-y-2">
              <span className="field-label">Name</span>
              <Input name="name" defaultValue={lead.name} required />
            </label>
            <label className="space-y-2">
              <span className="field-label">Company</span>
              <Input name="company" defaultValue={lead.company ?? ""} />
            </label>
            <label className="space-y-2">
              <span className="field-label">Email</span>
              <Input
                name="email"
                type="email"
                defaultValue={lead.email ?? ""}
              />
            </label>
            <label className="space-y-2">
              <span className="field-label">Phone</span>
              <Input name="phone" defaultValue={lead.phone ?? ""} />
            </label>
            <label className="space-y-2">
              <span className="field-label">Source</span>
              <Input name="source" defaultValue={lead.source ?? ""} />
            </label>
            <label className="space-y-2">
              <span className="field-label">Customer</span>
              <Select name="customerId" defaultValue={lead.customer?.id ?? ""}>
                <option value="">No customer linked</option>
                {customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.firstName} {customer.lastName}
                  </option>
                ))}
              </Select>
            </label>
            <label className="space-y-2 md:col-span-2">
              <span className="field-label">Notes</span>
              <Textarea name="notes" defaultValue={lead.notes ?? ""} />
            </label>
          </div>
          <Button
            type="submit"
            disabled={editAction.pending}
            className="w-full md:w-fit"
          >
            {editAction.pending ? (
              <LoaderCircle className="size-4 animate-spin mr-2" />
            ) : null}
            {editAction.pending ? "Saving..." : "Save lead profile"}
          </Button>
        </form>
      ) : null}

      {canChangeStatus || canAssignLead ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {canChangeStatus ? (
            <form
              action={statusAction.formAction}
              className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4"
            >
              <input type="hidden" name="id" value={lead.id} />
              <label className="space-y-2">
                <span className="field-label">Status</span>
                <Select name="status" defaultValue={lead.status}>
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                </Select>
              </label>
              <Button
                type="submit"
                variant="outline"
                disabled={statusAction.pending}
                className="w-full md:w-fit"
              >
                {statusAction.pending ? (
                  <LoaderCircle className="size-4 animate-spin mr-2" />
                ) : null}
                {statusAction.pending ? "Updating..." : "Update status"}
              </Button>
            </form>
          ) : null}

          {canAssignLead ? (
            <form
              action={assignAction.formAction}
              className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4"
            >
              <input type="hidden" name="id" value={lead.id} />
              <label className="space-y-2">
                <span className="field-label">Assignee</span>
                <Select
                  name="assignedToUserId"
                  defaultValue={lead.assignedToUser?.id ?? ""}
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
                className="w-full md:w-fit"
              >
                {assignAction.pending ? (
                  <LoaderCircle className="size-4 animate-spin mr-2" />
                ) : null}
                {assignAction.pending ? "Assigning..." : "Assign lead"}
              </Button>
            </form>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
