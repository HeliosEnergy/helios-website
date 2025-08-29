import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import HeroSection from "./components/sections/HeroSection";
import TrustedBySection from "./components/sections/TrustedBySection"; // Import the new section
import { StackSection } from "./components/stack-section";
import EnhancedFeatureSection from "./components/feature-section/EnhancedFeatureSection";
import { GPUSelectionSection } from "./components/gpu-selection";
import { TestimonialsSection } from "./components/testimonials";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <HeroSection />
        <TrustedBySection /> {/* Add the new section here */}
        <StackSection />
        <EnhancedFeatureSection />
        <GPUSelectionSection />
        <TestimonialsSection />
      </main>
      <Footer />
    </>
  );
}
