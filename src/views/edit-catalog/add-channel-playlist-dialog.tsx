"use client";

import Fuse from "fuse.js";
import { Check, ChevronLeft, ListPlusIcon, Search } from "lucide-react";
import { useState } from "react";
import { KeyedMutator } from "swr";

import { ApiResponse } from "~/shared/lib/next/nx-response";
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
import { Label } from "~/shared/ui/label";
import { Separator } from "~/shared/ui/separator";

import useCatalogStore from "./catalog-store";
import InputURLForm from "./input-url-form";
import SelectForm from "./select-form";

const mockPlaylists = [
  {
    id: "PLrAXtmRdnEQy8VF-mJDrLFA0RLKV1VU2L",
    title: "Chrome DevTools",
    videoCount: 45,
  },
  {
    id: "PLrAXtmRdnEQy1ukqjf8R-89oaqVoqJNHi",
    title: "Web Development",
    videoCount: 128,
  },
  {
    id: "PLrAXtmRdnEQy2VF-mJDrLFA0RLKV1VU3M",
    title: "Android Development",
    videoCount: 89,
  },
  {
    id: "PLrAXtmRdnEQy3VF-mJDrLFA0RLKV1VU4N",
    title: "Machine Learning",
    videoCount: 67,
  },
  {
    id: "PLrAXtmRdnEQy4VF-mJDrLFA0RLKV1VU5O",
    title: "Firebase",
    videoCount: 34,
  },
  {
    id: "PLrAXtmRdnEQy5VF-mJDrLFA0RLKV1VU6P",
    title: "Google Cloud Platform",
    videoCount: 156,
  },
  {
    id: "PLrAXtmRdnEQy6VF-mJDrLFA0RLKV1VU7Q",
    title: "Flutter Development",
    videoCount: 78,
  },
  {
    id: "PLrAXtmRdnEQy7VF-mJDrLFA0RLKV1VU8R",
    title: "TensorFlow",
    videoCount: 92,
  },
];

interface Playlist {
  id: string;
  title: string;
  videoCount: number;
}

export default function AddChannelPlaylistDialog({
  revalidateCatalog,
}: {
  revalidateCatalog: KeyedMutator<ApiResponse<any>>;
}) {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlaylists, setSelectedPlaylists] = useState<string[]>([]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fuzzy search setup
  const fuse = new Fuse(playlists, {
    keys: ["title"],
    threshold: 0.3,
  });

  const filteredPlaylists = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : playlists;

  const resetDialog = () => {
    // setFormStep("url");
    // setVideoUrl("");
    // setChannelData(null);
    setPlaylists([]);
    setSearchQuery("");
    setSelectedPlaylists([]);
    // setSelectionType(null);
    // setInputMode("video");
  };

  const handleAddPlaylists = () => {
    // if (!channelData || selectedPlaylists.length === 0) return;

    // onChannelAdded({
    //   channelId: channelData.id,
    //   name: channelData.title, // Changed from channelData.name to channelData.title
    //   playlistIds: selectedPlaylists,
    //   type: "playlist",
    // });
    resetDialog();
  };

  const togglePlaylistSelection = (playlistId: string) => {
    setSelectedPlaylists((prev) =>
      prev.includes(playlistId)
        ? prev.filter((id) => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetDialog();
    }
    setIsDialogOpen(open);
  };

  const { channelInfo, formStep, setFormStep } = useCatalogStore();

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <div className="flex gap-2 items-center">
            <ListPlusIcon className="size-8" />
            <p>Add channel-playlist</p>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col px-3 py-6">
        <DialogHeader className="px-3">
          <div className="flex items-center gap-2">
            {formStep !== "url" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (formStep === "channel") setFormStep("url");
                  if (formStep === "playlists") setFormStep("channel");
                }}
                className="p-1 h-8 w-8"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
            <DialogTitle>
              {formStep === "url" && "Add YouTube Channel"}
              {formStep === "channel" && "Channel Details"}
              {formStep === "playlists" && "Select Playlists"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto px-3">
          {/* Step 1: URL Input */}
          {formStep === "url" && <InputURLForm />}

          {/* Step 2: Channel Details */}
          {formStep === "channel" && channelInfo && (
            <SelectForm
              setIsDialogOpen={setIsDialogOpen}
              revalidateCatalog={revalidateCatalog}
            />
          )}

          {/* Step 3: Playlist Selection */}
          {formStep === "playlists" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="playlist-search">Search Playlists</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="playlist-search"
                    placeholder="Search playlists..."
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {selectedPlaylists.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedPlaylists.map((id) => {
                    const playlist = playlists.find((p) => p.id === id);
                    return playlist ? (
                      <Badge key={id} variant="secondary" className="gap-1">
                        {playlist.title}
                        <button
                          onClick={() => togglePlaylistSelection(id)}
                          className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}

              <Separator />

              <div className="space-y-2 max-h-60 overflow-auto">
                {filteredPlaylists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => togglePlaylistSelection(playlist.id)}
                  >
                    <Checkbox
                      checked={selectedPlaylists.includes(playlist.id)}
                      onChange={() => togglePlaylistSelection(playlist.id)}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium">{playlist.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {playlist.videoCount} videos
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {filteredPlaylists.length === 0 && searchQuery && (
                <div className="text-center py-8 text-muted-foreground">
                  No playlists found matching {searchQuery}
                </div>
              )}

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
                  disabled={selectedPlaylists.length === 0}
                  className="flex-1"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Add {selectedPlaylists.length} Playlist
                  {selectedPlaylists.length !== 1 ? "s" : ""}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
