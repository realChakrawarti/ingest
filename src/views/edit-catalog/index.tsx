"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { CatalogList } from "~/entities/catalogs/models";
import { useToast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import TerminalLogger from "~/shared/lib/terminal-logger";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { LinkIcon } from "~/shared/ui/icons";
import { Separator } from "~/shared/ui/separator";
import JustTip from "~/widgets/just-the-tip";
import Spinner from "~/widgets/spinner";

import AddChannelPlaylist from "./add-channel-playlist";
import useCatalogStore from "./catalog-store";
import ChannelTable from "./channel-table";
import PlaylistTable from "./playlist-table";
import UpdateCatalogMeta from "./update-catalog-meta";

type UpdateCatalogPayload = {
  channels?: string[];
};

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

  const {
    localChannels,
    setLocalChannels,
    savedChannels,
    setSavedChannels,
    localPlaylists,
    setLocalPlaylists,
    resetLocalPlaylist,
    setSavedPlaylists,
    savedPlaylists,
  } = useCatalogStore();

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

  // TODO: Deleting item should be a single function as both doing the same thing, amd should use a single endpoint
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

  const handleDeleteLocal = (id: string) => {
    const filteredChannels = localChannels.filter(
      (channel) => channel.id !== id
    );
    setLocalChannels(filteredChannels || []);
  };

  const handleDeleteLocalPlaylist = (id: string) => {
    const filteredPlaylists = localPlaylists.filter(
      (playlist) => playlist.id !== id
    );
    setLocalPlaylists(filteredPlaylists);
  };

  const handleAddPlaylistsToCatalog = async () => {
    // Check if channelId already exists in savedChannels
    const alreadyExists = savedChannels?.some((channel) => {
      if (channel.channelId === localPlaylists[0].channelId) {
        toast({
          title: `${channel.channelTitle}'s channel is already added to the catalog.`,
          description:
            "Please remove the channel before proceeding to add specific playlist from the same channel.",
        });
        return true;
      }
      return false;
    });

    if (alreadyExists) return;

    const result = await fetchApi(`/catalogs/${catalogId}/playlist`, {
      method: "PATCH",
      body: JSON.stringify(localPlaylists),
    });

    if (result.success) {
      toast({ title: "Catalog has been updated with new playlists." });
      resetLocalPlaylist();
      revalidateCatalog();
    } else {
      toast({ title: "Something went wrong!" });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    const payload: UpdateCatalogPayload = {
      channels: savedChannels.map((channel) => channel.channelId),
    };

    if (localChannels.length) {
      payload.channels?.push(...localChannels.map((item) => item.id));
    }

    // Check if any playlist is already added of the channel, if so ask to remove the playlists
    const playlistExists = localChannels?.some((channel) => {
      return savedPlaylists?.some((playlist) => {
        if (playlist.channelId === channel.id) {
          toast({
            title: `${channel.title} has already added specific playlists.`,
            description: `Remove ${channel.title} playlists to add this channel.`,
          });
          return true;
        }
      });
    });

    if (playlistExists) return;

    try {
      setIsSubmitting(true);
      const result = await fetchApi(`/catalogs/${catalogId}/channel`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (result.success) {
        revalidateCatalog();
        setLocalChannels([]);
      }

      toast({ title: result.message });
    } catch (err) {
      if (err instanceof Error) {
        TerminalLogger.fail(err.message);
      } else {
        TerminalLogger.fail(String(err));
      }
    } finally {
      setIsSubmitting(false);
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
          <AddChannelPlaylist />
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
          {localChannels?.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Unsaved Channels</h2>
                <div className="flex gap-2 mt-5 justify-end">
                  <Button
                    disabled={Boolean(
                      !localChannels.length &&
                        !localPlaylists.length &&
                        isSubmitting
                    )}
                    onClick={handleSubmit}
                  >
                    {isSubmitting ? <Spinner className="size-4" /> : null}
                    Submit
                  </Button>
                </div>
              </div>
              <ChannelTable
                channels={localChannels}
                handleDelete={handleDeleteLocal}
              />
            </div>
          ) : null}
          {localPlaylists?.length ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Unsaved Playlists</h2>
                <Button onClick={handleAddPlaylistsToCatalog}>
                  Add to catalog
                </Button>
              </div>
              <PlaylistTable
                playlists={localPlaylists}
                handleDelete={handleDeleteLocalPlaylist}
              />
            </div>
          ) : null}

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
