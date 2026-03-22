import { getStorage } from "firebase-admin/storage";

const bucket = getStorage().bucket();

const file = bucket.file("ebooks/TOP 50 AI Tools 5.0.pdf");

// ✅ Generate signed URL (VERY IMPORTANT)
const [url] = await file.getSignedUrl({
  action: "read",
  expires: Date.now() + 1000 * 60 * 60, // 1 hour
});

return res.status(200).json({ url });
