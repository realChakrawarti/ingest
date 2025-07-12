"use client";

import Linkify from "linkify-react";
import { ArrowUp, CalendarClock, MessageSquare } from "lucide-react";
import Slider, { type Settings } from "react-slick";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import useScreenWidth from "~/shared/hooks/use-screen-width";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/shared/ui/sheet";
import { getDifferenceString } from "~/shared/utils/time-diff";

import { OutLink } from "~/widgets/out-link";

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
      className="px-0 md:px-3"
      style={{ width: `${screenWidth}px` }}
      id="posts-container"
    >
      <div className="border rounded-md border-spacing-x-2 border-spacing-y-2 px-2">
        <Slider {...settings}>
          {posts?.map((post) => {
            const currentTime = Date.now() / 1000;
            const createdAt = getDifferenceString(
              (currentTime - post.postCreatedAt) / 60,
              "ago",
              true
            );

            return (
              <div key={post.postId} className="flex gap-3 min-h-8 min-w-full">
                <div className="container">
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
                    <span className="text-primary">{post.postVotes}</span>
                    <span>•</span>
                    <MessageSquare className="size-3" />
                    <span>{post.postCommentsCount} comments</span>
                    {post.postDomain !== `self.${post.subreddit}` && (
                      <>
                        <span>•</span>
                        <span className="text-primary">{post.postDomain}</span>
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

function PostDetailSheet({ post }: { post: ZCatalogSubredditPost }) {
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
          <SheetDescription className="sr-only">
            {/* // TODO: Maybe consider adding post meta? */}
            {post.postTitle}
          </SheetDescription>
        </SheetHeader>
        <div className="my-4">
          {post.postImage ? (
            <img
              src={post.postImage}
              alt={post.postTitle}
              className="w-full h-auto max-h-96 object-contain"
            />
          ) : null}
          {post.postSelftext ? (
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
              {post?.postSelftext}
            </Linkify>
          ) : null}
          {/* {JSON.stringify(post, null, 2)} */}
        </div>
      </SheetContent>
    </Sheet>
  );
}
