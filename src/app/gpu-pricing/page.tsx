'use client';

import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GPUPricingHero from '../components/gpu-pricing/GPUPricingHero';
import PricingTable from '../components/ui/PricingTable';
import { PRICING_PLANS } from '../components/ui/PricingPlanTabs';
import GPUSelectionSection from '../components/gpu-selection/GPUSelectionSection';

export default function GPUPricingPage() {
  const [selectedPlan, setSelectedPlan] = useState(PRICING_PLANS[0]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <GPUPricingHero />
        
        {/* Pricing Table Section with integrated tabs */}
        <PricingTable 
          selectedPlan={selectedPlan} 
          onPlanChange={setSelectedPlan}
        />
        
        {/* GPU Selection Section */}
        <GPUSelectionSection />
      </main>
      <Footer />
    </>
  );
}