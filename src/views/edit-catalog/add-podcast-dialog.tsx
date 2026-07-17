"use client";

import type { KeyedMutator } from "swr";

import type { ChangeEvent } from "react";
import { useState } from "react";
import { useParams } from "next/navigation";
import { Check, Loader2, Podcast, Search } from "lucide-react";

import { toast } from "sonner";
import useSWR from "swr";

import type { ZCatalogByID, ZCatalogPodcast } from "~/entities/catalogs/models";
import type { Feed } from "~/entities/podcast/models";

import useDebounce from "~/shared/hooks/use-debounce";
import fetchApi from "~/shared/lib/api/fetch";
import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Avatar, AvatarFallback, AvatarImage } from "~/shared/ui/avatar";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { Checkbox } from "~/shared/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";
import { Separator } from "~/shared/ui/separator";
import Log from "~/shared/utils/terminal-logger";

import { OutLink } from "~/widgets/out-link";

import useCatalogStore from "~/stores/catalog-store";

async function getPodcasts(query: string) {
  const response = await fetchApi(`/podcast?q=${query}`);
  const results = await response.data;
  return results;
}

export default function AddPodcastDialog({
  revalidateCatalog,
}: {
  revalidateCatalog: KeyedMutator<ApiResponse<ZCatalogByID>>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const debouncedSearch = useDebounce(searchInput, 1000);

  const { catalogId } = useParams<{ catalogId: string }>();

  const { selectedPodcasts, setSelectedPodcasts, resetTempData } =
    useCatalogStore();

  const [isLoadingUpdate, setIsLoadingUpdate] = useState<boolean>(false);

  const { data, isLoading, mutate } = useSWR(
    debouncedSearch?.length > 2 ? `podcasts-${debouncedSearch}` : null,
    () => getPodcasts(debouncedSearch)
  );

  const togglePodcastSelection = (podcast: any) => {
    const podcastId = podcast.id || podcast.podcastId;
    // // Check if podcast already added
    const podcastExists = selectedPodcasts.find(
      (item) => item.podcastId === podcastId
    );

    // Remove podcast when already added
    if (podcastExists) {
      const filteredPodcast = selectedPodcasts.filter(
        (item) => item.podcastId !== podcastId
      );
      setSelectedPodcasts(filteredPodcast);
      // Add podcast to the local subreddit
    } else {
      const podcastFormatted: ZCatalogPodcast = {
        podcastDescription: podcast.description,
        podcastEpisode: podcast.episodeCount,
        podcastArtwork: podcast.artwork,
        podcastId: podcastId,
        podcastTitle: podcast.title,
        podcastLink: podcast.link,
        podcastLastPublished: podcast.newestItemPubdate,
        type: "podcast",
      };

      setSelectedPodcasts([...selectedPodcasts, podcastFormatted]);
    }
  };

  function handleDialogClose(open: boolean) {
    if (!open) {
      resetTempData();
    }
    setIsDialogOpen(open);
  }

  function onSearchInputChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setSearchInput(input);
  }

  async function handleAddPodcast() {
    setIsLoadingUpdate(true);
    try {
      const result = await fetchApi(`/catalogs/${catalogId}/podcast`, {
        body: JSON.stringify(selectedPodcasts),
        method: "PATCH",
      });

      if (result.success) {
        toast("Catalog has been updated with new podcasts.");
        revalidateCatalog();
        resetTempData();
      } else {
        toast("Something went wrong!");
      }
      setSearchInput("");
      await mutate(undefined); // Clear the data
      setIsDialogOpen(false);
    } catch (err) {
      Log.fail(err);
    } finally {
      setIsLoadingUpdate(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button aria-label="Add podcast">
          <span className="flex items-center gap-1">
            <Podcast className="size-8" />
            <p className="hidden md:inline-block">Podcast</p>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden px-3 py-6 sm:max-w-150">
        <DialogHeader className="px-3">
          <DialogTitle>Add Podcast</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 px-3">
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              className="input-search-icon pl-10"
              type="search"
              id="podcast-search"
              placeholder="Search podcasts..."
              value={searchInput}
              onChange={onSearchInputChange}
              autoFocus
            />
          </div>

          {selectedPodcasts.length > 0 && (
            <div className="flex max-h-25 flex-wrap gap-2">
              {selectedPodcasts
                .toReversed()
                .slice(0, 3)
                .map((podcast) => {
                  return (
                    <Badge
                      key={podcast.podcastId}
                      variant="secondary"
                      className="bg-primary/60 hover:bg-primary/40 gap-1 font-normal"
                    >
                      {podcast.podcastTitle}
                      <button
                        type="button"
                        onClick={() => togglePodcastSelection(podcast)}
                        className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  );
                })}
              <p className="text-primary">
                {selectedPodcasts.length - 3 > 0
                  ? `+${selectedPodcasts.length - 3} more`
                  : null}
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              onClick={handleAddPodcast}
              disabled={selectedPodcasts.length === 0 || isLoadingUpdate}
              className="flex-1"
            >
              <div className="flex items-center gap-2">
                {isLoadingUpdate ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    <p>
                      Adding {selectedPodcasts.length} Podcasts
                      {selectedPodcasts.length !== 1 ? "s..." : "..."}
                    </p>
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    <p>
                      Add {selectedPodcasts.length} Podcast
                      {selectedPodcasts.length !== 1 ? "s" : ""}
                    </p>
                  </>
                )}
              </div>
            </Button>
          </div>

          <Separator />

          {searchInput ? (
            <SearchDropdown
              isLoading={isLoading}
              podcasts={data}
              togglePodcastSelection={togglePodcastSelection}
            />
          ) : (
            <div className="text-muted-foreground py-8 text-center">
              <p className="mb-2">Search for podcasts to get started</p>
              <p className="text-sm">
                Try searching for topics like "technology", "gaming", or "news"
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchDropdown({
  isLoading,
  podcasts,
  togglePodcastSelection,
}: {
  isLoading: boolean;
  podcasts: Feed[];
  togglePodcastSelection: (podcast: any) => void;
}) {
  const { selectedPodcasts } = useCatalogStore();

  function podcastAlreadySelected(id: number) {
    return Boolean(selectedPodcasts.find((item) => item.podcastId === id));
  }

  return (
    <div className="bg-card border-border z-50 flex max-h-100 min-h-64 flex-col overflow-y-auto rounded-md border">
      {isLoading ? (
        <span className="text-muted-foreground p-4 text-center">
          Searching...
        </span>
      ) : podcasts?.length > 0 ? (
        podcasts.map((podcast) => {
          return (
            <div
              key={podcast.id}
              className="hover:bg-accent border-border flex cursor-pointer items-start justify-between gap-2 border-b p-3 transition-colors last:border-b-0"
              onClick={() => togglePodcastSelection(podcast)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-8 rounded-lg">
                  <AvatarImage
                    src={podcast.artwork}
                    alt={`${podcast.title} icon`}
                  />
                  <AvatarFallback className="bg-primary/80 text-sm text-white">
                    *
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-primary/80 flex items-center gap-2 text-sm dark:text-white">
                      {podcast.link ? (
                        <OutLink href={podcast.link}>
                          <span className="font-semibold tracking-wide underline-offset-2 hover:underline">
                            {podcast.title}
                          </span>
                        </OutLink>
                      ) : (
                        <span className="font-semibold tracking-wide underline-offset-2 hover:underline">
                          {podcast.title}
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="text-muted-foreground text-sm tracking-wide">
                    Last published:{" "}
                    {new Date(podcast.newestItemPubdate * 1000).toDateString()}
                  </span>
                  <div className="flex items-center gap-1 text-sm">
                    <span className="text-primary/80 shrink-0 dark:text-white">
                      {podcast.episodeCount} episodes
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="line-clamp-1 font-semibold">
                      {podcast.author}
                    </span>
                  </div>
                  <p className="text-muted-foreground line-clamp-2 text-xs">
                    {podcast.description}
                  </p>
                </div>
              </div>
              <Checkbox checked={podcastAlreadySelected(podcast.id)} />
            </div>
          );
        })
      ) : null}
    </div>
  );
}