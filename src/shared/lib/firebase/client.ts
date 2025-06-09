import { FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const appInstanceName = "ytcatalog-client";

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
  const clientFirebaseApp = apps.find((app) => app.name === appInstanceName);

  if (!clientFirebaseApp) {
    try {
      return initializeApp(firebaseConfig, appInstanceName);
    } catch (err) {
      TerminalLogger.fail(`Failed to initialize Firebase client app: ${err}`);
      throw err;
    }
  }

  return clientFirebaseApp;
}

const app = getClientFirebaseApp();

const auth = getAuth(app);
const db = getFirestore(app);

import localFirebase from "../../../../firebase.json";
import isDevelopment from "../is-development";
import TerminalLogger from "../terminal-logger";

const authPort = localFirebase.emulators.auth.port;
const firestorePort = localFirebase.emulators.firestore.port;

if (isDevelopment()) {
  connectAuthEmulator(auth, `http://127.0.0.1:${authPort}`);
  connectFirestoreEmulator(db, "127.0.0.1", firestorePort);
}

export { app, auth, db };
