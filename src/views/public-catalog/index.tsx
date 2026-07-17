import type { ZContentByCatalog } from "~/entities/catalogs/models";

import fetchApi from "~/shared/lib/api/fetch";
import type { YouTubeCardOptions } from "~/shared/types-schema/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/ui/tabs";

import BackLink from "~/widgets/back-link";
import { ItemSection } from "~/widgets/item-section";
import {
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";
import ScrollTop from "~/widgets/scroll-top";
import YouTubeCard from "~/widgets/youtube/youtube-card";

import { CatalogAction } from "./catalog-action";
import CatalogInformation from "./catalog-information";
import FilterChannel, { CurrentActive } from "./filter-channel";
import { FilterSubreddit } from "./filter-subreddit";
import { filterVideos, getActiveChannelIds } from "./helper-methods";
import NextUpdateToast from "./next-update-toast";
import { SubredditPost } from "./subreddit-posts";
import UpdatePing from "./update-ping";

export default async function PubliCatalog({
  channelId = "",
  catalogId,
  duration = null,
}: {
  channelId: string;
  catalogId: string;
  duration: "short" | "medium" | "long" | null;
}) {
  const result = await fetchApi<ZContentByCatalog>(
    `/catalogs/${catalogId}/contents`
  );

  const catalogData = result.data;

  const posts = catalogData?.posts;
  const nextUpdate = catalogData?.nextUpdate;

  const videos = catalogData?.videos;
  const catalogTitle = catalogData?.title ?? "";
  const catalogDescription = catalogData?.description ?? "";

  const playerOptions: YouTubeCardOptions = {
    addWatchLater: true,
    enableJsApi: true,
    hideAvatar: Boolean(channelId),
    markWatched: true,
    showDuration: true,
    showVideoCategory: true,
    showVideoStats: true,
    focusMode: true,
  };

  if (!videos) {
    return (
      <div className="grid h-full w-full place-items-center">
        No data available. Please update the channel list
      </div>
    );
  }

  const [today, week, month] = filterVideos(videos, channelId, duration);

  const activeChannels = getActiveChannelIds(videos);
  const subreddits = new Set(posts?.map((post) => post.subreddit));

  const activeTab = posts?.length ? "subreddit" : "youtube";

  return (
    <>
      <NextUpdateToast nextUpdate={nextUpdate} />
      <PublicMainContainer className="space-y-4">
        <PublicHeaderTitle>
          <div className="border-primary/40 shadow-primary/20 relative min-h-45 rounded-md border p-3 shadow-md">
            <div className="flex flex-col">
              <BackLink className="size-6" href="/explore/catalogs" />
              <div className="mt-4">
                <CatalogInformation
                  title={catalogTitle}
                  pageviews={catalogData.pageviews}
                  description={catalogDescription}
                  totalVideos={catalogData.totalVideos}
                  totalPosts={catalogData.totalPosts}
                />
              </div>
            </div>
            <div className="absolute top-3 right-3">
              <UpdatePing nextUpdate={nextUpdate ?? ""} />
            </div>
            <div className="absolute right-4 bottom-3">
              <CatalogAction
                catalogTitle={catalogTitle}
                catalogDescription={catalogDescription}
                catalogId={catalogId}
              />
            </div>
          </div>
        </PublicHeaderTitle>

        <Tabs defaultValue={activeTab}>
          <TabsList className="mx-2 my-3 text-lg md:mx-3">
            {posts?.length ? (
              <TabsTrigger value="subreddit">
                Reddit Posts ({posts?.length})
              </TabsTrigger>
            ) : null}
            <TabsTrigger value="youtube">YouTube Videos</TabsTrigger>
          </TabsList>
          <TabsContent className="space-y-4" value="youtube">
            <FilterChannel activeChannels={activeChannels} />
            <CurrentActive activeChannels={activeChannels} />

            {/* Today */}
            {today?.length ? (
              <ItemSection label="Today">
                {today.map((video) => (
                  <YouTubeCard
                    key={video.videoId}
                    options={playerOptions}
                    video={video}
                  />
                ))}
              </ItemSection>
            ) : null}
            {/* This week */}
            {week?.length ? (
              <ItemSection label="This week">
                {week.map((video) => (
                  <YouTubeCard
                    key={video.videoId}
                    options={playerOptions}
                    video={video}
                  />
                ))}
              </ItemSection>
            ) : null}
            {/* This month */}
            {month?.length ? (
              <ItemSection label="This month">
                {month.map((video) => (
                  <YouTubeCard
                    key={video.videoId}
                    options={playerOptions}
                    video={video}
                  />
                ))}
              </ItemSection>
            ) : null}
          </TabsContent>

          <TabsContent className="space-y-4" value="subreddit">
            <FilterSubreddit subreddits={Array.from(subreddits)} />
            <SubredditPost posts={posts ?? []} />
          </TabsContent>
        </Tabs>
        <ScrollTop />
      </PublicMainContainer>
    </>
  );
}