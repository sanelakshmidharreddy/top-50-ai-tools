import React, { useState, useEffect, useRef } from "react";
import { Star, Users, ShieldCheck, Zap, Globe, Layout, Quote } from "lucide-react";
import ProductCarousel from "./ProductCarousel";
import { startPayment } from "../utils/payment";
import { useAuth } from "../contexts/AuthContext";
import { AI_TOOLS_LIST } from "../constants";

export default function HomePage() {
  const { user } = useAuth();
  const [buyerCount, setBuyerCount] = useState(3500);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const suggestions = AI_TOOLS_LIST.filter(tool =>
    tool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🔐 Close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ FIXED (NO ERROR NOW)
  useEffect(() => {
    setBuyerCount(3500);
  }, []);

  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    startPayment(user?.uid);
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={i} className="text-brand-accent font-black">{part}</span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  const allTools = [
    { icon: Globe, title: "Top 50 AI Tools", desc: "Detailed breakdown of the best tools." },
    { icon: Layout, title: "Build Websites", desc: "Create sites in minutes with AI." },
    { icon: Zap, title: "Automate Tasks", desc: "Save hours of manual work every day." },
    { icon: Star, title: "Prompt Engineering", desc: "Master the art of AI prompts." },
  ];

  const reviews = [
    { name: "Rahul", text: "Best ₹29 investment!" },
    { name: "Priya", text: "Very useful for students." },
    { name: "Ankit", text: "Clear and practical content." },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">

      {/* HERO */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-black text-white">Top 50 AI Tools</h1>
        <p className="text-gray-400 mt-4">Ultimate AI Handbook</p>

        <button
          onClick={handlePurchase}
          className="mt-8 bg-blue-600 px-8 py-4 rounded-xl text-white font-bold"
        >
          Buy Now ₹29
        </button>

        <p className="mt-4 text-gray-400">{buyerCount}+ Buyers</p>
      </section>

      {/* SEARCH */}
      <div className="max-w-xl mx-auto relative" ref={searchRef}>
        <input
          type="text"
          placeholder="Search tools..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowSuggestions(true);
          }}
          className="w-full p-4 rounded-xl bg-gray-900 text-white"
        />

        {showSuggestions && searchQuery && (
          <div className="absolute w-full bg-black mt-2 rounded-xl">
            {suggestions.map((tool, i) => (
              <div
                key={i}
                className="p-3 hover:bg-gray-800 cursor-pointer"
                onClick={() => {
                  setSearchQuery(tool);
                  setShowSuggestions(false);
                }}
              >
                {highlightMatch(tool, searchQuery)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FEATURES */}
      <section className="grid grid-cols-2 gap-6 p-10">
        {allTools.map((f, i) => (
          <div key={i} className="p-6 bg-gray-900 rounded-xl">
            <f.icon />
            <h3 className="text-white font-bold">{f.title}</h3>
            <p className="text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>

      {/* REVIEWS */}
      <section className="p-10">
        {reviews.map((r, i) => (
          <div key={i} className="mb-4 bg-gray-900 p-4 rounded-xl">
            <p className="text-gray-300">"{r.text}"</p>
            <p className="text-white font-bold">- {r.name}</p>
          </div>
        ))}
      </section>

    </div>
  );
}
