"use client";

import type { ReactNode } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type CreateFormSheetProps = {
  triggerLabel: string;
  title: string;
  description: string;
  children: React.ReactNode;
  triggerIcon?: ReactNode;
  triggerClassName?: string;
  contentClassName?: string;
  side?: "left" | "right";
  variant?: VariantProps<typeof buttonVariants>["variant"];
};

export function CreateFormSheet({
  triggerLabel,
  title,
  description,
  children,
  triggerIcon,
  triggerClassName,
  contentClassName,
  side = "right",
  variant = "default",
}: CreateFormSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant={variant}
          className={cn("w-full sm:w-auto", triggerClassName)}
        >
          {triggerIcon ?? <Plus className="size-4" />}
          {triggerLabel}
        </Button>
      </SheetTrigger>
      <SheetContent side={side} className={cn("p-0", contentClassName)}>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
}
