"use client";

import type { PropsWithChildren } from "react";

import { useIsMobile } from "~/shared/hooks/use-mobile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/shared/ui/tooltip";

type JustTipProps = PropsWithChildren & { label: string };
export default function JustTip({ children, label }: JustTipProps) {
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <abbr className="no-underline" title={label}>
        {children}
      </abbr>
    );

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
