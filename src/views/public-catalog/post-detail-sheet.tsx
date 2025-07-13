import Linkify from "linkify-react";
import { ArrowUp, ExternalLink, MessageSquare } from "lucide-react";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

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
export default function PostDetailSheet({
  post,
}: {
  post: ZCatalogSubredditPost;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <p
          className="tracking-wide hover:text-primary/80 text-foreground
        line-clamp-2 text-sm"
        >
          {post.postTitle}
        </p>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto w-full md:max-w-[450px]">
        <SheetHeader className="text-left">
          <SheetTitle>
            <OutLink href={`https://www.reddit.com${post.postPermalink}`}>
              <p>{post.postTitle}</p>
            </OutLink>
          </SheetTitle>
          <SheetDescription>
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <ArrowUp className="size-3" />
              <span>{formatLargeNumber(post.postVotes)} votes</span>
              <span>•</span>
              <MessageSquare className="size-3" />
              <span>{post.postCommentsCount} comments</span>
              {post.postDomain !== `self.${post.subreddit}` && (
                <>
                  <span>•</span>
                  <ExternalLink className="size-3" />
                  <span>{post.postDomain}</span>
                </>
              )}
            </div>
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
        </div>
      </SheetContent>
    </Sheet>
  );
}
