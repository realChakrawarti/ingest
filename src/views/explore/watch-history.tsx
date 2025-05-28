"use client";

import { useEffect, useState } from "react";

import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";
import GridContainer from "~/widgets/grid-container";
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
    <div className="p-3">
      <h1 className="text-2xl font-semibold tracking-tight">History</h1>
      <div className="w-full pt-7">
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
      </div>
    </div>
  );
}
