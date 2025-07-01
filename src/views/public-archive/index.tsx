import { Info } from "lucide-react";

import type { ZArchiveByID } from "~/entities/archives/models";

import fetchApi from "~/shared/lib/api/fetch";

import BackLink from "~/widgets/back-link";
import GridContainer from "~/widgets/grid-container";
import JustTip from "~/widgets/just-the-tip";
import YouTubeCard from "~/widgets/youtube/youtube-card";

export default async function PublicArchive({
  archiveId,
}: {
  archiveId: string;
}) {
  const result = await fetchApi<ZArchiveByID>(`/archives/${archiveId}`);
  const archiveData = result.data;

  const archiveTitle = archiveData?.title ?? "";
  const archiveDescription = archiveData?.description ?? "";

  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="flex items-center gap-4">
          <BackLink href="/explore/archives" />
          <div className="space-y-1">
            <h1 className="text-lg lg:text-xl font-semibold tracking-tight">
              {archiveTitle}
            </h1>
            <JustTip label={archiveDescription}>
              <Info className="size-4" />
            </JustTip>
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
