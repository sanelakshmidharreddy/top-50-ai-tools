import { db, auth } from "../firebase";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";
import { isMobile } from "./isMobile";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const getTotalPurchases = async () => {
  try {
    const snapshot = await getDocs(collection(db, "orders"));
    return snapshot.size;
  } catch (error) {
    console.error("Error fetching total purchases:", error);
    return 0;
  }
};

export const startPayment = async (userId?: string) => {
  try {
    // ✅ LOGIN CHECK
    if (!userId) {
      alert("Please login first to purchase");
      return;
    }

    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) throw new Error("Failed to create order");

    const data = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      order_id: data.id,

      name: "AI Tools Handbook",
      description: "Premium Access",

      // 🔥 MAIN FIX HERE
      handler: async function (response: any) {
        try {
          const verifyRes = await fetch("/api/verify-payment", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              userId,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // ✅ SAVE PURCHASE IN FIRESTORE
            await setDoc(doc(db, "users", userId), {
              hasPurchased: true,
            }, { merge: true });

            alert("Payment Successful ✅");

            // ✅ REDIRECT TO VIEWER (IMPORTANT)
            window.location.href = "/viewer";

          } else {
            alert("Payment verification failed");
          }
        } catch (err) {
          console.error(err);
          alert("Something went wrong during verification");
        }
      },

      prefill: {
        name: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
      },

      upi: {
        flow: isMobile() ? "intent" : "collect",
      },

      theme: {
        color: "#00C853",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
  }
};
