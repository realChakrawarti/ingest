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
    <div
      id={id}
      className={cn(
        "bg-[rgba(0,0,0,0.6)] text-white/90 backdrop-blur-sm tracking-wide",
        className
      )}
    >
      {children}
    </div>
  );
}
