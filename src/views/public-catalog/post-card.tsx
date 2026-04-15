"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowDownCircle,
  ArrowUp,
  ArrowUpCircle,
  CalendarClock,
  ExternalLink,
  MessageSquare,
  PanelRight,
  Pause,
  Play,
} from "lucide-react";

import { useQueryState } from "nuqs";
import Slider, { type Settings } from "react-slick";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import useScreenWidth from "~/shared/hooks/use-screen-width";
import { Badge } from "~/shared/ui/badge";
import formatLargeNumber from "~/shared/utils/format-large-number";
import { getDifferenceString } from "~/shared/utils/time-diff";

import MarkdownHTML from "~/widgets/markdown-html";
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
    autoplaySpeed: 3500,
    cssEase: "ease-in",
    dots: false,
    fade: true,
    // Refer: https://github.com/akiran/react-slick/issues/1171
    infinite: posts.length > 1,
    slidesToScroll: 1,
    slidesToShow: 1,
    swipeToSlide: true,
  };

  const sliderRef = useRef<Slider | null>(null);
  const [slidesPlaying, setSlidesPlaying] = useState<boolean>(false);

  const screenWidth = useScreenWidth();

  const playSlides = () => {
    setSlidesPlaying(true);
    sliderRef.current?.slickPlay();
  };

  const pauseSlides = () => {
    setSlidesPlaying(false);
    sliderRef.current?.slickPause();
  };

  const [subreddit] = useQueryState("subreddit");

  const filterSubreddits = subreddit
    ? posts.filter((post) => post.subreddit === subreddit)
    : posts;

  useEffect(() => {
    sliderRef.current?.slickGoTo(0);
  }, [subreddit]);

  const nextSlide = () => sliderRef?.current?.slickNext();
  const previousSlide = () => sliderRef?.current?.slickPrev();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSheetOpen = (isOpen: boolean) => {
    setSheetOpen(isOpen);
  };

  const currentPost = filterSubreddits[currentIndex];

  return (
    <div
      className="container min-w-full px-0 md:px-3"
      style={{ width: `${screenWidth}px` }}
      id="posts-container"
    >
      <div className="relative h-full min-h-44 border-spacing-x-2 border-spacing-y-2 rounded-md border">
        <div className="absolute right-0 bottom-3 z-50">
          {/* Next & Previous slides */}
          <div className="text-muted-foreground absolute right-0 bottom-1 z-50 flex flex-col gap-1.5 px-1 *:cursor-pointer">
            <ArrowUpCircle
              onClick={() => {
                pauseSlides();
                nextSlide();
              }}
              className="size-6"
            />
            <ArrowDownCircle
              onClick={() => {
                pauseSlides();
                previousSlide();
              }}
              className="size-6"
            />
            {/* Play & Pause slides */}
            {slidesPlaying ? (
              <Pause onClick={pauseSlides} className="size-6" />
            ) : (
              <Play onClick={playSlides} className="size-6" />
            )}
          </div>
        </div>
        <Slider
          ref={sliderRef}
          {...settings}
          beforeChange={(_, newIndex) => setCurrentIndex(newIndex)}
        >
          {filterSubreddits?.map((post, idx) => {
            const totalPosts = filterSubreddits.length;
            const currentTime = Date.now() / 1000;
            const createdAt = getDifferenceString(
              (currentTime - post.postCreatedAt) / 60,
              "ago",
              true
            );

            return (
              <div key={post.postId} className="flex min-h-8 min-w-full gap-3">
                <OverlayTip
                  id="post-count"
                  className="text-foreground bg-primary/10 absolute top-0 right-0 z-50 rounded-l-md p-1 text-xs"
                >
                  {(idx + 1).toString().padStart(2, "0")}/
                  {totalPosts.toString().padStart(2, "0")}
                </OverlayTip>
                <div className="container px-3">
                  <div className="text-muted-foreground mb-2 flex gap-1 text-xs">
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
                    <span suppressHydrationWarning>{createdAt}</span>
                  </div>
                  <div className="flex w-[90%] items-center gap-2">
                    <div className="flex flex-1 items-center gap-2">
                      <Badge
                        onClick={() => setSheetOpen(true)}
                        className="flex cursor-pointer items-center gap-1"
                      >
                        <PanelRight className="size-3" />
                        Expand
                      </Badge>
                      <p className="hover:text-primary/80 text-foreground line-clamp-2 text-sm tracking-wide">
                        {post.postTitle}
                      </p>
                    </div>
                  </div>

                  <div className="text-muted-foreground mt-2 flex items-center gap-2 text-xs">
                    <ArrowUp className="size-3" />
                    <span>{formatLargeNumber(post.postVotes)} votes</span>
                    <span>•</span>
                    <MessageSquare className="size-3" />
                    <span>{post.postCommentsCount} comments</span>
                    {post.postDomain !== `self.${post.subreddit}` &&
                      post.postDomain !== "i.redd.it" && (
                        <>
                          <span>•</span>
                          <OutLink
                            href={post.postUrl}
                            className="flex items-center gap-1"
                          >
                            <ExternalLink className="size-3" />
                            <span>{post.postDomain}</span>
                          </OutLink>
                        </>
                      )}
                  </div>

                  {post.postSelftext && (
                    <span className="text-muted-foreground mt-2 line-clamp-2 w-[90%] text-sm">
                      <MarkdownHTML
                        showImage={false}
                        content={post.postSelftext}
                      />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </Slider>

        <PostDetailSheet
          sheetOpen={sheetOpen}
          handleSheetOpen={handleSheetOpen}
          nextSlide={nextSlide}
          previousSlide={previousSlide}
          post={currentPost}
        />
      </div>
    </div>
  );
}