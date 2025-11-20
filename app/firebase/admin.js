// app/firebase/admin.js
import * as admin from "firebase-admin";

let app;

if (!admin.apps.length) {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  let privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "[FIREBASE ADMIN] Missing env vars. Check FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL, FIREBASE_ADMIN_PRIVATE_KEY"
    );
  }

  // Au cas où la clé est entourée de guillemets par erreur
  if (privateKey.startsWith('"') || privateKey.startsWith("'")) {
    privateKey = privateKey.slice(1, -1);
  }

  privateKey = privateKey.replace(/\\n/g, "\n");

  console.log("[FIREBASE ADMIN] Initializing with projectId:", projectId);
  console.log("[FIREBASE ADMIN] clientEmail:", clientEmail);
  console.log("[FIREBASE ADMIN] privateKey length:", privateKey.length);

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey,
    }),
  });
} else {
  app = admin.app();
}

export const adminDb = admin.firestore();
export { admin };