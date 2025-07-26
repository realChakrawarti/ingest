import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import { PublicMarker } from "~/widgets/public-layout";

import { FilterSubreddit } from "./filter-subreddit";
import PostCard from "./post-card";

export default function SubredditPosts({
  posts,
}: {
  posts: ZCatalogSubredditPost[] | undefined;
}) {
  const subreddits = new Set(posts?.map((post) => post.subreddit));

  if (posts?.length) {
    return (
      <section className="space-y-4">
        <div className="h-6 px-2 md:px-3 flex items-center gap-2 text-primary">
          <PublicMarker />
          <h2 id={"subreddit-posts"} className="text-lg">
            <a href={"#subreddit-posts"}>Subreddit Posts</a>
          </h2>
          <FilterSubreddit subreddits={Array.from(subreddits)} />
        </div>

        <PostCard posts={posts} />
      </section>
    );
  }

  return null;
}
