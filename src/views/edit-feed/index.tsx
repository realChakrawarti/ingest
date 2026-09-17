"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LinkIcon, PodcastIcon } from "lucide-react";

import { SiReddit, SiYoutube } from "@icons-pack/react-simple-icons";
import { parseAsString, useQueryState } from "nuqs";
import { toast } from "sonner";
import useSWR from "swr";

import type { ZFeedByID } from "~/entities/feeds/models";

import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/shared/ui/empty";
import { Marker, MarkerContent } from "~/shared/ui/marker";
import { Separator } from "~/shared/ui/separator";
import { Skeleton } from "~/shared/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/shared/ui/tabs";

import BackLink from "~/widgets/back-link";
import JustTip from "~/widgets/just-the-tip";

import useFeedStore from "~/stores/feed-store";

import AddChannelPlaylistDialog from "./add-channel-playlist-dialog";
import AddPodcastDialog from "./add-podcast-dialog";
import AddSubredditDialog from "./add-subreddit-dialog";
import ChannelTable from "./channel-table";
import PlaylistTable from "./playlist-table";
import PodcastTable from "./podcast-table";
import SubredditTable from "./subreddit-table";
import UpdateFeedMeta from "./update-feed-meta";

// TODO: Instead of table for rendering saved and unsaved channels/playlist, consider using cards
// This will simplify the UI/UX. Against each unsaved, add a button to saved.

export default function EditFeed({ feedId }: { feedId: string }) {
  const {
    data: feeds,
    isLoading,
    error,
    mutate: revalidateFeed,
  } = useSWR(
    feedId ? `/feeds/${feedId}` : null,
    (url) => fetchApi<ZFeedByID>(url),
    { revalidateOnFocus: false }
  );

  const feedsData = feeds?.data;

  const {
    savedChannels,
    setSavedChannels,
    setSavedPlaylists,
    setSavedSubreddits,
    savedPlaylists,
    savedSubreddits,
    savedPodcasts,
    setSavedPodcasts,
  } = useFeedStore();

  useEffect(() => {
    if (feedsData) {
      setSavedChannels(
        feedsData?.list?.filter((item) => item.type === "channel")
      );
      setSavedPlaylists(
        feedsData?.list?.filter((item) => item.type === "playlist")
      );
      setSavedSubreddits(
        feedsData?.list?.filter((item) => item.type === "subreddit")
      );
      setSavedPodcasts(
        feedsData?.list?.filter((item) => item.type === "podcast")
      );
    }
  }, [
    feedsData,
    setSavedChannels,
    setSavedPlaylists,
    setSavedSubreddits,
    setSavedPodcasts,
  ]);

  // TODO: Deleting item should be a single function as both doing the same thing, and should use a single endpoint
  const handleDeleteSaved = async (id: string) => {
    const deleteChannel = savedChannels.find(
      (channel) => channel.channelId === id && channel.type === "channel"
    );
    if (!deleteChannel) {
      return;
    }

    const result = await fetchApi(`/feeds/${feedId}/channel`, {
      body: JSON.stringify(deleteChannel),
      method: "DELETE",
    });

    if (result.success) {
      toast(`${deleteChannel.channelTitle}'s channel deleted from the feed.`);
      revalidateFeed();
    } else {
      toast("Something went wrong.");
    }
  };

  const [type, setType] = useQueryState(
    "type",
    parseAsString.withDefault("youtube").withOptions({
      history: "replace",
      shallow: true,
    })
  );

  const handleTabChange = (value: string) => {
    setType(value);
  };

  const handleDeleteSavedPlaylist = async (id: string) => {
    const deletePlaylist = savedPlaylists.find(
      (playlist) => playlist.type === "playlist" && playlist.playlistId === id
    );
    if (!deletePlaylist) {
      return;
    }

    const result = await fetchApi(`/feeds/${feedId}/playlist`, {
      body: JSON.stringify(deletePlaylist),
      method: "DELETE",
    });

    if (result.success) {
      toast(
        `${
          deletePlaylist.type === "playlist" && deletePlaylist.playlistTitle
        }'s playlist deleted from the feed.`
      );
      revalidateFeed();
    } else {
      toast("Something went wrong.");
    }
  };

  const handleDeleteSavedPodcast = async (id: number) => {
    const deletePodcast = savedPodcasts.find(
      (podcast) => podcast.type === "podcast" && podcast.podcastId === id
    );
    if (!deletePodcast) {
      return;
    }

    const result = await fetchApi(`/feeds/${feedId}/podcast`, {
      body: JSON.stringify(deletePodcast),
      method: "DELETE",
    });

    if (result.success) {
      toast(
        `${
          deletePodcast.type === "podcast" && deletePodcast.podcastTitle
        }'s podcast deleted from the feed.`
      );
      revalidateFeed();
    } else {
      toast("Something went wrong.");
    }
  };

  const handleDeleteSavedSubreddit = async (id: string) => {
    const deleteSubreddit = savedSubreddits.find(
      (subreddit) =>
        subreddit.type === "subreddit" && subreddit.subredditId === id
    );
    if (!deleteSubreddit) {
      return;
    }

    const result = await fetchApi(`/feeds/${feedId}/subreddit`, {
      body: JSON.stringify(deleteSubreddit),
      method: "DELETE",
    });

    if (result.success) {
      toast(
        `${
          deleteSubreddit.type === "subreddit" && deleteSubreddit.subredditTitle
        } subreddit deleted from the feed.`
      );
      revalidateFeed();
    } else {
      toast("Something went wrong.");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-2 p-3">
        <div className="flex items-center gap-4">
          <BackLink className="size-6" href="/dashboard" />
          {isLoading ? (
            <Skeleton className="h-6 w-16" />
          ) : (
            <Badge className="text-sm">
              {feedsData?.isPublic ? "Public" : "Private"}
            </Badge>
          )}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <div className="space-y-1">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-4 w-32 lg:h-5" />
              </div>
            ) : (
              <div className="space-y-1">
                <h1 className="text-lg lg:text-xl">{feedsData?.title}</h1>
                <h2 className="text-xs lg:text-sm">
                  {feedsData?.description ?? ""}
                </h2>
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          {isLoading ? (
            <Skeleton className="size-7" />
          ) : (
            <UpdateFeedMeta
              feedId={feedId}
              revalidateFeed={revalidateFeed}
              title={feedsData?.title ?? ""}
              description={feedsData?.description ?? ""}
              isPublic={feedsData?.isPublic ?? true}
              lastUpdatedAt={feedsData?.lastUpdatedAt}
            />
          )}
          {isLoading ? (
            <Skeleton className="size-7" />
          ) : savedChannels?.length ? (
            <Link href={`/f/${feedId}`} target="_blank">
              <JustTip label="Visit Feed">
                <Button variant="ghost" size="icon">
                  <LinkIcon />
                </Button>
              </JustTip>
            </Link>
          ) : null}
        </div>
      </div>
      <Separator className="my-3" />
      {error && <p>Something went wrong!</p>}
      <Tabs
        value={type}
        onValueChange={handleTabChange}
        className="space-y-7 px-3 py-2"
      >
        <div className="flex justify-between">
          <TabsList>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="reddit">Subreddit</TabsTrigger>
            <TabsTrigger value="podcast">Podcast</TabsTrigger>
          </TabsList>
          {type === "youtube" &&
          (savedChannels.length || savedPlaylists.length) ? (
            <AddChannelPlaylistDialog revalidateFeed={revalidateFeed} />
          ) : null}
          {type === "reddit" && savedSubreddits.length ? (
            <AddSubredditDialog revalidateFeed={revalidateFeed} />
          ) : null}
          {type === "podcast" && savedPodcasts.length ? (
            <AddPodcastDialog revalidateFeed={revalidateFeed} />
          ) : null}
        </div>

        <TabsContent value="youtube">
          <div className="space-y-3">
            {savedChannels?.length === 0 && savedPlaylists.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="default">
                    <SiYoutube className="size-12" />
                  </EmptyMedia>
                  <EmptyTitle>No channel or playlist</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t added any channel or playlist yet. Get
                    started by adding a channel or playlist.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent className="flex-row justify-center gap-2">
                  <AddChannelPlaylistDialog revalidateFeed={revalidateFeed} />
                </EmptyContent>
              </Empty>
            ) : null}

            <ChannelTable
              channels={savedChannels}
              handleDelete={handleDeleteSaved}
            />
          </div>

          {savedChannels.length && savedPlaylists.length ? (
            <Marker className="my-8" variant="separator">
              <MarkerContent className="border-border rounded-md border px-3 py-2">
                Playlists
              </MarkerContent>
            </Marker>
          ) : null}

          <PlaylistTable
            playlists={savedPlaylists}
            handleDelete={handleDeleteSavedPlaylist}
          />
        </TabsContent>
        <TabsContent value="reddit">
          {savedSubreddits.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="default">
                  <SiReddit className="size-12" />
                </EmptyMedia>
                <EmptyTitle>No subreddit</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t added any subreddit yet. Get started by
                  adding your first subreddit.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <AddSubredditDialog revalidateFeed={revalidateFeed} />
              </EmptyContent>
            </Empty>
          ) : null}
          <SubredditTable
            subreddits={savedSubreddits}
            handleDelete={handleDeleteSavedSubreddit}
          />
        </TabsContent>
        <TabsContent value="podcast">
          {savedPodcasts.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="default">
                  <PodcastIcon className="size-12" />
                </EmptyMedia>
                <EmptyTitle>No podcast</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t added any podcast yet. Get started by adding
                  your first podcast.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent className="flex-row justify-center gap-2">
                <AddPodcastDialog revalidateFeed={revalidateFeed} />
              </EmptyContent>
            </Empty>
          ) : null}
          <PodcastTable
            podcasts={savedPodcasts}
            handleDelete={handleDeleteSavedPodcast}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}