// Utility functions for pricing calculations

export interface PricingCalculation {
    baseCost: number;
    discountAmount: number;
    totalCost: number;
    effectiveRate: number;
}

/**
 * Calculate pricing with discount applied
 * @param baseRate - Base hourly rate
 * @param quantity - Number of GPU units
 * @param hours - Hours per month
 * @param discountPercent - Discount percentage (0-100)
 * @returns Pricing breakdown
 */
export const calculatePricing = (
    baseRate: number,
    quantity: number,
    hours: number,
    discountPercent: number
): PricingCalculation => {
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

/**
 * Calculate total cost for entire reservation period
 * @param monthlyCost - Monthly cost
 * @param periodId - Reservation period ID
 * @returns Total cost for the period
 */
export const calculateTotalReservationCost = (
    monthlyCost: number,
    periodId: string
): number => {
    const periodMonths: Record<string, number> = {
        'on-demand': 1,
        'quarterly': 1,
        '1-month': 1,
        'semi-annually': 3,
        '3-months': 3,
        'annually': 6,
        '6-months': 6,
        'two-years': 12,
        '12-months': 12
    };

    const months = periodMonths[periodId] || 1;
    return monthlyCost * months;
};

/**
 * Format price for display
 * @param price - Price value
 * @param decimals - Number of decimal places
 * @returns Formatted price string
 */
export const formatPrice = (price: number, decimals: number = 2): string => {
    return price.toFixed(decimals);
};

/**
 * Parse price string that might be "Not listed" or a number
 * @param priceStr - Price string from provider
 * @returns Parsed price or null if not available
 */
export const parseProviderPrice = (priceStr: string): number | null => {
    if (!priceStr || priceStr.toLowerCase().includes('not')) {
        return null;
    }

    // Handle price ranges like "1.86-2.24"
    if (priceStr.includes('-')) {
        const prices = priceStr.split('-').map(p => parseFloat(p.trim()));
        return prices[0]; // Return the lower price
    }

    const price = parseFloat(priceStr);
    return isNaN(price) ? null : price;
};
