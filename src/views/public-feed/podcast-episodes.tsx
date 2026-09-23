"use client";

import { useRef, useState } from "react";
import { CalendarClock } from "lucide-react";

import { useQueryState } from "nuqs";

import type { ZFeedPodcastItem } from "~/entities/feeds/models";

import { getTimeDifference } from "~/shared/utils/time-diff";

import { ItemSection } from "~/widgets/item-section";

import { PodcastPlayer } from "./podcast-player";
import { ShowNotesSheet } from "./show-notes-sheet";

export function PodcastEpisodes({
  podcasts,
}: {
  podcasts: ZFeedPodcastItem[];
}) {
  const [podcastIdQuery] = useQueryState("podcast");

  const sortedPodcasts = podcasts.toSorted(
    (a, b) => b.datePublished - a.datePublished
  );

  const filterPodcasts = podcastIdQuery
    ? sortedPodcasts.filter(
        (podcast) => podcast.podcastId!.toString() === podcastIdQuery
      )
    : sortedPodcasts;

  return (
    <ItemSection>
      {filterPodcasts.map((podcast) => (
        <PodcastCard key={podcast.id} podcast={podcast} />
      ))}
    </ItemSection>
  );
}

function PodcastCard({ podcast }: { podcast: ZFeedPodcastItem }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  return (
    <div
      className="group/card-item hover-lift shadow-primary/20 rounded border shadow"
      key={podcast.id}
    >
      <div className="flex flex-col gap-3 p-3">
        <div className="grid grid-cols-[96px_1fr] gap-3">
          <div className="size-24 overflow-clip rounded">
            <img src={podcast.feedImage} alt={podcast.podcastTitle} />
          </div>
          <button
            onClick={() => setSheetOpen(true)}
            className="flex flex-col gap-3 text-left"
          >
            <div className="flex items-start justify-between">
              <span className="text-primary/80 hover:text-primary line-clamp-2 w-2/3 text-sm font-bold tracking-wider">
                {podcast.podcastTitle}
              </span>
              <span className="flex items-center gap-1.5 text-xs tracking-wide">
                <CalendarClock className="size-3" />
                <span>
                  {
                    getTimeDifference({
                      value: podcast.datePublished * 1000,
                      nearest: true,
                      suffixEnabled: true,
                      limitMonth: true,
                    })[1]
                  }
                </span>
              </span>
            </div>
            <span className="group-hover/card-item:text-primary line-clamp-2 text-base">
              {podcast.title}
            </span>
          </button>
        </div>
        <PodcastPlayer audioPlayerRef={audioPlayerRef} podcast={podcast} />
      </div>
      <ShowNotesSheet
        link={podcast.link}
        title={podcast.title}
        description={podcast.description}
        sheetOpen={sheetOpen}
        handleSheetOpen={setSheetOpen}
      />
    </div>
  );
}
