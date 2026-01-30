import { Code, MessageSquare, Bot } from "lucide-react";
import { Link } from "react-router-dom";

export const PlatformDropdownMobile = () => {
  return (
    <div className="space-y-4 py-4">
      <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] px-4">
        Infrastructure
      </h4>
      <Link to="#" className="block px-4 py-3 text-sm text-white/70 hover:text-white transition-colors border-b border-white/5 last:border-b-0">
        For AI Natives
      </Link>
      <Link to="#" className="block px-4 py-3 text-sm text-white/70 hover:text-white transition-colors border-b border-white/5 last:border-b-0">
        For Enterprises
      </Link>
      
      <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] px-4 mt-4">
        Capabilities
      </h4>
      <div className="space-y-2 px-4">
        {[
          { icon: Code, label: "Code Assistance" },
          { icon: MessageSquare, label: "Conversational AI" },
          { icon: Bot, label: "Agentic Systems" },
        ].map((item) => (
          <Link key={item.label} to="#" className="flex items-center gap-3 py-2 text-xs text-white/60 hover:text-white transition-colors">
            <item.icon className="w-4 h-4 opacity-30 group-hover:opacity-100" />
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
};
