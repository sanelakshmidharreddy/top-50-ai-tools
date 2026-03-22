import { VercelRequest, VercelResponse } from "@vercel/node";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

const db = admin.firestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    const doc = await db.collection("accessTokens").doc(token as string).get();

    if (!doc.exists) {
      return res.status(403).json({ error: "Invalid access" });
    }

    const data = doc.data();

    if (!data?.valid) {
      return res.status(403).json({ error: "Token expired" });
    }

    // 🔥 OPTIONAL: Expire after first use
    await db.collection("accessTokens").doc(token as string).update({
      valid: false,
    });

    const pdfUrl =
      "https://firebasestorage.googleapis.com/v0/b/top-50-ai-tools.firebasestorage.app/o/ebooks%2FTOP%2050%20AI%20Tools%205.0.pdf?alt=media";

    return res.status(200).json({ url: pdfUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
