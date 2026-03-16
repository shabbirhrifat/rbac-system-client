"use client";

import { LoaderCircle } from "lucide-react";
import { createLeadAction } from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/lib/use-form-action";
import type { UserListItem } from "@/types/api";

export function LeadCreateForm({ users, customers }: { users: UserListItem[]; customers: UserListItem[] }) {
  const { formAction, pending } = useFormAction(createLeadAction);

  return (
    <form action={formAction} className="grid gap-5">
      <div className="form-grid">
        <label className="space-y-2"><span className="field-label">Name</span><Input name="name" required /></label>
        <label className="space-y-2"><span className="field-label">Company</span><Input name="company" /></label>
        <label className="space-y-2"><span className="field-label">Email</span><Input name="email" type="email" /></label>
        <label className="space-y-2"><span className="field-label">Phone</span><Input name="phone" /></label>
        <label className="space-y-2"><span className="field-label">Source</span><Input name="source" /></label>
        <label className="space-y-2">
          <span className="field-label">Assigned to</span>
          <Select name="assignedToUserId" defaultValue=""><option value="">Unassigned</option>{users.map((user) => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>)}</Select>
        </label>
        <label className="space-y-2 md:col-span-2">
          <span className="field-label">Customer link</span>
          <Select name="customerId" defaultValue=""><option value="">No customer linked</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}</Select>
        </label>
        <label className="space-y-2 md:col-span-2"><span className="field-label">Notes</span><Textarea name="notes" /></label>
      </div>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Creating..." : "Create lead"}
      </Button>
    </form>
  );
}
