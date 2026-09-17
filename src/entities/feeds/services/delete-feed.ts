import { admin } from "~/shared/lib/firebase/admin";
import { refs } from "~/shared/lib/firebase/refs";

export async function deleteFeed(userId: string, feedId: string) {
  const feedRef = refs.feeds.doc(feedId);

  const userFeedRef = refs.userFeeds(userId).doc(feedId);

  const batch = admin.db.batch();
  try {
    batch.delete(feedRef);
    batch.delete(userFeedRef);

    await batch.commit();
  } catch (err) {
    if (err instanceof Error) {
      return err.message;
    }
    return "Unable to delete the feed.";
  }
}