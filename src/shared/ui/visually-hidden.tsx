import type { PropsWithChildren } from "react";

import { VisuallyHidden as VisuallyHiddenPrimitive } from "radix-ui";

export default function VisuallyHidden(props: PropsWithChildren) {
  return (
    <VisuallyHiddenPrimitive.Root>
      {props.children}
    </VisuallyHiddenPrimitive.Root>
  );
}