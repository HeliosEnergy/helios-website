import { createBrowserRouter } from "react-router-dom";
import MapPage from "./pages/map/MapPage";
import App from "./App";
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
			}
		]
	}
])