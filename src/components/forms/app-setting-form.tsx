"use client";

import { LoaderCircle } from "lucide-react";
import { updateAppSettingAction } from "@/actions/resources";
import { useSheetAutoClose } from "@/components/forms/create-form-sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/lib/use-form-action";
import type { AppSettingItem } from "@/types/api";

export function AppSettingForm({ setting }: { setting: AppSettingItem }) {
  const sheet = useSheetAutoClose();
  const { formAction, pending } = useFormAction(updateAppSettingAction, {
    onSuccess: () => sheet?.close(),
  });

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="key" value={setting.key} />
      <div className="space-y-1">
        <p className="text-sm font-semibold text-neutral-900">{setting.key}</p>
        <p className="text-sm leading-6 text-neutral-500">Edit the JSON payload and save to upsert this app-level setting.</p>
      </div>
      <Textarea name="value" defaultValue={JSON.stringify(setting.value, null, 2)} className="min-h-40 font-mono text-xs" />
      <Button type="submit" variant="outline" disabled={pending} className="w-full sm:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Updating..." : "Update setting"}
      </Button>
    </form>
  );
}
