import { getAuth, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import React, { useState, useEffect, useRef } from "react";
import { Star, Users, ShieldCheck, Zap, Globe, Layout, ArrowRight, Quote } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import ProductCarousel from "./ProductCarousel";
import { startPayment } from "../utils/payment";
import { useAuth } from "../contexts/AuthContext";
import { AI_TOOLS_LIST } from "../constants";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";

export default function HomePage() {
  const { user } = useAuth();
  const [buyerCount, setBuyerCount] = useState(3500);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [hasPurchased, setHasPurchased] = useState(false);

  const suggestions = AI_TOOLS_LIST.filter(tool =>
    tool.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
  let count = 3500;

  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 2);
    setBuyerCount(count);
  }, 5000);

  return () => clearInterval(interval);
}, []);
  // ✅ ADD HERE (exact place)
useEffect(() => {
  const auth = getAuth();

  const unsub = onAuthStateChanged(auth, async (u) => {
    if (!u) return;

    const userRef = doc(db, "users", u.uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const data = snap.data();

      if (data.hasPurchased) {
        setHasPurchased(true);
      }
    }
  });

  return () => unsub();
}, []);
  
  const handlePurchase = (e: React.MouseEvent) => {
    e.preventDefault();
    startPayment(user?.uid);
  };

  const allTools = [
    { icon: Globe, title: "Top 50 AI Tools", desc: "Detailed breakdown of the best tools." },
    { icon: Layout, title: "Build Websites", desc: "Create sites in minutes with AI." },
    { icon: Zap, title: "Automate Tasks", desc: "Save hours of manual work every day." },
    { icon: Star, title: "Prompt Engineering", desc: "Master the art of talking to AI." },
  ];

  const reviews = [
    { name: "Rahul S.", text: "Best investment of ₹29! Saved me hours of research." },
    { name: "Priya M.", text: "The prompt engineering section is absolute gold for students." },
    { name: "Ankit V.", text: "Exactly what I needed to stay updated with AI trends." },
    { name: "Sneha K.", text: "Launched my portfolio in one day thanks to the builder guide!" },
    { name: "Vikram R.", text: "Clear, concise, and highly practical. Every tool is a winner." },
    { name: "Deepa T.", text: "The ultimate AI cheat sheet. Highly recommended!" },
    { name: "Karan P.", text: "Amazing value for money. The video tools are mind-blowing." },
    { name: "Neha L.", text: "Simplified complex AI concepts for me. Great for beginners." },
    { name: "Arjun M.", text: "A must-have for every engineering student in 2026." },
    { name: "Sonia G.", text: "Practical examples made it so easy to implement these tools." },
  ];

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-12 pb-16 sm:pt-20 sm:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Centered Title */}
          <div 
            className="text-center mb-12 sm:mb-16"
          >
            <div className="relative inline-block">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-black tracking-tighter mb-2 text-white">
                Top 50 AI Tools
              </h1>
            </div>
            <p className="text-xs sm:text-sm font-black text-brand-accent uppercase tracking-[0.5em] mt-2 opacity-80">E-BOOK</p>
          </div>

          <div className="flex flex-col lg:grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Image Section */}
            <div
              className="relative z-10 w-full order-1 lg:order-2 max-w-sm sm:max-w-md mx-auto lg:max-w-none"
            >
              <ProductCarousel />
              
              {/* Floating Badge */}
              <div
                className="absolute -top-2 -right-1 sm:-top-4 sm:-right-2 bg-white text-brand-bg px-3 py-2 rounded-xl shadow-lg flex flex-col items-center z-30"
              >
                <p className="text-[10px] font-bold uppercase text-gray-400 line-through">₹149</p>
                <p className="text-lg sm:text-xl font-black leading-none">₹29</p>
                <p className="text-[10px] font-bold text-emerald-600">80% OFF</p>
              </div>
            </div>

            {/* Text Section */}
            <div
              className="w-full order-2 lg:order-1 text-center lg:text-left"
            >
              <div className="inline-flex items-center space-x-2 bg-emerald-900/20 border border-emerald-500/20 px-4 py-1.5 rounded-full mb-6 mx-auto lg:mx-0">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-500">Official Bestseller</span>
              </div>
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold leading-tight mb-6 tracking-tight text-white">
                Master the Future with <span className="text-brand-accent">Practical</span> AI Guides
              </h2>
              <p className="text-base sm:text-lg text-gray-400 mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0">
                The Ultimate Handbook for Engineers and Students. A Practical Guide to the Most Powerful AI Tools of the Modern Era.
              </p>
              
              <div className="flex flex-col items-center lg:items-start space-y-8">
                <button
                  onClick={handlePurchase}
                  className="w-full sm:w-auto bg-brand-accent text-white px-8 sm:px-12 py-5 rounded-2xl text-lg sm:text-xl font-black shadow-xl flex items-center justify-center space-x-4 group cursor-pointer"
                >
                  <div className="flex flex-col items-start leading-tight">
                    <span className="text-xs opacity-70 line-through">₹149</span>
                    <span>Buy Now for ₹29</span>
                  </div>
                  <span
                    className="text-2xl"
                  >
                    →
                  </span>
                </button>
                
                <div className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center space-x-4">
                    <div className="flex -space-x-3">
                      {[1, 2, 3, 4].map((i) => (
                        <img
                          key={i}
                          src={`https://picsum.photos/seed/user${i}/100/100`}
                          alt="User"
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-brand-bg shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                      ))}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm sm:text-base text-gray-300 font-bold">{buyerCount.toLocaleString()}+ Buyers</span>
                      <div className="flex text-yellow-400">
                        {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-500 font-black mt-4 tracking-widest uppercase bg-emerald-900/20 px-3 py-1 rounded-full">🔥 80% OFF - LIMITED EDITION</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-12 bg-brand-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-center space-x-5 p-6 sm:p-8 rounded-3xl bg-brand-bg border border-white/5 shadow-md">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="text-blue-500 w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black">{buyerCount.toLocaleString()}+</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">Happy Students</p>
              </div>
            </div>
            <div className="flex items-center space-x-5 p-6 sm:p-8 rounded-3xl bg-brand-bg border border-white/5 shadow-md">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Star className="text-yellow-500 w-6 h-6 sm:w-7 sm:h-7 fill-current" />
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black">4.8/5</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">Average Rating</p>
              </div>
            </div>
            <div className="flex items-center space-x-5 p-6 sm:p-8 rounded-3xl bg-brand-bg border border-white/5 shadow-md sm:col-span-2 lg:col-span-1">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="text-emerald-500 w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-black">Secure</p>
                <p className="text-xs sm:text-sm text-gray-400 font-medium">Lifetime Access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">What's Inside?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-10 text-base sm:text-lg px-4">Comprehensive guides for the most powerful AI tools available today.</p>
            
            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative group px-2 sm:px-0" ref={searchRef}>
              <div className="absolute inset-y-0 left-0 pl-6 sm:pl-8 flex items-center pointer-events-none">
                <Globe className="h-5 w-5 text-gray-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search tools or topics..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                className="block w-full pl-14 sm:pl-16 pr-6 py-5 bg-brand-card border border-white/10 rounded-[2rem] text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-brand-accent/20 focus:border-brand-accent transition-all shadow-xl text-lg"
              />

              {/* Suggestions Dropdown */}
              {showSuggestions && searchQuery && (
                <div
                  className="absolute z-50 left-2 right-2 sm:left-0 sm:right-0 mt-3 bg-[#0f172a] border border-white/10 rounded-2xl shadow-xl max-h-[350px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10"
                >
                  {suggestions.length > 0 ? (
                    <ul className="py-3">
                      {suggestions.map((tool, i) => (
                        <li
                          key={i}
                          onClick={() => {
                            setSearchQuery(tool);
                            setShowSuggestions(false);
                          }}
                          className="px-6 py-4 hover:bg-white/5 cursor-pointer text-base text-gray-300 hover:text-white transition-colors border-b border-white/5 last:border-0 text-left flex items-center space-x-3"
                        >
                          <div className="w-2 h-2 rounded-full bg-brand-accent/40" />
                          <span>{highlightMatch(tool, searchQuery)}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="px-6 py-8 text-center text-base text-gray-500 italic">
                      No tools found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {allTools.map((feature, i) => (
              <div 
                key={i} 
                className="p-8 sm:p-10 rounded-3xl bg-brand-card border border-white/5 hover:border-brand-accent/30 transition-all group hover:shadow-lg"
              >
                <div className="w-14 h-14 bg-brand-accent/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-105 transition-transform group-hover:bg-brand-accent/20">
                  <feature.icon className="text-brand-accent w-7 h-7" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 text-sm sm:text-base leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Slider */}
      <section id="testimonials" className="py-20 bg-brand-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">Loved by Thousands</h2>
            <p className="text-gray-400 text-base sm:text-lg">Real feedback from real students and professionals.</p>
          </div>
          
          <div className="max-w-4xl mx-auto px-4">
            <div className="reviews-container">
              {reviews.map((t, i) => (
                <div key={i} className="review-card">
                  <div className="flex text-yellow-400 mb-6">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <div className="relative flex-1">
                    <Quote className="absolute -top-2 -left-2 w-8 h-8 text-white/5 -z-0" />
                    <p className="text-gray-300 italic mb-6 text-base leading-relaxed relative z-10">
                      "{t.text}"
                    </p>
                  </div>
                  <div className="flex items-center space-x-3 mt-auto">
                    <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center text-xs font-black text-brand-accent">
                      {t.name.charAt(0)}
                    </div>
                    <p className="font-bold text-sm text-white">— {t.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Author Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-brand-card rounded-[3rem] p-8 sm:p-16 border border-white/5 flex flex-col lg:flex-row items-center gap-10 lg:gap-20 shadow-xl">
            <div className="flex -space-x-8 sm:-space-x-12">
              <img src="https://picsum.photos/seed/indian-tech-student-male/400/400" alt="Sane Laksmidhar Reddy" className="w-28 h-28 sm:w-48 sm:h-48 rounded-full border-4 sm:border-8 border-brand-card shadow-lg object-cover" referrerPolicy="no-referrer" />
              <img src="https://picsum.photos/seed/indian-tech-student-female/400/400" alt="Vimal Vinitha" className="w-28 h-28 sm:w-48 sm:h-48 rounded-full border-4 sm:border-8 border-brand-card shadow-lg object-cover" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1 text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-6">Meet the Creators</h2>
              <div className="grid sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-brand-bg/50 p-5 rounded-2xl border border-white/5">
                  <p className="text-lg font-black text-brand-accent mb-1">Sane Laksmidhar Reddy</p>
                  <p className="text-gray-400 text-xs font-medium">Tech Innovator & AI Developer</p>
                </div>
                <div className="bg-brand-bg/50 p-5 rounded-2xl border border-white/5">
                  <p className="text-lg font-black text-brand-accent mb-1">Vimal Vinitha</p>
                  <p className="text-gray-400 text-xs font-medium">AI Enthusiast & Creative Thinker</p>
                </div>
              </div>
              <p className="text-gray-400 leading-relaxed text-base sm:text-lg mb-8">
                Passionate about AI and innovation, we aim to simplify powerful tools for students and creators through practical, real-world solutions.
              </p>
              <div className="inline-flex items-center space-x-3 bg-emerald-500/10 text-emerald-500 px-6 py-3 rounded-full font-bold text-sm sm:text-base">
                <Zap className="w-5 h-5 fill-current" />
                <span>Trusted by 3500+ learners 🚀</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 pb-32 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-brand-accent/10 p-1 rounded-[3rem]">
            <div className="bg-brand-card rounded-[2.75rem] p-8 sm:p-16 border border-white/10 shadow-xl">
              <h2 className="text-4xl sm:text-5xl font-black mb-6 tracking-tight">Get Instant Access</h2>
              <p className="text-gray-400 mb-10 text-base sm:text-lg">Join {buyerCount.toLocaleString()}+ others mastering AI today.</p>
              
              <div className="flex items-center justify-center space-x-6 mb-10">
                <span className="text-3xl sm:text-4xl text-gray-500 line-through font-bold">₹149</span>
                <span className="text-6xl sm:text-8xl font-black text-white">₹29</span>
              </div>
              
              <div className="inline-block bg-orange-500/10 text-orange-500 px-6 py-3 rounded-full text-sm sm:text-base font-black mb-12 animate-pulse uppercase tracking-widest border border-orange-500/20">
                🔥 Limited Time Offer
              </div>

              <button
                onClick={handlePurchase}
                className="block w-full bg-brand-accent hover:bg-blue-600 text-white py-6 sm:py-7 rounded-[2rem] text-xl sm:text-2xl font-black transition-all shadow-xl shadow-blue-500/20 mb-8 cursor-pointer active:scale-[0.98]"
              >
                Unlock Now for ₹29
              </button>
              
              <div className="flex flex-col items-center justify-center space-y-6 text-sm sm:text-base text-gray-400">
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-10">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    <span className="font-medium">Instant Access</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Button for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] p-4 bg-brand-bg border-t border-white/10 shadow-lg">
        <button
          onClick={handlePurchase}
          className="flex w-full items-center justify-between bg-brand-accent text-white px-8 py-5 rounded-2xl shadow-lg font-black text-xl cursor-pointer active:scale-95 transition-transform"
        >
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs opacity-70 line-through">₹149</span>
            <span>Buy Now for ₹29</span>
          </div>
          <Zap className="w-7 h-7 fill-current" />
        </button>
      </div>

      <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>© 2026 AI Tools Handbook Store. All rights reserved.</p>
      </footer>
    </div>
  );
}
