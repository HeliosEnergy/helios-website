'use client';

import React from 'react';
import { GPUModel, ReservationPeriod } from './GPUPricingData';
import CompactGPUDropdown from './CompactGPUDropdown';
import CompactPeriodQuantityRow from './CompactPeriodQuantityRow';
import CompactUsageSlider from './CompactUsageSlider';

interface CompactConfigPanelProps {
  gpuModels: GPUModel[];
  reservationPeriods: ReservationPeriod[];
  selectedGPU: GPUModel;
  selectedPeriod: ReservationPeriod;
  quantity: number;
  hoursPerMonth: number;
  onGPUChange: (gpu: GPUModel) => void;
  onPeriodChange: (period: ReservationPeriod) => void;
  onQuantityChange: (quantity: number) => void;
  onHoursChange: (hours: number) => void;
}

const CompactConfigPanel: React.FC<CompactConfigPanelProps> = ({
  gpuModels,
  reservationPeriods,
  selectedGPU,
  selectedPeriod,
  quantity,
  hoursPerMonth,
  onGPUChange,
  onPeriodChange,
  onQuantityChange,
  onHoursChange
}) => {
  return (
    <div className="space-y-4">
      {/* GPU Selection */}
      <CompactGPUDropdown
        gpuModels={gpuModels}
        selectedGPU={selectedGPU}
        onGPUChange={onGPUChange}
      />

      {/* Period + Quantity Row */}
      <CompactPeriodQuantityRow
        periods={reservationPeriods}
        selectedPeriod={selectedPeriod}
        quantity={quantity}
        onPeriodChange={onPeriodChange}
        onQuantityChange={onQuantityChange}
      />

      {/* Usage Slider */}
      <CompactUsageSlider
        hours={hoursPerMonth}
        onHoursChange={onHoursChange}
      />
    </div>
  );
};

export default CompactConfigPanel;