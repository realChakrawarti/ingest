import type { ReactNode } from "react";

export default function GridContainer({ children }: { children: ReactNode }) {
  return (
    <section className="grid grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))] gap-4">
      {children}
    </section>
  );
}