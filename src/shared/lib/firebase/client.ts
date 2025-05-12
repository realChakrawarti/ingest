import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const appInstanceName = "ytcatalog-client";

// TODO: Use service account, for account token validation?
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  appId: "1:874223131522:web:1cbe3657cb8eed060ccd9b",
  authDomain: "ytcatalog707.firebaseapp.com",
  messagingSenderId: "874223131522",
  projectId: "ytcatalog707",
  storageBucket: "ytcatalog707.appspot.com",
};

function getClientFirebaseApp() {
  const apps = getApps();
  // TODO: Maybe use Array.find instead of filter?
  const clientFirebaseApp = apps.filter((app) => app.name === appInstanceName);
  if (!clientFirebaseApp.length) {
    try {
      return initializeApp(firebaseConfig, appInstanceName);
    } catch (err) {
      console.error(
        "Failed to initialize Firebase client app:",
        JSON.stringify(err)
      );

      throw err;
    }
  }
  return clientFirebaseApp[0];
}

const app = getClientFirebaseApp();

const auth = getAuth(app);
const db = getFirestore(app);

import localFirebase from "../../../../firebase.json";

const authPort = localFirebase.emulators.auth.port;
const firestorePort = localFirebase.emulators.firestore.port;

if (process.env.NODE_ENV === "development") {
  connectAuthEmulator(auth, `http://127.0.0.1:${authPort}`);
  connectFirestoreEmulator(db, "127.0.0.1", firestorePort);
}

export { app, auth, db };
