"use client";

import { LoaderCircle } from "lucide-react";
import { updateAppSettingAction } from "@/actions/resources";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/lib/use-form-action";
import type { AppSettingItem } from "@/types/api";

export function AppSettingForm({ setting }: { setting: AppSettingItem }) {
  const { formAction, pending } = useFormAction(updateAppSettingAction);

  return (
    <form action={formAction} className="grid gap-4 rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4">
      <input type="hidden" name="key" value={setting.key} />
      <div>
        <p className="text-sm font-semibold text-neutral-900">{setting.key}</p>
        <p className="mt-1 text-xs text-neutral-500">Edit JSON payload and save to upsert this app-level setting.</p>
      </div>
      <Textarea name="value" defaultValue={JSON.stringify(setting.value, null, 2)} className="min-h-40 font-mono text-xs" />
      <Button type="submit" variant="outline" disabled={pending} className="w-full md:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Updating..." : "Update setting"}
      </Button>
    </form>
  );
}
