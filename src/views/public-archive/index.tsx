import type { ArchiveByIdResponse } from "~/entities/archives/models";
import fetchApi from "~/shared/lib/api/fetch";
import GridContainer from "~/widgets/grid-container";
import YouTubeCard from "~/widgets/youtube/youtube-card";

export default async function PublicArchive({
  archiveId,
}: {
  archiveId: string;
}) {
  const result = await fetchApi<ArchiveByIdResponse>(`/archives/${archiveId}`);
  const archiveData = result.data;

  const archiveTitle = archiveData?.title;
  const archiveDescription = archiveData?.description;

  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">
            {archiveTitle}
          </h1>
          <p className="text-base text-muted-foreground">
            {archiveDescription}
          </p>
        </div>
      </section>

      {archiveData?.videos.length ? (
        <section className="px-0 md:px-3">
          <GridContainer>
            {archiveData.videos.map(
              ({
                videoId,
                videoTitle,
                channelTitle,
                channelId,
                videoDescription,
                publishedAt,
              }) => {
                return (
                  <YouTubeCard
                    key={videoId}
                    video={{
                      channelId: channelId,
                      channelLogo: "",
                      channelTitle: channelTitle,
                      description: videoDescription,
                      publishedAt: publishedAt,
                      title: videoTitle,
                      videoId: videoId,
                    }}
                    options={{ hideAvatar: true }}
                  />
                );
              }
            )}
          </GridContainer>
        </section>
      ) : (
        <p>No videos added yet.</p>
      )}
    </div>
  );
}
