import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, onSnapshot, serverTimestamp, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { ShieldCheck, Zap, Smartphone, CreditCard, Loader2, CheckCircle2, AlertCircle, Send, Users, Check, X } from "lucide-react";
import confetti from "canvas-confetti";
import { handleFirestoreError, OperationType } from "../lib/firestoreErrors";
import { UserProfile } from "../types";
import { startPayment } from "../utils/payment";

export default function PricingPage() {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();
  const [paying, setPaying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (profile?.hasPurchased) {
      navigate("/viewer");
    }
  }, [profile, navigate]);

  // Listen for purchase status changes in real-time
  useEffect(() => {
    if (!user) return;
    const userDoc = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      if (doc.exists()) {
        const data = doc.data() as UserProfile;
        if (data.hasPurchased) {
          setSuccess(true);
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ["#3b82f6", "#6366f1", "#ffffff"]
          });
          setTimeout(() => navigate("/viewer"), 3000);
        }
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
    });
    return () => unsubscribe();
  }, [user, navigate]);

  const handleBuyNow = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setPaying(true);
    setError(null);

    try {
      await startPayment(user.uid);
    } catch (err: any) {
      console.error("Payment error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="min-h-[calc(100vh-64px)] py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black mb-4">Complete Your Purchase</h1>
          <p className="text-gray-400">Unlock the ultimate AI handbook instantly.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="bg-brand-card border border-white/10 p-6 sm:p-10 rounded-[2rem] shadow-2xl">
            <div className="flex items-center justify-between mb-10">
              <span className="text-xl font-black">Order Summary</span>
              <div className="flex flex-col items-end">
                <span className="bg-brand-accent/10 text-brand-accent px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Digital PDF</span>
                <span className="text-[10px] text-emerald-500 font-black mt-2 uppercase tracking-widest">80% OFF</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-6 mb-10">
              <img src="https://picsum.photos/seed/bookcover/200/300" alt="Book" className="w-20 h-28 rounded-xl object-cover shadow-2xl" referrerPolicy="no-referrer" />
              <div>
                <p className="font-black text-lg leading-tight">Mastering the Top 50 AI Tools</p>
                <p className="text-sm text-gray-400 mt-1">Limited Edition Access</p>
              </div>
            </div>

            <div className="space-y-5 border-t border-white/5 pt-8 mb-10">
              <div className="flex justify-between text-gray-400 font-medium">
                <span>Original Price</span>
                <span className="line-through">₹149</span>
              </div>
              <div className="flex justify-between text-brand-accent font-black">
                <span>Special Discount (80%)</span>
                <span>-₹120</span>
              </div>
              <div className="flex justify-between text-2xl font-black pt-6 border-t border-white/5">
                <span>Total Amount</span>
                <div className="flex flex-col items-end">
                  <span>₹29</span>
                  <span className="text-[10px] text-gray-500 font-normal mt-1">Inclusive of all taxes</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="mb-8 p-5 bg-red-500/10 border border-red-500/20 rounded-2xl text-sm text-red-400 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="font-medium">{error}</p>
              </div>
            )}

            <button
              onClick={handleBuyNow}
              disabled={paying}
              className="w-full bg-brand-accent hover:bg-blue-600 disabled:bg-gray-700 text-white py-5 rounded-2xl font-black text-xl transition-all shadow-2xl shadow-blue-500/30 flex items-center justify-center space-x-4 active:scale-[0.98]"
            >
              {paying ? (
                <>
                  <Loader2 className="animate-spin w-6 h-6" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <CreditCard className="w-6 h-6" />
                  <span>Buy Now - ₹29</span>
                </>
              )}
            </button>
            
            <p className="text-center mt-6 text-xs text-gray-500 font-medium">
              Pay securely via UPI (PhonePe / GPay).
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-brand-card/50 border border-white/5 p-8 rounded-[2rem] shadow-xl">
              <h3 className="font-black text-lg mb-6 flex items-center space-x-3">
                <ShieldCheck className="text-emerald-500 w-6 h-6" />
                <span>Secure Access Guarantee</span>
              </h3>
              <ul className="space-y-5 text-gray-400">
                <li className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Encrypted PDF viewer with advanced anti-copy protection.</span>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Personalized watermark with your email for identity protection.</span>
                </li>
                <li className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-brand-accent rounded-full mt-2 flex-shrink-0" />
                  <span className="text-sm sm:text-base leading-relaxed">Single device session tracking for maximum account security.</span>
                </li>
              </ul>
            </div>

            <div className="bg-blue-500/5 border border-blue-500/10 p-8 rounded-[2rem] shadow-xl">
              <h3 className="font-black text-lg mb-3 flex items-center space-x-3">
                <Zap className="text-yellow-500 w-6 h-6" />
                <span>Instant Delivery</span>
              </h3>
              <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
                The handbook will be unlocked in your account immediately after successful payment. No waiting time. Start learning now! 🚀
              </p>
            </div>
          </div>
        </div>
      </div>

        {success && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-brand-bg/90 p-4"
          >
            <div className="bg-brand-card border border-white/10 p-12 rounded-[3rem] text-center max-w-sm shadow-2xl">
              <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="text-emerald-500 w-10 h-10" />
              </div>
              <h2 className="text-3xl font-black mb-2">Payment Successful ✅</h2>
              <p className="text-gray-400 mb-8">Your purchase was successful. Unlocking your handbook...</p>
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-accent"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        )}
    </div>
  );
}
