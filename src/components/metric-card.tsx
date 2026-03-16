import { Card, CardDescription, CardTitle } from "@/components/ui/card";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
};

export function MetricCard({ label, value, detail }: MetricCardProps) {
  return (
    <Card className="gap-4 p-5 sm:p-6">
      <CardDescription className="text-xs uppercase tracking-[0.24em] text-neutral-400">{label}</CardDescription>
      <CardTitle className="text-2xl sm:text-3xl">{value}</CardTitle>
      <p className="text-sm text-neutral-500">{detail}</p>
    </Card>
  );
}
