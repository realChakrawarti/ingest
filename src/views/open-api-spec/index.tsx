"use client";

import "@stoplight/elements/styles.min.css";
import "@stoplight/elements/web-components.min.js";

import { useIsTablet } from "~/shared/hooks/use-tablet";
import { cn } from "~/shared/utils/tailwind-merge";

export default function OpenApiSpecification() {
  const isTablet = useIsTablet();
  return (
    <>
      <div className={cn("h-full", isTablet && "p-4")}>
        {/* Refer config options: https://docs.stoplight.io/docs/elements/b074dc47b2826-elements-configuration-options */}
        <elements-api
          hideTryIt
          hideExport
          layout={isTablet ? "stacked" : "sidebar"}
          router="memory"
          apiDescriptionUrl="/api/openapi-spec.json"
        />
      </div>
    </>
  );
}
