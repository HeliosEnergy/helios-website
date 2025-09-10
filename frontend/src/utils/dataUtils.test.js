// dataUtils.test.js
import { calculateDistance, groupBy, calculatePowerPlantStats } from './dataUtils';

describe('dataUtils', () => {
  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // Test with known distance (approximately 111 km for 1 degree of latitude)
      const coord1 = [0, 0];
      const coord2 = [0, 1];
      const distance = calculateDistance(coord1, coord2);
      expect(distance).toBeCloseTo(111, -1); // Within 10 km
    });
  });

  describe('groupBy', () => {
    it('should group items by property', () => {
      const data = [
        { type: 'A', value: 1 },
        { type: 'B', value: 2 },
        { type: 'A', value: 3 }
      ];

      const grouped = groupBy(data, 'type');
      expect(grouped.A).toHaveLength(2);
      expect(grouped.B).toHaveLength(1);
    });
  });

  describe('calculatePowerPlantStats', () => {
    it('should calculate power plant statistics', () => {
      const powerPlants = [
        { output: 100, source: 'nuclear' },
        { output: 200, source: 'hydro' },
        { output: 150, source: 'nuclear' }
      ];

      const stats = calculatePowerPlantStats(powerPlants);
      expect(stats.plantCount).toBe(3);
      expect(stats.totalCapacity).toBe(450);
      expect(stats.sourceBreakdown.nuclear.count).toBe(2);
      expect(stats.sourceBreakdown.nuclear.capacity).toBe(250);
      expect(stats.sourceBreakdown.hydro.count).toBe(1);
      expect(stats.sourceBreakdown.hydro.capacity).toBe(200);
    });
  });
});