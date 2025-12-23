import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { IsometricGPUAnimation, AnimationPhase } from "./hero/IsometricGPUAnimation";
import { useState, useEffect } from "react";

const phaseContent: Record<AnimationPhase, { title: string; subtitle: string }> = {
  'containers-drop': {
    title: 'Scale as you need',
    subtitle: 'Deploy GPU containers instantly. Add capacity on demand.',
  },
  'containers-hold': {
    title: 'Scale as you need',
    subtitle: 'Deploy GPU containers instantly. Add capacity on demand.',
  },
  'containers-fall': {
    title: 'Scale as you need',
    subtitle: 'Deploy GPU containers instantly. Add capacity on demand.',
  },
  'maxima': {
    title: 'Fine-tune at scale',
    subtitle: 'Train and optimize models with enterprise-grade infrastructure.',
  },
  'inference': {
    title: 'Inference at scale',
    subtitle: 'Serve millions of requests with low latency across the globe.',
  },
};

export const HeroSection = () => {
  const { data: hero, isLoading } = useSanityQuery<any>('hero-section', QUERIES.heroSection);
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>('containers-drop');
  const [displayContent, setDisplayContent] = useState(phaseContent['containers-drop']);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const newContent = phaseContent[currentPhase];
    if (newContent.title !== displayContent.title) {
      setIsTransitioning(true);
      setTimeout(() => {
        setDisplayContent(newContent);
        setIsTransitioning(false);
      }, 300);
    }
  }, [currentPhase, displayContent.title]);

  return (
    <section className="relative overflow-hidden bg-background">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="animate-fade-in-up">
            {/* Dynamic Phase Text */}
            <div className="mb-8 min-h-[120px]">
              <h2 
                className={`text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-primary tracking-tight leading-[1.1] transition-all duration-300 ${
                  isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {displayContent.title}
              </h2>
              <p 
                className={`mt-3 text-lg text-muted-foreground transition-all duration-300 delay-75 ${
                  isTransitioning ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                }`}
              >
                {displayContent.subtitle}
              </p>
            </div>

            {/* Main Heading from Sanity */}
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
            <IsometricGPUAnimation onPhaseChange={setCurrentPhase} />
          </div>
        </div>
      </div>
    </section>
  );
};
