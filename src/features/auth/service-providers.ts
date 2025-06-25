import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { client } from "~/shared/lib/firebase/client";

// Initialize Firestore
export const firestore = getFirestore(client.app);

// Initalize Google Authentication Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize GitHub Authentication Provider
export const githubProvider = new GithubAuthProvider();
