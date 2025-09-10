// CableProcessor.test.js
import CableProcessor from './CableProcessor';

describe('CableProcessor', () => {
  describe('processSubmarineCables', () => {
    it('should process submarine cable data', () => {
      const geoJsonData = {
        features: [
          {
            type: 'Feature',
            properties: {
              name: 'Test Cable',
              length: 1000,
              capacity: '10 Gbps'
            },
            geometry: {
              type: 'LineString',
              coordinates: [
                [-123, 49],
                [-73, 40]
              ]
            }
          }
        ]
      };

      const result = CableProcessor.processSubmarineCables(geoJsonData);
      expect(result.cables).toHaveLength(1);
      expect(result.cables[0].name).toBe('Test Cable');
      expect(result.cables[0].length).toBe(1000);
      expect(result.landingPoints).toHaveLength(2);
    });
  });

  describe('isNorthAmericanCoordinate', () => {
    it('should identify North American coordinates', () => {
      expect(CableProcessor.isNorthAmericanCoordinate(50, -100)).toBe(true);
    });

    it('should reject non-North American coordinates', () => {
      expect(CableProcessor.isNorthAmericanCoordinate(0, 0)).toBe(false);
    });
  });
});