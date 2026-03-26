import { auth, db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const startPayment = async (uid?: string) => {
  try {
    const res = await fetch("/api/create-order", {
      method: "POST",
    });

    const data = await res.json();

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.amount,
      currency: "INR",
      order_id: data.id,

      name: "AI Tools Handbook",
      description: "Premium Access",

      // 🔥 FINAL HANDLER
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
              uid,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {

            // ✅ STEP 1: UPDATE FIRESTORE (VERY IMPORTANT)
            if (uid) {
              await updateDoc(doc(db, "users", uid), {
                hasPurchased: true,
              });
            }

            // ✅ STEP 2: SUCCESS MESSAGE
            alert("✅ Payment successful!");

            // ✅ STEP 3: REDIRECT
            window.location.href = "/book"; // (or /viewer if that's your route)

          } else {
            alert("Payment verification failed");
          }

        } catch (err) {
          console.error(err);
          alert("Error verifying payment");
        }
      },

      prefill: {
        name: auth.currentUser?.displayName || "",
        email: auth.currentUser?.email || "",
      },

      theme: {
        color: "#00C853",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

  } catch (err) {
    console.error(err);
    alert("Payment failed");
  }
};
