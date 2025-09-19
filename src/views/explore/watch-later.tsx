"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { indexedDB } from "~/shared/lib/api/dexie";

import BackLink from "~/widgets/back-link";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";
import YouTubeCard from "~/widgets/youtube/youtube-card";

export default function WatchLater() {
  const watchLater =
    useLiveQuery(() => indexedDB["watch-later"].toArray()) ?? [];

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <div className="flex items-center gap-2">
          <BackLink href="/explore" />
          <h1 className="text-lg lg:text-xl tracking-wide">Watch later</h1>
        </div>
      </PublicHeaderTitle>
      <PublicContentContainer>
        <GridContainer>
          {watchLater.length ? (
            watchLater.map((item) => (
              <YouTubeCard
                key={item.videoId}
                options={{
                  enableJsApi: true,
                  hideAvatar: true,
                  removeWatchLater: true,
                }}
                video={item}
              />
            ))
          ) : (
            <div className="px-2 md:px-0">No videos found.</div>
          )}
        </GridContainer>
      </PublicContentContainer>
    </PublicMainContainer>
  );
}
