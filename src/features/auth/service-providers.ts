import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { client } from "~/shared/lib/firebase/client";

// Initialize Firestore
const firestore = getFirestore(client.app);

// Initalize Google Authentication Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Initialize GitHub Authentication Provider
const githubProvider = new GithubAuthProvider();

export { firestore, googleProvider, githubProvider };
