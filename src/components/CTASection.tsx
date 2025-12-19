import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

export const CTASection = () => {
  const { data: cta, isLoading } = useSanityQuery<any>('cta-section', QUERIES.ctaSection);

  return (
    <section className="py-20 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-4">
          {isLoading ? "Loading..." : cta?.heading}
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg mx-auto">
          {isLoading ? "" : cta?.description}
        </p>
        {!isLoading && (
          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="secondary" size="lg" className="gap-2 font-mono uppercase tracking-wider text-xs font-semibold" asChild>
              <a href={cta?.primaryCtaLink || "#"}>
                {cta?.primaryCtaText}
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            {cta?.secondaryCtaText && (
              <Button variant="ghost" size="lg" className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 font-mono uppercase tracking-wider text-xs font-semibold" asChild>
                <a href={cta?.secondaryCtaLink || "#"}>
                  {cta?.secondaryCtaText}
                </a>
              </Button>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
