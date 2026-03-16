import Link from "next/link";
import { Card } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
};

export function EmptyState({ title, description, actionHref, actionLabel }: EmptyStateProps) {
  return (
    <Card className="items-start gap-4 p-5 sm:p-6">
      <div className="space-y-2">
        <h3 className="font-display text-lg font-semibold tracking-tight text-neutral-950 sm:text-xl">{title}</h3>
        <p className="max-w-xl text-sm leading-7 text-neutral-500">{description}</p>
      </div>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="inline-flex items-center justify-center rounded-2xl bg-neutral-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          {actionLabel}
        </Link>
      ) : null}
    </Card>
  );
}
