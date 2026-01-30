import React from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { EnergySection } from '@/components/energy';

const EnergyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <EnergySection />
      <Footer />
    </div>
  );
};

export default EnergyPage;
