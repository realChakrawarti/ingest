"use client";

import { useMemo } from "react";
import { CopyIcon, ShareIcon } from "lucide-react";

import { toast } from "sonner";

import appConfig from "~/shared/app-config";
import { Button } from "~/shared/ui/button";

type ShareFeedProps = {
  feedId: string;
  feedDescription: string;
  feedTitle: string;
};

export default function ShareFeed({
  feedId,
  feedDescription,
  feedTitle,
}: ShareFeedProps) {
  const shareData = useMemo(
    () => ({
      text: feedDescription,
      title: feedTitle,
      url: `${appConfig.url}/f/${feedId}`,
    }),
    [feedId, feedDescription, feedTitle]
  );

  const copyLink = () => {
    window.navigator.clipboard.writeText(shareData.url);
    toast("Link copied", {
      description: "The feed link has been copied to your clipboard.",
    });
  };

  const shareLink = async () => {
    try {
      await window.navigator.share(shareData);
    } catch (err) {
      if (err instanceof Error) {
        return toast(err.message);
      }

      return toast("Something went wrong!");
    }
  };

  // Firefox doesn't support it yet, 23-11-2024
  if (
    typeof window.navigator.canShare === "function" &&
    window.navigator.canShare(shareData)
  ) {
    return (
      <Button
        variant="outline"
        className="flex items-center gap-2 text-sm"
        onClick={shareLink}
      >
        <ShareIcon className="size-4" />
        Share feed
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 text-sm"
      onClick={copyLink}
    >
      <CopyIcon className="size-4" />
      Copy to Clipboard
    </Button>
  );
}