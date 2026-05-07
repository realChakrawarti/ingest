import type { ReactNode } from "react";

import GridContainer from "./grid-container";
import { PublicMarker } from "./public-layout";

type ItemSectionProps = {
  label?: string;
  children: ReactNode;
};

export function ItemSection({ label, children }: ItemSectionProps) {
  const id = label?.replaceAll(" ", "-").toLowerCase();
  return (
    <section className="space-y-4 px-0 md:px-3">
      {label ? (
        <div className="text-primary flex h-6 items-center gap-2 px-2 md:px-0">
          <PublicMarker />
          <h2 id={id} className="text-lg">
            <a href={`#${id}`}>{label}</a>
          </h2>
        </div>
      ) : null}
      <GridContainer>{children}</GridContainer>
    </section>
  );
}
