/**
 * HIDDEN SECTIONS - Temporarily disabled until content/partners are ready:
 * - LogoBar (Validated Infrastructure Partners) - waiting for 5-6 confirmed partners
 * - WhyHeliosSection (Why Teams Choose Helios)
 * - LifecycleSection (Complete AI Model Life Cycle Management)
 * - CaseStudySection (Case study deep-dive, testimonial quotes kept in TestimonialsSection)
 * - BlogSection (Blog navigation and page, waiting for content)
 */

import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { ModelsSection } from "@/components/ModelsSection";
import { InfrastructureSection } from "@/components/InfrastructureSection";
// import { LifecycleSection } from "@/components/LifecycleSection"; // HIDDEN
// import { WhyHeliosSection } from "@/components/WhyHeliosSection"; // HIDDEN
// import { LogoBar } from "@/components/LogoBar"; // HIDDEN
import { TestimonialsSection } from "@/components/TestimonialsSection";
// import { CaseStudySection } from "@/components/CaseStudySection"; // HIDDEN
// import { BlogSection } from "@/components/BlogSection"; // HIDDEN
import { CTASection } from "@/components/CTASection";
import { CoreValueProposition } from "@/components/CoreValueProposition";
import { Footer } from "@/components/Footer";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

const sectionMap: Record<string, React.ComponentType<any>> = {
  announcementBanner: AnnouncementBanner,
  heroSection: HeroSection,
  useCasesSection: UseCasesSection,
  testimonialsSection: TestimonialsSection,
  ctaSection: CTASection,
  // blogSection: BlogSection, // HIDDEN
  // logoBar: LogoBar, // HIDDEN
  modelsSection: ModelsSection,
  infrastructureSection: InfrastructureSection,
  // lifecycleSection: LifecycleSection, // HIDDEN
  // whyHeliosSection: WhyHeliosSection, // HIDDEN
  // caseStudySection: CaseStudySection, // HIDDEN
  coreValueProposition: CoreValueProposition,
};

const Index = () => {
  const { data: pageData, isLoading } = useSanityQuery<any>('landing-page', QUERIES.page, { slug: 'home' });

  const renderSections = () => {
    if (isLoading || !pageData?.sections) {
      // Fallback to default order if loading or no CMS data
      return (
        <>
          <HeroSection />
          {/* <LogoBar /> HIDDEN - waiting for 5-6 confirmed partners */}
          <UseCasesSection />
          <ModelsSection />
          <InfrastructureSection />
          <CoreValueProposition />
          {/* <LifecycleSection /> HIDDEN */}
          {/* <WhyHeliosSection /> HIDDEN */}
          <TestimonialsSection />
          {/* <CaseStudySection /> HIDDEN - testimonial quotes kept in TestimonialsSection */}
          {/* <BlogSection /> HIDDEN - waiting for content */}
          <CTASection />
        </>
      );
    }

    return pageData.sections.map((section: any, index: number) => {
      const SectionComponent = sectionMap[section._type];
      return SectionComponent ? <SectionComponent key={section._id || index} /> : null;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Navbar />
      <main>
        {renderSections()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
