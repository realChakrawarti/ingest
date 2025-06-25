import { GithubAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { app } from "~/shared/lib/firebase";

// Initialize Firestore
export const firestore = getFirestore(app.client);

// Initalize Google Authentication Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize GitHub Authentication Provider
export const githubProvider = new GithubAuthProvider();
