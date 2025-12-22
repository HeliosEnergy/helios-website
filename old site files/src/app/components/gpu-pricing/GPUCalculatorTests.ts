// GPU Rental Calculator - Calculation Tests

import { calculatePricing, calculatorGPUModels, reservationPeriods } from './GPUPricingData';

// Test suite for GPU rental calculator calculations
export const runCalculatorTests = () => {
  console.log('🧪 Running GPU Rental Calculator Tests...\n');

  let passedTests = 0;
  let totalTests = 0;

  // Helper function to run a test
  interface PricingResult {
    baseCost: number;
    discountAmount: number;
    totalCost: number;
    effectiveRate: number;
  }

  const runTest = (testName: string, expected: PricingResult | number, actual: PricingResult | number) => {
    totalTests++;
    const passed = JSON.stringify(expected) === JSON.stringify(actual);
    if (passed) {
      passedTests++;
      console.log(`✅ ${testName}: PASSED`);
    } else {
      console.log(`❌ ${testName}: FAILED`);
      console.log(`   Expected:`, expected);
      console.log(`   Actual:`, actual);
    }
  };

  // Test 1: Basic calculation - No discount
  const test1 = calculatePricing(1.0, 1, 100, 0);
  runTest('Basic calculation (1 GPU, $1/hr, 100hrs, 0% discount)', {
    baseCost: 100,
    discountAmount: 0,
    totalCost: 100,
    effectiveRate: 1.0
  }, test1);

  // Test 2: Multiple GPUs
  const test2 = calculatePricing(2.0, 3, 200, 0);
  runTest('Multiple GPUs (3 GPUs, $2/hr, 200hrs, 0% discount)', {
    baseCost: 1200,
    discountAmount: 0,
    totalCost: 1200,
    effectiveRate: 2.0
  }, test2);

  // Test 3: With discount
  const test3 = calculatePricing(1.0, 1, 100, 10);
  runTest('With 10% discount (1 GPU, $1/hr, 100hrs, 10% discount)', {
    baseCost: 100,
    discountAmount: 10,
    totalCost: 90,
    effectiveRate: 0.9
  }, test3);

  // Test 4: Maximum discount
  const test4 = calculatePricing(2.47, 1, 730, 15);
  runTest('Maximum discount (H100 NVL, 1 GPU, 730hrs, 15% discount)', {
    baseCost: 1803.1,
    discountAmount: 270.465,
    totalCost: 1532.635,
    effectiveRate: 2.0995
  }, test4);

  // Test 5: Edge case - Minimum values
  const test5 = calculatePricing(0.87, 1, 1, 0);
  runTest('Minimum values (L40S, 1 GPU, 1hr, 0% discount)', {
    baseCost: 0.87,
    discountAmount: 0,
    totalCost: 0.87,
    effectiveRate: 0.87
  }, test5);

  // Test 6: Edge case - Maximum values
  const test6 = calculatePricing(2.47, 100, 730, 15);
  runTest('Maximum values (H100 NVL, 100 GPUs, 730hrs, 15% discount)', {
    baseCost: 180310,
    discountAmount: 27046.5,
    totalCost: 153263.5,
    effectiveRate: 2.0995
  }, test6);

  // Test 7: Real scenario - L40S with 1 month commitment
  const l40s = calculatorGPUModels.find(gpu => gpu.id === 'l40s')!;
  const oneMonth = reservationPeriods.find(period => period.id === '1-month')!;
  const test7 = calculatePricing(l40s.pricePerHour, 5, 500, oneMonth.discount);
  runTest('Real scenario (L40S, 5 GPUs, 500hrs, 1-month 10% discount)', {
    baseCost: 2175,
    discountAmount: 217.5,
    totalCost: 1957.5,
    effectiveRate: 0.783
  }, test7);

  // Test 8: Real scenario - H100 SXM with 3 months commitment
  const h100sxm = calculatorGPUModels.find(gpu => gpu.id === 'h100-sxm')!;
  const threeMonths = reservationPeriods.find(period => period.id === '3-months')!;
  const test8 = calculatePricing(h100sxm.pricePerHour, 2, 730, threeMonths.discount);
  runTest('Real scenario (H100 SXM, 2 GPUs, 730hrs, 3-months 15% discount)', {
    baseCost: 3285,
    discountAmount: 492.75,
    totalCost: 2792.25,
    effectiveRate: 1.9125
  }, test8);

  // Test 9: Zero edge case validation
  const test9 = calculatePricing(1.0, 0, 100, 10);
  runTest('Zero GPUs edge case (should result in zero cost)', {
    baseCost: 0,
    discountAmount: 0,
    totalCost: 0,
    effectiveRate: 0.9
  }, test9);

  // Test 10: Zero hours edge case
  const test10 = calculatePricing(1.0, 5, 0, 5);
  runTest('Zero hours edge case (should result in zero cost)', {
    baseCost: 0,
    discountAmount: 0,
    totalCost: 0,
    effectiveRate: 0.95
  }, test10);

  // Test 11: Cost per hour verification
  const test11 = calculatePricing(2.25, 1, 730, 0);
  const costPerHour = test11.totalCost / 730;
  runTest('Cost per hour verification (should equal base rate)', 2.25, Number(costPerHour.toFixed(2)));

  // Test 12: Proportional discount test
  const test12a = calculatePricing(1.0, 1, 100, 20);
  const test12b = calculatePricing(2.0, 1, 100, 20);
  const ratio = test12b.totalCost / test12a.totalCost;
  runTest('Proportional discount test (2x rate should equal 2x cost)', 2, Number(ratio.toFixed(2)));

  // Test 13: All GPU models pricing consistency
  calculatorGPUModels.forEach((gpu) => {
    const test = calculatePricing(gpu.pricePerHour, 1, 730, 0);
    const expectedCost = gpu.pricePerHour * 730;
    runTest(`GPU ${gpu.name} base calculation consistency`, expectedCost, test.baseCost);
  });

  // Test 14: All reservation periods discount consistency
  reservationPeriods.forEach((period) => {
    const test = calculatePricing(1.0, 1, 100, period.discount);
    const expectedEffectiveRate = 1.0 * (1 - period.discount / 100);
    runTest(`${period.label} discount rate consistency`, 
      Number(expectedEffectiveRate.toFixed(4)), 
      Number(test.effectiveRate.toFixed(4))
    );
  });

  // Summary
  console.log(`\n📊 Test Results: ${passedTests}/${totalTests} tests passed`);
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Calculator logic is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please review the calculation logic.');
  }

  return {
    totalTests,
    passedTests,
    allPassed: passedTests === totalTests
  };
};

// Export for use in development/debugging
export default runCalculatorTests;