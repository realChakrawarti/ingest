"use client";

import { useMemo } from "react";
import { CopyIcon, ShareIcon } from "lucide-react";

import { toast } from "sonner";

import appConfig from "~/shared/app-config";
import { Button } from "~/shared/ui/button";

type ShareArchiveProps = {
  archiveId: string;
  archiveDescription: string;
  archiveTitle: string;
};

export default function ShareArchive({
  archiveId,
  archiveDescription,
  archiveTitle,
}: ShareArchiveProps) {
  const shareData = useMemo(
    () => ({
      text: archiveDescription,
      title: archiveTitle,
      url: `${appConfig.url}/a/${archiveId}`,
    }),
    [archiveId, archiveDescription, archiveTitle]
  );

  const copyLink = () => {
    window.navigator.clipboard.writeText(shareData.url);
    toast("Link copied", {
      description: "The archive link has been copied to your clipboard.",
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
        Share archive
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
