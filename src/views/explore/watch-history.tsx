"use client";

import { useCallback, useEffect, useState } from "react";
import { Trash2 } from "lucide-react";

import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";

import appConfig from "~/shared/app-config";
import { useLocalUserSettings } from "~/shared/hooks/use-local-user-settings";
import { indexedDB } from "~/shared/lib/api/dexie";
import type { History } from "~/shared/types-schema/types";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { time } from "~/shared/utils/time";

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

  const { localUserSettings } = useLocalUserSettings(null);

  const getWatchHistory = useCallback(async () => {
    try {
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
    } catch {
      toast("Unable to cleanup history.");
    }
  }, [status]);

  useEffect(() => {
    getWatchHistory();
  }, [getWatchHistory]);

  async function removeOldRecords() {
    const days = localUserSettings?.historyDays ?? 0;
    if (days === 0 || Number.isNaN(days)) {
      return;
    }

    const deletePrior = Date.now() - time.days(days);
    const historyQuery = indexedDB["history"]
      .where("updatedAt")
      .below(deletePrior);
    const removeCount = await historyQuery.count();
    if (removeCount) {
      await historyQuery.delete();
      await getWatchHistory();
      toast(`Removed ${removeCount} old videos from the history.`);
    } else {
      toast("Nothing to cleanup.");
    }
  }

  return (
    <PublicMainContainer>
      <PublicHeaderTitle className="flex justify-between">
        <div className="flex items-center gap-2">
          <BackLink href="/explore" />
          <h1 className="text-lg tracking-wide lg:text-xl">Watch history</h1>
        </div>
        <Button
          onClick={removeOldRecords}
          className="flex items-center gap-2"
          variant="outline"
        >
          <Trash2 />
          <span>Cleanup history</span>
        </Button>
      </PublicHeaderTitle>
      <FilterWatched status={status} setStatus={setStatus} />
      <PublicContentContainer>
        <GridContainer>
          {history.length ? (
            history.map((item) => (
              <YouTubeCard
                key={item.videoId}
                options={{
                  enableJsApi: true,
                  markWatched: true,
                  focusMode: true,
                  showDuration: true,
                  showVideoStats: true,
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

type FilterWatchedProps = {
  status: string | null;
  setStatus: (value: string | null) => Promise<URLSearchParams>;
};

function FilterWatched({ status, setStatus }: FilterWatchedProps) {
  function handleChange(id: OptionsIds | null) {
    setStatus(id);
  }
  return (
    <div className="mt-4 flex items-center gap-3 px-2 md:px-3">
      <Badge
        onClick={() => handleChange(null)}
        className="h-8 cursor-pointer p-0 px-3 text-sm font-normal tracking-normal text-nowrap select-none"
        variant={!status ? "default" : "outline"}
      >
        All
      </Badge>
      {Options.map((option) => (
        <Badge
          key={option.id}
          variant={option.id === status ? "default" : "outline"}
          onClick={() => handleChange(option.id)}
          className="h-8 cursor-pointer p-0 px-3 text-sm font-normal tracking-normal text-nowrap select-none"
        >
          {option.label}
        </Badge>
      ))}
    </div>
  );
}