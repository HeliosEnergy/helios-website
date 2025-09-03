// Test cases for the Partner Calculator logic
// These tests validate the revenue calculation functions

interface CalculationParams {
  currentRate: number; // $/kWh
  capacity: number; // kW
  hoursPerYear: number;
  heliosMultiplier: number;
}

// Mock the calculation functions for testing
const calculateGridRevenue = (params: CalculationParams, year: number): number => {
  const { currentRate, capacity, hoursPerYear } = params;
  const baseRevenue = currentRate * capacity * hoursPerYear;
  return baseRevenue * year;
};

const calculateHeliosRevenue = (params: CalculationParams, year: number): number => {
  const { currentRate, capacity, hoursPerYear, heliosMultiplier } = params;
  const baseRevenue = currentRate * capacity * hoursPerYear * heliosMultiplier;
  return baseRevenue * year;
};

const calculateAnnualIncrease = (params: CalculationParams): number => {
  const gridAnnual = calculateGridRevenue(params, 1);
  const heliosAnnual = calculateHeliosRevenue(params, 1);
  return heliosAnnual - gridAnnual;
};

// Test cases
describe('Partner Calculator Logic', () => {
  const defaultParams: CalculationParams = {
    currentRate: 0.10,
    capacity: 500,
    hoursPerYear: 8760,
    heliosMultiplier: 7.5
  };

  describe('Grid Revenue Calculation', () => {
    test('should calculate correct grid revenue for year 1', () => {
      const result = calculateGridRevenue(defaultParams, 1);
      const expected = 0.10 * 500 * 8760; // $438,000
      expect(result).toBe(expected);
    });

    test('should calculate cumulative grid revenue for year 5', () => {
      const result = calculateGridRevenue(defaultParams, 5);
      const expected = 0.10 * 500 * 8760 * 5; // $2,190,000
      expect(result).toBe(expected);
    });

    test('should handle different rate values', () => {
      const params = { ...defaultParams, currentRate: 0.15 };
      const result = calculateGridRevenue(params, 1);
      const expected = 0.15 * 500 * 8760; // $657,000
      expect(result).toBe(expected);
    });
  });

  describe('Helios Revenue Calculation', () => {
    test('should calculate correct Helios revenue for year 1', () => {
      const result = calculateHeliosRevenue(defaultParams, 1);
      const expected = 0.10 * 500 * 8760 * 7.5; // $3,285,000
      expect(result).toBe(expected);
    });

    test('should calculate cumulative Helios revenue for year 10', () => {
      const result = calculateHeliosRevenue(defaultParams, 10);
      const expected = 0.10 * 500 * 8760 * 7.5 * 10; // $32,850,000
      expect(result).toBe(expected);
    });

    test('should handle different capacity values', () => {
      const params = { ...defaultParams, capacity: 1000 };
      const result = calculateHeliosRevenue(params, 1);
      const expected = 0.10 * 1000 * 8760 * 7.5; // $6,570,000
      expect(result).toBe(expected);
    });
  });

  describe('Annual Revenue Increase Calculation', () => {
    test('should calculate correct annual increase', () => {
      const result = calculateAnnualIncrease(defaultParams);
      const gridAnnual = 0.10 * 500 * 8760; // $438,000
      const heliosAnnual = 0.10 * 500 * 8760 * 7.5; // $3,285,000
      const expected = heliosAnnual - gridAnnual; // $2,847,000
      expect(result).toBe(expected);
    });

    test('should show higher increase with higher rate', () => {
      const params = { ...defaultParams, currentRate: 0.20 };
      const result = calculateAnnualIncrease(params);
      const gridAnnual = 0.20 * 500 * 8760; // $876,000
      const heliosAnnual = 0.20 * 500 * 8760 * 7.5; // $6,570,000
      const expected = heliosAnnual - gridAnnual; // $5,694,000
      expect(result).toBe(expected);
    });
  });

  describe('Edge Cases', () => {
    test('should handle zero rate', () => {
      const params = { ...defaultParams, currentRate: 0 };
      const gridResult = calculateGridRevenue(params, 1);
      const heliosResult = calculateHeliosRevenue(params, 1);
      
      expect(gridResult).toBe(0);
      expect(heliosResult).toBe(0);
    });

    test('should handle zero capacity', () => {
      const params = { ...defaultParams, capacity: 0 };
      const gridResult = calculateGridRevenue(params, 5);
      const heliosResult = calculateHeliosRevenue(params, 5);
      
      expect(gridResult).toBe(0);
      expect(heliosResult).toBe(0);
    });

    test('should maintain proportional relationship', () => {
      const year1Grid = calculateGridRevenue(defaultParams, 1);
      const year1Helios = calculateHeliosRevenue(defaultParams, 1);
      const ratio1 = year1Helios / year1Grid;

      const year5Grid = calculateGridRevenue(defaultParams, 5);
      const year5Helios = calculateHeliosRevenue(defaultParams, 5);
      const ratio5 = year5Helios / year5Grid;

      expect(ratio1).toBeCloseTo(ratio5, 10);
      expect(ratio1).toBeCloseTo(7.5, 1);
    });
  });
});

// Usage example for manual testing
console.log('=== Calculator Logic Test Examples ===');

const testParams: CalculationParams = {
  currentRate: 0.10,
  capacity: 500,
  hoursPerYear: 8760,
  heliosMultiplier: 7.5
};

console.log('Year 1 Grid Revenue:', calculateGridRevenue(testParams, 1).toLocaleString());
console.log('Year 1 Helios Revenue:', calculateHeliosRevenue(testParams, 1).toLocaleString());
console.log('Annual Increase:', calculateAnnualIncrease(testParams).toLocaleString());

console.log('\\n=== 10-Year Projection ===');
for (let year = 1; year <= 10; year++) {
  const grid = calculateGridRevenue(testParams, year);
  const helios = calculateHeliosRevenue(testParams, year);
  console.log(`Year ${year}: Grid $${(grid/1000000).toFixed(1)}M, Helios $${(helios/1000000).toFixed(1)}M`);
}

export { calculateGridRevenue, calculateHeliosRevenue, calculateAnnualIncrease };
export type { CalculationParams };