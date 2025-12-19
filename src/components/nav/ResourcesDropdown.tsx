import { ArrowRight } from "lucide-react";

export const ResourcesDropdown = () => {
  return (
    <div className="grid grid-cols-2 gap-0 p-0 bg-background border border-border min-w-[800px]">
      {/* Resources */}
      <div className="p-8 border-r border-border">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Resources
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Find the guides, tools, and insights to help you get the most from Helios
        </p>
        <div className="space-y-0">
          <a href="#" className="flex items-center justify-between py-4 border-b border-border text-sm text-foreground hover:text-primary transition-colors group">
            Blog
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#" className="flex items-center justify-between py-4 border-b border-border text-sm text-foreground hover:text-primary transition-colors group">
            Events
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#" className="flex items-center justify-between py-4 border-b border-border text-sm text-foreground hover:text-primary transition-colors group">
            Documentation
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#" className="flex items-center justify-between py-4 border-b border-border text-sm text-foreground hover:text-primary transition-colors group">
            Demos
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#" className="flex items-center justify-between py-4 text-sm text-foreground hover:text-primary transition-colors group">
            Cookbooks
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Featured Resources */}
      <div className="p-8">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Featured Resources
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Highlighted resources to help you learn, build, and scale
        </p>
        <div className="space-y-4">
          <a href="#" className="flex gap-4 p-3 border border-border hover:border-primary transition-colors group">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
              <span className="text-xs text-primary font-mono">CLAUDE CODE</span>
            </div>
            <div>
              <span className="text-primary font-mono text-xs uppercase tracking-wider">Blog</span>
              <h4 className="text-sm font-medium mt-1 group-hover:text-primary transition-colors">
                LLM Eval Driven Development with Claude Code
              </h4>
              <p className="text-xs text-muted-foreground mt-1">by Helios Team</p>
            </div>
          </a>
          <a href="#" className="flex gap-4 p-3 border border-border hover:border-primary transition-colors group">
            <div className="w-20 h-20 bg-gradient-to-br from-primary/30 to-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xs text-primary font-mono text-center px-2">AI Benchmark</span>
            </div>
            <div>
              <span className="text-primary font-mono text-xs uppercase tracking-wider">Blog</span>
              <h4 className="text-sm font-medium mt-1 group-hover:text-primary transition-colors">
                Your AI Benchmark is Lying to You. Here's How We Caught It
              </h4>
              <p className="text-xs text-muted-foreground mt-1">by Helios Team</p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};
