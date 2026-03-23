import type { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

const db = admin.firestore();
const bucket = admin.storage().bucket();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "No UID provided" });
    }

    // 🔐 CHECK PURCHASE
    const userDoc = await db.collection("users").doc(uid as string).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const userData = userDoc.data();

    if (!userData?.hasPurchased) {
      return res.status(403).json({ error: "Not purchased" });
    }

    // 📄 FILE PATH (IMPORTANT)
    const file = bucket.file("ebooks/top50.pdf");

    // 🔥 CHECK FILE EXISTS
    const [exists] = await file.exists();
    if (!exists) {
      return res.status(404).json({ error: "PDF not found in storage" });
    }

    // 🔐 GENERATE SIGNED URL
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 5, // 5 minutes
    });

    return res.status(200).json({ url });

  } catch (err) {
    console.error("API ERROR:", err);
    return res.status(500).json({ error: "Server error", details: err });
  }
}
