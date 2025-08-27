'use client';

import React, { useState, useMemo } from 'react';

// Calculation utilities
interface CalculationParams {
  currentRate: number; // $/kWh
  capacity: number; // kW
  hoursPerYear: number;
  heliosMultiplier: number;
}

interface YearlyData {
  year: string;
  grid: number;
  helios: number;
}

// Calculate revenue for grid sales
const calculateGridRevenue = (params: CalculationParams, year: number): number => {
  const { currentRate, capacity, hoursPerYear } = params;
  const baseRevenue = currentRate * capacity * hoursPerYear;
  // Cumulative revenue up to this year
  return baseRevenue * year;
};

// Calculate revenue for Helios partnership
const calculateHeliosRevenue = (params: CalculationParams, year: number): number => {
  const { currentRate, capacity, hoursPerYear, heliosMultiplier } = params;
  const baseRevenue = currentRate * capacity * hoursPerYear * heliosMultiplier;
  // Cumulative revenue up to this year
  return baseRevenue * year;
};

// Generate dynamic chart data
const generateChartData = (params: CalculationParams): YearlyData[] => {
  const data: YearlyData[] = [];
  for (let year = 1; year <= 10; year++) {
    data.push({
      year: `Year ${year}`,
      grid: calculateGridRevenue(params, year),
      helios: calculateHeliosRevenue(params, year)
    });
  }
  return data;
};

// Calculate annual revenue increase
const calculateAnnualIncrease = (params: CalculationParams): number => {
  const gridAnnual = calculateGridRevenue(params, 1);
  const heliosAnnual = calculateHeliosRevenue(params, 1);
  return heliosAnnual - gridAnnual;
};

const formatCurrency = (value: number): string => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}k`;
  }
  return `$${value.toLocaleString()}`;
};

const CalculatorSection: React.FC = () => {
  const [currentRate, setCurrentRate] = useState('0.10');
  const [capacity, setCapacity] = useState('500 kW');

  // Parse capacity value to number
  const capacityValue = useMemo(() => {
    const match = capacity.match(/([\d.]+)/);
    if (!match) return 500;
    const value = parseFloat(match[1]);
    return capacity.includes('MW') ? value * 1000 : value;
  }, [capacity]);

  // Calculation parameters
  const calculationParams: CalculationParams = useMemo(() => ({
    currentRate: parseFloat(currentRate) || 0.10,
    capacity: capacityValue,
    hoursPerYear: 8760, // 24 * 365
    heliosMultiplier: 7.5 // Based on the original data showing ~7.5x higher returns
  }), [currentRate, capacityValue]);

  // Generate dynamic data
  const chartData = useMemo(() => generateChartData(calculationParams), [calculationParams]);
  const annualIncrease = useMemo(() => calculateAnnualIncrease(calculationParams), [calculationParams]);
  const maxValue = useMemo(() => Math.max(...chartData.map(d => d.helios)), [chartData]);

  return (
    <div className="w-full bg-gray-50">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 text-center">
          Estimated Rate Comparison
        </h2>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <label className="block text-lg font-semibold text-black mb-3">
              Current Rate per kWh
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-lg font-medium">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={currentRate}
                onChange={(e) => setCurrentRate(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border-2 border-[#fbbf24] rounded-lg text-lg focus:outline-none focus:border-[#f59e0b] bg-gray-200 text-black font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-lg font-semibold text-black mb-3">
              Capacity Allocated to Helios
            </label>
            <select
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="w-full px-4 py-3 border-2 border-[#fbbf24] rounded-lg text-lg focus:outline-none focus:border-[#f59e0b] bg-gray-200 text-black font-medium"
            >
              <option value="250 kW">250 kW</option>
              <option value="500 kW">500 kW</option>
              <option value="750 kW">750 kW</option>
              <option value="1 MW">1 MW</option>
              <option value="1.5 MW">1.5 MW</option>
              <option value="2 MW">2 MW</option>
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg p-4 md:p-8 shadow-sm overflow-hidden">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-600 mb-4 text-center">
              Estimated Cumulative Gross Income by Year
            </h3>
            
            {/* Legend */}
            <div className="flex justify-center gap-6 mb-6">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-black mr-2"></div>
                <span className="text-sm font-medium text-black">Grid</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-[#fbbf24] mr-2"></div>
                <span className="text-sm font-medium text-black">Helios</span>
              </div>
            </div>
          </div>

          {/* Chart Area */}
          <div className="relative overflow-x-auto">
            {/* Y-axis label */}
            <div className="absolute -left-16 md:-left-20 top-1/2 transform -translate-y-1/2 -rotate-90 text-sm font-medium text-gray-600">
              Gross Income ($)
            </div>

            {/* Y-axis ticks */}
            <div className="absolute left-0 h-64 md:h-80 flex flex-col justify-between text-xs text-gray-500 pr-2">
              <span>{formatCurrency(maxValue)}</span>
              <span>{formatCurrency(maxValue * 0.85)}</span>
              <span>{formatCurrency(maxValue * 0.7)}</span>
              <span>{formatCurrency(maxValue * 0.55)}</span>
              <span>{formatCurrency(maxValue * 0.4)}</span>
              <span>{formatCurrency(maxValue * 0.25)}</span>
              <span>{formatCurrency(maxValue * 0.1)}</span>
              <span>$0</span>
            </div>

            {/* Chart bars */}
            <div className="ml-12 md:ml-16 pl-4">
              <div className="flex items-end justify-between h-64 md:h-80 border-l-2 border-b-2 border-gray-300 min-w-[600px]">
                {chartData.map((data, index) => {
                  const gridHeight = (data.grid / maxValue) * 280;
                  const heliosHeight = (data.helios / maxValue) * 280;
                  
                  return (
                    <div key={index} className="flex-1 flex justify-center items-end gap-1 px-0.5 md:px-1">
                      <div className="flex flex-col items-center">
                        {/* Grid bar */}
                        <div className="text-xs font-semibold mb-1 text-center text-black">
                          {formatCurrency(data.grid)}
                        </div>
                        <div 
                          className="w-4 md:w-6 bg-black"
                          style={{ height: `${Math.max(gridHeight * 0.85, 2)}px` }}
                        ></div>
                      </div>
                      
                      <div className="flex flex-col items-center">
                        {/* Helios bar */}
                        <div className="text-xs font-semibold mb-1 text-center text-black">
                          {formatCurrency(data.helios)}
                        </div>
                        <div 
                          className="w-4 md:w-6 bg-[#fbbf24]"
                          style={{ height: `${Math.max(heliosHeight * 0.85, 2)}px` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* X-axis labels */}
              <div className="flex justify-between mt-2 text-xs text-gray-600 min-w-[600px]">
                {chartData.map((data, index) => (
                  <div key={index} className="flex-1 text-center">
                    {data.year}
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis label */}
            <div className="text-center mt-4">
              <span className="text-sm font-medium text-gray-600">Timeline</span>
            </div>
          </div>

          {/* Caption - Dynamic Annual Revenue Increase */}
          <div className="mt-8 text-center">
            <p className="text-lg text-gray-700">
              Annual revenue increase from Helios: <span className="text-3xl font-normal text-black">{formatCurrency(annualIncrease)}</span>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CalculatorSection;