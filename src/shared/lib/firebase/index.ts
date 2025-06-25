import type { Timestamp } from "firebase-admin/firestore";

export { verifyFirebaseSessionCookie } from "./verify-session-cookie";

export function timestampUTC(dateTime: Timestamp) {
  return new Date(dateTime.toDate()).toUTCString();
}
