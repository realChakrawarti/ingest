"use client";

import { useState } from "react";

import { useQueryState } from "nuqs";

import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import { ItemSection } from "~/widgets/item-section";

import { PostCard } from "./post-card";
import PostDetailSheet from "./post-detail-sheet";

export function SubredditPost({ posts }: { posts: ZCatalogSubredditPost[] }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [subreddit] = useQueryState("subreddit");

  const sortedPosts = posts.toSorted(
    (a, b) => b.postCreatedAt - a.postCreatedAt
  );

  const filterSubreddits = subreddit
    ? sortedPosts.filter((post) => post.subreddit === subreddit)
    : sortedPosts;

  const currentPost = filterSubreddits[currentIndex];

  const handleSheetOpen = (isOpen: boolean) => {
    // Reset currentIndex when sheet is closed
    if (!isOpen) {
      setCurrentIndex(0);
    }
    setSheetOpen(isOpen);
  };

  function nextSlide() {
    const updateIndex = (currentIndex + 1) % filterSubreddits.length;
    setCurrentIndex(updateIndex);
  }

  function previousSlide() {
    const updateIndex =
      (currentIndex - 1 + filterSubreddits.length) % filterSubreddits.length;
    setCurrentIndex(updateIndex);
  }

  return (
    <>
      <ItemSection>
        {filterSubreddits.map((post, index) => (
          <PostCard
            index={index}
            handleSheetOpen={handleSheetOpen}
            key={post.postId}
            post={post}
            setCurrentIndex={setCurrentIndex}
          />
        ))}
      </ItemSection>

      <PostDetailSheet
        sheetOpen={sheetOpen}
        handleSheetOpen={handleSheetOpen}
        nextSlide={nextSlide}
        previousSlide={previousSlide}
        post={currentPost}
      />
    </>
  );
}