import { Metadata } from "next";

import appConfig from "~/shared/app-config";

export const metadata: Metadata = {
  title: `Dashboard | ${appConfig.marketName}`,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
