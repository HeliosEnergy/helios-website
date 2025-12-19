import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useSanityQuery } from "@/hooks/useSanityData";

export const CaseStudySection = () => {
  const { data: sectionData } = useSanityQuery<any>('case-study-section', `*[_type == "caseStudySection"][0]`);

  const gradientStart = sectionData?.gradientStart || 'primary';
  const gradientEnd = sectionData?.gradientEnd || 'yellow-dark';

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <div>
            <span className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              {sectionData?.sectionLabel || 'Case Study'}
            </span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-heading font-bold text-foreground leading-tight">
              {sectionData?.heading || 'Sentient Achieved 50% Higher GPU Throughput with Sub-2s Latency'}
            </h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {sectionData?.description || 'Sentient waitlisted 1.8M users in 24 hours, delivering sub-2s latency across 15-agent workflows with 50% higher throughput per GPU and zero infra sprawl, all powered by Helios'}
            </p>
            <Button variant="hero" className="mt-6 gap-2" asChild>
              <a href={sectionData?.ctaLink || '#'}>
                {sectionData?.ctaText || 'Read the Case Study'}
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
          </div>

          {/* Stats Card */}
          <div className={`bg-gradient-to-br from-${gradientStart} to-${gradientEnd} p-8 text-primary-foreground`}>
            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-bold">✦ {sectionData?.companyName?.toLowerCase() || 'sentient'}</span>
            </div>
            <div className="text-right">
              <div className="text-6xl sm:text-7xl font-bold">
                {sectionData?.statValue || '50%'}
              </div>
              <p className="mt-2 text-white/80 text-sm">
                {sectionData?.statLabel || 'Higher throughput per GPU'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
