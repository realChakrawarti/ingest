import type { Timestamp } from "firebase-admin/firestore";

/**
 * Converts a Firestore Timestamp to a UTC formatted string.
 *
 * @param dateTime - The Firestore Timestamp to be converted
 * @returns A string representation of the timestamp in UTC format
 */
export function toUTCString(dateTime: Timestamp) {
  return new Date(dateTime.toDate()).toUTCString();
}
