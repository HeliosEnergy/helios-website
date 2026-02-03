import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { EnergySection } from '@/components/energy';

const EnergyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <EnergySection />
      <Footer />
    </div>
  );
};

export default EnergyPage;
