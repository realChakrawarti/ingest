import type { Metadata } from "next";

import appConfig from "~/shared/app-config";

export const metadata: Metadata = {
  title: `Catalogs | ${appConfig.marketName}`,
};

export default function CatalogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
