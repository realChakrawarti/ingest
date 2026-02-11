/**
 * This function creates a user document in the firestore when user signs up
 * for the first time.
 * @param uid
 * @returns
 */

import { refs } from "~/shared/lib/firebase/refs";

export const createUser = async (userId: string): Promise<string> => {
  const userRef = refs.users.doc(userId);
  const userSnap = await userRef.get();

  // Check if the user document already exists
  if (!userSnap.exists) {
    // If the document doesn't exist, create it
    await userRef.set({
      createdAt: new Date(),
    });

    return "User created successfully.";
  }

  return "User loggedIn successfully.";
};
