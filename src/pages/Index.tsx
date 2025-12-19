import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { UseCasesSection } from "@/components/UseCasesSection";
import { ModelsSection } from "@/components/ModelsSection";
import { InfrastructureSection } from "@/components/InfrastructureSection";
import { LifecycleSection } from "@/components/LifecycleSection";
import { WhyHeliosSection } from "@/components/WhyHeliosSection";
import { LogoBar } from "@/components/LogoBar";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CaseStudySection } from "@/components/CaseStudySection";
import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

const sectionMap: Record<string, React.ComponentType<any>> = {
  announcementBanner: AnnouncementBanner,
  heroSection: HeroSection,
  useCasesSection: UseCasesSection,
  testimonialsSection: TestimonialsSection,
  ctaSection: CTASection,
  blogSection: BlogSection,
  logoBar: LogoBar,
  modelsSection: ModelsSection,
  infrastructureSection: InfrastructureSection,
  lifecycleSection: LifecycleSection,
  whyHeliosSection: WhyHeliosSection,
  caseStudySection: CaseStudySection,
};

const Index = () => {
  const { data: pageData, isLoading } = useSanityQuery<any>('landing-page', QUERIES.page, { slug: 'home' });

  const renderSections = () => {
    if (isLoading || !pageData?.sections) {
      // Fallback to default order if loading or no CMS data
      return (
        <>
          <HeroSection />
          <LogoBar />
          <UseCasesSection />
          <ModelsSection />
          <InfrastructureSection />
          <LifecycleSection />
          <WhyHeliosSection />
          <TestimonialsSection />
          <CaseStudySection />
          <BlogSection />
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
