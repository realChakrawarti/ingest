import { Fragment } from "react";
import type { Metadata } from "next";

import appConfig from "~/shared/app-config";

export const metadata: Metadata = {
  title: `Picks | ${appConfig.marketName}`,
};

export default function PicksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Fragment>{children}</Fragment>;
}