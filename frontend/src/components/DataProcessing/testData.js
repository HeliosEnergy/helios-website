// testData.js - Test data for submarine cables and terrestrial links
export const testCables = {
  features: [
    {
      type: "Feature",
      properties: {
        name: "Trans-Canada Cable System",
        cable_name: "Trans-Canada Cable System",
        length: 2500,
        capacity: "40 Gbps",
        owners: "Bell Canada;Rogers Communications",
        rfs: "2015-06-01",
        start_point: "Vancouver, BC",
        end_point: "St. John's, NL",
        start_country: "Canada",
        end_country: "Canada"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-123.1207, 49.2827], // Vancouver
          [-114.0708, 51.0447], // Calgary
          [-97.1384, 49.8951],  // Winnipeg
          [-79.3832, 43.6532],  // Toronto
          [-71.2080, 46.8139],  // Quebec City
          [-63.1222, 46.2333],  // Charlottetown
          [-52.7093, 47.5615]   // St. John's
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "CANUS-1 Cable System",
        cable_name: "CANUS-1 Cable System",
        length: 1800,
        capacity: "25 Gbps",
        owners: "Telus;Verizon",
        rfs: "2018-03-15",
        start_point: "Seattle, WA",
        end_point: "Vancouver, BC",
        start_country: "United States",
        end_country: "Canada"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-122.3321, 47.6062], // Seattle
          [-123.1207, 49.2827]  // Vancouver
        ]
      }
    }
  ]
};

export const testTerrestrialLinks = {
  features: [
    {
      type: "Feature",
      properties: {
        name: "Alberta Fiber Network",
        description: "Alberta Fiber Network",
        infrastructure_type: "fiber",
        type: "terrestrial"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-114.0708, 51.0447], // Calgary
          [-113.4938, 53.5461], // Edmonton
          [-110.7594, 53.9333], // Fort McMurray
          [-115.5708, 51.1784]  // Banff
        ]
      }
    },
    {
      type: "Feature",
      properties: {
        name: "Ontario Express Link",
        description: "Ontario Express Link",
        infrastructure_type: "microwave",
        type: "terrestrial"
      },
      geometry: {
        type: "LineString",
        coordinates: [
          [-79.3832, 43.6532], // Toronto
          [-75.6972, 45.4215], // Ottawa
          [-80.5400, 43.4668]  // Kitchener
        ]
      }
    }
  ]
};