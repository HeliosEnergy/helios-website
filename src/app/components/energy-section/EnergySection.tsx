import React from 'react';
import EnergyHeroSection from './EnergyHeroSection';
import AdvantagesCarousel from './AdvantagesCarousel';
import FeatureBlocks from './FeatureBlocks';
import EnergyCTASection from './EnergyCTASection';

const EnergySection = () => {
  return (
    <div className="energy-section">
      <EnergyHeroSection />
      <AdvantagesCarousel />
      <FeatureBlocks />
      <EnergyCTASection />
    </div>
  );
};

export default EnergySection;