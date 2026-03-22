import React from "react";
import { Brain } from "lucide-react";

export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Brain className="text-white w-6 h-6" />
        </div>
        <div
          className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-brand-bg"
        />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xl font-black tracking-tighter text-white">AI TOOLS</span>
        <span className="text-[10px] font-bold tracking-[0.2em] text-blue-400 uppercase">Handbook</span>
      </div>
    </div>
  );
}
