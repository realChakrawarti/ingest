import type { Metadata } from "next/types";

import type { ZFeedMeta } from "~/entities/feeds/models";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";

import PubliFeed from "~/views/public-feed";

type PublicFeedParams = {
  params: Promise<{ feedId: string }>;
  searchParams?: Promise<{
    channelId?: string;
    duration?: "short" | "medium" | "long";
  }>;
};

export async function generateMetadata({
  params,
}: PublicFeedParams): Promise<Metadata> {
  const { feedId } = await params;

  const result = await fetchApi<ZFeedMeta>(
    `/feeds/${feedId}/contents?meta=true`
  );
  const feedData = result.data;

  return {
    openGraph: {
      description: feedData?.description,
      siteName: `${appConfig.marketName}`,
      title: feedData?.title,
      type: "website",
      url: `${appConfig.url}/${feedId}`,
    },
    title: `${feedData?.title} | ${appConfig.marketName}`,
  };
}

export const revalidate = 600; // Cache the page for 10 minutes, unless revalidated on updates

export default async function PublicFeedPage({
  params,
  searchParams,
}: PublicFeedParams) {
  const resolvedSearchParams = await (searchParams ||
    Promise.resolve(
      {} as { channelId?: string; duration?: "short" | "medium" | "long" }
    ));
  const channelId = resolvedSearchParams?.channelId;
  const duration = resolvedSearchParams?.duration;

  const { feedId } = await params;

  return (
    <PubliFeed
      feedId={feedId}
      channelId={channelId ?? ""}
      duration={duration ?? null}
    />
  );
}
