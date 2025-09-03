'use client';

import React, { useState } from 'react';
import { 
  GPUModel, 
  ReservationPeriod, 
  calculatorGPUModels, 
  reservationPeriods, 
  calculatePricing 
} from './GPUPricingData';
import GPUDropdown from './GPUDropdown';
import ReservationPeriodTabs from './ReservationPeriodTabs';
import GPUQuantityControl from './GPUQuantityControl';
import ProfessionalUsageSlider from './ProfessionalUsageSlider';
import PricingSummary from './PricingSummary';
import MobileCalculatorTabs from './MobileCalculatorTabs';
import CompactConfigPanel from './CompactConfigPanel';
import CompactPricingSummary from './CompactPricingSummary';

// Calculator state interface
interface CalculatorState {
  selectedGPU: GPUModel;
  reservationPeriod: ReservationPeriod;
  quantity: number;
  hoursPerMonth: number;
}

const GPURentalCalculator: React.FC = () => {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    selectedGPU: calculatorGPUModels[0],
    reservationPeriod: reservationPeriods[0],
    quantity: 1,
    hoursPerMonth: 730
  });

  // Calculate pricing using shared function
  const pricing = calculatePricing(
    calculatorState.selectedGPU.pricePerHour,
    calculatorState.quantity,
    calculatorState.hoursPerMonth,
    calculatorState.reservationPeriod.discount
  );

  return (
    <section className="w-full bg-white py-6 md:py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-normal text-black mb-3 md:mb-4">
            GPU Infrastructure Cost Calculator
          </h2>
          <p className="text-sm md:text-base lg:text-lg font-light text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Configure enterprise GPU infrastructure and calculate precise monthly costs with volume discounts
          </p>
        </div>

        {/* Mobile Tabbed Interface */}
        <div className="max-w-6xl mx-auto">
          <MobileCalculatorTabs
            configurationContent={
              <CompactConfigPanel
                gpuModels={calculatorGPUModels}
                reservationPeriods={reservationPeriods}
                selectedGPU={calculatorState.selectedGPU}
                selectedPeriod={calculatorState.reservationPeriod}
                quantity={calculatorState.quantity}
                hoursPerMonth={calculatorState.hoursPerMonth}
                onGPUChange={(gpu) => setCalculatorState(prev => ({ ...prev, selectedGPU: gpu }))}
                onPeriodChange={(period) => setCalculatorState(prev => ({ ...prev, reservationPeriod: period }))}
                onQuantityChange={(quantity) => setCalculatorState(prev => ({ ...prev, quantity }))}
                onHoursChange={(hours) => setCalculatorState(prev => ({ ...prev, hoursPerMonth: hours }))}
              />
            }
            pricingContent={
              <CompactPricingSummary
                selectedGPU={calculatorState.selectedGPU}
                reservationPeriod={calculatorState.reservationPeriod}
                quantity={calculatorState.quantity}
                hoursPerMonth={calculatorState.hoursPerMonth}
                pricing={pricing}
              />
            }
          />

          {/* Desktop Layout - Hidden on Mobile */}
          <div className="hidden md:grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Pricing Summary - Right Side on Desktop */}
            <div className="order-1 lg:order-2">
              <PricingSummary
                selectedGPU={calculatorState.selectedGPU}
                reservationPeriod={calculatorState.reservationPeriod}
                quantity={calculatorState.quantity}
                hoursPerMonth={calculatorState.hoursPerMonth}
                pricing={pricing}
              />
            </div>

            {/* Configuration Panel - Left Side on Desktop */}
            <div className="order-2 lg:order-1">
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl md:text-2xl font-medium text-black mb-6 pb-3 border-b border-gray-100">
                    Configuration
                  </h3>
                  
                  {/* GPU Selection */}
                  <div className="space-y-6">
                    <GPUDropdown
                      gpuModels={calculatorGPUModels}
                      selectedGPU={calculatorState.selectedGPU}
                      onGPUChange={(gpu) => setCalculatorState(prev => ({ ...prev, selectedGPU: gpu }))}
                    />

                    {/* Reservation Period Selection */}
                    <ReservationPeriodTabs
                      periods={reservationPeriods}
                      selectedPeriod={calculatorState.reservationPeriod}
                      onPeriodChange={(period) => setCalculatorState(prev => ({ ...prev, reservationPeriod: period }))}
                    />

                    {/* GPU Quantity Control */}
                    <GPUQuantityControl
                      quantity={calculatorState.quantity}
                      onQuantityChange={(quantity) => setCalculatorState(prev => ({ ...prev, quantity }))}
                    />

                    {/* Professional Usage Hours Slider */}
                    <ProfessionalUsageSlider
                      hours={calculatorState.hoursPerMonth}
                      onHoursChange={(hours) => setCalculatorState(prev => ({ ...prev, hoursPerMonth: hours }))}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GPURentalCalculator;