
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function BookViewer() {
  const [searchParams] = useSearchParams();
  const [pdfUrl, setPdfUrl] = useState("");
  const [blur, setBlur] = useState(false);

  import { getAuth } from "firebase/auth";

const user = getAuth().currentUser;
const uid = user?.uid;

  // 🔥 Load PDF securely
  useEffect(() => {
    if (uid) {
      fetch(`/api/get-pdf?uid=${uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.url) setPdfUrl(data.url);
          else alert("Access denied");
        });
    }
  }, [uid]);

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
      setBlur(document.hidden);
    });

    return () => {
      document.removeEventListener("contextmenu", block);
    };
  }, []);

  // 🔥 Dynamic watermark
  const watermark = `
  PROTECTED CONTENT
  UID: ${uid}
  TIME: ${new Date().toLocaleString()}
  `;

  return (
    <div className={`h-screen ${blur ? "blur-2xl" : ""}`}>

      {/* 🔥 WATERMARK */}
      <div className="fixed inset-0 opacity-10 text-lg font-bold rotate-[-30deg] grid grid-cols-3 gap-20 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i}>{watermark}</div>
        ))}
      </div>

      {/* 🔥 PDF VIEW */}
      {pdfUrl ? (
        <iframe
          src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=1"}
          className="w-full h-full"
        />
      ) : (
        <p className="text-center mt-10">Loading secure content...</p>
      )}
    </div>
  );
}
