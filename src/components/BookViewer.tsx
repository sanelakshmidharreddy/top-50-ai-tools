import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";

export default function BookViewer() {
  const [pdfUrl, setPdfUrl] = useState("");
  const user = getAuth().currentUser;

  useEffect(() => {
    const load = async () => {
      if (!user) {
        alert("Login required");
        window.location.href = "/";
        return;
      }

      const res = await fetch(`/api/get-pdf?uid=${user.uid}`);
      const data = await res.json();

      if (data.url) {
        setPdfUrl(data.url);
      } else {
        alert("Please purchase first");
        window.location.href = "/pricing";
      }
    };

    load();
  }, [user]);

  useEffect(() => {
    document.addEventListener("contextmenu", e => e.preventDefault());
  }, []);

  return (
    <div className="h-screen">
      {pdfUrl ? (
        <iframe
          src={pdfUrl + "#toolbar=0"}
          className="w-full h-full"
        />
      ) : (
        <p className="text-center mt-10">Loading...</p>
      )}
    </div>
  );
}
