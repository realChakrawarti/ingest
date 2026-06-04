import * as React from "react";

import { cn } from "~/shared/utils/tailwind-merge";

const Textarea = ({
  ref,
  className,
  ...props
}: React.ComponentProps<"textarea">) => {
  return (
    <textarea
      className={cn(
        "flex min-h-15 w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  );
};
Textarea.displayName = "Textarea";

export { Textarea };