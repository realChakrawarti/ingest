import type { ComponentProps } from "react";

interface OutLinkProps extends ComponentProps<"a"> {
  href: `https://${string}` | string;
}

export function OutLink({
  children,
  href,
  target = "_blank",
  ...rest
}: OutLinkProps) {
  return (
    <a rel="noopener noreferrer external" href={href} target={target} {...rest}>
      {children}
    </a>
  );
}
