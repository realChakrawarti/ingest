import { Loader2, Youtube } from "lucide-react";
import { usePathname } from "next/navigation";
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
  const { setFormStep, channelInfo } = useCatalogStore();

  const catalogId = usePathname().split("/")[2];

  const handleAddChannel = async () => {
    // 1. Check channelInfo.title and channelInfo.id

    if (!channelInfo.title || !channelInfo.id) {
      return;
    }

    // 2. Check if any saved channel has same channelId, maybe disable button to add entire channel and notifying the
    // channel already added, same for playlist as well

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
      }

      toast({ title: result.message });
      setIsDialogOpen(false);
    } catch (err) {
      if (err instanceof Error) {
        TerminalLogger.fail(err.message);
      } else {
        TerminalLogger.fail(String(err));
      }
    } finally {
      setIsLoading(false);
    }

    // const payload: UpdateCatalogPayload = {
    //   channels: savedChannels.map((channel) => channel.channelId),
    // };

    // if (localChannels.length) {
    //   payload.channels?.push(...localChannels.map((item) => item.id));
    // }

    // Check if any playlist is already added of the channel, if so ask to remove the playlists
    // const playlistExists = localChannels?.some((channel) => {
    //   return savedPlaylists?.some((playlist) => {
    //     if (playlist.channelId === channel.id) {
    //       toast({
    //         title: `${channel.title} has already added specific playlists.`,
    //         description: `Remove ${channel.title} playlists to add this channel.`,
    //       });
    //       return true;
    //     }
    //   });
    // });

    // if (playlistExists) return;
  };

  const handleBrowsePlaylists = async () => {
    setSelectionType("playlists");
    setIsLoading(true);
    // Mock API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // setPlaylists(mockPlaylists);
    setIsLoading(false);
    setFormStep("playlists");
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
            disabled={selectionType === "playlists"}
          >
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

        {selectionType && (
          <div className="text-xs text-muted-foreground p-3 bg-muted rounded-lg">
            <strong>Note:</strong> You can either add the entire channel OR
            specific playlists, but not both.
          </div>
        )}
      </div>
    </div>
  );
}
