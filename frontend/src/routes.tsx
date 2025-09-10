import { createBrowserRouter } from "react-router-dom";
import MapPage from "./pages/map/MapPage";
import App from "./App";
import { MapLeafletPage } from "./pages/map/MapLeafletPage";
import DeckGLDemoPage from "./pages/map/DeckGLDemoPage";
import SimpleDeckGLDemoPage from "./pages/map/SimpleDeckGLDemoPage";

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <div>Home</div>
			},
			{
				path: "/map",
				element: <MapPage />
			},
			{
				path: "/map-leaflet",
				element: <MapLeafletPage />
			},
			{
				path: "/map-deckgl",
				element: <DeckGLDemoPage />
			},
			{
				path: "/map-deckgl-simple",
				element: <SimpleDeckGLDemoPage />
			}
		]
	}
])