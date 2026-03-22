import { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
    storageBucket: "top-50-ai-tools.firebasestorage.app"
  });
}

const db = admin.firestore();

export default async function handler(req: VercelRequest, res: VercelResponse) {

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // ✅ SAVE ORDER
    await db.collection("orders").add({
      // ✅ UPDATE USER PURCHASE STATUS
await db.collection("users").doc(userId).set({
  hasPurchased: true,
  devices: [], // reset devices on purchase
}, { merge: true });
      paymentId: razorpay_payment_id,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ✅ GIVE LIFETIME ACCESS
    await db.collection("users").doc(userId).set(
      { hasPurchased: true },
      { merge: true }
    );

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }
}
