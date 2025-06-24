import type { Metadata } from "next";

import appConfig from "~/shared/app-config";

export const metadata: Metadata = {
  title: `OpenAPI | ${appConfig.marketName}`,
};

export default function OpenApiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
