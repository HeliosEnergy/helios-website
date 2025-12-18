import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const CTASection = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
          Start building today
        </h2>
        <p className="text-xl text-muted-foreground mb-10 max-w-lg mx-auto">
          Instantly run popular and specialized models.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="hero" size="lg" className="gap-2">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Button>
          <Button variant="heroOutline" size="lg">
            Talk to an Expert
          </Button>
        </div>
      </div>
    </section>
  );
};
