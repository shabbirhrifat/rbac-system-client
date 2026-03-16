"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ListPaginationProps = {
  page: number;
  totalPages: number;
  total: number;
};

export function ListPagination({ page, totalPages, total }: ListPaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  function buildHref(targetPage: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (targetPage <= 1) {
      params.delete("page");
    } else {
      params.set("page", String(targetPage));
    }
    const qs = params.toString();
    return qs ? `${pathname}?${qs}` : pathname;
  }

  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="flex items-center justify-between gap-4 pt-2">
      <p className="text-sm text-neutral-500">
        Page {page} of {totalPages}
        <span className="hidden sm:inline"> &middot; {total} total</span>
      </p>

      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Link
            href={buildHref(page - 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-300 cursor-not-allowed">
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </span>
        )}

        {hasNext ? (
          <Link
            href={buildHref(page + 1)}
            className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-100 bg-neutral-50 px-3 py-2 text-sm font-medium text-neutral-300 cursor-not-allowed">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </span>
        )}
      </div>
    </div>
  );
}
