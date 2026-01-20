import type { CollectionReference } from "firebase-admin/firestore";

import type {
  ZArchiveDocument,
  ZUserArchiveDocument,
} from "~/entities/archives/models";
import type {
  ZCatalogDocument,
  ZUserCatalogDocument,
} from "~/entities/catalogs/models";

import { admin } from "./admin";

const COLLECTION = {
  archives: "archives",
  catalogs: "catalogs",
  users: "users",
} as const;

export const refs = {
  archives: admin.db.collection(
    COLLECTION.archives
  ) as CollectionReference<ZArchiveDocument>,
  catalogs: admin.db.collection(
    COLLECTION.catalogs
  ) as CollectionReference<ZCatalogDocument>,
  userArchives: (userId: string) =>
    refs.users
      .doc(userId)
      .collection(
        COLLECTION.archives
      ) as CollectionReference<ZUserArchiveDocument>,
  userCatalogs: (userId: string) =>
    refs.users
      .doc(userId)
      .collection(
        COLLECTION.catalogs
      ) as CollectionReference<ZUserCatalogDocument>,
  users: admin.db.collection(COLLECTION.users),
} as const;
