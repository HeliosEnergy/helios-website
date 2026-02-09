import { Sparkles, Server, Brain, Image, AudioLines, Eye, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const ModelsDropdown = () => {
  return (
    <div className="flex gap-0 p-0 min-w-[1000px] bg-transparent">
      {/* Model Types */}
      <div className="flex-1 p-12 space-y-10">
        <div>
          <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-6">
            Classification
          </h3>
          <p className="text-xl text-white/80 leading-relaxed font-light">
            The right architecture <br />for the task.
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-y-6 gap-x-8">
           {[
             { icon: Sparkles, label: "Featured", filter: "featured" },
             { icon: Brain, label: "LLM", filter: "LLM" },
             { icon: Eye, label: "Vision", filter: "Vision" },
             { icon: Image, label: "Image", filter: "Image" },
             { icon: AudioLines, label: "Audio", filter: "Audio" },
             { icon: Server, label: "Serverless", filter: "serverless" },
           ].map((item) => (
             <Link key={item.label} to={`/model-library?filter=${item.filter}`} className="flex items-center gap-3 text-sm text-white/70 hover:text-white transition-colors group">
               <item.icon className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
               {item.label}
             </Link>
           ))}
        </div>
      </div>

      {/* Featured Providers */}
      <div className="flex-1 p-12 bg-white/[0.02] space-y-10">
        <h3 className="text-white/60 font-mono text-[10px] uppercase tracking-[0.4em] mb-8">
          The Ecosystem
        </h3>
        <div className="grid grid-cols-2 gap-y-6 gap-x-8">
           {[
             { symbol: "✦", label: "Qwen" },
             { symbol: "◇", label: "DeepSeek" },
             { symbol: "∞", label: "Meta" },
             { symbol: "⬡", label: "OpenAI" },
             { symbol: "G", label: "Google" },
             { symbol: "A", label: "Anthropic" },
           ].map((item) => (
             <Link key={item.label} to={`/model-library?filter=provider:${item.label}`} className="flex items-center gap-3 text-sm text-white hover:text-white group">
               <span className="w-5 h-5 flex items-center justify-center text-white/70 group-hover:text-primary transition-colors">{item.symbol}</span>
               {item.label}
             </Link>
           ))}
        </div>
      </div>

      {/* 400+ Models Supported */}
      <div className="flex-1 p-12 bg-[#111111] flex flex-col justify-between">
        <div className="space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#FF6B35]">Library</span>
            <h4 className="text-4xl font-heading font-bold tracking-tighter text-white">400+</h4>
            <p className="text-sm text-white/70 leading-relaxed">
              Models supported with <br />optimized inference.
            </p>
          </div>
          
          <div className="space-y-4 pt-4 border-t border-white/5">
            {[
              { name: "GLM-4.6", slug: "glm-4-6" },
              { name: "DeepSeek V3", slug: "deepseek-v3" },
              { name: "Kimi K2 Instruct", slug: "kimi-k2-instruct" }
            ].map(model => (
              <Link key={model.slug} to={`/model-library/${model.slug}`} className="flex items-center justify-between text-xs text-white/80 hover:text-white group transition-colors">
                {model.name}
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
        
        <a
          href="/model-library"
          className="mt-12 block w-full py-4 bg-white text-black text-center text-[10px] font-mono font-bold uppercase tracking-[0.3em] rounded-full hover:bg-white/90 transition-all hover:scale-[1.02]"
        >
          Explore All
        </a>
      </div>
    </div>
  );
};