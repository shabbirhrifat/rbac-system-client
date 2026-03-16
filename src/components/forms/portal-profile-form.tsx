"use client";

import { LoaderCircle } from "lucide-react";
import { updatePortalProfileAction } from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFormAction } from "@/lib/use-form-action";
import type { ProfileSettings } from "@/types/api";

export function PortalProfileForm({ profile }: { profile: ProfileSettings }) {
  const { formAction, pending } = useFormAction(updatePortalProfileAction);

  return (
    <form action={formAction} className="grid gap-4">
      <div className="form-grid">
        <label className="space-y-2"><span className="field-label">First name</span><Input name="firstName" defaultValue={profile.firstName} /></label>
        <label className="space-y-2"><span className="field-label">Last name</span><Input name="lastName" defaultValue={profile.lastName} /></label>
        <label className="space-y-2 md:col-span-2"><span className="field-label">Phone</span><Input name="phone" defaultValue={profile.phone ?? ""} /></label>
      </div>
      <Button type="submit" disabled={pending} className="w-full md:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Saving..." : "Save portal profile"}
      </Button>
    </form>
  );
}
