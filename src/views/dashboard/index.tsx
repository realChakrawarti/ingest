"use client";

import { Separator } from "~/shared/ui/separator";

import ArchiveView from "./archive-view";
import CatalogView from "./catalog-view";

export default function Dashboard() {
  return (
    <div className="flex first:pt-3 last:pb-3 flex-col gap-3">
      <h1 className="px-3 text-2xl tracking-wide">Dashboard</h1>
      <Separator />
      <CatalogView />
      <Separator />
      <ArchiveView />
    </div>
  );
}
