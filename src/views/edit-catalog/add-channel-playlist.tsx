"use client";

import { ListPlusIcon } from "lucide-react";
import { ChangeEvent } from "react";

import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { Regex } from "~/shared/lib/constants";
import TerminalLogger from "~/shared/lib/terminal-logger";
import { Button } from "~/shared/ui/button";
import { Input } from "~/shared/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/shared/ui/sheet";
import { OutLink } from "~/widgets/out-link";

import useCatalogStore from "./catalog-store";
import ShowPlaylist from "./show-playlist";

export default function AddChannelPlaylist() {
  const {
    localChannels,
    savedChannels,
    setLocalChannels,
    setChannelPlaylists,
    channelInfo,
    setChannelInfo,
    setVideoLink,
    videoLink,
    fetchedChannelPlaylists,
    setFetchedChannelPlaylists,
    resetLocalPlaylist,
  } = useCatalogStore();

  const handleVideoLink = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoLink({
      link: e.target.value,
    });

    if (!Regex.YOUTUBE_VIDEO_LINK.test(e.target.value)) {
      setVideoLink({
        error: "Invalid YouTube video link.",
      });

      return;
    } else {
      setVideoLink({
        error: "",
      });
    }
  };

  const validateVideoLink = async () => {
    // Reset playlist state
    resetLocalPlaylist();

    const found = videoLink.link.match(Regex.YOUTUBE_VIDEO_LINK);
    let videoId = "";
    if (found?.length) {
      videoId = found[1];
    }

    if (!videoId) {
      return;
    }

    try {
      const result = await fetchApi(`/youtube/video?videoId=${videoId}`);

      if (!result.success) {
        toast({ title: result.message });
        return;
      }

      const videoData = result.data;
      const channelId = videoData.channelId;
      const channelTitle = videoData.channelTitle;

      setChannelInfo({
        id: channelId,
        title: channelTitle,
      });
    } catch (err) {
      TerminalLogger.fail(String(err));
    }
  };

  const addChannelToLocal = () => {
    const alreadyExists = localChannels.find(
      (item: any) => item.id === channelInfo.id
    );

    const alreadySaved = savedChannels?.find(
      (channel: any) => channel.id === channelInfo.id
    );

    if (!alreadyExists && !alreadySaved) {
      const localChannel = [
        ...localChannels,
        { id: channelInfo.id, title: channelInfo.title },
      ];
      setLocalChannels(localChannel);

      toast({ title: `${channelInfo.title}'s channel added to the list.` });
    } else if (alreadyExists) {
      toast({
        title: `${channelInfo.title}'s channel already added to the list.`,
      });
    } else if (alreadySaved) {
      toast({ title: `${channelInfo.title}'s channel already saved.` });
    }

    setVideoLink({
      link: "",
      error: "",
    });
    setChannelInfo({ title: "", id: "" });
  };

  const fetchChannelPlaylists = async () => {
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
      setFetchedChannelPlaylists(true);
      return;
    }

    setFetchedChannelPlaylists(true);
    setChannelPlaylists(playlists);
  };

  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <div className="flex gap-2 items-center">
              <ListPlusIcon className="size-8" />
              <p>Add channel-playlist</p>
            </div>
          </Button>
        </SheetTrigger>
        <SheetContent className="overflow-y-auto w-full md:max-w-[450px] space-y-2">
          <SheetHeader className="text-left">
            <SheetTitle>Paste YouTube video link</SheetTitle>
            <SheetDescription className="sr-only">
              Paste YouTube video link
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                className="input-search-icon"
                type="search"
                aria-label="YouTube video URL"
                placeholder="Enter video URL"
                value={videoLink.link}
                onChange={handleVideoLink}
              />
              {/* TODO: Maybe paste from clipboard icon and validate */}
              <Button
                disabled={Boolean(videoLink.error || !videoLink.link)}
                onClick={validateVideoLink}
              >
                Validate
              </Button>
            </div>
            {videoLink.error ? (
              <p className="text-sm text-[hsl(var(--primary))]">
                {videoLink.error}
              </p>
            ) : null}
          </div>

          {channelInfo.title && channelInfo.id ? (
            <section className="flex flex-col gap-3">
              <h1 className="text-base">
                <OutLink
                  href={`https://www.youtube.com/channel/${channelInfo.id}`}
                  className="text-primary hover:underline hover:underline-offset-2"
                >
                  {channelInfo.title}
                </OutLink>
              </h1>
              <div className="flex gap-3 flex-col md:flex-row flex-grow">
                <Button
                  disabled={fetchedChannelPlaylists}
                  className="md:w-1/2"
                  onClick={fetchChannelPlaylists}
                >
                  Get playlists
                </Button>
                <Button className="md:w-1/2" onClick={addChannelToLocal}>
                  Add channel
                </Button>
              </div>
              <ShowPlaylist />
            </section>
          ) : null}
        </SheetContent>
      </Sheet>
    </>
  );
}
