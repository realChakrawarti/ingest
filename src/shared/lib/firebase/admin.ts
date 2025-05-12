import {
  type AppOptions,
  cert,
  getApps,
  initializeApp,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

const appOptions: AppOptions = {
  credential: cert({
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env
      .FIREBASE_PRIVATE_KEY!.split(String.raw`\n`)
      .join("\n"),
    projectId: process.env.FIREBASE_PROJECT_ID,
  }),
};

if (process.env.NODE_ENV === "development") {
  process.env.FIRESTORE_EMULATOR_HOST = "localhost:8080";
}

const appInstanceName = "ytcatalog-server";

function getServerFirebaseApp() {
  const apps = getApps();
  const serverFirebaseApp = apps.filter((app) => app.name === appInstanceName);
  if (!serverFirebaseApp.length) {
    try {
      return initializeApp(appOptions, appInstanceName);
    } catch (err) {
      console.error(
        "Failed to initialize Firebase admin app:",
        JSON.stringify(err)
      );

      throw err;
    }
  }
  return serverFirebaseApp[0];
}

const adminApp = getServerFirebaseApp();

const adminAuth = getAuth(adminApp);
const adminDb = getFirestore(adminApp);

export { adminApp, adminAuth, adminDb };
