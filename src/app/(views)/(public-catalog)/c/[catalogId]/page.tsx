import type { Metadata } from "next/types";

import type { ZCatalogMeta } from "~/entities/catalogs/models";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";

import PubliCatalog from "~/views/public-catalog";

type PublicCatalogParams = {
  params: Promise<{ catalogId: string }>;
  searchParams?: Promise<{
    channelId?: string;
    duration?: "short" | "medium" | "long";
  }>;
};

export async function generateMetadata({
  params,
}: PublicCatalogParams): Promise<Metadata> {
  const { catalogId } = await params;

  const result = await fetchApi<ZCatalogMeta>(
    `/catalogs/${catalogId}/contents?meta=true`
  );
  const catalogData = result.data;

  return {
    openGraph: {
      description: catalogData?.description,
      siteName: `${appConfig.marketName}`,
      title: catalogData?.title,
      type: "website",
      url: `${appConfig.url}/${catalogId}`,
    },
    title: `${catalogData?.title} | ${appConfig.marketName}`,
  };
}

export const revalidate = 600; // Cache the page for 10 minutes, unless revalidated on updates

export default async function PublicCatalogPage({
  params,
  searchParams,
}: PublicCatalogParams) {
  const resolvedSearchParams = await (searchParams || Promise.resolve({} as { channelId?: string; duration?: "short" | "medium" | "long" }));
  const channelId = resolvedSearchParams?.channelId;
  const duration = resolvedSearchParams?.duration;

  const { catalogId } = await params;

  return (
    <PubliCatalog
      catalogId={catalogId}
      channelId={channelId ?? ""}
      duration={duration ?? null}
    />
  );
}
