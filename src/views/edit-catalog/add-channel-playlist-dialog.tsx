"use client";

import type { KeyedMutator } from "swr";

import { useState } from "react";
import { ChevronLeft } from "lucide-react";

import { SiYoutube } from "@icons-pack/react-simple-icons";

import type { ZCatalogByID } from "~/entities/catalogs/models";

import type { ApiResponse } from "~/shared/lib/next/nx-response";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";

import useCatalogStore from "~/stores/catalog-store";

import InputURLForm from "./input-url-form";
import PlaylistSelectionForm from "./playlist-selection-form";
import SelectForm from "./select-form";

export default function AddChannelPlaylistDialog({
  revalidateCatalog,
}: {
  revalidateCatalog: KeyedMutator<ApiResponse<ZCatalogByID>>;
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
            <p className="hidden md:inline-block">Channel Playlist</p>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex max-h-[80vh] flex-col overflow-hidden px-3 py-6 sm:max-w-150">
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
                className="h-8 w-8 p-1"
              >
                <ChevronLeft className="h-4 w-4" />
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