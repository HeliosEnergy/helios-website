import React from 'react';
import PartnerHeroSection from './PartnerHeroSection';
import CalculatorSection from './CalculatorSection';
import HowItWorksSection from './HowItWorksSection';
import DealsStructureSection from './DealsStructureSection';
import SpecificationsSection from './SpecificationsSection';
import ContactFormSection from './ContactFormSection';

export function PartnerSection() {
  return (
    <div className="w-full">
      <PartnerHeroSection />
      <CalculatorSection />
      <HowItWorksSection />
      <DealsStructureSection />
      <SpecificationsSection />
      <ContactFormSection />
    </div>
  );
}