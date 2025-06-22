import type { Metadata } from "next";

import appConfig from "~/shared/app-config";

export const metadata: Metadata = {
  title: `Watch later | ${appConfig.marketName}`,
};

export default function WatchLaterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
