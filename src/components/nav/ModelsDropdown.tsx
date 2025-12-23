import { Sparkles, Server, Brain, Image, AudioLines, Eye } from "lucide-react";

export const ModelsDropdown = () => {
  return (
    <div className="grid grid-cols-3 gap-0 p-0 bg-background border border-border min-w-[900px]">
      {/* Model Types */}
      <div className="p-8 border-r border-border">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Model Types
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Browse models by category to find the right fit for your use case
        </p>
         <div className="grid grid-cols-2 gap-4">
           <a href="/model-library?filter=featured" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <Sparkles className="w-4 h-4 text-muted-foreground" />
             Featured Models
           </a>
           <a href="/model-library?filter=serverless" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <Server className="w-4 h-4 text-muted-foreground" />
             Serverless
           </a>
           <a href="/model-library?filter=LLM" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <Brain className="w-4 h-4 text-muted-foreground" />
             LLM
           </a>
           <a href="/model-library?filter=Image" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <Image className="w-4 h-4 text-muted-foreground" />
             Image
           </a>
           <a href="/model-library?filter=Audio" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <AudioLines className="w-4 h-4 text-muted-foreground" />
             Audio
           </a>
           <a href="/model-library?filter=Vision" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <Eye className="w-4 h-4 text-muted-foreground" />
             Vision
           </a>
         </div>
      </div>

      {/* Featured Providers */}
      <div className="p-8 border-r border-border">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Featured Providers
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Discover top model providers powering Helios AI
        </p>
         <div className="grid grid-cols-2 gap-4">
           <a href="/model-library?filter=provider:Qwen" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center text-primary">✦</span>
             Qwen
           </a>
           <a href="/model-library?filter=provider:OpenAI" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center">⬡</span>
             OpenAI
           </a>
           <a href="/model-library?filter=provider:Moonshot AI" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center text-primary">☾</span>
             Moonshot AI
           </a>
           <a href="/model-library?filter=provider:Meta" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center text-primary">∞</span>
             Meta
           </a>
           <a href="/model-library?filter=provider:DeepSeek" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center text-blue-500">◇</span>
             DeepSeek
           </a>
           <a href="/model-library?filter=provider:Z.ai" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center">Z</span>
             Z.ai
           </a>
         </div>
      </div>

      {/* 400+ Models Supported */}
      <div className="p-8 flex flex-col">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          400+ Models Supported
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Explore our large Model Library with full support and integration
        </p>
        <div className="space-y-3 flex-1">
           <a href="/model-library/glm-4-6" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center bg-primary/10 text-primary text-xs">Z</span>
             GLM-4.6
           </a>
           <a href="/model-library/deepseek-v3-1-terminus" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center text-blue-500">◇</span>
             DeepSeek V3.1 Terminus
           </a>
           <a href="/model-library/kimi-k2-instruct-0905" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
             <span className="w-5 h-5 flex items-center justify-center text-primary">☾</span>
             Kimi K2 Instruct 0905
           </a>
        </div>
        <a
          href="/model-library"
          className="mt-6 block w-full py-3 bg-primary/10 text-primary text-center text-sm font-mono uppercase tracking-wider hover:bg-primary/20 transition-colors"
        >
          View All Models
        </a>
      </div>
    </div>
  );
};
