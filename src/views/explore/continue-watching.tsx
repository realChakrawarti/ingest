"use client";

import { useEffect, useState } from "react";

import { useLocalStorage } from "~/shared/hooks/use-local-storage";
import { indexedDB } from "~/shared/lib/api/dexie";
import { LOCAL_USER_SETTINGS } from "~/shared/lib/constants";
import type { History, TUserSettings } from "~/shared/types-schema/types";

import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";
import YouTubeCard from "~/widgets/youtube/youtube-card";

export default function ContinueWatching() {
  const [history, setHistory] = useState<History[]>([]);
  const [localUserSettings] = useLocalStorage<TUserSettings>(
    LOCAL_USER_SETTINGS,
    null
  );

  useEffect(() => {
    const getWatchHistory = async () => {
      const indexedHistory =
        (await indexedDB["history"]
          .toCollection()
          .reverse()
          .sortBy("updatedAt")) ?? [];

      const filteredIndexedHistory = indexedHistory.filter(
        (item) => item.completed < localUserSettings.watchedPercentage
      );
      setHistory(filteredIndexedHistory);
    };

    getWatchHistory();
  }, []);

  if (history.length) {
    return (
      <PublicMainContainer>
        <PublicHeaderTitle>
          <h1 className="text-2xl tracking-wide">Continue Watching</h1>
        </PublicHeaderTitle>
        <PublicContentContainer>
          <GridContainer>
            {history.slice(0, 4).map((item) => (
              // TODO: Track video progression
              <YouTubeCard
                key={item.videoId}
                options={{ enableJsApi: true }}
                video={item}
              />
            ))}
          </GridContainer>
        </PublicContentContainer>
      </PublicMainContainer>
    );
  }
  return null;
}
