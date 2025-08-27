import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GPUPricingHero from '../components/gpu-pricing/GPUPricingHero';
import PricingTable from '../components/ui/PricingTable';
import GPUSelectionSection from '../components/gpu-selection/GPUSelectionSection';

export default function GPUPricingPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <GPUPricingHero />
        
        {/* Pricing Table Section */}
        <PricingTable />
        
        {/* GPU Selection Section */}
        <GPUSelectionSection />
      </main>
      <Footer />
    </>
  );
}