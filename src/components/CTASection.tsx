import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";
import { CONSOLE_SIGNUP_URL, DOCS_URL } from "@/lib/site";

const CTA_FALLBACK = {
  heading: "Plan your Helios deployment.",
  description:
    "Tell us the GPUs, megawatts and target date. We'll map the right capacity, site and deployment path.",
  primaryCtaText: "Get a deployment plan",
  primaryCtaLink: "/contact",
};

interface CtaContent {
  heading?: string;
  description?: string;
  primaryCtaText?: string;
  primaryCtaLink?: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
}

// Helper to fix legacy URLs from Sanity until re-migration
const fixUrl = (url?: string) => {
  if (!url) return CTA_FALLBACK.primaryCtaLink;
  if (url === 'https://helios.ai/contact') return '/contact';
  if (url === 'https://helios.ai/signup') return CONSOLE_SIGNUP_URL;
  if (url.includes('helios.ai/docs')) return DOCS_URL;
  return url;
};

export const CTASection = () => {
  const { data: cta } = useSanityQuery<CtaContent>('cta-section', QUERIES.ctaSection);
  const content = {
    heading: cta?.heading?.trim() || CTA_FALLBACK.heading,
    description: cta?.description?.trim() || CTA_FALLBACK.description,
    primaryCtaText: cta?.primaryCtaText?.trim() || CTA_FALLBACK.primaryCtaText,
    primaryCtaLink: cta?.primaryCtaLink || CTA_FALLBACK.primaryCtaLink,
    secondaryCtaText: cta?.secondaryCtaText?.trim(),
    secondaryCtaLink: cta?.secondaryCtaLink,
  };

  return (
    <section className="py-10 bg-primary">
      <div className="max-w-7xl mx-auto px-3 lg:px-6 text-center">
        <h2 className="text-3xl sm:text-4xl font-heading font-bold text-primary-foreground mb-4">
          {content.heading}
        </h2>
        <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg mx-auto">
          {content.description}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button variant="secondary" size="lg" className="gap-2 font-mono uppercase tracking-wider text-xs font-semibold" asChild>
            <a href={fixUrl(content.primaryCtaLink)}>
              {content.primaryCtaText}
              <ArrowRight className="w-4 h-4" />
            </a>
          </Button>
          {content.secondaryCtaText && (
            <Button variant="ghost" size="lg" className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10 font-mono uppercase tracking-wider text-xs font-semibold" asChild>
              <a href={fixUrl(content.secondaryCtaLink)}>
                {content.secondaryCtaText}
              </a>
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};
