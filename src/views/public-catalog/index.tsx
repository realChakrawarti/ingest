import dynamic from "next/dynamic";
import type { ReactNode } from "react";

import type { ZContentByCatalog } from "~/entities/catalogs/models";

import fetchApi from "~/shared/lib/api/fetch";
import type { YouTubeCardOptions } from "~/shared/types-schema/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/shared/ui/dropdown-menu";
import { ThreeDotIcon } from "~/shared/ui/icons";

import BackLink from "~/widgets/back-link";
import GridContainer from "~/widgets/grid-container";
import {
  PublicHeaderTitle,
  PublicMainContainer,
  PublicMarker,
} from "~/widgets/public-layout";
import ScrollTop from "~/widgets/scroll-top";
import YouTubeCard from "~/widgets/youtube/youtube-card";

import { AddToFavorites } from "./add-to-fav";
import CatalogInformationPopover from "./catalog-information-popover";
import FilterChannel, { CurrentActive } from "./filter-channel";
import { filterVideos, getActiveChannelIds } from "./helper-methods";
import NextUpdateToast from "./next-update-toast";
import SubredditPosts from "./subreddit-posts";

// Refer: https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr
const DynamicShareCatalog = dynamic(() => import("./share-catalog"), {
  ssr: false,
});

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
  };

  if (!videos) {
    return (
      <div className="h-full w-full grid place-items-center">
        No data available. Please update the channel list
      </div>
    );
  }

  const [today, week, month] = filterVideos(videos, channelId, duration);

  const activeChannels = getActiveChannelIds(videos);

  return (
    <>
      <NextUpdateToast nextUpdate={nextUpdate} />
      <PublicMainContainer className="space-y-4">
        <PublicHeaderTitle>
          <div className="space-y-0">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                <BackLink href="/explore/catalogs" />
                <div className="space-y-1">
                  <span className="flex items-center gap-4">
                    <h1 className="text-lg lg:text-xl tracking-wide">
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
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ThreeDotIcon className="size-5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="bottom"
                    align="end"
                    className="border-none flex flex-col gap-2 w-44 rounded-lg"
                  >
                    <DropdownMenuItem className="p-2 rounded-lg">
                      <DynamicShareCatalog
                        catalogId={catalogId}
                        catalogTitle={catalogTitle}
                        catalogDescription={catalogDescription}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-2 rounded-lg">
                      <AddToFavorites
                        catalogId={catalogId}
                        catalogTitle={catalogTitle}
                        catalogDescription={catalogDescription}
                      />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </PublicHeaderTitle>

        <SubredditPosts posts={posts ?? []} />

        <FilterChannel activeChannels={activeChannels} />

        <CurrentActive activeChannels={activeChannels} />

        {/* Today */}
        {today?.length ? (
          <VideoSection label="Today">
            {today.map((video) => (
              <YouTubeCard
                key={video.videoId}
                options={playerOptions}
                video={video}
              />
            ))}
          </VideoSection>
        ) : null}
        {/* This week */}
        {week?.length ? (
          <VideoSection label="This week">
            {week.map((video) => (
              <YouTubeCard
                key={video.videoId}
                options={playerOptions}
                video={video}
              />
            ))}
          </VideoSection>
        ) : null}
        {/* This month */}
        {month?.length ? (
          <VideoSection label="This month">
            {month.map((video) => (
              <YouTubeCard
                key={video.videoId}
                options={playerOptions}
                video={video}
              />
            ))}
          </VideoSection>
        ) : null}
        <ScrollTop />
      </PublicMainContainer>
    </>
  );
}

type VideoSectionProps = {
  label: string;
  children: ReactNode;
};

function VideoSection({ label, children }: VideoSectionProps) {
  const id = label.replaceAll(" ", "-").toLowerCase();
  return (
    <section className="px-0 md:px-3 space-y-4">
      <div className="h-6 px-2 md:px-0 flex items-center gap-2 text-primary">
        <PublicMarker />
        <h2 id={id} className="text-lg">
          <a href={`#${id}`}>{label}</a>
        </h2>
      </div>
      <GridContainer>{children}</GridContainer>
    </section>
  );
}
