import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { getDeviceId } from "../utils/device";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

export default function BookViewer() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pages, setPages] = useState<string[]>([]);

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

  // 🔥 LOAD IMAGES (SECURE WAY)
  useEffect(() => {
    const loadImages = async () => {
      const storage = getStorage();
      const urls = [];

      for (let i = 1; i <= 108; i++) {
        const num = String(i).padStart(3, "0");
        const imageRef = ref(storage, `ebooks/${num}.jpg`);
        const url = await getDownloadURL(imageRef);
        urls.push(url);
      }

      setPages(urls);
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
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
        logSuspicious("Blocked key attempt");
      }
    };

    document.addEventListener("contextmenu", disableRightClick);
    document.addEventListener("keydown", blockKeys);

    return () => {
      document.removeEventListener("contextmenu", disableRightClick);
      document.removeEventListener("keydown", blockKeys);
    };
  }, []);

  // 🔥 SCREENSHOT / DEVTOOLS DETECTION (SIMULATION)
  useEffect(() => {
    let blurTimeout: any;

    const applyBlur = () => {
      document.body.style.filter = "blur(20px)";

      clearTimeout(blurTimeout);
      blurTimeout = setTimeout(() => {
        document.body.style.filter = "none";
      }, 1000);

      logSuspicious("Screen capture suspected");
    };

    const handleVisibility = () => {
      if (document.hidden) applyBlur();
    };

    const detectDevTools = () => {
      const widthDiff = window.outerWidth - window.innerWidth > 150;
      const heightDiff = window.outerHeight - window.innerHeight > 150;

      if (widthDiff || heightDiff) applyBlur();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("resize", detectDevTools);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", detectDevTools);
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

  // 🔥 LOG SUSPICIOUS ACTIVITY TO FIREBASE
  const logSuspicious = async (action: string) => {
    if (!user) return;

    try {
      await addDoc(collection(db, "security_logs"), {
        user: user.email,
        action,
        time: new Date(),
      });
    } catch (e) {}
  };

  if (loading) {
    return <p className="text-center mt-10 text-white">Loading...</p>;
  }

  return (
    <div className="relative bg-black min-h-screen">

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

      {/* IMAGES */}
      <div className="flex flex-col items-center gap-6 p-4">
        {pages.map((src, index) => (
          <img
            key={index}
            src={src}
            loading="lazy"
            alt={`Page ${index + 1}`}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            onDragStart={(e) => e.preventDefault()}
            style={{ userSelect: "none" }}
            className="max-w-3xl w-full rounded-lg shadow-lg"
          />
        ))}
      </div>
    </div>
  );
}
