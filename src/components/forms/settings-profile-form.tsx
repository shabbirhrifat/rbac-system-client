"use client";

import { LoaderCircle } from "lucide-react";
import { updateSettingsProfileAction } from "@/actions/resources";
import { useSheetAutoClose } from "@/components/forms/create-form-sheet";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useFormAction } from "@/lib/use-form-action";
import type { ProfileSettings } from "@/types/api";

export function SettingsProfileForm({ profile }: { profile: ProfileSettings }) {
  const sheet = useSheetAutoClose();
  const { formAction, pending } = useFormAction(updateSettingsProfileAction, {
    onSuccess: () => sheet?.close(),
  });

  return (
    <form action={formAction} className="grid gap-5">
      <div className="form-grid">
        <label className="space-y-2"><span className="field-label">First name</span><Input name="firstName" defaultValue={profile.firstName} /></label>
        <label className="space-y-2"><span className="field-label">Last name</span><Input name="lastName" defaultValue={profile.lastName} /></label>
        <label className="space-y-2"><span className="field-label">Phone</span><Input name="phone" defaultValue={profile.phone ?? ""} /></label>
        <label className="space-y-2"><span className="field-label">Timezone</span><Input name="timezone" defaultValue={profile.userSetting.timezone ?? "UTC"} /></label>
        <label className="space-y-2"><span className="field-label">Locale</span><Input name="locale" defaultValue={profile.userSetting.locale ?? "en"} /></label>
        <label className="flex min-h-11 items-center gap-3 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700">
          <Checkbox
            name="sidebarCollapsed"
            defaultChecked={profile.userSetting.sidebarCollapsed}
          />
          Collapse sidebar by default
        </label>
        <label className="space-y-2"><span className="field-label">Current password</span><Input name="currentPassword" type="password" /></label>
        <label className="space-y-2"><span className="field-label">New password</span><Input name="newPassword" type="password" /></label>
      </div>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Saving..." : "Save settings"}
      </Button>
    </form>
  );
}
