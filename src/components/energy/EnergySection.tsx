import React from 'react';
import EnergyHeroSection from './EnergyHeroSection';
import AdvantagesCarousel from './AdvantagesCarousel';
import InfographicSection from './InfographicSection';
import FeatureBlocks from './FeatureBlocks';
import EnergyCTASection from './EnergyCTASection';

const EnergySection = () => {
  return (
    <div className="energy-section bg-black">
      <EnergyHeroSection />
      <AdvantagesCarousel />
      <InfographicSection />
      <FeatureBlocks />
      <EnergyCTASection />
    </div>
  );
};

export default EnergySection;
