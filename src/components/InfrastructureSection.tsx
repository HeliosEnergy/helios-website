import { useState } from "react";
import { Globe, Shield, Zap, ArrowDown, ArrowUp } from "lucide-react";

const features = [
  {
    id: "global",
    icon: Globe,
    title: "Globally distributed",
    description: "Virtual cloud infrastructure running on the latest hardware across multiple regions worldwide, ensuring low latency and high availability for your AI workloads.",
  },
  {
    id: "enterprise",
    icon: Shield,
    title: "Enterprise ready",
    description: "Enterprise-grade security and reliability across mission-critical workloads with 99.98% uptime and resilient infrastructure, backed by 24/7 support.",
  },
  {
    id: "fast",
    icon: Zap,
    title: "Fast inference",
    description: "Industry-leading throughput and latency with our optimized inference engine, delivering responses in milliseconds for real-time AI applications.",
  },
];

export const InfrastructureSection = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section className="bg-background border-t border-border">
      <div className="grid lg:grid-cols-2">
        {/* Left side - Image area */}
        <div className="relative bg-background p-12 lg:p-16 flex flex-col justify-center min-h-[500px] border-r border-border">
          <span className="text-sm font-mono uppercase tracking-widest text-primary mb-6">
            Building with Helios
          </span>
          
          {/* Dynamic illustration based on hover */}
          <div className="relative w-full max-w-xs">
            {features.map((feature, index) => (
              <div
                key={feature.id}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  activeIndex === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <div className="w-48 h-48 relative">
                  {/* Isometric illustration placeholder */}
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {index === 0 && (
                      <>
                        {/* Globe illustration */}
                        <ellipse cx="100" cy="140" rx="60" ry="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
                        <ellipse cx="100" cy="100" rx="50" ry="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                        <ellipse cx="100" cy="100" rx="50" ry="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
                        <ellipse cx="100" cy="100" rx="20" ry="50" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" />
                        <circle cx="70" cy="85" r="4" fill="hsl(var(--primary))" />
                        <circle cx="130" cy="95" r="4" fill="hsl(var(--primary))" />
                        <circle cx="100" cy="60" r="4" fill="hsl(var(--primary))" />
                      </>
                    )}
                    {index === 1 && (
                      <>
                        {/* Shield illustration */}
                        <path d="M100 30 L150 60 L150 110 Q150 160 100 180 Q50 160 50 110 L50 60 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                        <path d="M80 100 L95 115 L125 85" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" />
                        <rect x="85" y="140" width="30" height="4" fill="hsl(var(--primary))" />
                      </>
                    )}
                    {index === 2 && (
                      <>
                        {/* Lightning/speed illustration */}
                        <polygon points="110,20 70,100 95,100 85,180 140,80 110,80" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                        <line x1="40" y1="100" x2="60" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" />
                        <line x1="140" y1="100" x2="160" y2="100" stroke="hsl(var(--primary))" strokeWidth="2" />
                        <circle cx="100" cy="100" r="60" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="4 4" />
                      </>
                    )}
                  </svg>
                </div>
              </div>
            ))}
            
            {/* Default state illustration */}
            <div
              className={`transition-opacity duration-500 ${
                activeIndex === null ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="w-48 h-48 relative">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Cloud + server isometric */}
                  <path d="M60 120 Q40 120 40 100 Q40 80 60 80 Q60 60 90 60 Q120 60 130 80 Q160 80 160 100 Q160 120 140 120 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                  <rect x="70" y="130" width="60" height="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="2" />
                  <line x1="70" y1="145" x2="130" y2="145" stroke="hsl(var(--primary))" strokeWidth="1" />
                  <line x1="70" y1="155" x2="130" y2="155" stroke="hsl(var(--primary))" strokeWidth="1" />
                  <circle cx="80" cy="138" r="2" fill="hsl(var(--primary))" />
                  <circle cx="90" cy="138" r="2" fill="hsl(var(--primary))" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Feature accordion */}
        <div className="flex flex-col">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className={`border-b border-border transition-all duration-300 cursor-pointer ${
                activeIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-foreground hover:bg-muted"
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="p-8 lg:p-12">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl lg:text-3xl font-heading font-bold">
                    {feature.title}
                  </h3>
                  {activeIndex === index ? (
                    <ArrowUp className="w-6 h-6 flex-shrink-0" />
                  ) : (
                    <ArrowDown className="w-6 h-6 flex-shrink-0" />
                  )}
                </div>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeIndex === index ? "max-h-40 mt-6 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm lg:text-base leading-relaxed max-w-md">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
