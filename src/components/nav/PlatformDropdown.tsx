import { ArrowRight, Code, MessageSquare, Bot, Search, Play, Building } from "lucide-react";
import { motion } from "framer-motion";

export const PlatformDropdown = () => {
  return (
    <div className="flex gap-0 p-0 min-w-[1000px] bg-transparent">
      {/* Virtual Cloud Infrastructure */}
      <div className="flex-1 p-12 space-y-10">
        <div>
          <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
            Infrastructure
          </h3>
          <p className="text-xl text-white/80 leading-relaxed font-light">
            Fast prototyping to <br />production scale.
          </p>
        </div>
        
        <div className="space-y-6">
          <a href="#" className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
            For AI Natives
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
          <a href="#" className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
            For Enterprises
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </a>
        </div>
      </div>

      {/* Use Cases */}
      <div className="flex-[1.2] p-12 bg-white/[0.02]">
        <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
          Capabilities
        </h3>
        <div className="grid grid-cols-2 gap-x-12 gap-y-8">
          {[
            { icon: Code, label: "Code Assistance" },
            { icon: MessageSquare, label: "Conversational AI" },
            { icon: Bot, label: "Agentic Systems" },
            { icon: Search, label: "Semantic Search" },
            { icon: Play, label: "Multimedia" },
            { icon: Building, label: "Enterprise RAG" },
          ].map((item) => (
            <a key={item.label} href="#" className="flex items-center gap-4 text-sm text-white/70 hover:text-white transition-colors group">
              <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              {item.label}
            </a>
          ))}
        </div>
      </div>

      {/* The Moment of Warmth: Featured Partner */}
      <div className="flex-1 p-12 bg-[#111111] flex flex-col justify-between">
        <div className="space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#FF6B35]">Partner Spotlight</span>
          <h2 className="font-heading text-4xl font-bold tracking-tighter text-white/60 uppercase">CURSOR</h2>
          <p className="text-sm text-white/80 leading-relaxed italic">
            "Helios helps implement task specific speed ups and new architectures, allowing us to achieve bleeding edge performance."
          </p>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
          <div className="w-10 h-10 bg-gradient-to-tr from-white/10 to-white/5 rounded-full" />
          <div>
            <p className="text-xs font-bold text-white">Sualeh Asif</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">CPO, Cursor</p>
          </div>
        </div>
      </div>
    </div>
  );
};