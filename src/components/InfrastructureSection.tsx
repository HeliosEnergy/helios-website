import { Globe, Shield, Zap, Settings } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Globally distributed virtual cloud infrastructure running on the latest hardware",
  },
  {
    icon: Shield,
    title: "Enterprise-grade security and reliability across mission-critical workloads",
  },
  {
    icon: Zap,
    title: "Fast inference engine delivering industry-leading throughput and latency",
  },
  {
    icon: Settings,
    title: "Optimized deployments across quality, speed, and cost",
  },
];

export const InfrastructureSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Building with Fireworks
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-foreground max-w-2xl mx-auto">
            Run and tune your models on our highly scalable, optimized virtual cloud infrastructure
          </h2>
        </div>

        {/* Grid with illustrations */}
        <div className="grid sm:grid-cols-2 gap-8">
          {features.map((feature, i) => (
            <div
              key={i}
              className="flex flex-col items-center text-center p-6"
            >
              {/* Illustration placeholder */}
              <div className="w-48 h-36 mb-6 bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center">
                <feature.icon className="w-16 h-16 text-primary/40" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                {feature.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
