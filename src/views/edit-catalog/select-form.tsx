import { Loader2, Youtube } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { KeyedMutator } from "swr";

import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { ApiResponse } from "~/shared/lib/next/nx-response";
import TerminalLogger from "~/shared/lib/terminal-logger";
import { Button } from "~/shared/ui/button";

import useCatalogStore from "./catalog-store";

export default function SelectForm({
  revalidateCatalog,
  setIsDialogOpen,
}: {
  revalidateCatalog: KeyedMutator<ApiResponse<any>>;
  setIsDialogOpen: (_open: boolean) => void;
}) {
  const [selectionType, setSelectionType] = useState<
    "channel" | "playlists" | null
  >(null);

  const [isLoading, setIsLoading] = useState(false);
  const {
    setFormStep,
    channelInfo,
    setChannelPlaylists,
    savedPlaylists,
    savedChannels,
    resetTempData,
  } = useCatalogStore();

  const { catalogId } = useParams<{ catalogId: string }>();

  const handleAddChannel = async () => {
    // 1. Check channelInfo.title and channelInfo.id

    if (!channelInfo.title || !channelInfo.id) {
      return;
    }

    const channelExists = savedChannels.find(
      (item) => item.channelId === channelInfo.id
    );

    const playlistWithChannelExists = savedPlaylists.find(
      (item) => item.channelId === channelInfo.id
    );

    if (playlistWithChannelExists) {
      toast({
        title: `${channelInfo.title} has already added specific playlists.`,
        description: `Remove ${channelInfo.title} playlists to add this channel.`,
      });

      setSelectionType(null);
      return;
    }

    if (channelExists) {
      toast({
        title: `${channelInfo.title}'s channel is already added.`,
      });
      setSelectionType(null);
      return;
    }

    // 3. Create the payload, push it, clear all state and close dialog on success with a notification

    const payload = {
      channel: [channelInfo.id],
    };

    try {
      setIsLoading(true);
      const result = await fetchApi(`/catalogs/${catalogId}/channel`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      if (result.success) {
        revalidateCatalog();
        resetTempData();
        setIsDialogOpen(false);
      }

      toast({ title: result.message });
    } catch (err) {
      if (err instanceof Error) {
        TerminalLogger.fail(err.message);
      } else {
        TerminalLogger.fail(String(err));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBrowsePlaylists = async () => {
    setSelectionType("playlists");

    // Check if the channel is already added

    const channelExists = savedChannels.find(
      (item) => item.channelId === channelInfo.id
    );

    if (channelExists) {
      toast({
        title: `${channelInfo.title}'s channel is already added to the catalog.`,
        description:
          "Please remove the channel before proceeding to add specific playlist from the same channel.",
      });
      setSelectionType(null);
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchApi(
        `/youtube/playlists?channelId=${channelInfo.id}`
      );

      if (!result.success) {
        toast({ title: result.message });
        return;
      }

      const playlists = result.data;

      if (!playlists.length) {
        toast({ title: `No playlist created by ${channelInfo.title}` });
        return;
      }

      setChannelPlaylists(playlists);
      setFormStep("playlists");
    } catch (err) {
      TerminalLogger.fail(`${err}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 p-4 border rounded-lg">
        <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
          <Youtube className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-lg">{channelInfo.title}</h3>
          <p className="text-sm text-muted-foreground">
            Channel ID: {channelInfo.id}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="font-medium">What would you like to add?</h4>

        <div className="grid gap-3">
          <Button
            variant={selectionType === "channel" ? "default" : "outline"}
            className="justify-start h-auto p-4"
            onClick={() => {
              setSelectionType("channel");
              handleAddChannel();
            }}
            disabled={selectionType === "playlists" || isLoading}
          >
            {isLoading && selectionType === "channel" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            <div className="text-left">
              <div className="font-medium">Entire Channel</div>
              <div className="text-sm opacity-70">
                Add all videos from this channel
              </div>
            </div>
          </Button>

          <Button
            variant={selectionType === "playlists" ? "default" : "outline"}
            className="justify-start h-auto p-4"
            onClick={handleBrowsePlaylists}
            disabled={selectionType === "channel" || isLoading}
          >
            {isLoading && selectionType === "playlists" ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            <div className="text-left">
              <div className="font-medium">Specific Playlists</div>
              <div className="text-sm opacity-70">
                Choose individual playlists from this channel
              </div>
            </div>
          </Button>
        </div>

        <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
          <strong>Note:</strong> You can either add the entire channel OR
          specific playlists, but not both.
        </div>
      </div>
    </div>
  );
}
