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
import CatalogInformationPopover from "./catalog-information-popover";
import FilterChannel, { CurrentActive } from "./filter-channel";
import { FilterSubreddit } from "./filter-subreddit";
import { filterVideos, getActiveChannelIds } from "./helper-methods";
import NextUpdateToast from "./next-update-toast";
import { SubredditPost } from "./subreddit-posts";

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

  return (
    <>
      <NextUpdateToast nextUpdate={nextUpdate} />
      <PublicMainContainer className="space-y-4">
        <PublicHeaderTitle>
          <div className="space-y-0">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <BackLink href="/explore/catalogs" />
                <div className="space-y-1">
                  <span className="flex items-center gap-4">
                    <h1 className="text-lg tracking-wide lg:text-xl">
                      {catalogTitle}
                    </h1>
                    <CatalogInformationPopover
                      pageviews={catalogData.pageviews}
                      description={catalogData?.description ?? ""}
                      totalVideos={catalogData.totalVideos}
                      totalPosts={catalogData.totalPosts}
                      nextUpdate={catalogData.nextUpdate}
                    />
                  </span>
                </div>
              </div>

              <div className="mr-2">
                <CatalogAction
                  catalogTitle={catalogTitle}
                  catalogDescription={catalogDescription}
                  catalogId={catalogId}
                />
              </div>
            </div>
          </div>
        </PublicHeaderTitle>

        <Tabs defaultValue={posts?.length ? "subreddit" : "youtube"}>
          <TabsList className="mx-2 my-3 text-lg md:mx-3">
            <TabsTrigger value="youtube">YouTube Videos</TabsTrigger>
            <TabsTrigger value="subreddit">
              Reddit Posts ({posts?.length})
            </TabsTrigger>
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
          {posts?.length ? (
            <TabsContent className="space-y-4" value="subreddit">
              <FilterSubreddit subreddits={Array.from(subreddits)} />
              <SubredditPost posts={posts} />
            </TabsContent>
          ) : null}
        </Tabs>
        <ScrollTop />
      </PublicMainContainer>
    </>
  );
}