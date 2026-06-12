/**
 * HIDDEN SECTIONS - Temporarily disabled until content/partners are ready:
 * - LogoBar (Validated Infrastructure Partners) - waiting for 5-6 confirmed partners
 * - WhyHeliosSection (Why Teams Choose Helios)
 * - CoreValueProposition (Why teams choose Helios - similar content)
 * - LifecycleSection (Complete AI Model Life Cycle Management)
 * - CaseStudySection (Case study deep-dive, testimonial quotes kept in TestimonialsSection)
 * - BlogSection (Blog navigation and page, waiting for content)
 * - InfrastructureSection (Services tabs section)
 * - UseCasesSection (hidden for homepage repositioning)
 * - ModelsSection (hidden for homepage repositioning)
 * - TestimonialsSection (hidden for homepage repositioning)
 * - Redesign prototype sections are implemented as local React sections below
 *   instead of deleting the older CMS-backed sections.
 */

import React from "react";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/HeroSection";
// import { UseCasesSection } from "@/components/UseCasesSection"; // HIDDEN
// import { ModelsSection } from "@/components/ModelsSection"; // HIDDEN
// import { InfrastructureSection } from "@/components/InfrastructureSection"; // HIDDEN
// import { LifecycleSection } from "@/components/LifecycleSection"; // HIDDEN
// import { WhyHeliosSection } from "@/components/WhyHeliosSection"; // HIDDEN
// import { LogoBar } from "@/components/LogoBar"; // HIDDEN
// import { TestimonialsSection } from "@/components/TestimonialsSection"; // HIDDEN
// import { CaseStudySection } from "@/components/CaseStudySection"; // HIDDEN
// import { BlogSection } from "@/components/BlogSection"; // HIDDEN
import { CTASection } from "@/components/CTASection";
// import { CoreValueProposition } from "@/components/CoreValueProposition"; // HIDDEN
import { GpuSovereigntySection } from "@/components/GpuSovereigntySection";
import {
  HomeModelsStrip,
  HomeOfferingsSection,
  HomeSpeedSection,
  HomeSustainabilitySection,
} from "@/components/HomeRevampSections";
import { HomeFootprintSection } from "@/components/map/FootprintSection";
import { Footer } from "@/components/Footer";
import { useSanityQuery, QUERIES } from "@/hooks/useSanityData";

const sectionMap: Record<string, React.ComponentType<any>> = {
  announcementBanner: AnnouncementBanner,
  heroSection: HeroSection,
  // useCasesSection: UseCasesSection, // HIDDEN
  // testimonialsSection: TestimonialsSection, // HIDDEN
  ctaSection: CTASection,
  // blogSection: BlogSection, // HIDDEN
  // logoBar: LogoBar, // HIDDEN
  // modelsSection: ModelsSection, // HIDDEN
  // infrastructureSection: InfrastructureSection, // HIDDEN
  // lifecycleSection: LifecycleSection, // HIDDEN
  // whyHeliosSection: WhyHeliosSection, // HIDDEN
  // caseStudySection: CaseStudySection, // HIDDEN
  // coreValueProposition: CoreValueProposition, // HIDDEN
  gpuSovereigntySection: GpuSovereigntySection,
  homeOfferingsSection: HomeOfferingsSection,
  homeSpeedSection: HomeSpeedSection,
  homeSustainabilitySection: HomeSustainabilitySection,
  homeFootprintSection: HomeFootprintSection,
  homeModelsStrip: HomeModelsStrip,
};

const Index = () => {
  const { data: pageData, isLoading } = useSanityQuery<any>('landing-page', QUERIES.page, { slug: 'home' });

  const renderSections = () => {
    if (isLoading || !pageData?.sections) {
      // Fallback to default order if loading or no CMS data
      return (
        <>
          <HeroSection />
          <HomeOfferingsSection />
          {/* <LogoBar /> HIDDEN - waiting for 5-6 confirmed partners */}
          {/* <UseCasesSection /> HIDDEN */}
          {/* <ModelsSection /> HIDDEN */}
          <GpuSovereigntySection />
          <HomeSpeedSection />
          <HomeSustainabilitySection />
          <HomeFootprintSection />
          <HomeModelsStrip />
          {/* <InfrastructureSection /> HIDDEN */}
          {/* <CoreValueProposition /> HIDDEN */}
          {/* <LifecycleSection /> HIDDEN */}
          {/* <WhyHeliosSection /> HIDDEN */}
          {/* <TestimonialsSection /> HIDDEN */}
          {/* <CaseStudySection /> HIDDEN - testimonial quotes kept in TestimonialsSection */}
          {/* <BlogSection /> HIDDEN - waiting for content */}
          <CTASection />
        </>
      );
    }

    const renderedSections = [
      { _type: "heroSection", _id: "manual-hero" },
      { _type: "homeOfferingsSection", _id: "manual-offerings" },
      { _type: "gpuSovereigntySection", _id: "manual-sovereignty" },
      { _type: "homeSpeedSection", _id: "manual-speed" },
      { _type: "homeSustainabilitySection", _id: "manual-sustainability" },
      { _type: "homeFootprintSection", _id: "manual-footprint" },
      { _type: "homeModelsStrip", _id: "manual-models-strip" },
      { _type: "ctaSection", _id: "manual-cta" },
    ].map((section: any, index: number) => {
      const SectionComponent = sectionMap[section._type];
      return SectionComponent ? <SectionComponent key={section._id || index} /> : null;
    });

    return <>{renderedSections}</>;
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Navigation />
      <main>
        {renderSections()}
      </main>
      <Footer />
    </div>
  );
};

export default Index;
