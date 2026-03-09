"use client";

import { parseAsString, useQueryState } from "nuqs";
import { useEffect, useState } from "react";

import appConfig from "~/shared/app-config";
import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";
import { Badge } from "~/shared/ui/badge";

import BackLink from "~/widgets/back-link";
import GridContainer from "~/widgets/grid-container";
import {
  PublicContentContainer,
  PublicHeaderTitle,
  PublicMainContainer,
} from "~/widgets/public-layout";
import YouTubeCard from "~/widgets/youtube/youtube-card";

const Options = [
  {
    id: "not-completed",
    label: "Not completed",
  },
  {
    id: "completed",
    label: "Completed",
  },
] as const;

type OptionsIds = (typeof Options)[number]["id"];

export default function WatchHistory() {
  const [history, setHistory] = useState<History[]>([]);
  const [status, setStatus] = useQueryState(
    "status",
    parseAsString.withOptions({ history: "replace", shallow: false })
  );

  useEffect(() => {
    const getWatchHistory = async () => {
      const indexedHistory = (await indexedDB.history.toArray()) ?? [];
      if (status === "completed") {
        const completed = indexedHistory.filter(
          (item) => item.completed > appConfig.watchedPercentage
        );
        setHistory(completed);
      } else if (status === "not-completed") {
        const notCompleted = indexedHistory.filter((item) => {
          return item.completed < appConfig.watchedPercentage;
        });
        setHistory(notCompleted);
      } else {
        setHistory(indexedHistory);
      }
    };

    getWatchHistory();
  }, [status]);

  return (
    <PublicMainContainer>
      <PublicHeaderTitle>
        <div className="flex items-center gap-2">
          <BackLink href="/explore" />
          <h1 className="text-lg lg:text-xl tracking-wide">Watch history</h1>
        </div>
      </PublicHeaderTitle>
      <FilterWatched status={status} setStatus={setStatus} />
      <PublicContentContainer>
        <GridContainer>
          {history.length ? (
            history.map((item) => (
              <YouTubeCard
                key={item.videoId}
                options={{ enableJsApi: true, markWatched: true }}
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

type FilterWatchedProps = {
  status: string | null;
  setStatus: (value: string | null) => Promise<URLSearchParams>;
};

function FilterWatched({ status, setStatus }: FilterWatchedProps) {
  function handleChange(id: OptionsIds | null) {
    setStatus(id);
  }
  return (
    <div className="flex items-center gap-3 mt-4 px-2 md:px-3">
      <Badge
        onClick={() => handleChange(null)}
        className="cursor-pointer tracking-normal font-normal text-sm h-8 p-0 px-3 text-nowrap select-none"
        variant={!status ? "default" : "outline"}
      >
        All
      </Badge>
      {Options.map((option) => (
        <Badge
          key={option.id}
          variant={option.id === status ? "default" : "outline"}
          onClick={() => handleChange(option.id)}
          className="cursor-pointer tracking-normal font-normal text-sm h-8 p-0 px-3 text-nowrap select-none"
        >
          {option.label}
        </Badge>
      ))}
    </div>
  );
}
