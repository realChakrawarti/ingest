"use client";

import { useLiveQuery } from "dexie-react-hooks";

import { indexedDB } from "~/shared/lib/api/dexie";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";
import YouTubeCard from "~/widgets/youtube/youtube-card";

export default function WatchLater() {
  const watchLater =
    useLiveQuery<any[]>(() => indexedDB["watch-later"].toArray()) ?? [];

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <h1 className="text-2xl font-semibold tracking-tight">Watch later</h1>
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
            <div>No videos found.</div>
          )}
        </GridContainer>
      </PublicContentContainer>
    </PublicMainContainer>
  );
}
