import type { CollectionReference } from "firebase-admin/firestore";

import type {
  ZArchiveDocument,
  ZUserArchiveDocument,
} from "~/entities/archives/models";
import type { ZFeedDocument, ZUserFeedDocument } from "~/entities/feeds/models";

import { admin } from "./admin";

const COLLECTION = {
  archives: "archives",
  feeds: "feeds",
  users: "users",
} as const;

export const refs = {
  archives: admin.db.collection(
    COLLECTION.archives
  ) as CollectionReference<ZArchiveDocument>,
  feeds: admin.db.collection(
    COLLECTION.feeds
  ) as CollectionReference<ZFeedDocument>,
  userArchives: (userId: string) =>
    refs.users
      .doc(userId)
      .collection(
        COLLECTION.archives
      ) as CollectionReference<ZUserArchiveDocument>,
  userFeeds: (userId: string) =>
    refs.users
      .doc(userId)
      .collection(COLLECTION.feeds) as CollectionReference<ZUserFeedDocument>,
  users: admin.db.collection(COLLECTION.users),
} as const;