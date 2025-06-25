import { admin } from "./admin";

const COLLECTION = {
  archives: "archives",
  catalogs: "catalogs",
  users: "users",
} as const;

export const refs = {
  archives: admin.db.collection(COLLECTION.archives),
  catalogs: admin.db.collection(COLLECTION.catalogs),
  userArchives: (userId: string) =>
    refs.users.doc(userId).collection(COLLECTION.archives),
  userCatalogs: (userId: string) =>
    refs.users.doc(userId).collection(COLLECTION.catalogs),
  users: admin.db.collection(COLLECTION.users),
};
