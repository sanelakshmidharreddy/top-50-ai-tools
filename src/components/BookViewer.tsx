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
        if (!userData?.hasPurchased) {
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

        // ✅ SET SECURE STREAM URL (NO FETCH JSON)
        const secureUrl = `/api/get-pdf?uid=${user.uid}`;
        setPdfUrl(secureUrl);

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
      <p className="text-center mt-10 text-lg font-bold text-white">
        ⚡ Preparing your book...
      </p>
    );
  }

  return (
  <div className="relative h-screen w-full bg-black flex flex-col overflow-hidden">

    {/* TOP BAR */}
    <div className="p-3 bg-gray-900 text-white text-center">
      📘 Your Book (Protected View)
    </div>

    {/* 🔐 WATERMARK */}
    <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
      <div className="w-full h-full flex flex-wrap opacity-10 text-white text-xs">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="w-1/3 text-center py-4"
            style={{
              transform: `rotate(-20deg) translateY(${i * 10}px)`
            }}
          >
            {user?.email}
          </div>
        ))}
      </div>
    </div>

    {/* 🚫 PDF VIEW (STRICT) */}
    <div className="flex-1 pointer-events-auto">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          className="w-full h-full border-none"
          sandbox="allow-same-origin allow-scripts"
        />
      ) : (
        <p className="text-center mt-10 text-white">
          Unable to load PDF
        </p>
      )}
    </div>

  </div>
);
}
