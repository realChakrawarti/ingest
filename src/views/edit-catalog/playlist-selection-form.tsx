import Fuse from "fuse.js";
import { Check, Loader2, Search } from "lucide-react";
import { usePathname } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import { KeyedMutator } from "swr";

import { ChannelPlaylist } from "~/entities/youtube/models";
import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { ApiResponse } from "~/shared/lib/next/nx-response";
import TerminalLogger from "~/shared/lib/terminal-logger";
import { Badge } from "~/shared/ui/badge";
import { Button } from "~/shared/ui/button";
import { Checkbox } from "~/shared/ui/checkbox";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import { Separator } from "~/shared/ui/separator";

import useCatalogStore from "./catalog-store";

export default function PlaylistSelectionForm({
  revalidateCatalog,
  setIsDialogOpen,
}: {
  revalidateCatalog: KeyedMutator<ApiResponse<any>>;
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
  } = useCatalogStore();

  const [isLoading, setIsLoading] = useState(false);

  const catalogId = usePathname().split("/")[2];

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
      const result = await fetchApi(`/catalogs/${catalogId}/playlist`, {
        method: "PATCH",
        body: JSON.stringify({ playlists: selectedPlaylists }),
      });

      if (result.success) {
        toast({ title: "Catalog has been updated with new playlists." });
        revalidateCatalog();
        resetTempData();
      } else {
        toast({ title: "Something went wrong!" });
      }
      setIsDialogOpen(false);
    } catch (err) {
      TerminalLogger.fail(`${err}`);
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

  function playlistAlreadySelected(id: string) {
    return Boolean(selectedPlaylists.find((item) => item.playlistId === id));
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="playlist-search">Search Playlists</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            className="pl-10 input-search-icon"
            type="search"
            id="playlist-search"
            placeholder="Search playlists..."
            value={playlistInput}
            onChange={fuzzySearchPlaylist}
          />
        </div>
        {searchPlaylists.length === 0 && playlistInput && (
          <p className="text-sm text-center">
            No matching playlists found -{" "}
            <span className="text-primary font-semibold">{playlistInput}</span>!
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
                className="gap-1 bg-primary/60 hover:bg-primary/40 font-normal"
              >
                {playlist.playlistTitle}
                <button
                  onClick={() => togglePlaylistSelection(playlist)}
                  className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      <Separator />

      <div className="space-y-2 max-h-60 overflow-auto">
        {searchPlaylists.length
          ? searchPlaylists.map((playlist) => (
              <div
                key={playlist.playlistId}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => togglePlaylistSelection(playlist)}
              >
                <Checkbox
                  checked={playlistAlreadySelected(playlist.playlistId)}
                  onChange={() => togglePlaylistSelection(playlist)}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{playlist.playlistTitle}</div>
                  <div className="text-sm text-muted-foreground">
                    {playlist.videoCount} videos
                  </div>
                </div>
              </div>
            ))
          : channelPlaylists.map((playlist) => (
              <div
                key={playlist.playlistId}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                onClick={() => togglePlaylistSelection(playlist)}
              >
                <Checkbox
                  checked={playlistAlreadySelected(playlist.playlistId)}
                  onChange={() => togglePlaylistSelection(playlist)}
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium">{playlist.playlistTitle}</div>
                  <div className="text-sm text-muted-foreground">
                    {playlist.videoCount} videos
                  </div>
                </div>
              </div>
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
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <p>
                  Adding {selectedPlaylists.length} Playlist
                  {selectedPlaylists.length !== 1 ? "s..." : "..."}
                </p>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
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
