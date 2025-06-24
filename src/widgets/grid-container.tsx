import type { ReactNode } from "react";

export default function GridContainer({ children }: { children: ReactNode }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {children}
    </section>
  );
}
