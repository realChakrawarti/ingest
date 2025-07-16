import Linkify from "linkify-react";
import { ArrowUp, ExternalLink, MessageSquare, PanelRight } from "lucide-react";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import { Badge } from "~/shared/ui/badge";
import { Separator } from "~/shared/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/shared/ui/sheet";
import formatLargeNumber from "~/shared/utils/format-large-number";

import { OutLink } from "~/widgets/out-link";

import PostComments from "./post-comments";
export default function PostDetailSheet({
  post,
}: {
  post: ZCatalogSubredditPost;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Badge className="cursor-pointer flex items-center gap-1">
          <PanelRight className="size-3" />
          Expand
        </Badge>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full md:max-w-[450px]">
        <SheetHeader className="text-left">
          <SheetTitle>
            <OutLink href={`https://www.reddit.com${post.postPermalink}`}>
              <Badge className="mb-2 space-x-2 cursor-pointer">
                <ExternalLink className="size-4" />
                <p className="text-md">Open on Reddit</p>
              </Badge>
              <p>{post.postTitle}</p>
            </OutLink>
          </SheetTitle>
          <SheetDescription>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <ArrowUp className="size-4" />
              <span>{formatLargeNumber(post.postVotes)} votes</span>
              <span>•</span>
              <MessageSquare className="size-4" />
              <span>{post.postCommentsCount} comments</span>
            </div>
            {post.postDomain !== `self.${post.subreddit}` &&
              post.postDomain !== "i.redd.it" && (
                <div className="mt-2 flex gap-2 items-center">
                  <ExternalLink className="size-4" />
                  <OutLink href={post.postUrl}>
                    <span>{post.postDomain}</span>
                  </OutLink>
                </div>
              )}
          </SheetDescription>
        </SheetHeader>
        <div className="my-4">
          {post.postVideo ? (
            <video
              controls
              muted
              className="w-full h-auto max-h-96 object-contain"
            >
              <source src={post.postVideo} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : null}
          {post.postImage ? (
            <img
              src={post.postImage}
              alt={post.postTitle}
              className="w-full h-auto max-h-96 object-contain"
            />
          ) : null}
          {post?.postSelftext ? (
            <>
              <Separator className="my-3" />
              <Linkify
                className={`text-sm whitespace-pre-wrap font-slalom`}
                as="pre"
                options={{
                  className:
                    "cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70",
                  rel: "noopener noreferrer external",
                  target: "_blank",
                }}
              >
                {post.postSelftext}
              </Linkify>
            </>
          ) : null}
          <Separator className="my-3" />
          <PostComments subreddit={post.subreddit} postId={post.postId} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
