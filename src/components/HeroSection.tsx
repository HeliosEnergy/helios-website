import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 hero-grid opacity-40" />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground tracking-tight leading-[1.1]">
              Build. Tune. Scale.
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
              Open-source AI models at blazing speed, optimized for your use case, scaled globally with the Fireworks Inference Cloud
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button variant="hero" size="lg" className="gap-2">
                Get Started
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button variant="heroOutline" size="lg">
                Talk to Our Team
              </Button>
            </div>
          </div>

          {/* Geometric Pattern */}
          <div className="relative hidden lg:block animate-fade-in-delay-2">
            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-transparent to-transparent blur-3xl" />
            <GeometricPattern />
          </div>
        </div>
      </div>
    </section>
  );
};

const GeometricPattern = () => {
  const tiles = [
    { opacity: 0.9, delay: "0ms" },
    { opacity: 0.7, delay: "50ms" },
    { opacity: 0.5, delay: "100ms" },
    { opacity: 0.8, delay: "150ms" },
    { opacity: 0.6, delay: "200ms" },
    { opacity: 0.4, delay: "250ms" },
    { opacity: 0.7, delay: "100ms" },
    { opacity: 0.5, delay: "150ms" },
    { opacity: 0.9, delay: "200ms" },
    { opacity: 0.6, delay: "250ms" },
    { opacity: 0.8, delay: "300ms" },
    { opacity: 0.4, delay: "350ms" },
    { opacity: 0.5, delay: "200ms" },
    { opacity: 0.7, delay: "250ms" },
    { opacity: 0.6, delay: "300ms" },
    { opacity: 0.9, delay: "350ms" },
    { opacity: 0.4, delay: "400ms" },
    { opacity: 0.8, delay: "450ms" },
  ];

  return (
    <div className="relative w-full aspect-square max-w-lg ml-auto">
      <div className="grid grid-cols-6 gap-2 transform rotate-6 scale-90">
        {tiles.map((tile, i) => (
          <div
            key={i}
            className="aspect-square rounded-lg transition-all duration-500"
            style={{
              backgroundColor: `hsl(262 83% 58% / ${tile.opacity})`,
              animationDelay: tile.delay,
            }}
          />
        ))}
      </div>
      {/* Additional floating tiles */}
      <div className="absolute top-1/4 -left-8 w-16 h-16 rounded-lg bg-primary/30 transform -rotate-12" />
      <div className="absolute bottom-1/3 -right-4 w-12 h-12 rounded-lg bg-primary/50 transform rotate-6" />
      <div className="absolute bottom-1/4 left-1/4 w-20 h-20 rounded-lg bg-primary/20 transform rotate-3" />
    </div>
  );
};
