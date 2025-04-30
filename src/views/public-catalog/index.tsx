/* eslint-disable @next/next/no-img-element */
import { ClockIcon, type LucideIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

import fetchApi from "~/shared/lib/api/fetch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/shared/ui/dropdown-menu";
import { MonthIcon, ThreeDotIcon, WeekIcon } from "~/shared/ui/icons";
import GridContainer from "~/widgets/grid-container";
import Marker from "~/widgets/marker";
import ScrollTop from "~/widgets/scroll-top";
import YouTubeCard from "~/widgets/youtube/youtube-card";

import { AddToFavorites } from "./add-to-fav";
import FilterChannel, { CurrentActive } from "./filter-channel";
import { filterChannel, getActiveChannelIds } from "./helper-methods";

// Refer: https://nextjs.org/docs/pages/building-your-application/optimizing/lazy-loading#with-no-ssr
const DynamicShareCatalog = dynamic(() => import("./share-catalog"), {
  ssr: false,
});

export default async function PubliCatalog({
  channelId = "",
  catalogId,
}: {
  channelId: string;
  catalogId: string;
}) {
  const result = await fetchApi(`/catalogs/${catalogId}/videos`);

  const catalogData = result.data;

  const videos: Record<string, any> = catalogData?.data;
  const catalogTitle = catalogData?.title;
  const catalogDescription = catalogData?.description;

  if (!videos) {
    return (
      <div className="h-full w-full grid place-items-center">
        No data available. Please update the channel list
      </div>
    );
  }

  const [today, week, month] = filterChannel(videos, channelId);

  const activeChannels = getActiveChannelIds(videos);

  return (
    <div className="space-y-4 pb-6 pt-7">
      <section className="px-2 md:px-3">
        <div className="space-y-0">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <span className="flex items-center gap-4">
                <h1 className="text-2xl font-semibold tracking-tight">
                  {catalogTitle}
                </h1>
                <FilterChannel activeChannels={activeChannels} />
              </span>
              <p className="text-base text-muted-foreground">
                {catalogDescription}
              </p>
            </div>

            <div className="self-center mr-2">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <ThreeDotIcon className="size-5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="bottom"
                  align="end"
                  className="border-none flex flex-col gap-2"
                >
                  <DropdownMenuItem>
                    <DynamicShareCatalog
                      catalogId={catalogId}
                      catalogTitle={catalogTitle}
                      catalogDescription={catalogDescription}
                    />
                  </DropdownMenuItem>
                  <DropdownMenuItem>
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
      </section>

      <CurrentActive activeChannels={activeChannels} />

      {/* Today */}
      {today?.length ? (
        <VideoSection icon={ClockIcon} label="Today">
          {today.map((video) => (
            <YouTubeCard
              key={video.videoId}
              options={{
                addWatchLater: true,
                enableJsApi: true,
                hideAvatar: Boolean(channelId),
              }}
              video={video}
            />
          ))}
        </VideoSection>
      ) : null}
      {/* This week */}
      {week?.length ? (
        <VideoSection icon={WeekIcon} label="This week">
          {week.map((video) => (
            <YouTubeCard
              key={video.videoId}
              options={{
                addWatchLater: true,
                enableJsApi: true,
                hideAvatar: Boolean(channelId),
              }}
              video={video}
            />
          ))}
        </VideoSection>
      ) : null}
      {/* This month */}
      {month?.length ? (
        <VideoSection icon={MonthIcon} label="This month">
          {month.map((video) => (
            <YouTubeCard
              key={video.videoId}
              options={{
                addWatchLater: true,
                enableJsApi: true,
                hideAvatar: Boolean(channelId),
              }}
              video={video}
            />
          ))}
        </VideoSection>
      ) : null}
      <ScrollTop />
    </div>
  );
}

type VideoSectionProps = {
  label: string;
  children: ReactNode;
  icon: LucideIcon;
};

function VideoSection({ label, children, icon: Icon }: VideoSectionProps) {
  const id = label.replaceAll(" ", "-").toLowerCase();
  return (
    <section className="px-0 md:px-3 space-y-4">
      <div className="h-6 px-2 md:px-0 flex items-center gap-2 text-primary">
        <Marker />
        <h2 id={id} className="text-lg">
          <a href={`#${id}`}>{label}</a>
        </h2>
        <Icon />
      </div>
      <GridContainer>{children}</GridContainer>
    </section>
  );
}
