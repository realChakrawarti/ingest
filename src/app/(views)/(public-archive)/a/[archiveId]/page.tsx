import type { Metadata } from "next/types";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";

import PublicArchive from "~/views/public-archive";

type PublicArchiveParams = {
  params: Promise<{ archiveId: string }>;
};

export async function generateMetadata({
  params,
}: PublicArchiveParams): Promise<Metadata> {
  const { archiveId } = await params;

  const result = await fetchApi(`/archives/${archiveId}`);
  const archiveData = result.data;

  return {
    openGraph: {
      description: archiveData?.description,
      siteName: `${appConfig.marketName}`,
      title: archiveData?.title,
      type: "website",
      url: `${appConfig.url}/a/${archiveId}`,
    },
    title: `${archiveData?.title} | ${appConfig.marketName}`,
  };
}

export default async function PublicArchivePage({
  params,
}: PublicArchiveParams) {
  const { archiveId } = await params;
  return <PublicArchive archiveId={archiveId} />;
}
