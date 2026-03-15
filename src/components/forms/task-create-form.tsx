import { createTaskAction } from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Lead, UserListItem } from "@/types/api";

export function TaskCreateForm({ users, leads, customers }: { users: UserListItem[]; leads: Lead[]; customers: UserListItem[] }) {
  return (
    <form action={createTaskAction} className="grid gap-4">
      <div className="form-grid">
        <label className="space-y-2"><span className="field-label">Title</span><Input name="title" required /></label>
        <label className="space-y-2"><span className="field-label">Priority</span><Select name="priority" defaultValue="medium"><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></Select></label>
        <label className="space-y-2"><span className="field-label">Due at</span><Input name="dueAt" type="datetime-local" /></label>
        <label className="space-y-2"><span className="field-label">Assignee</span><Select name="assignedToUserId" defaultValue=""><option value="">Unassigned</option>{users.map((user) => <option key={user.id} value={user.id}>{user.firstName} {user.lastName}</option>)}</Select></label>
        <label className="space-y-2"><span className="field-label">Lead link</span><Select name="leadId" defaultValue=""><option value="">No lead</option>{leads.map((lead) => <option key={lead.id} value={lead.id}>{lead.name}</option>)}</Select></label>
        <label className="space-y-2"><span className="field-label">Customer link</span><Select name="customerId" defaultValue=""><option value="">No customer</option>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>)}</Select></label>
        <label className="space-y-2 md:col-span-2"><span className="field-label">Description</span><Textarea name="description" /></label>
      </div>
      <Button type="submit" className="w-full md:w-fit">Create task</Button>
    </form>
  );
}
