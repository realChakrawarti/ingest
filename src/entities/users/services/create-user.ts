/**
 * This function creates a user document in the firestore when user signs up
 * for the first time.
 * @param uid
 * @returns
 */

import { adminDb } from "~/shared/lib/firebase/admin";
import { COLLECTION } from "~/shared/lib/firebase/collections";

export const createUser = async (uid: string): Promise<string> => {
  const userRef = adminDb.collection(COLLECTION.users).doc(uid);
  const userSnap = await userRef.get();

  // Check if the user document already exists
  if (!userSnap.exists) {
    // If the document doesn't exist, create it
    await userRef.set({
      createdAt: new Date(),
    });

    return "User created successfully";
  }

  return "User loggedIn successfully";
};
