import { refs } from "~/shared/lib/firebase/refs";

/**
 * Retrieves the next scheduled update time for a specific feed.
 *
 * @param feedId - The unique identifier of the feed
 * @returns The timestamp of the feed's last update
 */
export async function getNextUpdate(feedId: string) {
  const feedRef = refs.feeds.doc(feedId);
  const feedSnap = await feedRef.get();
  const feedData = feedSnap.data();

  return feedData?.data.updatedAt.toDate();
}