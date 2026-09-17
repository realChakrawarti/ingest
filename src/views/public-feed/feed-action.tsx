"use client";

import AddToFavorites from "./add-to-fav";
import ShareFeed from "./share-feed";

type FeedActionProps = {
  feedId: string;
  feedTitle: string;
  feedDescription: string;
};

export function FeedAction({
  feedId,
  feedTitle,
  feedDescription,
}: FeedActionProps) {
  return (
    <div className="flex justify-start gap-4 md:justify-end">
      <ShareFeed
        feedId={feedId}
        feedTitle={feedTitle}
        feedDescription={feedDescription}
      />
      <AddToFavorites
        feedId={feedId}
        feedTitle={feedTitle}
        feedDescription={feedDescription}
      />
    </div>
  );
}