import type { ZArchiveByID } from "~/entities/archives/models";

import fetchApi from "~/shared/lib/api/fetch";

import BackLink from "~/widgets/back-link";
import GridContainer from "~/widgets/grid-container";
import YouTubeCard from "~/widgets/youtube/youtube-card";

import ArchiveInformationPopover from "./archive-information-popover";

export default async function PublicArchive({
  archiveId,
}: {
  archiveId: string;
}) {
  const result = await fetchApi<ZArchiveByID>(`/archives/${archiveId}`, {
    cache: "no-store",
  });
  const archiveData = result.data;

  if (!archiveData) {
    return <p>Something went wrong while fetching archive data.</p>;
  }

  const archiveTitle = archiveData.title;
  const archiveDescription = archiveData.description;
  const archiveUpdatedAt = archiveData.updatedAt;

  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="flex items-center gap-4">
          <BackLink href="/explore/archives" />
          <div className="flex gap-1 items-center">
            <h1 className="text-lg lg:text-xl tracking-wide">{archiveTitle}</h1>
            <ArchiveInformationPopover
              description={archiveDescription}
              totalVideos={archiveData?.videos.length ?? 0}
              updatedAt={archiveUpdatedAt}
            />
          </div>
        </div>
      </section>

      {archiveData?.videos.length ? (
        <section className="px-0 md:px-3">
          <GridContainer>
            {archiveData.videos.map((video) => {
              return (
                <YouTubeCard
                  key={video.videoId}
                  video={video}
                  options={{ hideAvatar: true }}
                />
              );
            })}
          </GridContainer>
        </section>
      ) : (
        <p>No videos added yet.</p>
      )}
    </div>
  );
}
