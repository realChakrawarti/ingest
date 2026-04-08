import {
  ArrowLeftCircle,
  ArrowRightCircle,
  ArrowUp,
  ExternalLink,
  MessageSquare,
} from "lucide-react";

import { useHotkey } from "@tanstack/react-hotkeys";
import { useDrag } from "@use-gesture/react";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import { Badge } from "~/shared/ui/badge";
import { Separator } from "~/shared/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/shared/ui/sheet";
import formatLargeNumber from "~/shared/utils/format-large-number";

import MarkdownHTML from "~/widgets/markdown-html";
import { OutLink } from "~/widgets/out-link";

import PostComments from "./post-comments";
export default function PostDetailSheet({
  post,
  nextSlide,
  previousSlide,
  sheetOpen,
  handleSheetOpen,
}: {
  post: ZCatalogSubredditPost;
  nextSlide: () => void;
  previousSlide: () => void;
  sheetOpen: boolean;
  handleSheetOpen: (isOpen: boolean) => void;
}) {
  useHotkey("ArrowRight", () => {
    nextSlide();
  });
  useHotkey("ArrowLeft", () => {
    previousSlide();
  });

  const bind = useDrag(
    ({ swipe: [swipeX] }) => {
      if (swipeX === 1) {
        previousSlide();
      } else if (swipeX === -1) {
        nextSlide();
      }
    },
    {
      axis: "x",
      threshold: 10,
      swipe: { velocity: 0.5, distance: 20 },
    }
  );

  return (
    <Sheet open={sheetOpen} onOpenChange={handleSheetOpen}>
      <SheetContent
        {...bind()}
        className="w-full overflow-y-auto md:max-w-112.5"
      >
        <SheetHeader className="mb-5 text-left">
          <SheetTitle>
            <div className="mt-4 flex items-center justify-between">
              <OutLink href={`https://www.reddit.com${post.postPermalink}`}>
                <Badge className="mb-2 cursor-pointer space-x-2">
                  <ExternalLink className="size-4" />
                  <p className="text-md">Open on Reddit</p>
                </Badge>
              </OutLink>
              <div className="flex items-center gap-2">
                <ArrowLeftCircle
                  className="size-5 cursor-pointer"
                  onClick={() => previousSlide()}
                />
                <ArrowRightCircle
                  className="size-5 cursor-pointer"
                  onClick={() => nextSlide()}
                />
              </div>
            </div>
            <p className="text-foreground mt-2">{post.postTitle}</p>
          </SheetTitle>
          <SheetDescription asChild>
            <div>
              <div className="text-muted-foreground mt-2 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <ArrowUp className="size-4" />
                  <span>{formatLargeNumber(post.postVotes)} votes</span>
                  <span>•</span>
                  <MessageSquare className="size-4" />
                  <span>{post.postCommentsCount} comments</span>
                </div>
              </div>
              {post.postDomain !== `self.${post.subreddit}` &&
                post.postDomain !== "i.redd.it" && (
                  <div className="mt-2 flex items-center gap-2">
                    <ExternalLink className="size-4" />
                    <OutLink href={post.postUrl}>
                      <span>{post.postDomain}</span>
                    </OutLink>
                  </div>
                )}
            </div>
          </SheetDescription>
        </SheetHeader>
        <div className="my-4">
          {/*If there is video, show the video container*/}
          {post.postVideo ? (
            <video
              controls
              muted
              className="h-auto max-h-96 w-full object-contain"
            >
              <source src={post.postVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
          {/*Only show image when there is no video*/}
          {!post.postVideo && post.postImage ? (
            <img
              src={post.postImage}
              alt={post.postTitle}
              className="h-auto max-h-96 w-full object-contain"
            />
          ) : null}
          {post?.postSelftext ? (
            <>
              <Separator className="my-3" />
              <MarkdownHTML content={post.postSelftext} />
            </>
          ) : null}
          <Separator className="my-3" />
          <PostComments
            key={post.postId}
            subreddit={post.subreddit}
            postId={post.postId}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}