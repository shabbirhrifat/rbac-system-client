import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
  className?: string;
};

export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        {
          "bg-white/80 text-neutral-600 ring-1 ring-neutral-200": tone === "neutral",
          "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100": tone === "success",
          "bg-amber-50 text-amber-700 ring-1 ring-amber-100": tone === "warning",
          "bg-rose-50 text-rose-700 ring-1 ring-rose-100": tone === "danger",
          "bg-brand-50 text-brand-700 ring-1 ring-brand-100": tone === "brand",
        },
        className,
      )}
    >
      {children}
    </span>
  );
}
