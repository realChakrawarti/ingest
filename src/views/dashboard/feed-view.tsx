"use client";

import { BookOpenIcon } from "lucide-react";

import { toast } from "sonner";
import useSWR from "swr";

import type { ZFeedByUser } from "~/entities/feeds/models";

import appConfig from "~/shared/app-config";
import fetchApi from "~/shared/lib/api/fetch";
import { Badge } from "~/shared/ui/badge";
import Log from "~/shared/utils/terminal-logger";
import { getTimeDifference } from "~/shared/utils/time-diff";

import GridContainer from "~/widgets/grid-container";
import FeedCard from "~/widgets/item-card";
import NoItemCard from "~/widgets/no-item-card";
import Spinner from "~/widgets/spinner";

import CreateFeedDialog from "./create-feed-dialog";

export default function FeedView() {
  const {
    data: feeds,
    isLoading: isFeedLoading,
    error: isFeedError,
    mutate,
  } = useSWR("/feeds", (url) => fetchApi<ZFeedByUser[]>(url));

  const feedsData = feeds?.data;

  const handleFeedDelete = async (feedId: string) => {
    if (feedId) {
      try {
        const result = await fetchApi(`/feeds/${feedId}/delete`, {
          method: "DELETE",
        });
        mutate();
        toast(result.message);
      } catch (err) {
        Log.fail(err);
      }
    }
  };

  return (
    <div className="space-y-4 px-3">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-3 text-lg lg:text-xl">
          <BookOpenIcon />
          <p>Feeds</p>
          <Badge className="text-primary text-lg lg:text-xl" variant="outline">
            {feedsData?.length ?? 0}/{appConfig.limitFeeds}
          </Badge>
        </h1>
        <div className="flex items-center gap-3">
          <CreateFeedDialog
            disabled={(feedsData?.length ?? 0) >= appConfig.limitFeeds}
            revalidateFeeds={mutate}
          />
        </div>
      </div>
      {isFeedError && <p>Error loading feeds</p>}
      {isFeedLoading ? (
        <Spinner className="size-8" />
      ) : (
        <section className="w-full">
          {/* TODO: Maybe add a skeleton? */}
          {feedsData?.length ? (
            <GridContainer>
              {feedsData.map((feed) => {
                const [_, lastUpdated] = getTimeDifference(
                  feed.updatedAt,
                  true,
                  false
                );
                return (
                  <FeedCard
                    isPublic={feed.isPublic}
                    type="feed"
                    key={feed.id}
                    onDelete={handleFeedDelete}
                    id={feed?.id}
                    title={feed?.title}
                    description={feed?.description}
                    lastUpdated={lastUpdated}
                  />
                );
              })}
            </GridContainer>
          ) : (
            <NoItemCard icon={BookOpenIcon} title="No feeds added yet." />
          )}
        </section>
      )}
    </div>
  );
}