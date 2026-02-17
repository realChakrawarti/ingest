import { Loader2 } from "lucide-react";
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useState,
} from "react";
import { toast } from "sonner";

import type { ChannelDetails } from "~/entities/youtube/models";

import fetchApi, { type EndpointURL } from "~/shared/lib/api/fetch";
import { Regex } from "~/shared/lib/constants";
import { Button } from "~/shared/ui/button";
import { Checkbox } from "~/shared/ui/checkbox";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";
import Log from "~/shared/utils/terminal-logger";

import useCatalogStore from "./catalog-store";

export default function InputURLForm() {
  const [inputMode, setInputMode] = useState<"video" | "channel">("video");
  const [isLoading, setIsLoading] = useState(false);
  const {
    videoLink,
    setVideoLink,
    resetTempData,
    setChannelInfo,
    setFormStep,
  } = useCatalogStore();

  const handleSubmit = async () => {
    if (videoLink.error) {
      return;
    }

    if (inputMode === "video") {
      const found = videoLink.link.match(Regex.YOUTUBE_VIDEO_LINK);
      let videoId = "";
      if (found?.length) {
        videoId = found[1];
      }

      if (!videoId) {
        return;
      }

      try {
        setIsLoading(true);
        const result = await fetchApi<ChannelDetails>(
          `/youtube/channel?videoId=${videoId}`
        );

        if (!result.success) {
          toast(result.message);
          return;
        }

        const channelDetails = result.data;

        // Reset playlist state
        resetTempData();

        if (channelDetails) {
          setChannelInfo(channelDetails);
        }
        setFormStep("channel");
      } catch (err) {
        Log.fail(String(err));
      } finally {
        setIsLoading(false);
      }
    } else if (inputMode === "channel") {
      const found = videoLink.link.match(Regex.YOUTUBE_USER_CHANNEL);
      let channel = "";
      if (found?.length) {
        // Channel handle is found at 1 and channel id at 2
        channel = found[1] ?? found[2];
      }

      if (!channel) {
        setVideoLink({ error: "Unable to parse channel link." });
        return;
      }

      let endpoint: EndpointURL;
      if (channel?.startsWith("@")) {
        endpoint = `/youtube/channel?channelHandle=${channel}`;
      } else {
        endpoint = `/youtube/channel?channelId=${channel}`;
      }

      try {
        setIsLoading(true);
        const result = await fetchApi<ChannelDetails>(endpoint);

        if (!result.success) {
          toast(result.message);
          return;
        }

        const channelDetails = result.data;

        // Reset playlist state
        resetTempData();

        if (channelDetails) {
          setChannelInfo(channelDetails);
        }
        setFormStep("channel");
      } catch (err) {
        Log.fail(String(err));
      } finally {
        setIsLoading(false);
      }
    }
  };

  function validateLink(inputValue: string) {
    const mode = inputMode;

    if (
      mode === "video" &&
      inputValue &&
      !Regex.YOUTUBE_VIDEO_LINK.test(inputValue)
    ) {
      setVideoLink({
        error: "Invalid YouTube video link.",
      });

      return;
    }
    if (
      mode === "channel" &&
      inputValue &&
      !Regex.YOUTUBE_USER_CHANNEL.test(inputValue)
    ) {
      setVideoLink({
        error: "Invalid YouTube channel link.",
      });

      return;
    }
    setVideoLink({
      error: "",
    });
  }

  const handleVideoLink = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();

    setVideoLink({
      link: inputValue,
    });

    validateLink(inputValue);
  };

  const handleCheckboxChange = (mode: "video" | "channel") => {
    setInputMode(mode);
  };

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only when input mode is changed, validate the link
  useEffect(() => {
    validateLink(videoLink.link);
  }, [inputMode]);

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="video-url-checkbox"
                  checked={inputMode === "video"}
                  onCheckedChange={() => handleCheckboxChange("video")}
                />
                <Label
                  htmlFor="video-url-checkbox"
                  className={`text-sm cursor-pointer ${
                    inputMode === "video"
                      ? "font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Video URL
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="channel-url-checkbox"
                  checked={inputMode === "channel"}
                  onCheckedChange={() => handleCheckboxChange("channel")}
                />
                <Label
                  htmlFor="channel-url-checkbox"
                  className={`text-sm cursor-pointer ${
                    inputMode === "channel"
                      ? "font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  Channel URL/Handle
                </Label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="url-input">
          {inputMode === "video"
            ? "YouTube Video URL"
            : "YouTube Channel URL or Handle"}
        </Label>
        <Input
          autoComplete="off"
          className="input-search-icon"
          type="search"
          id="url-input"
          placeholder={
            inputMode === "video"
              ? "https://www.youtube.com/watch?v=..."
              : "https://www.youtube.com/@channelname"
          }
          value={videoLink.link}
          onChange={handleVideoLink}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) =>
            e.key === "Enter" && handleSubmit()
          }
        />
        <p className="text-sm text-muted-foreground">
          {videoLink.error ? (
            <p className="text-sm text-[hsl(var(--primary))]">
              {videoLink.error}
            </p>
          ) : inputMode === "video" ? (
            "Paste any video URL from the channel you want to add"
          ) : (
            "Paste the channel URL or enter the channel handle (e.g., @channelname)"
          )}
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={Boolean(videoLink.error) || !videoLink.link || isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Fetching Channel...
          </>
        ) : (
          "Get Channel Details"
        )}
      </Button>
    </div>
  );
}
