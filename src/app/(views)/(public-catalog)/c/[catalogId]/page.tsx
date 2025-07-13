import type { Metadata } from "next/types";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";

import PubliCatalog from "~/views/public-catalog";

type PublicCatalogParams = {
  params: { catalogId: string };
  searchParams?: {
    channelId?: string;
    duration?: "short" | "medium" | "long";
  };
};

export async function generateMetadata({
  params,
}: PublicCatalogParams): Promise<Metadata> {
  const { catalogId } = params;

  const result = await fetchApi(`/catalogs/${catalogId}/contents`);
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

export const revalidate = 60 * 10; // Cache the page for 10 minutes, unless revalidated on updates

export default async function PublicCatalogPage({
  params,
  searchParams,
}: PublicCatalogParams) {
  const channelId = searchParams?.channelId;
  const duration = searchParams?.duration;

  const { catalogId } = params;

  return (
    <PubliCatalog
      catalogId={catalogId}
      channelId={channelId ?? ""}
      duration={duration ?? null}
    />
  );
}
