import { Rocket, Sliders, Scale, ArrowRight } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Build",
    description: "Go from idea to output in seconds—with just a prompt. Run the latest open models on Fireworks serverless, with no GPU setup or cold starts. Move to production with on-demand GPUs that auto-scale as you grow",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Sliders,
    title: "Tune",
    description: "Fine-tune to meet your use case without the complexity. Get the highest-quality results from any open model using advanced tuning techniques like reinforcement learning, quantization-aware tuning, and adaptive speculation",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Scale,
    title: "Scale",
    description: "Scale production workloads seamlessly, anywhere, without managing infrastructure. Fireworks automatically provisions AI infrastructure across any deployment type, so you can focus on building",
    color: "from-orange-500 to-red-500",
  },
];

export const LifecycleSection = () => {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
            Model Lifecycle Management
          </span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-foreground">
            Complete AI model lifecycle management
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            Run the fastest inference, tune with ease, and scale globally, all without managing infrastructure
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative bg-card border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300"
            >
              {/* Gradient Icon */}
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg`}>
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-4">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {feature.description}
              </p>
              
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
