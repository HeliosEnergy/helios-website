# Deck.gl North America Infrastructure Map

## Overview

This implementation provides an interactive web-based map visualization using Deck.gl to display critical infrastructure in North America, with a focus on Canadian power plants, submarine cables, and terrestrial communication links.

## Features

- Interactive visualization of Canadian power plants with capacity and source information
- Submarine cable routes with landing point markers
- Terrestrial communication links
- Layer controls for toggling different infrastructure types
- Filtering by power plant source type and capacity
- Information panels for detailed data on selected features
- Statistics dashboard showing infrastructure metrics
- Responsive design for desktop and mobile devices

## Technology Stack

- **Framework**: React with Deck.gl
- **Mapping**: Mapbox GL JS base layer
- **Data Processing**: Custom parsers for CSV, GeoJSON/GPKG
- **Styling**: Tailwind CSS
- **State Management**: React hooks (useState, useEffect)

## Project Structure

```
src/
├── components/
│   ├── Map/
│   │   ├── DeckGLMap.jsx
│   │   ├── LayerControls.jsx
│   │   └── InfoPanel.jsx
│   ├── DataProcessing/
│   │   ├── PowerPlantProcessor.js
│   │   ├── CableProcessor.js
│   │   └── TerrestrialProcessor.js
│   └── UI/
│       ├── Legend.jsx
│       ├── FilterPanel.jsx
│       └── StatsDashboard.jsx
├── data/
│   ├── powerplants.csv
│   ├── submarine-cables.gpkg
│   └── processed/
├── utils/
│   ├── dataUtils.js
│   ├── colorUtils.js
│   └── geoUtils.js
└── styles/
    └── map.css
```

## Data Models

### PowerPlant Interface
```typescript
interface PowerPlant {
  id: string;
  name: string;
  operator: string;
  output: number; // MW
  outputDisplay: string; // "6,232 MW"
  source: 'nuclear' | 'hydro' | 'gas' | 'coal' | 'wind' | 'solar' | 'other';
  method: string;
  wikidataId?: string;
  latitude: number;
  longitude: number;
  coordinates: [number, number]; // [lng, lat] for Deck.gl
}
```

### Cable Interface
```typescript
interface SubmarineCable {
  id: string;
  name: string;
  coordinates: number[][]; // Array of [lng, lat] pairs
  length: number;
  capacity?: string;
  owners?: string[];
  rfs?: string; // Ready for service date
  landing_points: LandingPoint[];
}

interface LandingPoint {
  name: string;
  country: string;
  coordinates: [number, number];
}
```

### Terrestrial Link Interface
```typescript
interface TerrestrialLink {
  id: string;
  name?: string;
  coordinates: number[][]; // Line geometry
  type: string;
  country: string;
  properties: Record<string, any>;
}
```

## Implementation Details

### Data Processing Pipeline

The data processing pipeline consists of three main processors:

1. **PowerPlantProcessor.js** - Parses CSV power plant data, cleans data, and validates entries
2. **CableProcessor.js** - Processes submarine cables from GeoJSON/GPKG data
3. **TerrestrialProcessor.js** - Handles terrestrial link data processing

### Deck.gl Layer Implementation

The visualization uses several Deck.gl layers:

1. **ScatterplotLayer** for power plants, sized by capacity
2. **PathLayer** for submarine cables and terrestrial links
3. **ScatterplotLayer** for landing points

### Color Scheme

The implementation uses a consistent color scheme for different infrastructure types:

- Nuclear: Red
- Hydro: Blue
- Gas: Orange
- Coal: Gray
- Wind: Light Green
- Solar: Yellow
- Other: Purple
- Submarine Cables: Ocean Blue
- Terrestrial Links: Magenta
- Landing Points: Orange

## Performance Optimization

- Coordinate precision reduction (4-6 decimal places)
- Data clustering for dense regions
- Viewport-based data loading
- Caching of processed data in sessionStorage
- Use of Deck.gl's built-in GPU acceleration

## Accessibility & Responsive Design

- Keyboard navigation support
- Screen reader compatible descriptions
- High contrast mode option
- Focus indicators for interactive elements
- Responsive breakpoints for mobile, tablet, and desktop

## Running the Application

1. Install dependencies: `npm install`
2. Configure Mapbox access token (see [MAPBOX_CONFIGURATION.md](MAPBOX_CONFIGURATION.md))
3. Start development server: `npm run dev`
4. Access the application at `http://localhost:9729`

## Accessing the Deck.gl Map

The Deck.gl map implementation can be accessed at: `/map-deckgl`

For a detailed overview of the implementation, visit: `/DECKGL_DEMO.html`

## Testing

Unit tests are available for the data processing components:
- PowerPlantProcessor.test.js
- CableProcessor.test.js
- dataUtils.test.js

Run tests with: `npm test` (if test script is configured)

## Future Enhancements

- Complete GPKG parsing implementation
- Full ITU WFS integration for terrestrial links
- Advanced clustering for dense regions
- Export functionality for map views
- Enhanced accessibility features
- Mobile-responsive design improvements