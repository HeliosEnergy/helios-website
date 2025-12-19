import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

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

          {/* Geometric Pattern */}
          <div className="relative hidden lg:block animate-fade-in-delay-2">
            <GeometricPattern />
          </div>
        </div>
      </div>
    </section>
  );
};

const GeometricPattern = () => {
  const rows = [
    [0.9, 0.7, 0.5, 0.8, 0.6],
    [0.7, 0.9, 0.6, 0.5, 0.8],
    [0.5, 0.6, 0.8, 0.9, 0.7],
    [0.8, 0.5, 0.7, 0.6, 0.9],
  ];

  return (
    <div className="relative w-full max-w-md ml-auto">
      <div className="grid gap-3 transform -rotate-6">
        {rows.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-3 justify-end" style={{ paddingRight: `${rowIndex * 20}px` }}>
            {row.map((opacity, colIndex) => (
              <div
                key={colIndex}
                className="w-16 h-16 transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: `hsl(48 96% 53% / ${opacity})`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* Floating tiles */}
      <div className="absolute -top-4 left-12 w-12 h-12 bg-primary/20 transform rotate-12" />
      <div className="absolute bottom-8 -left-4 w-14 h-14 bg-primary/30 transform -rotate-6" />
    </div>
  );
};
