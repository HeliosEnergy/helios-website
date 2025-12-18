import { ArrowRight } from "lucide-react";

const features = [
  {
    title: "Build",
    description: "Go from idea to output in seconds—with just a prompt. Run the latest open models on Helios serverless, with no GPU setup or cold starts. Move to production with on-demand GPUs that auto-scale as you grow",
  },
  {
    title: "Tune",
    description: "Fine-tune to meet your use case without the complexity. Get the highest-quality results from any open model using advanced tuning techniques like reinforcement learning, quantization-aware tuning, and adaptive speculation",
  },
  {
    title: "Scale",
    description: "Scale production workloads seamlessly, anywhere, without managing infrastructure. Helios automatically provisions AI infrastructure across any deployment type, so you can focus on building",
  },
];

export const LifecycleSection = () => {
  return (
    <section className="py-20 bg-surface border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left side - Header */}
          <div>
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              Model Lifecycle Management
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-heading font-bold text-foreground">
              Complete AI model lifecycle management
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Run the fastest inference, tune with ease, and scale globally, all without managing infrastructure
            </p>
          </div>

          {/* Right side - Features */}
          <div className="space-y-8">
            {features.map((feature, i) => (
              <div
                key={feature.title}
                className="group"
              >
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  {feature.description}
                </p>
                <a href="#" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
