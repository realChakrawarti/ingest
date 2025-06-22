import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import type { Metadata } from "next";

import appConfig from "~/shared/app-config";

export const metadata: Metadata = {
  title: `Explore | ${appConfig.marketName}`,
};

export default function ExploreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
