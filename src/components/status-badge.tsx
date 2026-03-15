import { Badge } from "@/components/ui/badge";
import { sentenceCase } from "@/lib/format";

const toneMap = {
  active: "success",
  won: "success",
  done: "success",
  qualified: "brand",
  contacted: "warning",
  pending: "warning",
  suspended: "warning",
  in_progress: "brand",
  high: "warning",
  banned: "danger",
  lost: "danger",
  cancelled: "danger",
  urgent: "danger",
  new: "neutral",
  todo: "neutral",
  medium: "brand",
  low: "neutral",
} as const;

export function StatusBadge({ value }: { value: string | null | undefined }) {
  const key = (value ?? "").toLowerCase() as keyof typeof toneMap;
  return <Badge tone={toneMap[key] ?? "neutral"}>{sentenceCase(value)}</Badge>;
}
