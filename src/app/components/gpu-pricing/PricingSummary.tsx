'use client';

import React, { useState } from 'react';
import { GPUModel, ReservationPeriod } from './GPUPricingData';

// Cloudflare Worker URL
const CLOUDFLARE_WORKER_URL = "https://helios-contact-worker.helios-energy.workers.dev/";

interface PricingSummaryProps {
  selectedGPU: GPUModel;
  reservationPeriod: ReservationPeriod;
  quantity: number;
  hoursPerMonth: number;
  pricing: {
    baseCost: number;
    discountAmount: number;
    totalCost: number;
    effectiveRate: number;
  };
}

const PricingSummary: React.FC<PricingSummaryProps> = ({
  selectedGPU,
  reservationPeriod,
  quantity,
  hoursPerMonth,
  pricing
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate total cost for the entire reservation period
  const calculateTotalReservationCost = () => {
    // Map period IDs to months
    const periodMonths: Record<string, number> = {
      '1-month': 1,
      '3-months': 3,
      '6-months': 6,
      '12-months': 12
    };
    
    const months = periodMonths[reservationPeriod.id] || 1;
    return pricing.totalCost * months;
  };

  const totalReservationCost = calculateTotalReservationCost();

  const handleContactSales = async () => {
    setIsSubmitting(true);
    
    // Construct the message with all GPU configuration details
    const message = `
GPU Rental Inquiry Details:
---------------------------
GPU Model: ${selectedGPU.name}
VRAM: ${selectedGPU.vram}
Memory: ${selectedGPU.memory}
Specifications: ${selectedGPU.specs}

Configuration:
- Quantity: ${quantity} unit${quantity !== 1 ? 's' : ''}
- Monthly Runtime: ${hoursPerMonth} hours
- Contract Term: ${reservationPeriod.label} (${reservationPeriod.duration})

Pricing Summary:
- Base Cost: $${pricing.baseCost.toFixed(2)}
- Discount: $${pricing.discountAmount.toFixed(2)} (${reservationPeriod.discount}%)
- Total Monthly Cost: $${pricing.totalCost.toFixed(2)}
- Effective Rate: $${pricing.effectiveRate.toFixed(2)}/hour

${quantity > 1 ? `Per Unit Cost: $${(pricing.totalCost / quantity).toFixed(2)}/month` : ''}
`;

    // Construct the payload with all GPU configuration details
    const payload = {
      name: 'GPU Calculator User', // Default name for calculator submissions
      company: 'Not provided', // Default company for calculator submissions
      email: 'not-provided@example.com', // Default email for calculator submissions
      message: message,
      inquiryType: 'GPU Rental Calculator',
      gpuDetails: {
        model: selectedGPU.name,
        count: quantity,
        memory: selectedGPU.memory,
        specs: selectedGPU.specs,
        vram: selectedGPU.vram,
        hoursPerMonth: hoursPerMonth,
        reservationPeriod: reservationPeriod.label,
        discount: reservationPeriod.discount,
        totalCost: pricing.totalCost,
        baseCost: pricing.baseCost,
        discountAmount: pricing.discountAmount,
        effectiveRate: pricing.effectiveRate
      }
    };

    try {
      const response = await fetch(CLOUDFLARE_WORKER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        // If the server responds with an error, handle it
        const errorData = await response.json();
        throw new Error(errorData.error || 'An unknown network error occurred.');
      }

      // If the request is successful, open Calendly
      window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer');
    } catch (error) {
      console.error('Submission error:', error);
      // Even if submission fails, still open Calendly so user can contact sales
      window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="lg:sticky lg:top-8">
      <div className="bg-gray-50 p-6 md:p-8 rounded-sm">
        <h3 className="text-2xl font-semibold text-black mb-6">
          Monthly Infrastructure Cost
        </h3>
        
        {/* Total Cost Display - Hero Section */}
        <div className="text-center mb-6 p-6 bg-white border border-gray-100">
          <div className="text-5xl md:text-6xl font-bold text-black mb-2">
            ${pricing.totalCost.toFixed(2)}
          </div>
          <div className="text-base font-normal text-gray-500">
            Monthly Infrastructure Cost
          </div>
          {reservationPeriod.discount > 0 && (
            <div className="mt-3">
              <div className="text-sm font-normal text-gray-600">
                Commitment discount: ${pricing.discountAmount.toFixed(2)} ({reservationPeriod.discount}% reduction)
              </div>
            </div>
          )}
        </div>

        {/* Total Reservation Cost - Compact One-liner */}
        <div className="text-center mb-8 py-3 bg-gray-100 rounded-sm">
          <div className="text-sm">
            <span className="font-medium text-gray-700">Total for {reservationPeriod.label}:</span>
            <span className="font-bold text-black ml-2">${totalReservationCost.toFixed(2)}</span>
          </div>
        </div>

        {/* Configuration Summary */}
        <div className="space-y-6 mb-8">
          <div className="pb-4 border-b border-gray-100">
            <h4 className="text-base font-medium text-black mb-4">
              Infrastructure Specification
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">GPU Model</span>
                <span className="text-sm font-medium text-black text-right">
                  {selectedGPU.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">Instance Count</span>
                <span className="text-sm font-medium text-black">
                  {quantity} unit{quantity !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">Monthly Runtime</span>
                <span className="text-sm font-medium text-black">
                  {hoursPerMonth} hours
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-light text-gray-600">Contract Term</span>
                <span className="text-sm font-medium text-black">
                  {reservationPeriod.label}
                </span>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div>
            <h4 className="text-base font-medium text-black mb-4">
              Price Analysis
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-normal text-gray-600">Base rate per unit</span>
                <span className="text-sm font-medium text-black">
                  ${selectedGPU.pricePerHour}/hour
                </span>
              </div>
              
              {reservationPeriod.discount > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-sm font-normal text-gray-600">Effective rate per unit</span>
                  <span className="text-sm font-medium text-black">
                    ${pricing.effectiveRate.toFixed(2)}/hour
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost Metrics */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-100">
          <div className="text-sm text-gray-700">
            <div className="font-light">Hourly cost breakdown</div>
            <div className="mt-2 space-y-1">
              <div className="text-xs font-light text-gray-600">
                Total: ${(pricing.totalCost / hoursPerMonth).toFixed(4)}/hour
              </div>
              {quantity > 1 && (
                <div className="text-xs font-light text-gray-600">
                  Per unit: ${(pricing.totalCost / hoursPerMonth / quantity).toFixed(4)}/hour
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button 
          className="w-full px-8 py-4 bg-black text-white text-base font-medium border border-black hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-black"
          onClick={handleContactSales}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Contact Sales'}
        </button>

        {/* Additional Info */}
        <div className="mt-4 text-center">
          <div className="text-xs font-light text-gray-500">
            Instant provisioning • Enterprise SLA • Scalable infrastructure
          </div>
          <button 
            onClick={handleContactSales}
            className="text-xs font-light text-gray-600 hover:text-black underline transition-colors mt-2"
          >
            Enterprise pricing inquiry
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingSummary;