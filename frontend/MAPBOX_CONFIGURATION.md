# Mapbox Configuration Guide

## Overview

This application uses Mapbox for the base map layer in the DeckGL visualization. To use the map functionality, you need a valid Mapbox access token.

## Obtaining a Mapbox Access Token

1. Go to [Mapbox](https://www.mapbox.com/) and create an account
2. Navigate to your account dashboard
3. Find the "Access tokens" section
4. Either use the default public token or create a new one
5. Copy the token value

## Configuring the Access Token

The application expects the Mapbox access token to be set as an environment variable. You need to update the following files with your valid token:

### Development Environment (.env.dev)
```
VITE_MAPBOX_ACCESS_TOKEN=your_valid_mapbox_token_here
VITE_API_SERVER_URL=http://localhost:4777
```

### Production Environment (.env.production)
```
VITE_MAPBOX_ACCESS_TOKEN=your_valid_mapbox_token_here
VITE_API_SERVER_URL=https://api-data-analysis.heliosenergy.io
```

### Default Environment (.env)
```
VITE_MAPBOX_ACCESS_TOKEN=your_valid_mapbox_token_here
VITE_API_SERVER_URL=http://localhost:4777
```

## Token Requirements

Make sure your Mapbox token has the following scopes:
- `styles:tiles` - for accessing map tiles
- `fonts` - for map fonts
- `sprites` - for map sprites

## Troubleshooting

If you're still seeing Mapbox errors after configuring your token:

1. Ensure the token is correctly copied without extra spaces
2. Restart the development server after updating the token
3. Check browser developer console for specific error messages
4. Verify your token has the required scopes in your Mapbox account

## Map Styles

The application currently uses the `satellite-streets-v12` style. You can change this in the DeckGLMap.jsx file:

```javascript
<Map
  mapboxAccessToken={MAPBOX_ACCESS_TOKEN}
  mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
  style={{ width: '100%', height: '100%' }}
/>
```

Available Mapbox styles include:
- `mapbox://styles/mapbox/streets-v11`
- `mapbox://styles/mapbox/outdoors-v11`
- `mapbox://styles/mapbox/light-v10`
- `mapbox://styles/mapbox/dark-v10`
- `mapbox://styles/mapbox/satellite-v9`
- `mapbox://styles/mapbox/satellite-streets-v12`
- `mapbox://styles/mapbox/navigation-day-v1`
- `mapbox://styles/mapbox/navigation-night-v1`

## Security Note

Never commit your Mapbox access token to version control. The .env files are included in .gitignore to prevent accidental exposure.