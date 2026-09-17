import type { CollectionReference } from "firebase-admin/firestore";

import type { ZFeedDocument, ZUserFeedDocument } from "~/entities/feeds/models";
import type { ZPickDocument, ZUserPickDocument } from "~/entities/picks/models";

import { admin } from "./admin";

const COLLECTION = {
  picks: "picks",
  feeds: "feeds",
  users: "users",
} as const;

export const refs = {
  picks: admin.db.collection(
    COLLECTION.picks
  ) as CollectionReference<ZPickDocument>,
  feeds: admin.db.collection(
    COLLECTION.feeds
  ) as CollectionReference<ZFeedDocument>,
  userPicks: (userId: string) =>
    refs.users
      .doc(userId)
      .collection(COLLECTION.picks) as CollectionReference<ZUserPickDocument>,
  userFeeds: (userId: string) =>
    refs.users
      .doc(userId)
      .collection(COLLECTION.feeds) as CollectionReference<ZUserFeedDocument>,
  users: admin.db.collection(COLLECTION.users),
} as const;