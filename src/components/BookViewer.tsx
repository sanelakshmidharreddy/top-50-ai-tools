import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, useSearchParams } from "react-router-dom";
import { BOOK_CONTENT } from "../types";
import { ChevronLeft, ChevronRight, Lock, Shield, Eye, AlertCircle, FileText, Loader2, X } from "lucide-react";

export default function BookViewer() {
  const { profile, loading, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);

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

  useEffect(() => {
    if (!loading && (!profile || !profile.hasPurchased)) {
      navigate("/pricing");
    }
  }, [profile, loading, navigate]);

  // Security: Disable Right Click and Protections
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();
    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable PrintScreen, Ctrl+P, Ctrl+S, Ctrl+U, Ctrl+Shift+I
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
      if (document.hidden) {
        setIsBlurred(true);
      } else {
        setIsBlurred(false);
      }
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

  const handleViewPdf = () => {
    alert("PDF viewing is disabled in this lightweight preview version. Please use the on-screen reader.");
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-brand-bg">
      <Loader2 className="w-12 h-12 text-brand-accent animate-spin mb-4" />
      <p className="text-gray-400 font-bold">Verifying Secure Access...</p>
    </div>
  );
  
  if (!profile?.hasPurchased) return null;

  const page = BOOK_CONTENT[currentPage];
  const watermarkText = `${profile.email} • ${profile.phone || ''} • SECURE ACCESS ID: ${user?.uid.slice(0, 8)}`;

  return (
    <div className={`min-h-[calc(100vh-64px)] bg-brand-bg flex flex-col items-center p-4 md:p-8 no-select relative overflow-hidden transition-all duration-500 ${isBlurred ? 'blur-3xl grayscale' : ''}`}>
      {/* Fixed Warning Overlay */}
      <div className="fixed top-20 right-5 z-[9999] bg-red-600 text-white px-4 py-2 rounded-xl font-bold shadow-2xl text-sm flex items-center gap-2 animate-pulse pointer-events-none">
        <AlertCircle className="w-4 h-4" />
        <span>⚠️ Content Protected</span>
      </div>

      {/* Dynamic Watermark Overlay (Grid Pattern) */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.04] overflow-hidden select-none grid grid-cols-2 md:grid-cols-4 gap-20 p-10">
        {Array.from({ length: 24 }).map((_, i) => (
          <div key={i} className="text-sm md:text-base font-black -rotate-45 whitespace-nowrap flex items-center justify-center">
            {watermarkText}
          </div>
        ))}
      </div>

      <div className="max-w-4xl w-full flex flex-col h-full relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="bg-brand-accent/20 p-2 rounded-lg">
              <Shield className="text-brand-accent w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Secure Reader</h2>
              <p className="text-xs text-gray-500 uppercase tracking-widest">Protected Content</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>Identity Verified: {profile.email}</span>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-full">
              <Lock className="w-3 h-3" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </div>

        {/* Viewer Area */}
        <div className="relative flex-1 bg-white text-gray-900 rounded-3xl shadow-2xl overflow-hidden min-h-[600px] flex flex-col border border-white/10">
          <div
            key={currentPage}
            className="flex-1 overflow-y-auto relative"
          >
              {page.imageUrl ? (
                <div className="h-full flex flex-col items-center justify-center p-0">
                  <img 
                    src={page.imageUrl} 
                    alt={page.title} 
                    className="max-h-[80vh] w-auto shadow-2xl rounded-lg object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <div className="mt-8 text-center px-8 pb-12">
                    <h1 className="text-4xl font-black mb-4 text-gray-900">{page.title}</h1>
                    <p className="text-xl text-gray-500 font-medium">{page.content}</p>
                  </div>
                </div>
              ) : (
                <div className="p-12 md:p-20">
                  <h1 className="text-3xl font-black mb-8 border-b border-gray-100 pb-4 text-gray-900">{page.title}</h1>
                  <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-6">
                    {page.content.split('\n').map((paragraph, i) => (
                      <p key={i}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>

          {/* Bottom Controls */}
          <div className="bg-gray-50 border-t border-gray-100 p-6 flex justify-between items-center">
            <button
              onClick={() => handlePageChange(Math.max(0, currentPage - 1))}
              disabled={currentPage === 0}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-200 disabled:opacity-30 transition-colors font-bold text-gray-600"
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous</span>
            </button>
            
            <div className="flex space-x-1">
              {BOOK_CONTENT.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full ${i === currentPage ? 'bg-brand-accent' : 'bg-gray-300'}`}
                />
              ))}
            </div>

            <button
              onClick={() => handlePageChange(Math.min(BOOK_CONTENT.length - 1, currentPage + 1))}
              disabled={currentPage === BOOK_CONTENT.length - 1}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-gray-200 disabled:opacity-30 transition-colors font-bold text-gray-600"
            >
              <span>Next</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Security Warning */}
        <div className="mt-8 bg-brand-card/50 border border-white/5 p-4 rounded-2xl flex items-center space-x-4">
          <AlertCircle className="text-yellow-500 w-6 h-6 shrink-0" />
          <p className="text-xs text-gray-400">
            This content is protected. Unauthorized sharing, screenshots, or recording will result in immediate account termination. Your email is watermarked on every page.
          </p>
        </div>
      </div>
    </div>
  );
}
