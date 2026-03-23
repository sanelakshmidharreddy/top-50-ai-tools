import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDeviceId } from "../utils/device";

export default function BookViewer() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 🔐 AUTH LISTENER
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        alert("Login required");
        window.location.href = "/";
      } else {
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 MAIN LOGIC
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          alert("User not found");
          window.location.href = "/pricing";
          return;
        }

        const userData = userSnap.data();

        // ❗ PURCHASE CHECK
        if (!userData.hasPurchased) {
          alert("Please purchase first");
          window.location.href = "/pricing";
          return;
        }

        // 🔐 DEVICE LIMIT
        const deviceId = getDeviceId();
        const devices = userData.devices || [];

        if (!devices.includes(deviceId)) {
          if (devices.length >= 2) {
            alert("❌ Device limit reached (Max 2 devices)");
            window.location.href = "/pricing";
            return;
          }

          await updateDoc(userRef, {
            devices: [...devices, deviceId],
          });
        }

        // 📄 FETCH PDF URL
        const res = await fetch(`/api/get-pdf?uid=${user.uid}`);
        const dataRes = await res.json();

        if (dataRes?.url) {
          setPdfUrl(dataRes.url);
        } else {
          alert("Access denied. Please purchase.");
          window.location.href = "/pricing";
        }

      } catch (err) {
        console.error("ERROR:", err);
        alert("Error loading content");
        window.location.href = "/";
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // 🔐 BASIC PROTECTION
  useEffect(() => {
    const disable = (e: any) => e.preventDefault();

    document.addEventListener("contextmenu", disable);

    const keyBlock = (e: any) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && ["p", "s", "u"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["i", "j", "c"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", keyBlock);

    return () => {
      document.removeEventListener("contextmenu", disable);
      document.removeEventListener("keydown", keyBlock);
    };
  }, []);

  // 🔄 UI
  if (loading) {
    return (
      <p className="text-center mt-10 text-lg font-bold">
        Loading secure content...
      </p>
    );
  }

return (
  <div className="h-screen w-full bg-black">
    {pdfUrl ? (
      <>
        <iframe
          src={pdfUrl}
          className="w-full h-[90%]"
        />

        {/* Mobile fallback */}
        <div className="text-center mt-2">
          <a
            href={pdfUrl}
            target="_blank"
            className="text-blue-400 underline"
          >
            Open PDF in new tab
          </a>
        </div>
      </>
    ) : (
      <p className="text-center mt-10 text-white">
        Unable to load PDF
      </p>
    )}
  </div>
);
}
