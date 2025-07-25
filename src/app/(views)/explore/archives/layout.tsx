import type { Metadata } from "next";

import appConfig from "~/shared/app-config";

export const metadata: Metadata = {
  title: `Archives | ${appConfig.marketName}`,
};

export default function ArchivesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
