"use client";

import Linkify from "linkify-react";
import { ArrowBigRightDashIcon, Loader2, MessageSquare } from "lucide-react";
import useSWRMutation from "swr/mutation";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import { redditRequestHeaders } from "~/shared/lib/reddit/reddit-header";
import { Button } from "~/shared/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/shared/ui/collapsible";
import formatLargeNumber from "~/shared/utils/format-large-number";
import { getDifferenceString } from "~/shared/utils/time-diff";

import { OutLink } from "~/widgets/out-link";

async function getPostComments(subreddit: string, postId: string) {
  const headers = redditRequestHeaders();

  const response = await fetch(
    `https://oauth.reddit.com/r/${subreddit}/comments/${postId}.json?limit=20&sort=top`,
    {
      headers: headers,
    }
  );
  const data = await response.json();
  const results = data[1].data.children
    .filter(
      (child: any) => child.data.body && child.data.author !== "[deleted]"
    )
    .map((child: any) => child.data);

  return results;
}

export default function PostComments({
  subreddit,
  postId,
}: Pick<ZCatalogSubredditPost, "postId" | "subreddit">) {
  const {
    data: comments,
    trigger,
    isMutating: commentsLoading,
  } = useSWRMutation(`${postId}-comments`, () =>
    getPostComments(subreddit, postId)
  );

  if (comments?.length === 0 && !commentsLoading) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No comments found
      </div>
    );
  }

  if (!comments?.length) {
    return (
      <div className="grid items-center">
        <Button
          disabled={commentsLoading}
          variant="outline"
          onClick={() => trigger()}
        >
          {commentsLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="size-4  animate-spin" />
              Loading comments...
            </span>
          ) : (
            "Load top comments"
          )}
        </Button>
      </div>
    );
  }

  return (
    <Collapsible defaultOpen>
      <CollapsibleTrigger>
        <h3 className="mb-4 flex items-center gap-2">
          <MessageSquare className="size-5" />
          Top Comments
          <ArrowBigRightDashIcon className="size-5" />
        </h3>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="space-y-4">
          {comments.map((comment: any) => {
            const currentTime = Date.now() / 1000;
            const commentCreatedAt = getDifferenceString(
              (currentTime - comment.created_utc) / 60,
              "ago",
              true
            );
            return (
              <div
                key={comment.id}
                className="border-l-2 border-primary/70 pl-4"
              >
                <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground">
                  <OutLink href={`https://www.reddit.com/u/${comment.author}`}>
                    u/{comment.author}
                  </OutLink>
                  <span>•</span>
                  <span>{formatLargeNumber(comment.score)} votes</span>
                  <span>•</span>
                  <span>{commentCreatedAt}</span>
                </div>
                <Linkify
                  className="text-sm whitespace-pre-wrap font-outfit"
                  as="pre"
                  options={{
                    className:
                      "cursor-pointer text-[hsl(var(--primary))] hover:text-[hsl(var(--primary))]/70",
                    rel: "noopener noreferrer external",
                    target: "_blank",
                  }}
                >
                  {comment.body}
                </Linkify>
              </div>
            );
          })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
