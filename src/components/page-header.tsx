import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  badge?: string;
  actions?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, badge, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-semibold tracking-[-0.04em] text-neutral-950 md:text-4xl">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-7 text-neutral-500 md:text-base">{description}</p>
        </div>
      </div>
      {badge || actions ? (
        <div className="flex flex-col gap-3 self-start sm:flex-row sm:flex-wrap sm:items-center lg:self-auto">
          {badge ? <Badge tone="brand">{badge}</Badge> : null}
          {actions}
        </div>
      ) : null}
    </div>
  );
}
