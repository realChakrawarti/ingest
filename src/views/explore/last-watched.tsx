"use client";

import { useEffect, useState } from "react";

import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";
import GridContainer from "~/widgets/grid-container";
import YouTubeCard from "~/widgets/youtube/youtube-card";

export default function LastWatched() {
  const [history, setHistory] = useState<History[]>([]);

  useEffect(() => {
    const getWatchHistory = async () => {
      const indexedHistory =
        (await indexedDB["history"]
          .toCollection()
          .reverse()
          .sortBy("updatedAt")) ?? [];

      // Filter the completed video, ones with 85% completed
      const filteredIndexedHistory = indexedHistory.filter(
        (item) => item.completed < 85
      );
      setHistory(filteredIndexedHistory);
    };

    getWatchHistory();
  }, []);

  if (history.length) {
    return (
      <section>
        <h1 className="text-2xl font-semibold tracking-tight">Watch history</h1>
        <div className="w-full pt-7">
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
        </div>
      </section>
    );
  }
  return null;
}
