"use client";

import {
  ArrowUp,
  CalendarClock,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import Slider, { type Settings } from "react-slick";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import useScreenWidth from "~/shared/hooks/use-screen-width";
import formatLargeNumber from "~/shared/utils/format-large-number";
import { getDifferenceString } from "~/shared/utils/time-diff";

import { OutLink } from "~/widgets/out-link";
import OverlayTip from "~/widgets/overlay-tip";

import PostDetailSheet from "./post-detail-sheet";

export default function PostCard({
  posts,
}: {
  posts: ZCatalogSubredditPost[];
}) {
  const settings: Settings = {
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3500,
    // cssEase: "ease-in",
    fade: true,
    // Refer: https://github.com/akiran/react-slick/issues/1171
    infinite: posts.length > 1,
    pauseOnFocus: true,
    pauseOnHover: true,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipeToSlide: true,
    waitForAnimate: false,
  };

  const screenWidth = useScreenWidth();
  return (
    <div
      className="px-0 md:px-3 min-w-full"
      style={{ width: `${screenWidth}px` }}
      id="posts-container"
    >
      <div className="border rounded-md border-spacing-x-2 border-spacing-y-2">
        <Slider {...settings}>
          {posts?.map((post, idx) => {
            const totalPosts = posts.length;
            const currentTime = Date.now() / 1000;
            const createdAt = getDifferenceString(
              (currentTime - post.postCreatedAt) / 60,
              "ago",
              true
            );

            return (
              <div key={post.postId} className="flex gap-3 min-h-8 min-w-full">
                <OverlayTip
                  id="post-count"
                  className="absolute top-0 right-0 rounded-l-md p-1 text-xs bg-primary/10 z-50"
                >
                  {(idx + 1).toString().padStart(2, "0")}/
                  {totalPosts.toString().padStart(2, "0")}
                </OverlayTip>
                <div className="container px-3">
                  <div className="flex mb-2 gap-1 text-xs text-muted-foreground">
                    <span>
                      On{" "}
                      <OutLink
                        href={`https://www.reddit.com/r/${post.subreddit}`}
                      >
                        r/{post.subreddit}
                      </OutLink>
                    </span>
                    <span>•</span>
                    <span>
                      by{" "}
                      <OutLink
                        href={`https://www.reddit.com/u/${post.postAuthor}`}
                      >
                        u/{post.postAuthor}
                      </OutLink>
                    </span>
                    <span>•</span>
                    <CalendarClock className="size-3" />
                    <span>{createdAt}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <PostDetailSheet post={post} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
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

                  {post.postSelftext && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                      {post.postSelftext}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </Slider>
      </div>
    </div>
  );
}
