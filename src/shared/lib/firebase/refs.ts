import { db } from "./index";

const COLLECTION = {
  archives: "archives",
  catalogs: "catalogs",
  users: "users",
} as const;

export const refs = {
  archives: db.admin.collection(COLLECTION.archives),
  catalogs: db.admin.collection(COLLECTION.catalogs),
  userArchives: (userId: string) =>
    refs.users.doc(userId).collection(COLLECTION.archives),
  userCatalogs: (userId: string) =>
    refs.users.doc(userId).collection(COLLECTION.catalogs),
  users: db.admin.collection(COLLECTION.users),
};
