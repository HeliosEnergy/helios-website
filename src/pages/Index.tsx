import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { LogoBar } from "@/components/LogoBar";
import { UseCasesSection } from "@/components/UseCasesSection";
import { ModelsSection } from "@/components/ModelsSection";
import { LifecycleSection } from "@/components/LifecycleSection";
import { WhyFireworksSection } from "@/components/WhyFireworksSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { CaseStudySection } from "@/components/CaseStudySection";
import { BlogSection } from "@/components/BlogSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
      <Navbar />
      <main>
        <HeroSection />
        <LogoBar />
        <UseCasesSection />
        <ModelsSection />
        <LifecycleSection />
        <WhyFireworksSection />
        <TestimonialsSection />
        <CaseStudySection />
        <BlogSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
