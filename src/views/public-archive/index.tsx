import type { ZArchiveByID } from "~/entities/archives/models";

import fetchApi from "~/shared/lib/api/fetch";
import { getTimeDifference } from "~/shared/utils/time-diff";

import BackLink from "~/widgets/back-link";
import { ItemSection } from "~/widgets/item-section";
import {
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";
import YouTubeCard from "~/widgets/youtube/youtube-card";

import ArchiveInformation from "./archive-information";

export default async function PublicArchive({
  archiveId,
}: {
  archiveId: string;
}) {
  const result = await fetchApi<ZArchiveByID>(`/archives/${archiveId}`);
  const archiveData = result.data;

  if (!archiveData) {
    return <p>Something went wrong while fetching archive data.</p>;
  }

  const archiveTitle = archiveData.title;
  const archiveDescription = archiveData.description;
  const archiveUpdatedAt = archiveData.updatedAt;

  return (
    <PublicMainContainer className="space-y-4">
      <PublicHeaderTitle>
        <div className="border-primary/40 shadow-primary/20 relative min-h-45 rounded-md border p-3 shadow-md">
          <div className="flex h-full items-start justify-between">
            <div className="flex flex-col">
              <BackLink className="size-6" href="/explore/archives" />
              <div className="mt-4">
                <ArchiveInformation
                  title={archiveTitle}
                  description={archiveDescription}
                  totalVideos={archiveData?.videos.length ?? 0}
                />
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-3 text-sm">
            {getTimeDifference(archiveUpdatedAt)[1]} ago
          </div>
        </div>
      </PublicHeaderTitle>

      {archiveData?.videos.length ? (
        <ItemSection>
          {archiveData.videos.map((video) => {
            return (
              <YouTubeCard
                key={video.videoId}
                video={video}
                options={{
                  hideAvatar: true,
                  focusMode: true,
                }}
              />
            );
          })}
        </ItemSection>
      ) : (
        <p>No videos added yet.</p>
      )}
    </PublicMainContainer>
  );
}