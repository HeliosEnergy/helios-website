import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const CTASection = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
          Start building today
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg mx-auto">
          Instantly run popular and specialized models.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="secondary" size="lg" className="gap-2 font-mono uppercase tracking-wider text-xs font-semibold">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="lg" className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 font-mono uppercase tracking-wider text-xs font-semibold">
            Talk to an Expert
          </Button>
        </div>
      </div>
    </section>
  );
};
