import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BOOK_CONTENT } from "../types";
import { ChevronLeft, ChevronRight, Lock, Shield, AlertCircle, Loader2 } from "lucide-react";

export default function BookViewer() {
  const { profile, loading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [currentPage, setCurrentPage] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);

  // ✅ NEW (A) PDF STATE
  const [pdfUrl, setPdfUrl] = useState("");

  // Page handling
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam !== null) {
      const pageIndex = parseInt(pageParam, 10);
      if (!isNaN(pageIndex) && pageIndex >= 0 && pageIndex < BOOK_CONTENT.length) {
        setCurrentPage(pageIndex);
      }
    }
  }, [searchParams]);

  const handlePageChange = (newIndex: number) => {
    setCurrentPage(newIndex);
    setSearchParams({ page: newIndex.toString() });
  };

  // Auth check
  useEffect(() => {
    if (!loading && (!profile || !profile.hasPurchased)) {
      navigate("/pricing");
    }
  }, [profile, loading, navigate]);

  // ✅ NEW (B) FETCH PDF USING TOKEN
  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      fetch(`/api/get-pdf?token=${token}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.url) {
            setPdfUrl(data.url);
          }
        })
        .catch(() => {
          alert("Failed to load PDF");
        });
    }
  }, [searchParams]);

  // Security protections
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "PrintScreen" ||
        (e.ctrlKey && (e.key === "p" || e.key === "s" || e.key === "u")) ||
        (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "J" || e.key === "C")) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) setIsBlurred(true);
      else setIsBlurred(false);
    };

    const handleBlur = () => setIsBlurred(true);
    const handleFocus = () => setIsBlurred(false);

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // ✅ NEW (C) VIEW PDF FUNCTION
  const handleViewPdf = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    } else {
      alert("PDF not available");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg">
        <Loader2 className="w-12 h-12 text-brand-accent animate-spin mb-4" />
        <p className="text-gray-400 font-bold">Verifying Secure Access...</p>
      </div>
    );
  }

  if (!profile?.hasPurchased) return null;

  const page = BOOK_CONTENT[currentPage];
  const watermarkText = `${profile.email} • ${user?.uid.slice(0, 8)}`;

  return (
    <div className={`min-h-screen bg-brand-bg p-4 ${isBlurred ? "blur-3xl" : ""}`}>
      
      {/* 🔥 PDF BUTTON */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleViewPdf}
          className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold"
        >
          View Full PDF
        </button>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-4">{page.title}</h1>
        <p className="text-gray-700">{page.content}</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
        >
          <ChevronLeft />
        </button>

        <button
          onClick={() =>
            handlePageChange(Math.min(BOOK_CONTENT.length - 1, currentPage + 1))
          }
          disabled={currentPage === BOOK_CONTENT.length - 1}
        >
          <ChevronRight />
        </button>
      </div>

      {/* Warning */}
      <div className="mt-6 text-sm text-red-500 flex items-center gap-2">
        <AlertCircle />
        Protected content. Do not share.
      </div>
    </div>
  );
}
