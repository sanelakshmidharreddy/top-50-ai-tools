import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { Cpu, Code, BarChart, Video, CheckCircle2, Star } from "lucide-react";

// Slide Components (kept from original for content)
const Slide1Cover = () => (
  <div className="w-full h-full bg-[#020617] text-white p-6 sm:p-8 flex flex-col items-center justify-center relative overflow-hidden font-poppins border-4 border-[#0f172a] rounded-lg">
    <div className="z-10 text-center flex flex-col items-center h-full">
      <div className="bg-[#d4af37] text-black px-3 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest mb-3 sm:mb-4">
        Bestseller AI Handbook
      </div>
      <h1 className="text-2xl sm:text-3xl font-black mb-2 leading-tight tracking-tighter uppercase">
        Mastering the <span className="text-[#d4af37]">Top 50</span> AI Tools
      </h1>
      <p className="text-[10px] sm:text-[11px] text-gray-300 font-medium mb-4 sm:mb-6 max-w-[240px]">
        The Ultimate Handbook for Engineers and Students
        <br />
        <span className="text-blue-400">A Practical Guide to the Most Powerful AI Tools of the Modern Era</span>
      </p>
      <div className="flex space-x-3 sm:space-x-4 mb-6 sm:mb-8">
        <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        <Code className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        <BarChart className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
        <Video className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
      </div>
      <div className="mt-auto w-full border-t border-white/10 pt-3 sm:pt-4">
        <div className="text-[8px] sm:text-[10px] font-bold text-[#d4af37] uppercase tracking-[0.2em] mb-1 sm:mb-2">Limited Edition</div>
        <div className="flex justify-between items-end">
          <div className="text-left">
            <p className="text-[7px] sm:text-[8px] text-gray-500 uppercase font-black">Authors</p>
            <p className="text-[9px] sm:text-[10px] font-bold">Sane Laksmidhar Reddy</p>
            <p className="text-[9px] sm:text-[10px] font-bold">Vimal Vinitha</p>
          </div>
          <div className="text-right">
            <p className="text-[7px] sm:text-[8px] text-gray-500 font-black">2026</p>
            <p className="text-[8px] sm:text-[9px] font-bold text-blue-400">Learn • Build • Innovate</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Slide2Index1 = () => (
  <div className="w-full h-full bg-[#020617] text-white p-6 flex flex-col font-poppins border-4 border-[#0f172a] rounded-lg">
    <h2 className="text-sm font-black text-[#d4af37] mb-3 uppercase tracking-tighter border-b border-[#0f172a] pb-1">Index (1–13)</h2>
    <div className="flex-1 overflow-hidden">
      <table className="w-full text-[9px] border-collapse">
        <thead>
          <tr className="bg-[#0f172a] text-[#d4af37]">
            <th className="p-1 text-left border border-white/10">S.No</th>
            <th className="p-1 text-left border border-white/10">Tool Name</th>
            <th className="p-1 text-left border border-white/10">Category</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["1", "Replit Ghostwriter", "AI Coding Assistant"],
            ["2", "Uizard", "AI UI/UX Design"],
            ["3", "Durable", "AI Website Builder"],
            ["4", "HeyGen", "AI Video Generation"],
            ["5", "Descript", "AI Media Editing"],
            ["6", "Microsoft Power BI", "AI Data Analytics"],
            ["7", "Obviously AI", "AI Predictive Analytics"],
            ["8", "ChatGPT", "AI Conversational"],
            ["9", "Perplexity AI", "AI Research Assistant"],
            ["10", "Copyleaks AI", "AI Plagiarism Detection"],
            ["11", "Consensus", "AI Academic Research"],
            ["12", "Gamma", "AI Presentation Tool"],
            ["13", "Visme", "AI Visual Content"],
          ].map(([no, name, cat], i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
              <td className="p-1 border border-white/10 font-bold text-blue-400">{no}</td>
              <td className="p-1 border border-white/10 font-bold">{name}</td>
              <td className="p-1 border border-white/10 text-gray-400">{cat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Slide3Index2 = () => (
  <div className="w-full h-full bg-[#020617] text-white p-6 flex flex-col font-poppins border-4 border-[#0f172a] rounded-lg">
    <h2 className="text-sm font-black text-[#d4af37] mb-3 uppercase tracking-tighter border-b border-[#0f172a] pb-1">Index (14–26)</h2>
    <div className="flex-1 overflow-hidden">
      <table className="w-full text-[9px] border-collapse">
        <thead>
          <tr className="bg-[#0f172a] text-[#d4af37]">
            <th className="p-1 text-left border border-white/10">S.No</th>
            <th className="p-1 text-left border border-white/10">Tool Name</th>
            <th className="p-1 text-left border border-white/10">Category</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["14", "Notion AI", "AI Productivity"],
            ["15", "Taskade", "AI Task Management"],
            ["16", "GitHub Copilot", "AI Programming"],
            ["17", "Mutable AI", "AI Code Automation"],
            ["18", "MATLAB", "AI & ML Development"],
            ["19", "Luma AI", "AI 3D Creation"],
            ["20", "Scenario", "AI Game Assets"],
            ["21", "Pika", "AI Video Creation"],
            ["22", "Canva Magic Studio", "AI Graphic Design"],
            ["23", "Builder.ai", "AI App Development"],
            ["24", "Beautiful.ai", "AI Presentation"],
            ["25", "MonkeyLearn", "AI Text Analysis"],
            ["26", "V0.dev", "AI Web Development"],
          ].map(([no, name, cat], i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white/5" : ""}>
              <td className="p-1 border border-white/10 font-bold text-blue-400">{no}</td>
              <td className="p-1 border border-white/10 font-bold">{name}</td>
              <td className="p-1 border border-white/10 text-gray-400">{cat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const Slide4Highlight = () => (
  <div className="w-full h-full bg-[#020617] text-white p-8 flex flex-col font-poppins border-4 border-[#0f172a] rounded-lg relative overflow-hidden">
    <h2 className="text-xs font-black text-blue-400 uppercase tracking-widest mb-1">Tool Highlight</h2>
    <h1 className="text-3xl font-black text-[#d4af37] mb-6 uppercase tracking-tighter">NotebookLM</h1>
    <div className="bg-[#0f172a] border border-[#0f172a] p-6 rounded-2xl mb-6 shadow-lg">
      <h3 className="text-[10px] font-black uppercase text-[#d4af37] mb-2 tracking-widest">Category</h3>
      <p className="text-sm font-bold mb-4">AI Research & Note-Taking Assistant</p>
      <h3 className="text-[10px] font-black uppercase text-[#d4af37] mb-2 tracking-widest">Helps With</h3>
      <ul className="space-y-2">
        {["Analyzing documents", "Summarizing information", "Answering questions from sources", "Organizing research notes"].map((item, i) => (
          <li key={i} className="flex items-center space-x-2 text-xs">
            <CheckCircle2 className="w-3 h-3 text-blue-400" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

const Slide5Benefits = () => (
  <div className="w-full h-full bg-[#020617] text-white p-8 flex flex-col font-poppins border-4 border-[#0f172a] rounded-lg relative overflow-hidden">
    <h2 className="text-xl font-black text-[#d4af37] mb-1 uppercase tracking-tighter">The Ultimate AI Toolkit</h2>
    <p className="text-[10px] font-bold text-blue-400 mb-6 uppercase tracking-widest">Every Engineering Student Must Master</p>
    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-6">
      {[
        "Top 50 AI Tools", "Build Websites", "Create Videos", "Design PPTs", "Automate Tasks", "Write Code", "Research Pro", "Data Analysis"
      ].map((item, i) => (
        <div key={i} className="flex items-center space-x-2 text-[9px] font-bold">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
          <span>{item}</span>
        </div>
      ))}
    </div>
    <div className="mt-auto flex items-center justify-between">
      <div>
        <p className="text-[8px] text-gray-500 font-black uppercase">Authors</p>
        <p className="text-[9px] font-bold">Reddy & Vinitha</p>
      </div>
      <div className="bg-[#d4af37] text-black px-4 py-2 rounded-xl text-center shadow-md">
        <p className="text-[8px] font-black uppercase leading-none">Limited Edition</p>
        <p className="text-lg font-black leading-none mt-1">₹29</p>
      </div>
    </div>
    <div className="absolute top-4 right-4 flex space-x-0.5">
      {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-2 h-2 fill-[#d4af37] text-[#d4af37]" />)}
    </div>
  </div>
);

const slides = [
  <Slide1Cover />,
  <Slide2Index1 />,
  <Slide3Index2 />,
  <Slide4Highlight />,
  <Slide5Benefits />,
];

export default function ProductCarousel() {
  return (
    <div className="w-full max-w-md mx-auto bg-[#0f172a] p-2 sm:p-4 rounded-[2rem] shadow-xl border border-[#0f172a] overflow-hidden">
      <Swiper
        modules={[Pagination]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={true}
        pagination={{ clickable: true, dynamicBullets: true }}
        className="w-full aspect-[3/4] sm:aspect-square rounded-2xl overflow-hidden"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className="w-full h-full">
            <div className="w-full h-full p-1">
              {slide}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Mobile Swipe Indicator */}
      <div className="mt-4 flex justify-center">
        <div className="bg-[#0f172a] px-4 py-1.5 rounded-full">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Swipe to preview pages</span>
        </div>
      </div>
    </div>
  );
}
