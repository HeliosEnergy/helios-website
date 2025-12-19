import {
  Code2, MessageSquare, Brain, Search, Image, Database,
  ArrowRight, ArrowUpRight, LucideIcon
} from "lucide-react";
import { useState } from "react";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

const iconMap: Record<string, LucideIcon> = {
  Code2, MessageSquare, Brain, Search, Image, Database
};

export const UseCasesSection = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { data: section, isLoading } = useSanityQuery<any>('use-cases-section', QUERIES.useCasesSection);

  if (isLoading || !section) return null;

  return (
    <section className="py-24 bg-background relative overflow-hidden text-card-foreground">
      {/* Industrial grid background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="h-full w-full" style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 49px, currentColor 49px, currentColor 50px),
            repeating-linear-gradient(90deg, transparent, transparent 49px, currentColor 49px, currentColor 50px)
          `,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-12 bg-primary" />
            <span className="text-xs font-mono uppercase tracking-[0.3em] text-primary">
              {section.sectionLabel}
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-heading font-bold text-foreground tracking-tight">
            {section.heading}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl text-lg">
            {section.description}
          </p>
        </div>

        {/* Industrial Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {section.useCases?.map((useCase: any, i: number) => {
            const Icon = iconMap[useCase.icon] || Brain;
            return (
              <div
                key={useCase.title}
                className="group relative border border-border bg-card cursor-pointer transition-all duration-500"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  transform: hoveredIndex === i ? 'scale(1.02)' : 'scale(1)',
                  zIndex: hoveredIndex === i ? 10 : 1,
                }}
              >
                {/* Hover highlight bar */}
                <div className={`absolute top-0 left-0 h-1 bg-primary transition-all duration-300 ${hoveredIndex === i ? 'w-full' : 'w-0'
                  }`} />

                {/* Content */}
                <div className="p-8">
                  {/* Top row: Tag + Icon */}
                  <div className="flex items-start justify-between mb-6">
                    <span className="text-[10px] font-mono tracking-widest text-muted-foreground border border-border px-2 py-1">
                      {useCase.tag}
                    </span>
                    <div className={`p-3 border border-border transition-all duration-300 ${hoveredIndex === i ? 'bg-primary border-primary' : 'bg-transparent'
                      }`}>
                      <Icon className={`w-5 h-5 transition-colors duration-300 ${hoveredIndex === i ? 'text-primary-foreground' : 'text-foreground'
                        }`} />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-heading font-semibold text-foreground mb-2">
                    {useCase.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {useCase.description}
                  </p>

                  {/* Stat display */}
                  <div className={`flex items-end justify-between pt-4 border-t border-border transition-all duration-300 ${hoveredIndex === i ? 'border-primary/30' : ''
                    }`}>
                    <div>
                      <span className={`text-3xl font-heading font-bold transition-colors duration-300 ${hoveredIndex === i ? 'text-primary' : 'text-foreground'
                        }`}>
                        {useCase.stat}
                      </span>
                      <span className="block text-xs text-muted-foreground mt-1">
                        {useCase.statLabel}
                      </span>
                    </div>

                    {/* Arrow button */}
                    <div className={`p-2 transition-all duration-300 ${hoveredIndex === i
                        ? 'bg-primary text-primary-foreground translate-x-0 opacity-100'
                        : 'bg-transparent text-muted-foreground -translate-x-2 opacity-0'
                      }`}>
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Corner accent */}
                <div className={`absolute bottom-0 right-0 w-8 h-8 transition-all duration-500 ${hoveredIndex === i ? 'opacity-100' : 'opacity-0'
                  }`}>
                  <div className="absolute bottom-0 right-0 w-full h-px bg-primary" />
                  <div className="absolute bottom-0 right-0 h-full w-px bg-primary" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom accent line */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs font-mono text-muted-foreground tracking-widest">
            HELIOS.BUILD
          </span>
          <div className="h-px w-24 bg-primary" />
        </div>
      </div>
    </section>
  );
};