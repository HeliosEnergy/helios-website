// PowerPlantProcessor.test.js
import PowerPlantProcessor from './PowerPlantProcessor';

describe('PowerPlantProcessor', () => {
  describe('parseOutput', () => {
    it('should parse standard MW format', () => {
      expect(PowerPlantProcessor.parseOutput('1,234 MW')).toBe(1234);
    });

    it('should handle decimal values', () => {
      expect(PowerPlantProcessor.parseOutput('1,234.5 MW')).toBe(1234.5);
    });

    it('should return 0 for invalid input', () => {
      expect(PowerPlantProcessor.parseOutput('')).toBe(0);
      expect(PowerPlantProcessor.parseOutput(null)).toBe(0);
      expect(PowerPlantProcessor.parseOutput('invalid')).toBe(0);
    });
  });

  describe('categorizeSource', () => {
    it('should categorize nuclear power', () => {
      const result = PowerPlantProcessor.categorizeSource('nuclear');
      expect(result.type).toBe('nuclear');
      expect(result.color).toEqual([255, 100, 100]);
    });

    it('should categorize hydro power', () => {
      const result = PowerPlantProcessor.categorizeSource('hydro');
      expect(result.type).toBe('hydro');
      expect(result.color).toEqual([100, 150, 255]);
    });

    it('should default to other for unknown sources', () => {
      const result = PowerPlantProcessor.categorizeSource('unknown');
      expect(result.type).toBe('other');
      expect(result.color).toEqual([200, 150, 255]);
    });
  });

  describe('validateCoordinates', () => {
    it('should validate coordinates within North America', () => {
      expect(PowerPlantProcessor.validateCoordinates(50, -100)).toBe(true);
    });

    it('should reject coordinates outside North America', () => {
      expect(PowerPlantProcessor.validateCoordinates(0, 0)).toBe(false);
      expect(PowerPlantProcessor.validateCoordinates(90, -100)).toBe(false);
    });
  });

  describe('processCSV', () => {
    it('should process valid CSV data', () => {
      const csvData = [
        {
          name: 'Test Plant',
          operator: 'Test Operator',
          output: '1,000 MW',
          source: 'nuclear',
          method: 'fission',
          wikidata_id: 'Q123456',
          latitude: '50.0',
          longitude: '-100.0'
        }
      ];

      const result = PowerPlantProcessor.processCSV(csvData);
      expect(result.length).toBe(1);
      expect(result[0].name).toBe('Test Plant');
      expect(result[0].output).toBe(1000);
      expect(result[0].source).toBe('nuclear');
      expect(result[0].coordinates).toEqual([-100.0, 50.0]);
    });

    it('should skip invalid coordinates', () => {
      const csvData = [
        {
          name: 'Invalid Plant',
          operator: 'Test Operator',
          output: '1,000 MW',
          source: 'nuclear',
          method: 'fission',
          latitude: '0.0',
          longitude: '0.0' // Outside North America
        }
      ];

      const result = PowerPlantProcessor.processCSV(csvData);
      expect(result.length).toBe(0);
    });
  });
});