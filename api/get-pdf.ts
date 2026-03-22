import { VercelRequest, VercelResponse } from '@vercel/node';
import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getStorage } from 'firebase-admin/storage';

// 🔐 Init Firebase Admin (use ENV vars in Vercel)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    // ✅ Verify user
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    // 👉 OPTIONAL: Check Firestore for purchase flag
    // (add if you store orders there)

    const bucket = getStorage().bucket();
    const file = bucket.file("ebooks/your-book.pdf");

    // ⏳ Create temporary signed URL (1 min)
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + 60 * 1000,
    });

    return res.status(200).json({ url });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch PDF" });
  }
}
