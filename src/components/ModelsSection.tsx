import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState, useEffect } from "react";

const models = [
  {
    name: "Deepseek R1",
    provider: "DeepSeek",
    pricing: "$1.35/M Input • $5.4/M Output",
    context: "163840",
    type: "LLM",
    color: "bg-blue-500",
    initial: "D",
  },
  {
    name: "Llama 3 70B Instruct",
    provider: "Meta",
    pricing: "$0.9/M Tokens",
    context: "8192",
    type: "LLM",
    color: "bg-blue-600",
    initial: "M",
  },
  {
    name: "Gemma 3 27B Instruct",
    provider: "Google",
    pricing: "$0.9/M Tokens",
    context: "131072",
    type: "LLM",
    color: "bg-red-500",
    initial: "G",
  },
  {
    name: "FLUX.1 Kontext Pro",
    provider: "Flux",
    pricing: "$0.04/Image",
    context: null,
    type: "Image",
    color: "bg-gray-800",
    initial: "F",
  },
  {
    name: "Whisper V3 Large",
    provider: "OpenAI",
    pricing: "$0/M Tokens",
    context: null,
    type: "Audio",
    color: "bg-emerald-600",
    initial: "O",
  },
  {
    name: "Kimi K2 Instruct",
    provider: "Moonshot",
    pricing: "$0.6/M Input • $2.5/M Output",
    context: "131072",
    type: "LLM",
    color: "bg-purple-500",
    initial: "M",
  },
];

export const ModelsSection = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const ref = scrollRef.current;
    if (ref) {
      ref.addEventListener("scroll", checkScroll);
      return () => ref.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 280;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-surface border-y border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-12">
          <div>
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              Model Library
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-foreground">
              Run the latest open models with a single line of code
            </h2>
            <p className="mt-4 text-muted-foreground max-w-2xl">
              Helios gives you instant access to the most popular OSS models — optimized for cost, speed, and quality on the fastest AI cloud
            </p>
          </div>
          <a href="#" className="text-sm font-medium text-foreground hover:text-primary transition-colors flex items-center gap-1 shrink-0">
            View all models
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* Scrolling Cards */}
        <div className="relative">
          {/* Gradient Masks */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />
          
          <div 
            ref={scrollRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide"
          >
            {models.map((model, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-64 bg-card border border-border border-l-0 first:border-l p-5 hover:border-primary/40 hover:shadow-md transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className={`w-10 h-10 ${model.color} flex items-center justify-center text-white font-semibold text-sm`}>
                    {model.initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm truncate">
                      {model.name}
                    </h3>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    {model.pricing}
                  </p>
                  {model.context && (
                    <p className="text-xs text-muted-foreground">
                      {parseInt(model.context).toLocaleString()} Context
                    </p>
                  )}
                  <span className="inline-block px-2 py-0.5 text-xs font-medium bg-secondary text-muted-foreground">
                    {model.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Arrows below carousel */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="h-10 w-10 border-border"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="h-10 w-10 border-border"
          >
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};