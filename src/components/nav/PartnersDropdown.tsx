import { Cloud, Users, Settings } from "lucide-react";

export const PartnersDropdown = () => {
  return (
    <div className="grid grid-cols-2 gap-0 p-0 bg-background border border-border min-w-[700px]">
      {/* Partnerships */}
      <div className="p-8 border-r border-border">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Partnerships
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          From CSPs to GPU providers, Helios works with all of the strategic vendors to ensure you have the environment you need
        </p>
        
        <h4 className="text-primary font-mono text-xs uppercase tracking-wider mb-4">
          Partnership Types
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <a href="#" className="flex flex-col items-start gap-2 text-sm text-foreground hover:text-primary transition-colors">
            <Cloud className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs">Cloud and Infrastructure</span>
          </a>
          <a href="#" className="flex flex-col items-start gap-2 text-sm text-foreground hover:text-primary transition-colors">
            <Users className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs">Consulting and Services</span>
          </a>
          <a href="#" className="flex flex-col items-start gap-2 text-sm text-foreground hover:text-primary transition-colors">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <span className="text-xs">Technology</span>
          </a>
        </div>
      </div>

      {/* Helios for Startups */}
      <div className="p-8">
        <h3 className="text-primary font-mono text-xs uppercase tracking-wider mb-3">
          Helios for Startups
        </h3>
        <p className="text-sm text-muted-foreground mb-6">
          Access exclusive tools and services to help you accelerate AI development and production at scale
        </p>
        <a 
          href="#" 
          className="mt-4 block w-full py-3 bg-primary/10 text-primary text-center text-sm font-mono uppercase tracking-wider hover:bg-primary/20 transition-colors"
        >
          Join Program
        </a>
      </div>
    </div>
  );
};
