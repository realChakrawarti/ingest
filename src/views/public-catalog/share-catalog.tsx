"use client";

import { CopyIcon, ShareIcon } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import appConfig from "~/shared/app-config";

type ShareCatalogProps = {
  catalogId: string;
  catalogDescription: string;
  catalogTitle: string;
};

export default function ShareCatalog({
  catalogId,
  catalogDescription,
  catalogTitle,
}: ShareCatalogProps) {
  const shareData = useMemo(
    () => ({
      text: catalogDescription,
      title: catalogTitle,
      url: `${appConfig.url}/c/${catalogId}`,
    }),
    [catalogId, catalogDescription, catalogTitle]
  );

  const copyLink = () => {
    window.navigator.clipboard.writeText(shareData.url);
    toast("Link copied", {
      description: "The video link has been copied to your clipboard.",
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
      <span className="flex items-center gap-2 text-xs" onClick={shareLink}>
        <ShareIcon className="size-4" />
        Share catalog
      </span>
    );
  } else {
    return (
      <span className="flex items-center gap-2 text-xs" onClick={copyLink}>
        <CopyIcon className="size-4" />
        Copy to Clipboard
      </span>
    );
  }
}
