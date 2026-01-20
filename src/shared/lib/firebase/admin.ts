import {
  type AppOptions,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore, type Timestamp } from "firebase-admin/firestore";

import appConfig from "~/shared/app-config";
import isDevelopment from "~/shared/utils/is-development";
import Log from "~/shared/utils/terminal-logger";

let appOptions: AppOptions;

if (isDevelopment()) {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
  process.env.FIREBASE_AUTH_EMULATOR_HOST = "localhost:9099";

  appOptions = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  };
} else {
  appOptions = {
    credential: cert({
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey:
        process.env.FIREBASE_PRIVATE_KEY.split(String.raw`\n`).join("\n"),
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    }),
  };
}

const appInstanceName = `${appConfig.name}-server`;

function getServerFirebaseApp() {
  const apps = getApps();
  const serverFirebaseApp = apps.filter((app) => app.name === appInstanceName);
  if (!serverFirebaseApp.length) {
    try {
      return initializeApp(appOptions, appInstanceName);
    } catch (err) {
      Log.fail(`Failed to initialize Firebase admin app: ${String(err)}`);

      throw err;
    }
  }
  return serverFirebaseApp[0];
}

const adminApp = getServerFirebaseApp();

const adminAuth = getAuth(adminApp);

const adminDb = getFirestore(adminApp);

export const admin = {
  app: adminApp,
  auth: adminAuth,
  db: adminDb,
};

export function timestampUTC(dateTime: Timestamp | undefined) {
  if (!dateTime) return "";
  return dateTime.toDate().toUTCString();
}
