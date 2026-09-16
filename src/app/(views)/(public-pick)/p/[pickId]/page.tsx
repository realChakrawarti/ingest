import type { Metadata } from "next/types";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";

import PublicPick from "~/views/public-pick";

type PublicPickParams = {
  params: Promise<{ pickId: string }>;
};

export async function generateMetadata({
  params,
}: PublicPickParams): Promise<Metadata> {
  const { pickId } = await params;

  const result = await fetchApi(`/picks/${pickId}`);
  const pickData = result.data;

  return {
    openGraph: {
      description: pickData?.description,
      siteName: `${appConfig.marketName}`,
      title: pickData?.title,
      type: "website",
      url: `${appConfig.url}/a/${pickId}`,
    },
    title: `${pickData?.title} | ${appConfig.marketName}`,
  };
}

export default async function PublicPickPage({
  params,
}: PublicPickParams) {
  const { pickId } = await params;
  return <PublicPick pickId={pickId} />;
}
