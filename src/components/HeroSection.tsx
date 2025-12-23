import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { IsometricGPUAnimation } from "./hero/IsometricGPUAnimation";

export const HeroSection = () => {
  const { data: hero, isLoading } = useSanityQuery<any>('hero-section', QUERIES.heroSection);

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in-up">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-foreground tracking-tight leading-[1.1]">
              {isLoading ? "Loading..." : hero?.heading}
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              {isLoading ? "Please wait while we fetch content." : hero?.description}
            </p>
            {!isLoading && (
              <div className="mt-8 flex flex-wrap gap-4">
                <Button variant="hero" size="lg" className="gap-2" asChild>
                  <a href={hero?.primaryCtaLink || "#"}>
                    {hero?.primaryCtaText}
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </Button>
                {hero?.secondaryCtaText && (
                  <Button variant="heroOutline" size="lg" asChild>
                    <a href={hero?.secondaryCtaLink || "#"}>
                      {hero?.secondaryCtaText}
                    </a>
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Isometric 3D GPU Animation */}
          <div className="relative hidden lg:block animate-fade-in-delay-2">
            <IsometricGPUAnimation />
          </div>
        </div>
      </div>
    </section>
  );
};
