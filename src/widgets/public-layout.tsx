import { PropsWithChildren } from "react";

import { cn } from "~/shared/lib/tailwind-merge";

type ContainerType = { className?: string } & PropsWithChildren;

export function PublicMainContainer({ className, children }: ContainerType) {
  return <main className={cn("mb-6 mt-7", className)}>{children}</main>;
}

export function PublicHeaderTitle({ className, children }: ContainerType) {
  return <div className={cn("px-2 md:px-3", className)}>{children}</div>;
}

export function PublicContentContainer({ className, children }: ContainerType) {
  return (
    <section className={cn("w-full mt-4 px-0 md:px-3", className)}>
      {children}
    </section>
  );
}

export function PublicMarker() {
  return <span className="w-1 bg-primary h-full rounded-md" />;
}
