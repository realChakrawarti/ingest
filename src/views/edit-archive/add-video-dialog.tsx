import { ChangeEvent, useState } from "react";

import { toast } from "~/shared/hooks/use-toast";
import fetchApi from "~/shared/lib/api/fetch";
import { Regex } from "~/shared/lib/constants";
import TerminalLogger from "~/shared/lib/terminal-logger";
import { Button } from "~/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/shared/ui/dialog";
import { Input } from "~/shared/ui/input";

type VideoLink = {
  link: string;
  error: string;
};

export default function AddVideoDialog({
  archiveId,
  revalidateArchive,
}: {
  archiveId: string;
  revalidateArchive: () => void;
}) {
  const [videoLink, setVideoLink] = useState<VideoLink>({
    link: "",
    error: "",
  });
  const handleVideoLink = (e: ChangeEvent<HTMLInputElement>) => {
    setVideoLink((prev) => ({
      ...prev,
      link: e.target.value,
    }));

    if (!Regex.YOUTUBE_VIDEO_LINK.test(e.target.value)) {
      setVideoLink((prev) => ({
        ...prev,
        error: "Invalid YouTube video link.",
      }));

      return;
    } else {
      setVideoLink((prev) => ({
        ...prev,
        error: "",
      }));
    }
  };

  const addVideoLink = async () => {
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

      const resultAdd = await fetchApi(`/archives/${archiveId}/add-video`, {
        method: "PATCH",
        body: JSON.stringify(result.data),
      });

      if (resultAdd.success) {
        toast({ title: resultAdd.message });
        revalidateArchive();
      }

      setVideoLink({
        link: "",
        error: "",
      });
    } catch (err) {
      TerminalLogger.fail(String(err));
      toast({ title: "Something went wrong." });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Add video</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Paste YouTube video link</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="Enter video URL"
              value={videoLink.link}
              onChange={handleVideoLink}
            />
            <Button
              disabled={Boolean(videoLink.error || !videoLink.link)}
              onClick={addVideoLink}
            >
              Add
            </Button>
          </div>
          {videoLink.error ? (
            <p className="text-sm text-[hsl(var(--primary))]">
              {videoLink.error}
            </p>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
