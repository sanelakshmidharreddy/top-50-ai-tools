import { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ error: "Token missing" });
    }

    // ⚠️ TEMPORARY (we will secure later)
    if (token !== "test123") {
      return res.status(403).json({ error: "Invalid token" });
    }

    // ✅ Your Firebase PDF URL
    const pdfUrl =
      "https://firebasestorage.googleapis.com/v0/b/top-50-ai-tools.firebasestorage.app/o/ebooks%2FTOP%2050%20AI%20Tools%205.0.pdf?alt=media";

    return res.status(200).json({ url: pdfUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
}
