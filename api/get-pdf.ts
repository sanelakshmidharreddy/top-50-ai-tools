import { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET, // ✅ IMPORTANT
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "User ID missing" });
    }

    // ✅ Check user purchase
    const userDoc = await db.collection("users").doc(uid as string).get();

    if (!userDoc.exists || !userDoc.data()?.hasPurchased) {
      return res.status(403).json({ error: "Not purchased" });
    }

    // ✅ THIS IS YOUR FILE PATH (from your screenshot)
    const file = bucket.file("ebooks/top50.pdf");

    // ✅ Generate secure URL
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 10, // 10 minutes
    });

    return res.status(200).json({ url });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
