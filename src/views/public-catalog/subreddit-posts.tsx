import type { ZCatalogSubredditPost } from "~/entities/catalogs/models";

import { PublicMarker } from "~/widgets/public-layout";

import PostCard from "./post-card";

export default function SubredditPosts({
  posts,
}: {
  posts: ZCatalogSubredditPost[] | undefined;
}) {
  if (posts?.length) {
    return (
      <section className="space-y-4">
        <div className="h-6 px-2 md:px-3 flex items-center gap-2 text-primary">
          <PublicMarker />
          <h2 id={"subreddit-posts"} className="text-lg">
            <a href={"#subreddit-posts"}>Subreddit Posts</a>
          </h2>
        </div>

        <PostCard posts={posts} />
      </section>
    );
  }

  return null;
}
