import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function BookViewer() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);

  const user = getAuth().currentUser;

  useEffect(() => {
    const fetchPdf = async () => {
      if (!user) {
        alert("Please login first");
        window.location.href = "/";
        return;
      }

      try {
        const res = await fetch(`/api/get-pdf?uid=${user.uid}`);
        const data = await res.json();

        if (data.url) {
          setPdfUrl(data.url);
        } else {
          alert("You have not purchased this book");
          window.location.href = "/pricing";
        }
      } catch (error) {
        console.error(error);
        alert("Error loading PDF");
      } finally {
        setLoading(false);
      }
    };

    fetchPdf();
  }, [user]);

  // 🔒 Protection
  useEffect(() => {
    const block = (e: any) => e.preventDefault();

    document.addEventListener("contextmenu", block);

    document.addEventListener("keydown", (e) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && ["p", "s", "u"].includes(e.key)) ||
        (e.ctrlKey && e.shiftKey) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        document.body.style.filter = "blur(20px)";
      } else {
        document.body.style.filter = "none";
      }
    });

    return () => {
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  const watermark = `
  PROTECTED
  USER: ${user?.email}
  TIME: ${new Date().toLocaleString()}
  `;

  if (loading) {
    return <p className="text-center mt-10">Loading secure content...</p>;
  }

  return (
    <div className="h-screen">

      {/* 🔥 WATERMARK */}
      <div className="fixed inset-0 opacity-10 text-lg font-bold rotate-[-30deg] grid grid-cols-3 gap-20 pointer-events-none">
        {Array.from({ length: 30 }).map((_, i) => (
          <div key={i}>{watermark}</div>
        ))}
      </div>

      {/* 🔥 PDF VIEWER */}
      {pdfUrl && (
        <iframe
          src={pdfUrl + "#toolbar=0&navpanes=0"}
          className="w-full h-full"
        />
      )}
    </div>
  );
}
