import { Loader2 } from "lucide-react";
import { type ChangeEvent, type KeyboardEvent, useState } from "react";

import { VideoDetails } from "~/entities/youtube/models";
import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { Regex } from "~/shared/lib/constants";
import TerminalLogger from "~/shared/lib/terminal-logger";
import { Button } from "~/shared/ui/button";
import { Checkbox } from "~/shared/ui/checkbox";
import { Input } from "~/shared/ui/input";
import { Label } from "~/shared/ui/label";

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

    // Reset playlist state
    resetTempData();

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
      const result = await fetchApi<VideoDetails>(
        `/youtube/video?videoId=${videoId}`
      );

      if (!result.success) {
        toast({ title: result.message });
        return;
      }

      const videoData = result.data;
      const channelId = videoData?.channelId;
      const channelTitle = videoData?.channelTitle;

      setChannelInfo({
        id: channelId || "",
        title: channelTitle || "",
      });
      setFormStep("channel");
      setIsLoading(false);
    } catch (err) {
      setIsLoading(false);
      TerminalLogger.fail(String(err));
    }
  };

  const handleVideoLink = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.trim();

    setVideoLink({
      link: inputValue,
    });

    if (
      inputMode === "video" &&
      inputValue &&
      !Regex.YOUTUBE_VIDEO_LINK.test(inputValue)
    ) {
      setVideoLink({
        error: "Invalid YouTube video link.",
      });

      return;
    } else if (
      inputMode === "channel" &&
      inputValue &&
      !Regex.YOUTUBE_USER_CHANNEL.test(inputValue)
    ) {
      setVideoLink({
        error: "Invalid YouTube channel link.",
      });

      return;
    } else {
      setVideoLink({
        error: "",
      });
    }
  };

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
                  onCheckedChange={() => setInputMode("video")}
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
                  disabled
                  checked={inputMode === "channel"}
                  onCheckedChange={() => setInputMode("channel")}
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
