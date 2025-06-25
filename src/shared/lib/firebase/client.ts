import { type FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

import appConfig from "~/shared/app-config";
import isDevelopment from "~/shared/utils/is-development";
import Log from "~/shared/utils/terminal-logger";

import localFirebase from "../../../../firebase.json";

const appInstanceName = `${appConfig.name}-client`;

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
      Log.fail(`Failed to initialize Firebase client app: ${err}`);
      throw err;
    }
  }

  return clientFirebaseApp;
}

const clientApp = getClientFirebaseApp();

const clientAuth = getAuth(clientApp);
const clientDb = getFirestore(clientApp);

const authPort = localFirebase.emulators.auth.port;
const firestorePort = localFirebase.emulators.firestore.port;

if (isDevelopment()) {
  connectAuthEmulator(clientAuth, `http://127.0.0.1:${authPort}`);
  connectFirestoreEmulator(clientDb, "127.0.0.1", firestorePort);
}

export const client = {
  app: clientApp,
  auth: clientAuth,
  db: clientDb,
};
