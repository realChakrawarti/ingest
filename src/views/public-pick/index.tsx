import type { ZPickByID } from "~/entities/picks/models";

import fetchApi from "~/shared/lib/api/fetch";
import { Separator } from "~/shared/ui/separator";
import { getTimeDifference } from "~/shared/utils/time-diff";

import BackLink from "~/widgets/back-link";
import { ItemSection } from "~/widgets/item-section";
import {
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";
import YouTubeCard from "~/widgets/youtube/youtube-card";

import PickInformation from "./pick-information";
import SharePick from "./share-pick";

export default async function PublicPick({ pickId }: { pickId: string }) {
  const result = await fetchApi<ZPickByID>(`/picks/${pickId}`);
  const pickData = result.data;

  if (!pickData) {
    return <p>Something went wrong while fetching pick data.</p>;
  }

  const pickTitle = pickData.title;
  const pickDescription = pickData.description;
  const pickUpdatedAt = pickData.updatedAt;

  return (
    <PublicMainContainer className="space-y-4">
      <PublicHeaderTitle>
        <div className="relative px-2 py-1">
          <div className="flex flex-col">
            <BackLink className="size-6" href="/explore/picks" />
            <div className="mt-4">
              <PickInformation
                title={pickTitle}
                description={pickDescription}
                totalVideos={pickData?.videos.length ?? 0}
              />
            </div>
            <div className="mt-3">
              <div className="flex justify-start gap-4 md:justify-end">
                <SharePick
                  pickId={pickId}
                  pickDescription={pickDescription}
                  pickTitle={pickTitle}
                />
              </div>
            </div>
          </div>
          <div className="absolute top-3 right-3 text-sm">
            {getTimeDifference(pickUpdatedAt)[1]} ago
          </div>
        </div>
      </PublicHeaderTitle>

      <Separator />

      {pickData?.videos.length ? (
        <ItemSection>
          {pickData.videos.map((video) => {
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