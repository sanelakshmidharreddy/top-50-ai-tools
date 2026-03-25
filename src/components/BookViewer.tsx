import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import { getDeviceId } from "../utils/device";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function BookViewer() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<string[]>([]);
  const [blur, setBlur] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // 🔥 LOG SECURITY EVENT
  const logSecurityEvent = async (action: string) => {
    try {
      await addDoc(collection(db, "security_logs"), {
        user: user?.email || "unknown",
        action,
        time: new Date().toISOString(),
      });
    } catch (e) {
      console.log("Log error", e);
    }
  };

  // 🔐 AUTH CHECK
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) {
        alert("Login required");
        window.location.href = "/";
      } else {
        setUser(u);
      }
    });
    return () => unsub();
  }, []);

  // 🔥 PURCHASE + DEVICE LIMIT
  useEffect(() => {
    const run = async () => {
      if (!user) return;

      const userRef = doc(db, "users", user.uid);
      const snap = await getDoc(userRef);

      if (!snap.exists()) {
        alert("User not found");
        window.location.href = "/pricing";
        return;
      }

      const data = snap.data();

      if (!data?.hasPurchased) {
        alert("Please purchase first");
        window.location.href = "/pricing";
        return;
      }

      const deviceId = getDeviceId();
      const devices = data.devices || [];

      if (!devices.includes(deviceId)) {
        if (devices.length >= 2) {
          alert("❌ Device limit reached (Max 2)");
          window.location.href = "/pricing";
          return;
        }
        await updateDoc(userRef, { devices: [...devices, deviceId] });
      }

      setLoading(false);
    };

    run();
  }, [user]);

  // 🔥 LOAD IMAGES (FAST + SAFE)
  useEffect(() => {
    const loadImages = async () => {
      const storage = getStorage();

      try {
        const urls = await Promise.all(
          Array.from({ length: 108 }, async (_, i) => {
            const num = String(i + 1).padStart(3, "0");
            const imageRef = ref(storage, `ebooks/${num}.jpg`);
            return await getDownloadURL(imageRef);
          })
        );

        setPages(urls);
      } catch (err) {
        console.log("Image loading error:", err);
      }
    };

    if (user) loadImages();
  }, [user]);

  // 🚫 BASIC PROTECTION
  useEffect(() => {
    const disableRightClick = (e: any) => e.preventDefault();

    const blockKeys = (e: any) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && ["p", "s", "u"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey &&
          e.shiftKey &&
          ["i", "j", "c"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        logSecurityEvent("Blocked key attempt");
      }
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  // 🔥 SCREENSHOT DETECTION + LIMIT
  useEffect(() => {
    let timeout: any;

    const triggerSecurity = () => {
      setBlur(true);
      setShowWarning(true);

      setAttempts((prev) => {
        const newCount = prev + 1;

        logSecurityEvent(`Screenshot attempt ${newCount}`);

        if (newCount >= 10) {
          alert("🚫 Access blocked due to multiple screenshots");
          window.location.href = "/blocked";
        }

        return newCount;
      });

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        setBlur(false);
        setShowWarning(false);
      }, 2000);
    };

    const handleVisibility = () => {
      if (document.hidden) triggerSecurity();
    };

    const handleKey = (e: any) => {
      if (e.key === "PrintScreen") triggerSecurity();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // ⏳ SESSION LIMIT
  useEffect(() => {
    const timer = setTimeout(() => {
      alert("Session expired");
      window.location.href = "/";
    }, 15 * 60 * 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading...</p>;
  }

  return (
    <div className="relative bg-black min-h-screen">
      {/* ⚠️ WARNING POPUP */}
      {showWarning && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg">
          ⚠️ Screenshot detected! Attempts: {attempts}/10
        </div>
      )}

      {/* HEADER */}
      <div className="p-3 text-center text-white bg-gray-900">
        📘 Protected Book View
      </div>

      {/* WATERMARK */}
      <div className="absolute inset-0 pointer-events-none z-10 opacity-10 text-white text-xs flex flex-wrap">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="w-1/3 text-center py-6"
            style={{ transform: "rotate(-20deg)" }}
          >
            {user?.email} • {new Date().toLocaleTimeString()}
          </div>
        ))}
      </div>

      {/* 📖 IMAGES */}
      <div
        className="flex flex-col items-center gap-6 p-4"
        style={{
          filter: blur ? "blur(12px)" : "none",
          transition: "0.3s",
        }}
      >
        {pages.map((src, index) => (
          <img
            key={index}
            src={src}
            loading="lazy"
            alt={`Page ${index + 1}`}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            onError={() => console.log("Image failed:", src)}
            style={{ userSelect: "none" }}
            className="max-w-3xl w-full rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
}
