"use client";

import { LoaderCircle } from "lucide-react";
import { replaceUserOverridesAction } from "@/actions/resources";
import { useSheetAutoClose } from "@/components/forms/create-form-sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useFormAction } from "@/lib/use-form-action";
import type { AccessUserResponse, PermissionCatalogItem } from "@/types/api";

export function PermissionOverridesForm({
  userAccess,
  grantable,
}: {
  userAccess: AccessUserResponse;
  grantable: PermissionCatalogItem[];
}) {
  const sheet = useSheetAutoClose();
  const { formAction, pending } = useFormAction(replaceUserOverridesAction, {
    onSuccess: () => sheet?.close(),
  });

  const initialValue = userAccess.overrides
    .map((override) => `${override.permission.key}:${override.effect}${override.expiresAt ? `:${override.expiresAt}` : ""}`)
    .join("\n");

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="id" value={userAccess.user.id} />
      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <label className="space-y-2">
          <span className="field-label">Overrides</span>
          <Textarea
            name="overrides"
            defaultValue={initialValue}
            placeholder="permission.key:allow\npermission.key:deny:2026-12-31T00:00:00.000Z"
            className="min-h-64"
          />
          <p className="text-xs leading-6 text-neutral-500">One override per line. Use the format `permissionKey:effect[:expiresAt]`.</p>
        </label>

        <div className="rounded-[24px] border border-neutral-200 bg-neutral-50/80 p-4">
          <p className="text-sm font-semibold text-neutral-900">Grantable permissions</p>
          <div className="mt-4 flex max-h-64 flex-wrap gap-2 overflow-auto">
            {grantable.map((permission) => (
              <span key={permission.id} className="rounded-full bg-white px-3 py-1.5 text-xs text-neutral-600 ring-1 ring-neutral-200">
                {permission.key}
              </span>
            ))}
          </div>
        </div>
      </div>
      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Replacing..." : "Replace overrides"}
      </Button>
    </form>
  );
}
