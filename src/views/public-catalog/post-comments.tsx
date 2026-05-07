"use client";

import { useRef } from "react";
import {
  ArrowBigRightDashIcon,
  Loader2,
  MessageSquare,
  MinusCircle,
  PlusCircle,
} from "lucide-react";

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

import MarkdownHTML from "~/widgets/markdown-html";
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
      <div className="text-muted-foreground py-4 text-center">
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
              <Loader2 className="size-4 animate-spin" />
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
          {comments.map((comment: any) => (
            <Comment
              key={comment.id}
              id={comment.id}
              author={comment.author}
              score={comment.score}
              created_utc={comment.created_utc}
              body={comment.body}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

type CommentProps = {
  id: string;
  author: string;
  score: number;
  created_utc: number;
  body: string;
};

function Comment({ id, author, score, created_utc, body }: CommentProps) {
  const currentTime = Date.now() / 1000;
  const commentCreatedAt = getDifferenceString(
    (currentTime - created_utc) / 60,
    "ago",
    true
  );

  const commentRef = useRef<HTMLDivElement>(null);

  function toggleComment() {
    const commentEle = commentRef.current;
    const isCollapsed = commentEle?.getAttribute("data-collapsed") === "true";

    commentEle?.setAttribute("data-collapsed", isCollapsed ? "false" : "true");
  }
  return (
    <div className="group" data-collapsed="false" ref={commentRef} key={id}>
      <div className="text-muted-foreground mb-2 flex items-center gap-2 text-sm">
        <MinusCircle
          onClick={toggleComment}
          className="clickable -ml-1 size-3 group-data-[collapsed=true]:hidden"
        />
        <PlusCircle
          onClick={toggleComment}
          className="clickable -ml-1 size-3 group-data-[collapsed=false]:hidden"
        />
        <OutLink href={`https://www.reddit.com/u/${author}`}>
          u/{author}
        </OutLink>
        <span>•</span>
        <span>{formatLargeNumber(score)} votes</span>
        <span>•</span>
        <span>{commentCreatedAt}</span>
      </div>
      <div className="border-primary/70 border-l-2 pl-4 group-data-[collapsed=true]:hidden">
        <MarkdownHTML content={body} />
      </div>
    </div>
  );
}