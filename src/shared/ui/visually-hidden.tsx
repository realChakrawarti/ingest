import { VisuallyHidden as VisuallyHiddenPrimitive } from "radix-ui";
import type { PropsWithChildren } from "react";

export default function VisuallyHidden(props: PropsWithChildren) {
  return (
    <VisuallyHiddenPrimitive.Root>
      {props.children}
    </VisuallyHiddenPrimitive.Root>
  );
}
