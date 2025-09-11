'use client';

import React, { useState } from 'react';
import { GPUModel, ReservationPeriod } from './GPUPricingData';

// Cloudflare Worker URL
const CLOUDFLARE_WORKER_URL = "https://helios-contact-worker.helios-energy.workers.dev/";

interface CompactPricingSummaryProps {
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

const CompactPricingSummary: React.FC<CompactPricingSummaryProps> = ({
  selectedGPU,
  reservationPeriod,
  quantity,
  hoursPerMonth,
  pricing
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Abbreviate GPU name for mobile
  const getCompactName = (name: string) => {
    return name.split('(')[0].trim();
  };

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
    <div className="bg-gray-50 p-4 rounded-sm">
      {/* Hero Price */}
      <div className="text-center mb-4 p-4 bg-white border border-gray-100">
        <div className="text-3xl font-bold text-black mb-1">
          ${pricing.totalCost.toFixed(2)}
        </div>
        <div className="text-sm font-normal text-gray-500">
          Monthly Infrastructure Cost
        </div>
        {reservationPeriod.discount > 0 && (
          <div className="mt-2">
            <div className="text-xs font-light text-gray-600">
              Discount: ${pricing.discountAmount.toFixed(2)} ({reservationPeriod.discount}% reduction)
            </div>
          </div>
        )}
      </div>

      {/* Compact Configuration Summary */}
      <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center text-sm">
          <span className="font-normal text-gray-600">GPU:</span>
          <span className="font-medium text-black text-right">
            {getCompactName(selectedGPU.name)} × {quantity}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-normal text-gray-600">Runtime:</span>
          <span className="font-medium text-black">
            {hoursPerMonth}h • {reservationPeriod.label}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-normal text-gray-600">Rate:</span>
          <span className="font-medium text-black">
            ${reservationPeriod.discount > 0 ? pricing.effectiveRate.toFixed(2) : selectedGPU.pricePerHour}/hr
            {reservationPeriod.discount > 0 && (
              <span className="text-xs font-normal text-gray-500 ml-1">
                (was ${selectedGPU.pricePerHour})
              </span>
            )}
          </span>
        </div>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-2 mb-4">
        <div className="text-xs font-normal text-gray-600">
          <span className="font-medium">Hourly:</span> ${(pricing.totalCost / hoursPerMonth).toFixed(4)}
          {quantity > 1 && (
            <span className="text-gray-500">
              {' '}(${(pricing.totalCost / hoursPerMonth / quantity).toFixed(4)} per unit)
            </span>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <button 
        className="w-full px-6 py-3 bg-black text-white text-sm font-medium border border-black hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-black"
        onClick={handleContactSales}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Contact Sales'}
      </button>

      {/* Additional Info */}
      <div className="mt-3 text-center">
        <div className="text-xs font-light text-gray-500">
          Instant provisioning • Enterprise SLA • Scalable
        </div>
        <button 
          onClick={handleContactSales}
          className="text-xs font-light text-gray-600 hover:text-black underline transition-colors mt-2"
          disabled={isSubmitting}
        >
          Enterprise inquiry
        </button>
      </div>
    </div>
  );
};

export default CompactPricingSummary;