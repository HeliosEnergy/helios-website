import { Zap, Shield, ArrowRight, Check } from "lucide-react";
import { useSanityQuery } from "@/hooks/useSanityData";

const defaultAudiences = [
  {
    title: "AI Natives",
    points: [
      "Day 0 support for latest models",
      "Highest quality and performance, lowest cost",
      "Complete set of developer features no matter where you are on the journey",
    ],
  },
  {
    title: "Enterprise",
    points: [
      "SOC2, HIPAA, and GDPR compliant",
      "Bring your own cloud or run on ours",
      "Zero data retention and complete data sovereignty",
    ],
  },
];

export const WhyHeliosSection = () => {
  const { data: sectionData } = useSanityQuery<any>('why-helios-section', `*[_type == "whyHeliosSection"][0]`);
  const audiences = sectionData?.audiences || defaultAudiences;

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-14">
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            {sectionData?.sectionLabel || 'Why Helios'}
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-foreground">
            {sectionData?.heading || 'Startup velocity. Enterprise-grade stability.'}
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl">
            {sectionData?.description || 'From AI Natives to Enterprises, Helios powers everything from rapid prototyping to mission-critical workloads'}
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="bg-card border border-border p-6 hover:border-primary/40 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold text-foreground mb-5">
                {audience.title}
              </h3>

              <ul className="space-y-3 mb-5">
                {audience.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>

              <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                Learn more
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};