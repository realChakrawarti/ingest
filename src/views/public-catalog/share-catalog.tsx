"use client";

import { CopyIcon, ShareIcon } from "lucide-react";
import { useMemo } from "react";

import appConfig from "~/shared/app-config";
import { toast } from "~/shared/hooks/use-toast";

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
    toast({
      description: "The video link has been copied to your clipboard.",
      title: "Link copied",
    });
  };

  const shareLink = async () => {
    try {
      await window.navigator.share(shareData);
    } catch (err) {
      if (err instanceof Error) {
        return toast({ title: err.message });
      }

      return toast({ title: "Something went wrong!" });
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
