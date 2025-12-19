import { ArrowRight, Code, MessageSquare, Bot, Search, Play, Building } from "lucide-react";

export const PlatformDropdown = () => {
  return (
    <div className="grid grid-cols-3 gap-0 p-0 bg-background border border-border min-w-[900px]">
      {/* Virtual Cloud Infrastructure */}
      <div className="p-8 border-r border-border">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Virtual Cloud Infrastructure
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Accelerate your AI journey, from fast prototyping to production scale workloads
        </p>
        <div className="w-12 h-0.5 bg-primary mb-6" />
        <div className="space-y-4">
          <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group">
            For AI Natives
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
          <a href="#" className="flex items-center gap-2 text-sm text-foreground hover:text-primary transition-colors group">
            For Enterprises
            <ArrowRight className="w-4 h-4 text-primary group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      {/* Use Cases */}
      <div className="p-8 border-r border-border">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Use Cases
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          See how Helios AI powers real-world applications across industries
        </p>
        <div className="grid grid-cols-2 gap-4">
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <Code className="w-4 h-4 text-muted-foreground" />
            Code Assistance
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
            Conversational AI
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <Bot className="w-4 h-4 text-muted-foreground" />
            Agentic
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <Search className="w-4 h-4 text-muted-foreground" />
            Search
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <Play className="w-4 h-4 text-muted-foreground" />
            Multimedia
          </a>
          <a href="#" className="flex items-center gap-3 text-sm text-foreground hover:text-primary transition-colors">
            <Building className="w-4 h-4 text-muted-foreground" />
            Enterprise RAG
          </a>
        </div>
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
            Our Customers
          </h3>
          <p className="text-sm text-muted-foreground">
            Discover how leading companies are building and scaling on Helios
          </p>
        </div>
      </div>

      {/* Testimonial */}
      <div className="p-8 bg-surface">
        <h2 className="font-heading text-3xl text-muted-foreground/30 mb-4">CURSOR</h2>
        <p className="text-sm text-foreground mb-6 leading-relaxed">
          "Helios has been an amazing partner getting our Fast Apply and Copilot++ models running performantly. They exceeded other competitors we reviewed on performance. After testing their quantized model quality for our use cases, we have found minimal degradation. Helios helps implement task specific speed ups and new architectures, allowing us to achieve bleeding edge performance!"
        </p>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-full" />
          <div>
            <p className="text-sm font-medium">Sualeh Asif</p>
            <p className="text-xs text-muted-foreground">CPO</p>
          </div>
        </div>
      </div>
    </div>
  );
};
