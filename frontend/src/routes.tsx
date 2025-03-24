import { createBrowserRouter } from "react-router-dom";
import MapPage from "./pages/map/MapPage";
import App from "./App";
import { MapLeafletPage } from "./pages/map/MapLeafletPage";
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
			}
		]
	}
])