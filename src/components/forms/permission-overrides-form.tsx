"use client";

import { useState } from "react";
import { LoaderCircle } from "lucide-react";
import { replaceUserOverridesAction } from "@/actions/resources";
import { useSheetAutoClose } from "@/components/forms/create-form-sheet";
import { Button } from "@/components/ui/button";
import { useFormAction } from "@/lib/use-form-action";
import { sentenceCase } from "@/lib/format";
import type { AccessUserResponse, PermissionCatalogItem } from "@/types/api";

type OverrideEffect = "allow" | "deny" | null;

type OverrideState = {
  effect: OverrideEffect;
  expiresAt: string;
};

function groupByModule(permissions: PermissionCatalogItem[]) {
  const groups: Record<string, PermissionCatalogItem[]> = {};
  for (const perm of permissions) {
    const mod = perm.module || "other";
    if (!groups[mod]) groups[mod] = [];
    groups[mod].push(perm);
  }
  return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
}

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

  const initialOverrides: Record<string, OverrideState> = {};
  for (const override of userAccess.overrides) {
    initialOverrides[override.permission.key] = {
      effect: override.effect,
      expiresAt: override.expiresAt ?? "",
    };
  }

  const [overrides, setOverrides] = useState<Record<string, OverrideState>>(initialOverrides);

  const grouped = groupByModule(grantable);

  function setEffect(key: string, effect: OverrideEffect) {
    setOverrides((prev) => {
      const next = { ...prev };
      if (effect === null) {
        delete next[key];
      } else {
        next[key] = { effect, expiresAt: prev[key]?.expiresAt ?? "" };
      }
      return next;
    });
  }

  function setExpiry(key: string, expiresAt: string) {
    setOverrides((prev) => {
      if (!prev[key]) return prev;
      return { ...prev, [key]: { ...prev[key], expiresAt } };
    });
  }

  // Serialize to the text format the action expects
  function serializeOverrides() {
    return Object.entries(overrides)
      .map(([key, state]) => {
        if (!state.effect) return null;
        const parts = [key, state.effect];
        if (state.expiresAt) parts.push(state.expiresAt);
        return parts.join(":");
      })
      .filter(Boolean)
      .join("\n");
  }

  const activeCount = Object.values(overrides).filter((o) => o.effect).length;

  return (
    <form action={formAction} className="grid gap-5">
      <input type="hidden" name="id" value={userAccess.user.id} />
      <input type="hidden" name="overrides" value={serializeOverrides()} />

      {/* Summary bar */}
      <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50/80 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
            {Object.values(overrides).filter((o) => o.effect === "allow").length} allow
          </span>
          <span className="inline-flex items-center justify-center rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">
            {Object.values(overrides).filter((o) => o.effect === "deny").length} deny
          </span>
        </div>
        <p className="text-xs text-neutral-500">{activeCount} override{activeCount !== 1 ? "s" : ""} total</p>
      </div>

      {/* Module groups */}
      <div className="space-y-5">
        {grouped.map(([module, permissions]) => (
          <div key={module} className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {sentenceCase(module)}
            </h3>
            <div className="space-y-1">
              {permissions.map((perm) => {
                const current = overrides[perm.key]?.effect ?? null;

                return (
                  <div key={perm.id} className="group rounded-xl border border-transparent px-3 py-2.5 transition hover:border-neutral-200 hover:bg-white">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-neutral-800 truncate">{perm.label || perm.key}</p>
                        {perm.description ? (
                          <p className="text-xs text-neutral-400 truncate">{perm.description}</p>
                        ) : null}
                      </div>

                      {/* Toggle buttons */}
                      <div className="flex shrink-0 items-center rounded-xl border border-neutral-200 bg-neutral-50 p-0.5">
                        <button
                          type="button"
                          onClick={() => setEffect(perm.key, current === "allow" ? null : "allow")}
                          className={`rounded-[10px] px-2.5 py-1 text-xs font-semibold transition ${
                            current === "allow"
                              ? "bg-emerald-500 text-white shadow-sm"
                              : "text-neutral-400 hover:text-emerald-600"
                          }`}
                        >
                          Allow
                        </button>
                        <button
                          type="button"
                          onClick={() => setEffect(perm.key, null)}
                          className={`rounded-[10px] px-2.5 py-1 text-xs font-semibold transition ${
                            current === null
                              ? "bg-white text-neutral-700 shadow-sm"
                              : "text-neutral-400 hover:text-neutral-600"
                          }`}
                        >
                          -
                        </button>
                        <button
                          type="button"
                          onClick={() => setEffect(perm.key, current === "deny" ? null : "deny")}
                          className={`rounded-[10px] px-2.5 py-1 text-xs font-semibold transition ${
                            current === "deny"
                              ? "bg-rose-500 text-white shadow-sm"
                              : "text-neutral-400 hover:text-rose-600"
                          }`}
                        >
                          Deny
                        </button>
                      </div>
                    </div>

                    {/* Expiry input - only when allow or deny is selected */}
                    {current ? (
                      <div className="mt-2 flex items-center gap-2 pl-0">
                        <label className="text-xs text-neutral-400 shrink-0">Expires:</label>
                        <input
                          type="datetime-local"
                          value={overrides[perm.key]?.expiresAt ?? ""}
                          onChange={(e) => setExpiry(perm.key, e.target.value ? new Date(e.target.value).toISOString() : "")}
                          className="field-input h-8 max-w-[220px] text-xs"
                        />
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-fit">
        {pending ? <LoaderCircle className="size-4 animate-spin mr-2" /> : null}
        {pending ? "Replacing..." : "Replace overrides"}
      </Button>
    </form>
  );
}
