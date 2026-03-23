import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDeviceId } from "../utils/device";

export default function BookViewer() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // 🔐 Listen auth properly
  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        alert("Login required");
        window.location.href = "/";
      } else {
        console.log("USER UID:", currentUser.uid); // ✅ CORRECT PLACE
        setUser(currentUser);
      }
    });

    return () => unsubscribe();
  }, []);

  // 🔥 MAIN LOAD (PDF + DEVICE CHECK)
  useEffect(() => {
    const load = async () => {
      if (!user) return;

      try {
        // 🔐 DEVICE LIMIT CHECK
        const deviceId = getDeviceId();
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          alert("User not found");
          return;
        }

        const userData = userSnap.data();
        const devices = userData.devices || [];

        // ✅ already allowed
        if (!devices.includes(deviceId)) {
          // ❌ limit reached
          if (devices.length >= 2) {
            alert("❌ Device limit reached (Max 2 devices)");
            window.location.href = "/pricing";
            return;
          }

          // ✅ add device
          await updateDoc(userRef, {
            devices: [...devices, deviceId],
          });
        }

        // 📄 FETCH PDF (secure backend)
        const res = await fetch(`/api/get-pdf?uid=${user.uid}`);
        const dataRes = await res.json();

        console.log("PDF API RESPONSE:", dataRes); // ✅ FIXED

        if (dataRes.url) {
          setPdfUrl(dataRes.url);
        } else {
          alert("Please purchase first");
          window.location.href = "/pricing";
        }

      } catch (err) {
        console.error("ERROR:", err);
        alert("Error loading content");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  // 🔐 BASIC PROTECTIONS
  useEffect(() => {
    const disable = (e: any) => e.preventDefault();

    document.addEventListener("contextmenu", disable);

    const keyBlock = (e: any) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && ["p", "s", "u"].includes(e.key.toLowerCase())) ||
        (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(e.key.toLowerCase())) ||
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
        <iframe
          src={pdfUrl + "#toolbar=0&navpanes=0&scrollbar=0"}
          className="w-full h-full"
        />
      ) : (
        <p className="text-center mt-10 text-white">
          Unable to load PDF
        </p>
      )}
    </div>
  );
}
