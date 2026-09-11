"use client";

import { useEffect, useState } from "react";
import { StarIcon } from "lucide-react";

import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";

import { indexedDB } from "~/shared/lib/api/dexie";
import { Button } from "~/shared/ui/button";
import { cn } from "~/shared/utils/tailwind-merge";

export default function AddToFavorites({
  feedId,
  feedTitle,
  feedDescription,
}: {
  feedId: string;
  feedTitle: string;
  feedDescription: string;
}) {
  const favoriteFeeds =
    useLiveQuery(() => indexedDB["favorites"].toArray(), []) ?? [];
  const [feedExists, setFeedExists] = useState<boolean>(false);

  useEffect(() => {
    const checkIfExists = () => {
      for (let i = 0; i < favoriteFeeds?.length; i++) {
        if (favoriteFeeds[i].id === feedId) {
          setFeedExists(true);
          return;
        }
      }
      setFeedExists(false);
    };

    checkIfExists();
  }, [favoriteFeeds, feedId]);

  const addToFav = async () => {
    if (feedExists) {
      toast("Feed removed from favorites.");

      await indexedDB["favorites"].delete(feedId);
    }
    // Add the feedId to favorites
    else {
      const favFeed = {
        description: feedDescription,
        id: feedId,
        title: feedTitle,
      };
      await indexedDB["favorites"].add(favFeed);
      toast("Feed added to favorites.");
    }
  };

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2 text-sm"
      onClick={addToFav}
    >
      <StarIcon
        className={cn("size-4", feedExists ? "fill-primary text-primary" : "")}
      />
      {feedExists ? "Remove from favorites" : "Add to favorites"}
    </Button>
  );
}