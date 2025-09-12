// src/routes.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import MapPage from "./pages/map/MapPage";
import { MapLeafletPage } from "./pages/map/MapLeafletPage";
import DeckGLDemoPage from "./pages/map/DeckGLDemoPage";
import SimpleDeckGLDemoPage from "./pages/map/SimpleDeckGLDemoPage";
import TestStyling from "./TestStyling";
import TailwindTest from "./TailwindTest"; // Assuming TailwindTest.jsx is in src/

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			// All your normal app routes are here
			{ path: "/", element: <div>Home Page Content</div> },
			{ path: "/map", element: <MapPage /> },
			{ path: "/map-leaflet", element: <MapLeafletPage /> },
			{ path: "/map-deckgl", element: <DeckGLDemoPage /> },
			{ path: "/map-deckgl-simple", element: <SimpleDeckGLDemoPage /> },
			{ path: "/test-styling", element: <TestStyling /> },
		]
	},
	// --- NEW ISOLATED ROUTE ---
	// This route is now completely separate from the <App> layout.
	{
		path: "/tailwind-test",
		element: <TailwindTest />,
	}
]);