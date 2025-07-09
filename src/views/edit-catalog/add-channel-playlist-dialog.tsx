"use client";

import { SiYoutube } from "@icons-pack/react-simple-icons";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import type { KeyedMutator } from "swr";

import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";

import useCatalogStore from "./catalog-store";
import InputURLForm from "./input-url-form";
import PlaylistSelectionForm from "./playlist-selection-form";
import SelectForm from "./select-form";

export default function AddChannelPlaylistDialog({
  revalidateCatalog,
}: {
  revalidateCatalog: KeyedMutator<ApiResponse<any>>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { channelInfo, formStep, setFormStep, resetTempData } =
    useCatalogStore();
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      resetTempData();
    }
    setIsDialogOpen(open);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button>
          <span className="flex items-center gap-1">
            <SiYoutube className="size-8" />
            Channel Playlist
          </span>
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
              {formStep === "url" && "Add Channel Playlist"}
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
            <PlaylistSelectionForm
              setIsDialogOpen={setIsDialogOpen}
              revalidateCatalog={revalidateCatalog}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
