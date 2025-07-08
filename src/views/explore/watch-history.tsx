"use client";

import { useEffect, useState } from "react";

import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";

import BackLink from "~/widgets/back-link";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";
import YouTubeCard from "~/widgets/youtube/youtube-card";
export default function WatchHistory() {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    const getWatchHistory = async () => {
      const indexedHistory = (await indexedDB["history"].toArray()) ?? [];
      setHistory(indexedHistory);
    };

    getWatchHistory();
  }, []);

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <div className="flex items-start gap-2">
          <BackLink href="/explore" />
          <h1 className="text-lg lg:text-xl tracking-wide">Watch history</h1>
        </div>
      </PublicHeaderTitle>
      <PublicContentContainer>
        <GridContainer>
          {history.length ? (
            history.map((item) => (
              <YouTubeCard
                key={item.videoId}
                options={{ enableJsApi: true }}
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
