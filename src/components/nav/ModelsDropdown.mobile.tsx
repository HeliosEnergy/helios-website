import { Sparkles, Brain, Image } from "lucide-react";
import { Link } from "react-router-dom";

export const ModelsDropdownMobile = () => {
  return (
    <div className="space-y-4 py-4">
      <h4 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.3em] px-4">
        Classification
      </h4>
      <div className="space-y-2 px-4">
        {[
          { icon: Sparkles, label: "Featured" },
          { icon: Brain, label: "Language" },
          { icon: Image, label: "Vision" },
        ].map((item) => (
          <Link key={item.label} to={`/model-library?filter=${item.label}`} className="flex items-center gap-3 py-2 text-xs text-white/60 hover:text-white transition-colors">
            <item.icon className="w-4 h-4 opacity-30" />
            {item.label}
          </Link>
        ))}
      </div>

      <h4 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.3em] px-4 mt-4">
        Providers
      </h4>
      <div className="space-y-2 px-4">
        {[
          { label: "OpenAI" },
          { label: "Meta" },
          { label: "DeepSeek" },
        ].map((item) => (
          <Link key={item.label} to={`/model-library?filter=provider:${item.label}`} className="py-2 text-xs text-white/60 hover:text-white transition-colors block">
            {item.label}
          </Link>
        ))}
      </div>

      <Link to="/model-library" className="block mx-4 mt-4 py-2 px-4 text-center text-xs font-mono font-bold text-black bg-white rounded-lg hover:bg-white/90 transition-colors">
        View All
      </Link>
    </div>
  );
};
