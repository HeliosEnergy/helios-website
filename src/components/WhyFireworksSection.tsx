import { Zap, Shield, ArrowRight, Check } from "lucide-react";

const audiences = [
  {
    icon: Zap,
    title: "AI Natives",
    points: [
      "Day 0 support for latest models",
      "Highest quality and performance, lowest cost",
      "Complete set of developer features no matter where you are on the journey",
    ],
    gradient: "from-primary to-violet-light",
  },
  {
    icon: Shield,
    title: "Enterprise",
    points: [
      "SOC2, HIPAA, and GDPR compliant",
      "Bring your own cloud or run on ours",
      "Zero data retention and complete data sovereignty",
    ],
    gradient: "from-cyan-500 to-blue-500",
  },
];

export const WhyFireworksSection = () => {
  return (
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Why Fireworks
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-foreground">
            Startup velocity. Enterprise-grade stability.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            From AI Natives to Enterprises, Fireworks powers everything from rapid prototyping to mission-critical workloads
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {audiences.map((audience) => (
            <div
              key={audience.title}
              className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${audience.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                <audience.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-6">
                {audience.title}
              </h3>
              
              <ul className="space-y-4 mb-6">
                {audience.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{point}</span>
                  </li>
                ))}
              </ul>
              
              <a href="#" className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
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
