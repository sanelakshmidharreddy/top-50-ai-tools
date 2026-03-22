
import { db, auth } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
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
    // ✅ 1. Create order
    const res = await fetch("/api/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });

    if (!res.ok) {
      throw new Error("Failed to create order");
    }

    const data = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      order_id: data.id,

      name: "AI Tools Handbook",
      description: "Premium Access",

      // 🔥 MAIN PAYMENT SUCCESS HANDLER
      handler: async function (response: any) {
        try {
          if (!response.razorpay_payment_id) {
            throw new Error("Payment failed");
          }

          // ✅ 2. Verify payment
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
            alert("Payment Successful ✅");

            // 🔥 USE REAL TOKEN (VERY IMPORTANT)
            const token = verifyData.token;

            // Optional: store locally
            localStorage.setItem("paid", "true");

            // ✅ Redirect with real token
            window.location.href = `/book?token=${token}`;
          } else {
            alert("❌ Payment verification failed. Please contact support.");
          }
        } catch (error) {
          console.error("Error:", error);
          alert("Error verifying payment");
        }
      },

      prefill: {
        name: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
        contact: "",
      },

      notes: {
        address: "AI Tools Handbook Store",
      },

      // ✅ UPI ONLY CONFIG
      config: {
        display: {
          blocks: {
            upi: {
              name: "Pay via UPI",
              instruments: [{ method: "upi" }],
            },
          },
          sequence: ["block.upi"],
          preferences: {
            show_default_blocks: false,
          },
        },
      },

      upi: {
        flow: isMobile() ? "intent" : "collect",
      },

      theme: {
        color: "#00C853",
      },

      modal: {
        ondismiss: function () {
          console.log("Checkout closed");
        },
      },
    };

    // ✅ Check Razorpay loaded
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded.");
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error("Payment error:", err);
    alert("❌ Payment failed. Please try again.");
  }
};
