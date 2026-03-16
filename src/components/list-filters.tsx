"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search } from "lucide-react";

type FilterOption = {
  label: string;
  value: string;
};

type FilterField = {
  key: string;
  label: string;
  options: FilterOption[];
};

type ListFiltersProps = {
  searchKey?: string;
  searchPlaceholder?: string;
  filters?: FilterField[];
};

export function ListFilters({ searchKey, searchPlaceholder, filters = [] }: ListFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
      });
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
      {searchKey ? (
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder={searchPlaceholder ?? "Search..."}
            defaultValue={searchParams.get(searchKey) ?? ""}
            className="field-input pl-10"
            onChange={(e) => {
              const value = e.target.value.trim();
              updateParam(searchKey, value);
            }}
          />
        </div>
      ) : null}

      {filters.map((filter) => (
        <select
          key={filter.key}
          value={searchParams.get(filter.key) ?? ""}
          onChange={(e) => updateParam(filter.key, e.target.value)}
          className="field-input w-full sm:w-auto sm:min-w-[140px]"
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}

      {isPending ? (
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <div className="size-3.5 animate-spin rounded-full border-2 border-neutral-300 border-t-brand-500" />
          Filtering...
        </div>
      ) : null}
    </div>
  );
}
