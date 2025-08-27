'use client';

import React, { useState } from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import GPUPricingHero from '../components/gpu-pricing/GPUPricingHero';
import PricingTable from '../components/ui/PricingTable';
import PricingPlanTabs, { PRICING_PLANS } from '../components/ui/PricingPlanTabs';
import GPUSelectionSection from '../components/gpu-selection/GPUSelectionSection';

export default function GPUPricingPage() {
  const [selectedPlan, setSelectedPlan] = useState(PRICING_PLANS[0]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <GPUPricingHero />
        
        {/* Pricing Plan Tabs Section */}
        <div className="w-full bg-white py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-center">
            <PricingPlanTabs 
              selectedPlan={selectedPlan}
              onPlanChange={setSelectedPlan}
            />
          </div>
        </div>
        
        {/* Pricing Table Section */}
        <PricingTable selectedPlan={selectedPlan} />
        
        {/* GPU Selection Section */}
        <GPUSelectionSection />
      </main>
      <Footer />
    </>
  );
}