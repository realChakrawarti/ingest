import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";

import { cn } from "~/shared/utils/tailwind-merge";

const outLinkVariants = cva("cursor-pointer", {
  defaultVariants: {
    variant: "default",
  },
  variants: {
    variant: {
      default: "text-primary/80 hover:text-primary",
      reset:
        "text-inherit hover:text-inherit hover:underline text-nowrap overflow-hidden",
    },
  },
});
interface OutLinkProps
  extends ComponentProps<"a">,
    VariantProps<typeof outLinkVariants> {
  href: `https://${string}` | string;
  title?: string;
}

export function OutLink({
  children,
  href,
  target = "_blank",
  className,
  variant,
  title,
  ...rest
}: OutLinkProps) {
  return (
    <a
      className={cn(outLinkVariants({ variant }), className)}
      rel="noopener noreferrer external"
      href={href}
      target={target}
      {...rest}
    >
      {title ? (
        <abbr className="no-underline" title={title}>
          {children}
        </abbr>
      ) : (
        children
      )}
    </a>
  );
}
