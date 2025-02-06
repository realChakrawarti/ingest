import { GithubAuthProvider,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

import { app } from "../../utils/firebase";

// Initialize Firestore
export const firestore = getFirestore(app);

// Initalize Google Authentication Provider
export const googleProvider = new GoogleAuthProvider();

// Initialize GitHub Authentication Provider
export const githubProvider = new GithubAuthProvider();
