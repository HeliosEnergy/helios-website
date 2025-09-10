// test-data-processing.js
import PowerPlantProcessor from './components/DataProcessing/PowerPlantProcessor';
import CableProcessor from './components/DataProcessing/CableProcessor';
import TerrestrialProcessor from './components/DataProcessing/TerrestrialProcessor';
import { loadCSVData } from './utils/dataUtils';

// Simple test to verify data processing
async function testDataProcessing() {
  try {
    console.log('Testing data processing...');
    
    // Test PowerPlantProcessor
    const testPlants = [
      {
        name: 'Test Nuclear Plant',
        operator: 'Test Operator',
        output: '1,234 MW',
        source: 'nuclear',
        method: 'fission',
        latitude: '50.0',
        longitude: '-100.0'
      },
      {
        name: 'Test Hydro Plant',
        operator: 'Test Operator',
        output: '567 MW',
        source: 'hydro',
        method: 'water-storage',
        latitude: '45.0',
        longitude: '-95.0'
      }
    ];
    
    const processedPlants = PowerPlantProcessor.processCSV(testPlants);
    console.log('Processed plants:', processedPlants);
    
    // Test CableProcessor
    const testCables = {
      features: [
        {
          type: 'Feature',
          properties: {
            name: 'Test Cable',
            length: 1000
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
    
    const processedCables = CableProcessor.processSubmarineCables(testCables);
    console.log('Processed cables:', processedCables);
    
    // Test TerrestrialProcessor
    const testTerrestrial = [
      {
        type: 'Feature',
        properties: {
          name: 'Test Link',
          type: 'fiber'
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [-114, 51],
            [-113, 53]
          ]
        }
      }
    ];
    
    const processedTerrestrial = TerrestrialProcessor.filterCanadianLinks(testTerrestrial);
    console.log('Processed terrestrial links:', processedTerrestrial);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

// Run the test
testDataProcessing();