"use client";

import { Info } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";

import type { ZCatalogByID } from "~/entities/catalogs/models";

import { useToast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { LinkIcon } from "~/shared/ui/icons";
import { Separator } from "~/shared/ui/separator";

import BackLink from "~/widgets/back-link";
import JustTip from "~/widgets/just-the-tip";
import Spinner from "~/widgets/spinner";

import AddChannelPlaylistDialog from "./add-channel-playlist-dialog";
import AddSubredditDialog from "./add-subreddit-dialog";
import useCatalogStore from "./catalog-store";
import ChannelTable from "./channel-table";
import PlaylistTable from "./playlist-table";
import SubredditTable from "./subreddit-table";
import UpdateCatalogMeta from "./update-catalog-meta";

// TODO: Instead of table for rendering saved and unsaved channels/playlist, consider using cards
// This will simplify the UI/UX. Against each unsaved, add a button to saved.
// Make a separate endpoint for updating catalog's title and description

export default function EditCatalog({ catalogId }: { catalogId: string }) {
  const { toast } = useToast();

  const {
    data: catalogs,
    isLoading,
    error,
    mutate: revalidateCatalog,
  } = useSWR(
    catalogId ? `/catalogs/${catalogId}` : null,
    (url) => fetchApi<ZCatalogByID>(url, { cache: "no-store" }),
    { revalidateOnFocus: false }
  );

  const catalogsData = catalogs?.data;

  const {
    savedChannels,
    setSavedChannels,
    setSavedPlaylists,
    setSavedSubreddits,
    savedPlaylists,
    savedSubreddits,
  } = useCatalogStore();

  useEffect(() => {
    if (catalogsData) {
      setSavedChannels(
        catalogsData?.list?.filter((item) => item.type === "channel")
      );
      setSavedPlaylists(
        catalogsData?.list?.filter((item) => item.type === "playlist")
      );

      setSavedSubreddits(
        catalogsData?.list?.filter((item) => item.type === "subreddit")
      );
    }
  }, [catalogsData, setSavedChannels, setSavedPlaylists, setSavedSubreddits]);

  // TODO: Deleting item should be a single function as both doing the same thing, and should use a single endpoint
  const handleDeleteSaved = async (id: string) => {
    const deleteChannel = savedChannels.find(
      (channel) => channel.channelId === id && channel.type === "channel"
    );
    if (!deleteChannel) {
      return;
    }

    const result = await fetchApi(`/catalogs/${catalogId}/channel`, {
      body: JSON.stringify(deleteChannel),
      method: "DELETE",
    });

    if (result.success) {
      toast({
        title: `${deleteChannel.channelTitle}'s channel deleted from the catalog.`,
      });
      revalidateCatalog();
    } else {
      toast({ title: "Something went wrong." });
    }
  };

  const handleDeleteSavedPlaylist = async (id: string) => {
    const deletePlaylist = savedPlaylists.find(
      (playlist) => playlist.type === "playlist" && playlist.playlistId === id
    );
    if (!deletePlaylist) {
      return;
    }

    const result = await fetchApi(`/catalogs/${catalogId}/playlist`, {
      body: JSON.stringify(deletePlaylist),
      method: "DELETE",
    });

    if (result.success) {
      toast({
        title: `${
          deletePlaylist.type === "playlist" && deletePlaylist.playlistTitle
        }'s playlist deleted from the catalog.`,
      });
      revalidateCatalog();
    } else {
      toast({ title: "Something went wrong." });
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

    const result = await fetchApi(`/catalogs/${catalogId}/subreddit`, {
      body: JSON.stringify(deleteSubreddit),
      method: "DELETE",
    });

    if (result.success) {
      toast({
        title: `${
          deleteSubreddit.type === "subreddit" && deleteSubreddit.subredditTitle
        } subreddit deleted from the catalog.`,
      });
      revalidateCatalog();
    } else {
      toast({ title: "Something went wrong." });
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between p-3">
        <div className="flex items-center gap-4">
          <BackLink className="size-6" href="/dashboard" />
          <div className="flex items-center gap-2">
            <h1 className="text-lg lg:text-xl">{catalogsData?.title ?? ""}</h1>
            <JustTip label={catalogsData?.description ?? ""}>
              <Info className="size-4" />
            </JustTip>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UpdateCatalogMeta
            catalogId={catalogId}
            revalidateCatalog={revalidateCatalog}
            title={catalogsData?.title ?? ""}
            description={catalogsData?.description ?? ""}
          />
          {savedChannels?.length ? (
            <Link href={`/c/${catalogId}`} target="_blank">
              <JustTip label="Visit Catalog">
                <Button variant="ghost" size="icon">
                  <LinkIcon />
                </Button>
              </JustTip>
            </Link>
          ) : null}
          <AddSubredditDialog revalidateCatalog={revalidateCatalog} />
          <AddChannelPlaylistDialog revalidateCatalog={revalidateCatalog} />
        </div>
      </div>
      <Separator className="my-3" />
      {error && <p>Something went wrong!</p>}
      {isLoading && (
        <div className="size-full grid items-center">
          <Spinner className="size-8" />
        </div>
      )}
      {!isLoading && !error && (
        <div className="space-y-7 p-3">
          {savedChannels?.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-normal tracking-wide">
                  Saved Channels
                </h2>
                <Badge
                  className="font-normal tracking-wide"
                  variant="secondary"
                >
                  {savedChannels?.length} of 15 channels added
                </Badge>
              </div>
              <ChannelTable
                channels={savedChannels}
                handleDelete={handleDeleteSaved}
              />
            </div>
          ) : null}

          {savedPlaylists?.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-normal tracking-wide">
                  Saved Playlists
                </h2>
                <Badge
                  className="font-normal tracking-wide"
                  variant="secondary"
                >
                  {savedPlaylists?.length} of 15 playlists added
                </Badge>
              </div>
              <PlaylistTable
                playlists={savedPlaylists}
                handleDelete={handleDeleteSavedPlaylist}
              />
            </div>
          ) : null}

          {savedSubreddits?.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-normal tracking-wide">
                  Saved Subreddits
                </h2>
                <Badge
                  className="font-normal tracking-wide"
                  variant="secondary"
                >
                  {savedSubreddits?.length} of 10 subreddits added
                </Badge>
              </div>
              <SubredditTable
                subreddits={savedSubreddits}
                handleDelete={handleDeleteSavedSubreddit}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
