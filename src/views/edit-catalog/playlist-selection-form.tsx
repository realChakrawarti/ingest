import type { KeyedMutator } from "swr";

import { type ChangeEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Check, Loader2, Search } from "lucide-react";

import Fuse from "fuse.js";
import { toast } from "sonner";

import type {
  ZCatalogByID,
  ZCatalogPlaylist,
} from "~/entities/catalogs/models";
import type { ChannelPlaylist } from "~/entities/youtube/models";

import fetchApi from "~/shared/lib/api/fetch";
import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { Checkbox } from "~/shared/ui/checkbox";
import { Input } from "~/shared/ui/input";
import { Separator } from "~/shared/ui/separator";
import Log from "~/shared/utils/terminal-logger";

import useCatalogStore from "~/stores/catalog-store";

export default function PlaylistSelectionForm({
  revalidateCatalog,
  setIsDialogOpen,
}: {
  revalidateCatalog: KeyedMutator<ApiResponse<ZCatalogByID>>;
  setIsDialogOpen: (_open: boolean) => void;
}) {
  const {
    setFormStep,
    channelPlaylists,
    setSearchPlaylists,
    playlistInput,
    setPlaylistInput,
    setSelectedPlaylists,
    selectedPlaylists,
    searchPlaylists,
    resetTempData,
    channelInfo,
  } = useCatalogStore();

  const [isLoading, setIsLoading] = useState(false);

  const { catalogId } = useParams<{ catalogId: string }>();

  function fuzzySearchPlaylist(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target;
    setPlaylistInput(value);
    const search = fuse?.search(value);

    if (search?.length) {
      setSearchPlaylists(search.map((item: any) => item.item));
    } else {
      setSearchPlaylists([]);
    }
  }

  const handleAddPlaylists = async () => {
    try {
      setIsLoading(true);

      const playlistDetails = selectedPlaylists.map(
        (item: ChannelPlaylist): ZCatalogPlaylist => ({
          channelDescription: channelInfo.channelDescription,
          channelHandle: channelInfo.channelHandle,
          channelId: channelInfo.channelId,
          channelLogo: channelInfo.channelLogo,
          channelTitle: channelInfo.channelTitle,
          playlistDescription: item.playlistDescription,
          playlistId: item.playlistId,
          playlistTitle: item.playlistTitle,
          type: "playlist",
        })
      );

      const result = await fetchApi(`/catalogs/${catalogId}/playlist`, {
        body: JSON.stringify(playlistDetails),
        method: "PATCH",
      });

      if (result.success) {
        toast("Catalog has been updated with new playlists.");
        revalidateCatalog();
        resetTempData();
      } else {
        toast("Something went wrong!");
      }
      setIsDialogOpen(false);
    } catch (err) {
      Log.fail(`${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlaylistSelection = (playlist: ChannelPlaylist) => {
    // Check if playlist already added
    const playlistExists = selectedPlaylists.find(
      (item) => item.playlistId === playlist.playlistId
    );

    // Remove playlist when already added
    if (playlistExists) {
      const filteredPlaylist = selectedPlaylists.filter(
        (item) => item.playlistId !== playlist.playlistId
      );
      setSelectedPlaylists(filteredPlaylist);
      // Add playlist to the local playlist
    } else {
      setSelectedPlaylists([...selectedPlaylists, playlist]);
    }
  };

  const [fuse, setFuse] = useState<Fuse<ChannelPlaylist> | null>(null);

  useEffect(() => {
    if (channelPlaylists) {
      const fuseInstance = new Fuse(channelPlaylists, {
        keys: ["playlistTitle", "playlistDescription"],
        threshold: 0.4,
      });
      setFuse(fuseInstance);
    }
  }, [channelPlaylists]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
          <Input
            className="input-search-icon pl-10"
            type="search"
            id="playlist-search"
            placeholder="Search playlists..."
            value={playlistInput}
            onChange={fuzzySearchPlaylist}
          />
        </div>
        {searchPlaylists.length === 0 && playlistInput && (
          <p className="text-center text-sm">
            No matching playlists found -{" "}
            <span className="text-primary">{playlistInput}</span>!
          </p>
        )}
      </div>

      {selectedPlaylists.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedPlaylists.map((playlist) => {
            return (
              <Badge
                key={playlist.playlistId}
                variant="secondary"
                className="bg-primary/60 hover:bg-primary/40 gap-1 font-normal"
              >
                {playlist.playlistTitle}
                <button
                  type="button"
                  onClick={() => togglePlaylistSelection(playlist)}
                  className="hover:bg-muted-foreground/20 ml-1 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      <Separator />

      <div className="max-h-60 space-y-2 overflow-auto">
        {searchPlaylists.length
          ? searchPlaylists.map((playlist) => (
              <PlaylistItemCheckbox
                key={playlist.playlistId}
                playlist={playlist}
                togglePlaylistSelection={togglePlaylistSelection}
              />
            ))
          : channelPlaylists.map((playlist) => (
              <PlaylistItemCheckbox
                key={playlist.playlistId}
                playlist={playlist}
                togglePlaylistSelection={togglePlaylistSelection}
              />
            ))}
      </div>

      <div className="flex gap-2 pt-4">
        <Button
          variant="outline"
          onClick={() => setFormStep("channel")}
          className="flex-1"
        >
          Back
        </Button>
        <Button
          onClick={handleAddPlaylists}
          disabled={selectedPlaylists.length === 0 || isLoading}
          className="flex-1"
        >
          <div className="flex items-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                <p>
                  Adding {selectedPlaylists.length} Playlist
                  {selectedPlaylists.length !== 1 ? "s..." : "..."}
                </p>
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                <p>
                  Add {selectedPlaylists.length} Playlist
                  {selectedPlaylists.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </div>
        </Button>
      </div>
    </div>
  );
}

function PlaylistItemCheckbox({
  playlist,
  togglePlaylistSelection,
}: {
  playlist: ChannelPlaylist;
  togglePlaylistSelection: (playlist: ChannelPlaylist) => void;
}) {
  const { selectedPlaylists } = useCatalogStore();
  function playlistAlreadySelected(id: string) {
    return Boolean(selectedPlaylists.find((item) => item.playlistId === id));
  }

  return (
    <div
      className="hover:bg-muted/50 flex cursor-pointer items-center space-x-3 rounded-lg border p-3"
      onClick={() => togglePlaylistSelection(playlist)}
    >
      <Checkbox checked={playlistAlreadySelected(playlist.playlistId)} />
      <div className="min-w-0 flex-1">
        <div className="font-medium">{playlist.playlistTitle}</div>
        <div className="text-muted-foreground text-sm">
          {playlist.videoCount} videos
        </div>
      </div>
    </div>
  );
}