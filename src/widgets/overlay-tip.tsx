import type { ReactNode } from "react";

import { cn } from "~/shared/utils/tailwind-merge";

interface OverlayTipProps {
  children: ReactNode;
  className?: string;
  id: string;
}

export default function OverlayTip({
  children,
  className,
  id,
}: OverlayTipProps) {
  return (
    <div id={id} className={cn("bg-accent/70 backdrop-blur-sm", className)}>
      {children}
    </div>
  );
}
