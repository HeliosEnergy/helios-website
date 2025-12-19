import { ArrowRight, BookOpen, FileCode, Terminal, List, Twitter, Youtube, Linkedin, MessageCircle } from "lucide-react";

export const DevelopersDropdown = () => {
  return (
    <div className="grid grid-cols-3 gap-0 p-0 bg-background border border-border min-w-[900px]">
      {/* Developer Toolkit */}
      <div className="p-8 border-r border-border flex flex-col">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Developer Toolkit
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Use our comprehensive SDKs to build prototypes, evaluate quality, and scale with confidence
        </p>
        <div className="space-y-4 flex-1">
          <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group">
            SDK
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group">
            EvalProtocol
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group">
            Voice Agent
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
        <a 
          href="#" 
          className="mt-6 block w-full py-3 bg-primary text-primary-foreground text-center text-sm font-mono uppercase tracking-wider hover:bg-primary/90 transition-colors"
        >
          Get Started
        </a>
      </div>

      {/* Documentation & Lifecycle */}
      <div className="p-8 border-r border-border">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Documentation
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Access detailed guides and references to build with Helios
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            Docs
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <FileCode className="w-4 h-4 text-muted-foreground" />
            API
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            CLI
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <List className="w-4 h-4 text-muted-foreground" />
            Changelog
          </a>
        </div>
        
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-4">
          Model Lifecycle Management
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <h4 className="font-medium text-sm mb-2">Build</h4>
            <div className="space-y-2">
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">LLMs</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Multimedia</a>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Tune</h4>
            <div className="space-y-2">
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">SFT</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">RFT</a>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-sm mb-2">Scale</h4>
            <div className="space-y-2">
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Serverless</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">On-demand</a>
              <a href="#" className="block text-xs text-muted-foreground hover:text-primary transition-colors">Reserved</a>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Further */}
      <div className="p-8">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Explore Further
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Experiment, test, and bring your AI ideas to life instantly
        </p>
        <div className="space-y-4">
          <a href="#" className="block text-sm text-foreground hover:text-primary transition-colors">
            Deploy and Interact in Playground
          </a>
          <a href="#" className="block text-sm text-foreground hover:text-primary transition-colors">
            Fine-Tune Your Model
          </a>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-4">
            Connect With Us
          </h3>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
