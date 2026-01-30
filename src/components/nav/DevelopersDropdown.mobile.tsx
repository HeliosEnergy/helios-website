import { BookOpen, FileCode, Terminal } from "lucide-react";
import { Link } from "react-router-dom";

export const DevelopersDropdownMobile = () => {
  return (
    <div className="space-y-4 py-4">
      <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] px-4">
        Toolkit
      </h4>
      <Link to="#" className="block px-4 py-3 text-sm text-white/70 hover:text-white transition-colors border-b border-white/5">
        SDK
      </Link>
      <Link to="#" className="block px-4 py-3 text-sm text-white/70 hover:text-white transition-colors border-b border-white/5">
        EvalProtocol
      </Link>
      <Link to="#" className="block px-4 py-3 text-sm text-white/70 hover:text-white transition-colors border-b border-white/5">
        Voice Agent
      </Link>

      <h4 className="text-white/40 font-mono text-[10px] uppercase tracking-[0.3em] px-4 mt-4">
        Resources
      </h4>
      <div className="space-y-2 px-4">
        {[
          { icon: BookOpen, label: "Docs" },
          { icon: FileCode, label: "API Reference" },
          { icon: Terminal, label: "CLI Tool" },
        ].map((item) => (
          <Link key={item.label} to="#" className="flex items-center gap-3 py-2 text-xs text-white/60 hover:text-white transition-colors">
            <item.icon className="w-4 h-4 opacity-30" />
            {item.label}
          </Link>
        ))}
      </div>

      <Link to="#" className="block mx-4 mt-4 py-2 px-4 text-center text-xs font-mono font-bold text-black bg-white rounded-lg hover:bg-white/90 transition-colors">
        Get Started
      </Link>
    </div>
  );
};
