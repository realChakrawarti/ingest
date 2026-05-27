"use client";

import { useRef, useState } from "react";
// import { PauseIcon, PlayIcon } from "lucide-react";
import { PauseIcon, PlayIcon } from "lucide-react";

import { useQueryState } from "nuqs";

import type { ZCatalogPodcastItem } from "~/entities/catalogs/models";

// import { Button } from "~/shared/ui/button";
import { getTimeDifference } from "~/shared/utils/time-diff";
// import Spinner from "~/widgets/spinner";

import { ItemSection } from "~/widgets/item-section";
import Spinner from "~/widgets/spinner";

import { PodcastPlayer } from "./podcast-player";
import { ShowNotesSheet } from "./show-notes-sheet";
import { usePodcastPlayer } from "./use-podcast-player";

export function PodcastEpisodes({
  podcasts,
}: {
  podcasts: ZCatalogPodcastItem[];
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

function PodcastCard({ podcast }: { podcast: ZCatalogPodcastItem }) {
  const [sheetOpen, setSheetOpen] = useState(false);

  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const { isPlaying, isBuffering, togglePlay } =
    usePodcastPlayer(audioPlayerRef);

  return (
    <div className="rounded border" key={podcast.id}>
      <div className="flex flex-col gap-2 p-2">
        <div className="grid grid-cols-[96px_1fr] gap-2.5">
          <div className="relative size-24 overflow-clip rounded">
            <img src={podcast.feedImage} alt={podcast.podcastTitle} />
            <button
              className="clickable absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              <div className="border-border flex size-12 items-center justify-center rounded backdrop-blur-[1px]">
                {isBuffering ? (
                  <Spinner className="size-5" />
                ) : isPlaying ? (
                  <PauseIcon className="size-5" />
                ) : (
                  <PlayIcon className="size-5" />
                )}
              </div>
            </button>
          </div>
          <div onClick={() => setSheetOpen(true)} className="flex flex-col">
            <span className="text-muted-foreground text-sm tracking-wide">
              {getTimeDifference(podcast.datePublished * 1000, true)[1]}
            </span>
            <span className="line-clamp-2 text-sm">{podcast.title}</span>
            <span className="text-primary/80 line-clamp-2 text-xs font-semibold tracking-wider">
              {podcast.podcastTitle}
            </span>
          </div>
        </div>
        <PodcastPlayer audioPlayerRef={audioPlayerRef} podcast={podcast} />
      </div>
      <ShowNotesSheet
        title={podcast.title}
        description={podcast.description}
        sheetOpen={sheetOpen}
        handleSheetOpen={setSheetOpen}
      />
    </div>
  );
}