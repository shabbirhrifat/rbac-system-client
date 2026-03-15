import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, ...props }: React.ComponentProps<"select">) {
  return <select className={cn("field-input appearance-none", className)} {...props} />;
}
