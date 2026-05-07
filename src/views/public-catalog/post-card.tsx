import {
  ArrowUp,
  CalendarClock,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import formatLargeNumber from "~/shared/utils/format-large-number";
import { getDifferenceString } from "~/shared/utils/time-diff";

import { OutLink } from "~/widgets/out-link";

export function PostCard({
  index,
  post,
  handleSheetOpen,
  setCurrentIndex,
}: {
  index: number;
  post: ZCatalogSubredditPost;
  handleSheetOpen: (isOpen: boolean) => void;
  setCurrentIndex: (index: number) => void;
}) {
  const currentTime = Date.now() / 1000;
  const createdAt = getDifferenceString(
    (currentTime - post.postCreatedAt) / 60,
    "ago",
    true
  );

  return (
    <div
      role="button"
      tabIndex={0}
      key={post.postId}
      onClick={() => {
        setCurrentIndex(index);
        handleSheetOpen(true);
      }}
      className="group/card-item hover-lift shadow-primary/20 clickable flex max-h-64 min-h-32 min-w-full flex-col gap-3 rounded border p-3 shadow"
    >
      <div className="flex items-center justify-between text-xs">
        <OutLink
          onClick={(e) => e.stopPropagation()}
          className="text-sm font-bold tracking-wider"
          href={`https://www.reddit.com/r/${post.subreddit}`}
        >
          {post.subreddit}
        </OutLink>

        <span className="flex items-center gap-1.5">
          <CalendarClock className="size-3" />
          <span suppressHydrationWarning>{createdAt}</span>
        </span>
      </div>

      <p className="group-hover/card-item:text-primary text-foreground line-clamp-3 text-base tracking-wide">
        {post.postTitle}
      </p>

      <div className="mt-2 flex grow items-end text-xs">
        <div className="text-muted-foreground flex items-center gap-2">
          <ArrowUp className="size-3" />
          <span>{formatLargeNumber(post.postVotes)} votes</span>
          <span>•</span>
          <MessageSquare className="size-3" />
          <span>{formatLargeNumber(post.postCommentsCount)} comments</span>
          {post.postDomain !== `self.${post.subreddit}` &&
            post.postDomain !== "i.redd.it" && (
              <>
                <span>•</span>
                <OutLink
                  onClick={(e) => e.stopPropagation()}
                  href={post.postUrl}
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="size-3" />
                  <span>{post.postDomain}</span>
                </OutLink>
              </>
            )}
        </div>
      </div>
    </div>
  );
}
