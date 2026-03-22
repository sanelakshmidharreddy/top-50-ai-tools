import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { LogOut, User, BookOpen, Search, X, Globe } from "lucide-react";
import { BOOK_CONTENT } from "../types";
import { AI_TOOLS_LIST } from "../constants";

export default function Navbar() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const results = AI_TOOLS_LIST.filter(
        (tool) => tool.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

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

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleResultClick = (toolName: string) => {
    setSearchQuery(toolName);
    setIsSearchOpen(false);
    // If we have a detail page for tools, we'd navigate there.
    // For now, it just fills the search bar.
  };

  return (
    <div className="sticky top-0 z-50">
      {/* Top Banner */}
      <div className="bg-emerald-600 text-white py-2 text-center text-[10px] font-black uppercase tracking-widest">
        🔥 Hot Deal: 80% Off for next 24 hours only! Limited Edition Access
      </div>
      <nav className="bg-brand-bg/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 sm:h-20 items-center">
          <div className="flex items-center space-x-4 sm:space-x-8 flex-1">
            <Link to="/" className="flex items-center space-x-2 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-brand-accent rounded-lg flex items-center justify-center shadow-lg shadow-brand-accent/20">
                <BookOpen className="text-white w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="font-black text-lg sm:text-xl tracking-tighter hidden xs:inline-block">AI Handbook</span>
            </Link>

            {/* Search Bar */}
            <div className="relative flex-1 max-w-[140px] xs:max-w-xs sm:max-w-md" ref={searchRef}>
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-brand-accent transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-full bg-brand-card/50 border border-white/10 rounded-full py-2 pl-9 pr-4 text-xs sm:text-sm focus:outline-none focus:border-brand-accent/50 focus:ring-4 focus:ring-brand-accent/10 transition-all placeholder:text-gray-600"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                  {searchResults.length > 0 ? (
                    <div className="py-2">
                      {searchResults.map((tool, index) => (
                        <button
                          key={index}
                          onClick={() => handleResultClick(tool)}
                          className="w-full text-left px-4 py-3 hover:bg-white/5 transition-colors group border-b border-white/5 last:border-0"
                        >
                          <div className="text-sm text-gray-300 group-hover:text-white transition-colors">
                            {highlightMatch(tool, searchQuery)}
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="px-4 py-8 text-center text-gray-400 text-sm italic">
                      No tools found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 ml-2 sm:ml-4">
            {user ? (
              <>
                {profile?.hasPurchased && (
                  <Link
                    to="/viewer"
                    className="text-xs sm:text-sm font-black text-brand-accent hover:text-blue-400 transition-colors hidden xs:block"
                  >
                    Read
                  </Link>
                )}
                <div className="flex items-center space-x-2 bg-brand-card px-2 sm:px-3 py-1.5 rounded-full border border-white/5 max-w-[80px] sm:max-w-[150px]">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
                  <span className="text-[10px] sm:text-sm font-bold truncate">
                    {profile?.displayName || user.email?.split('@')[0] || "User"}
                  </span>
                </div>
                <button
                  onClick={() => logout()}
                  className="p-1.5 sm:p-2 text-gray-400 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-brand-accent hover:bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black transition-all shadow-lg shadow-blue-500/20 active:scale-95"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
    </div>
  );
}
