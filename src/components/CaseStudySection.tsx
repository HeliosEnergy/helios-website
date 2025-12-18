import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const CaseStudySection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div>
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              Case Study
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-foreground leading-tight">
              Sentient Achieved 50% Higher GPU Throughput with Sub-2s Latency
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Sentient waitlisted 1.8M users in 24 hours, delivering sub-2s latency across 15-agent workflows with 50% higher throughput per GPU and zero infra sprawl, all powered by Fireworks
            </p>
            <Button variant="hero" className="mt-6 gap-2">
              Read the Case Study
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {/* Stats Card */}
          <div className="bg-gradient-to-br from-primary to-violet-dark rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-bold">✦ sentient</span>
            </div>
            <div className="text-right">
              <div className="text-6xl sm:text-7xl font-bold">
                50%
              </div>
              <p className="mt-2 text-white/80 text-sm">
                Higher throughput per GPU
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
