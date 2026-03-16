"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { sentenceCase } from "@/lib/format";

type AuditMetadataDrawerProps = {
  metadata: Record<string, unknown>;
  action: string;
  module: string;
};

export function AuditMetadataDrawer({ metadata, action, module }: AuditMetadataDrawerProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-brand-600 transition hover:bg-brand-50 hover:text-brand-700"
      >
        <Eye className="size-3.5" />
        View
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Audit metadata</SheetTitle>
            <SheetDescription>
              {sentenceCase(action)} on {sentenceCase(module)}
            </SheetDescription>
          </SheetHeader>

          <div className="px-5 py-6 sm:px-6">
            <div className="space-y-4">
              {Object.entries(metadata).map(([key, value]) => (
                <div key={key} className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    {sentenceCase(key)}
                  </p>
                  <div className="rounded-xl border border-neutral-200 bg-neutral-50/80 p-3">
                    {typeof value === "object" && value !== null ? (
                      <pre className="whitespace-pre-wrap break-all text-xs text-neutral-700">
                        {JSON.stringify(value, null, 2)}
                      </pre>
                    ) : (
                      <p className="text-sm text-neutral-700">{String(value ?? "-")}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
