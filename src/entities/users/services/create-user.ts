/**
 * This function creates a user document in the firestore when user signs up
 * for the first time.
 * @param uid
 * @returns
 */

import { doc, getDoc, setDoc } from "firebase/firestore";

import { db } from "~/shared/lib/firebase/client";
import { COLLECTION } from "~/shared/lib/firebase/collections";

// TODO: Batch firebase calls so its atomic in nature
export const createUser = async (uid: string): Promise<string> => {
  const userRef = doc(db, COLLECTION.users, uid);
  const userSnap = await getDoc(userRef);

  // Check if the user document already exists
  if (!userSnap.exists()) {
    // If the document doesn't exist, create it
    await setDoc(userRef, {
      createdAt: new Date(),
    });

    return "User created successfully";
  }

  return "User loggedIn successfully";
};
