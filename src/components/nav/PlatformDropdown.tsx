import { ArrowRight, Code, MessageSquare, Bot, Search, Play, Building } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

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
          <Link to="/model-library" className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
            For AI Natives
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
          <Link to="/contact" className="flex items-center justify-between py-4 border-b border-white/5 text-sm text-white hover:text-white transition-all group">
            For Enterprises
            <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </Link>
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

      {/* Testimonial Spotlight */}
      <div className="flex-1 p-12 bg-[#111111] flex flex-col justify-between">
        <div className="space-y-6">
          <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#FF6B35]">What They Say</span>
          <p className="text-xl text-white/90 leading-relaxed font-heading font-medium tracking-tight">
            "Helios gave us the infrastructure to scale from prototype to production in weeks, not months."
          </p>
        </div>

        <div className="flex items-center gap-4 mt-8 pt-8 border-t border-white/5">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#FF6B35]/20 to-[#FF6B35]/5 rounded-full flex items-center justify-center">
            <span className="text-[#FF6B35] font-bold text-sm">AI</span>
          </div>
          <div>
            <p className="text-xs font-bold text-white">AI Infrastructure Lead</p>
            <p className="text-[10px] font-mono uppercase tracking-widest text-white/60">Fortune 500 Company</p>
          </div>
        </div>
      </div>
    </div>
  );
};