import { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";

// init (already in your code)
const db = admin.firestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "UID missing" });
    }

    // ✅ Check user purchase
    const userDoc = await db.collection("users").doc(uid as string).get();

    if (!userDoc.exists || !userDoc.data()?.hasPurchased) {
      return res.status(403).json({ error: "Not purchased" });
    }

    // ✅ Get storage bucket
    const bucket = admin.storage().bucket();

    const file = bucket.file("ebooks/TOP 50 AI Tools 5.0.pdf");

    // 🔥 IMPORTANT: Generate signed URL
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 1000 * 60 * 60, // 1 hour
    });

    return res.status(200).json({ url });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
