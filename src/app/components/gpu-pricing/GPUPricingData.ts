// Shared GPU pricing data extracted from PricingTable component

export interface GPUPricingData {
  gpu: string;
  vram: string;
  heliosCompute: string;
  aws: string;
  googleCloud: string;
  lambda: string;
  modal: string;
}

export interface GPUModel {
  id: string;
  name: string;
  pricePerHour: number;
  memory: string;
  specs: string;
  vram: string;
}

export interface ReservationPeriod {
  id: string;
  label: string;
  duration: string;
  discount: number;
}

// Original pricing data from PricingTable
export const originalPricingData: GPUPricingData[] = [
  {
    gpu: 'H100 NVL',
    vram: '94GB',
    heliosCompute: '2.47',
    aws: '5.88',
    googleCloud: 'Not listed',
    lambda: '2.49',
    modal: '3.95'
  },
  {
    gpu: 'H100 SXM',
    vram: '80GB',
    heliosCompute: '2.25',
    aws: '4.40',
    googleCloud: '11.06',
    lambda: '2.99',
    modal: '3.95'
  },
  {
    gpu: 'RTX Pro 6000',
    vram: '96GB',
    heliosCompute: '1.19',
    aws: 'Not listed',
    googleCloud: 'Not listed',
    lambda: 'Not listed',
    modal: 'Not listed'
  },
  {
    gpu: 'L40S',
    vram: '48GB',
    heliosCompute: '0.87',
    aws: '1.86-2.24',
    googleCloud: 'Not listed',
    lambda: 'Not Available',
    modal: '1.95'
  },
  {
    gpu: 'A100',
    vram: '80GB',
    heliosCompute: '1.35',
    aws: '3.67-4.10',
    googleCloud: '3.67',
    lambda: '1.29',
    modal: '2.50'
  }
];

// Transformed data for calculator with additional specs - aligned with pricing table
export const calculatorGPUModels: GPUModel[] = [
  {
    id: 'h100-nvl',
    name: 'H100 NVL (94GB)',
    pricePerHour: 2.47,
    memory: '94GB',
    specs: '94GB HBM3',
    vram: '94GB HBM3'
  },
  {
    id: 'h100-sxm',
    name: 'H100 SXM (80GB)',
    pricePerHour: 2.25,
    memory: '80GB',
    specs: '80GB HBM3',
    vram: '80GB HBM3'
  },
  {
    id: 'rtx-pro-6000',
    name: 'RTX Pro 6000 (96GB)',
    pricePerHour: 1.19,
    memory: '96GB',
    specs: '96GB GDDR7 ECC, Blackwell Architecture',
    vram: '96GB GDDR7 ECC'
  },
  {
    id: 'l40s',
    name: 'L40S (48GB)',
    pricePerHour: 0.87,
    memory: '48GB',
    specs: '48GB GDDR6',
    vram: '48GB GDDR6'
  },
  {
    id: 'a100',
    name: 'A100 (80GB)',
    pricePerHour: 1.35,
    memory: '80GB',
    specs: '80GB HBM2e',
    vram: '80GB HBM2e'
  }
];

// Reservation period options with discounts
export const reservationPeriods: ReservationPeriod[] = [
  {
    id: '1-month',
    label: '1 Month',
    duration: '5% off',
    discount: 5
  },
  {
    id: '3-months',
    label: '3 Months',
    duration: '10% off',
    discount: 10
  },
  {
    id: '6-months',
    label: '6 Months',
    duration: '15% off',
    discount: 15
  },
  {
    id: '12-months',
    label: '12 Months',
    duration: '20% off',
    discount: 20
  }
];

// Usage presets for hours per month
export const usagePresets = {
  light: { hours: 200, label: 'Light Usage' },
  medium: { hours: 500, label: 'Medium Usage' },
  heavy: { hours: 730, label: 'Heavy Usage (24/7)' }
};

// Helper function to calculate pricing
export const calculatePricing = (
  baseRate: number,
  quantity: number,
  hours: number,
  discountPercent: number
) => {
  const baseCost = baseRate * quantity * hours;
  const discountAmount = baseCost * (discountPercent / 100);
  const totalCost = baseCost - discountAmount;
  const effectiveRate = baseRate * (1 - discountPercent / 100);
  
  return {
    baseCost,
    discountAmount,
    totalCost,
    effectiveRate
  };
};