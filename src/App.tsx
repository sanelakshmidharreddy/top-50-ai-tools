import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import AuthPage from "./components/AuthPage";
import PricingPage from "./components/PricingPage";
import BookViewer from "./components/BookViewer";

import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// 🔐 PROTECTED ROUTE WITH PURCHASE CHECK
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  const [hasAccess, setHasAccess] = React.useState<boolean | null>(null);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) return;

      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists() && docSnap.data().hasPurchased) {
        setHasAccess(true);
      } else {
        setHasAccess(false);
      }
    };

    checkAccess();
  }, [user]);

  if (loading || hasAccess === null) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking access...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" />;

  if (!hasAccess) return <Navigate to="/pricing" />;

  return <>{children}</>;
}

// 🔁 AUTO REDIRECT IF USER ALREADY PURCHASED
function AutoRedirect() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkPurchase = async () => {
      if (!user) return;

      const docSnap = await getDoc(doc(db, "users", user.uid));

      if (docSnap.exists() && docSnap.data().hasPurchased) {
        navigate("/viewer");
      }
    };

    checkPurchase();
  }, [user, navigate]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-brand-bg text-brand-text">
          <Navbar />

          {/* 🔁 AUTO CHECK */}
          <AutoRedirect />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            <Route
              path="/viewer"
              element={
                <ProtectedRoute>
                  <BookViewer />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
