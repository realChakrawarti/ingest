"use client";

import * as React from "react";

import { cva } from "class-variance-authority";
import { Label as LabelPrimitive } from "radix-ui";

import { cn } from "~/shared/utils/tailwind-merge";

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = ({
  ref,
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };