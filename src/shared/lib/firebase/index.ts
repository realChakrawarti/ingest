import { adminApp, adminAuth, adminDb } from "./admin";
import { clientApp, clientAuth, clientDb } from "./client";

const db = {
  admin: adminDb,
  client: clientDb,
};

const app = {
  admin: adminApp,
  client: clientApp,
};

const auth = {
  admin: adminAuth,
  client: clientAuth,
};
export { db, app, auth };

export { refs } from "./refs";
export { timestampUTC } from "./timestamp-utc";
export { verifyFirebaseSessionCookie } from "./verify-session-cookie";
