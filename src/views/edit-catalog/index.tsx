"use client";

import Link from "next/link";
import { useEffect } from "react";
import useSWR from "swr";

import type { CatalogList } from "~/entities/catalogs/models";
import { useToast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { LinkIcon } from "~/shared/ui/icons";
import { Separator } from "~/shared/ui/separator";
import JustTip from "~/widgets/just-the-tip";
import Spinner from "~/widgets/spinner";

import AddChannelPlaylistDialog from "./add-channel-playlist-dialog";
import useCatalogStore from "./catalog-store";
import ChannelTable from "./channel-table";
import PlaylistTable from "./playlist-table";
import UpdateCatalogMeta from "./update-catalog-meta";

// TODO: Instead of table for rendering saved and unsaved channels/playlist, consider using cards
// This will simplify the UI/UX. Against each unsaved, add a button to saved.
// Make a separate endpoint for updating catalog's title and description

export default function EditCatalog({ catalogId }: { catalogId: string }) {
  const { toast } = useToast();

  const {
    data: catalogData,
    isLoading,
    error,
    mutate: revalidateCatalog,
  } = useSWR(
    catalogId ? `/catalogs/${catalogId}` : null,
    (url) => fetchApi(url, { cache: "no-store" }),
    { revalidateOnFocus: false }
  );

  const { savedChannels, setSavedChannels, setSavedPlaylists, savedPlaylists } =
    useCatalogStore();

  useEffect(() => {
    if (catalogData?.data) {
      setSavedChannels(
        catalogData?.data?.list.filter(
          (item: CatalogList) => item.type === "channel"
        )
      );
      setSavedPlaylists(
        catalogData?.data?.list.filter(
          (item: CatalogList) => item.type === "playlist"
        )
      );
    }
  }, [catalogData?.data, setSavedChannels, setSavedPlaylists]);

  // TODO: Deleting item should be a single function as both doing the same thing, and should use a single endpoint
  const handleDeleteSaved = async (id: string) => {
    const deleteChannel = savedChannels.find(
      (channel) => channel.channelId === id && channel.type === "channel"
    );
    if (!deleteChannel) {
      return;
    }

    const result = await fetchApi(`/catalogs/${catalogId}/channel`, {
      method: "DELETE",
      body: JSON.stringify(deleteChannel),
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
      method: "DELETE",
      body: JSON.stringify(deletePlaylist),
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

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between p-3">
        <div>
          <h1 className="text-lg lg:text-xl">
            {catalogData?.data.title ?? ""}
          </h1>
          <p className="text-xs lg:text-sm">
            {catalogData?.data.description ?? ""}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <UpdateCatalogMeta
            catalogId={catalogId}
            revalidateCatalog={revalidateCatalog}
            title={catalogData?.data.title}
            description={catalogData?.data.description}
          />
          {savedChannels?.length ? (
            <Link href={`/c/${catalogId}`} target="_blank">
              <JustTip label="Visit Catalog">
                <Button variant="outline">
                  <LinkIcon className="size-8" />
                </Button>
              </JustTip>
            </Link>
          ) : null}
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
                <h2 className="text-xl font-semibold">Saved Channels</h2>
                <Badge variant="secondary">
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
                <h2 className="text-xl font-semibold">Saved Playlists</h2>
                <Badge variant="secondary">
                  {savedPlaylists?.length} of 15 playlists added
                </Badge>
              </div>
              <PlaylistTable
                playlists={savedPlaylists}
                handleDelete={handleDeleteSavedPlaylist}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
