import { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import admin from "firebase-admin";

// 🔥 Initialize Firebase Admin
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

  // ✅ SECURITY: allow only POST
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

    // ❌ If invalid signature
    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false });
    }

    // ✅ Save order
    await db.collection("orders").add({ 
      await db.collection("users").doc(userId).set(
  {
    hasPurchased: true,
  },
  { merge: true }
);
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // ✅ GIVE USER LIFETIME ACCESS
await db.collection("users").doc(userId).set(
  {
    hasPurchased: true,
  },
  { merge: true }
);

    // ✅ Create secure token (payment ID)
    await db.collection("accessTokens").doc(razorpay_payment_id).set({
      token: razorpay_payment_id,
      valid: true,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // 🔥 Send token to frontend
    return res.status(200).json({
      success: true,
      token: razorpay_payment_id,
    });

  } catch (error) {
    console.error("Verify Payment Error:", error);
    return res.status(500).json({ success: false });
  }
}
