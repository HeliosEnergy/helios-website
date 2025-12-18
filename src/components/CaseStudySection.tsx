import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export const CaseStudySection = () => {
  return (
    <section className="py-24 bg-card/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/20 via-background to-background border border-border p-8 md:p-12">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
          
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            {/* Text Content */}
            <div>
              <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
                Case Study
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                Sentient Achieved 50% Higher GPU Throughput with Sub-2s Latency
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Sentient waitlisted 1.8M users in 24 hours, delivering sub-2s latency across 15-agent workflows with 50% higher throughput per GPU and zero infra sprawl, all powered by Fireworks
              </p>
              <Button variant="hero" className="mt-8 gap-2">
                Read the Case Study
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-col gap-6">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 text-center">
                <div className="text-5xl sm:text-6xl font-bold text-gradient">
                  50%
                </div>
                <p className="mt-2 text-muted-foreground">
                  Higher throughput per GPU
                </p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6 text-center">
                <div className="text-5xl sm:text-6xl font-bold text-gradient">
                  1.8M
                </div>
                <p className="mt-2 text-muted-foreground">
                  Users waitlisted in 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
