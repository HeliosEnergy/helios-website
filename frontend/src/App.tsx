import './App.css'
import { Outlet } from 'react-router-dom'

export function App() {

	return (
		<>
			<div className="min-h-screen bg-gray-50">
				{/* Header */}
				<header className="bg-white shadow-sm">
					<div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
						<h1 className="text-3xl font-bold text-gray-900">Helios Infrastructure Visualization</h1>
						<p className="mt-2 text-gray-600">Interactive visualization of North American energy infrastructure</p>
					</div>
				</header>

				{/* Navigation */}
				<nav className="bg-gray-100 border-b border-gray-200">
					<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex flex-wrap space-x-8 py-4">
							<a 
								href="/" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
								</svg>
								Home
							</a>
							<a 
								href="/map" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								Existing Map
								<span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">Basic</span>
							</a>
							<a 
								href="/map-leaflet" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								Leaflet Map
								<span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Interactive</span>
							</a>
							<a 
								href="/map-deckgl" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								Deck.gl Map
								<span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Advanced</span>
							</a>
							<a 
								href="/map-deckgl-simple" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
								</svg>
								Simple Deck.gl
								<span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Demo</span>
							</a>
							<a 
								href="/test-styling" 
								className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-200 transition-colors duration-200 flex items-center"
							>
								<svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
								</svg>
								Test Styling
								<span className="ml-2 text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full">Debug</span>
							</a>
						</div>
					</div>
				</nav>

				{/* Main Content */}
				<main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
					<div className="bg-white rounded-lg shadow p-6">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">Available Maps</h2>
						
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-blue-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Existing Map</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Traditional map implementation with basic features</p>
								<a 
									href="/map" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 mt-auto"
								>
									View Map
								</a>
							</div>
							
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-green-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Leaflet Implementation</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Interactive map using Leaflet.js library with enhanced features</p>
								<a 
									href="/map-leaflet" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 mt-auto"
								>
									View Map
								</a>
							</div>
							
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-purple-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Deck.gl Implementation</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Advanced WebGL-powered visualization with 3D capabilities</p>
								<a 
									href="/map-deckgl" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 mt-auto"
								>
									View Map
								</a>
							</div>
							
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-yellow-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Simple Deck.gl Demo</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Simplified version of the Deck.gl implementation for learning</p>
								<a 
									href="/map-deckgl-simple" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors duration-200 mt-auto"
								>
									View Demo
								</a>
							</div>
							<div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
								<div className="flex items-center mb-3">
									<div className="p-2 bg-yellow-100 rounded-lg mr-3">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
										</svg>
									</div>
									<h3 className="text-lg font-medium text-gray-900">Test Styling</h3>
								</div>
								<p className="text-gray-600 text-sm mb-4 flex-grow">Debug page to verify Tailwind CSS is working correctly</p>
								<a 
									href="/test-styling" 
									className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200 mt-auto"
								>
									View Test
								</a>
							</div>
						</div>
					</div>
				</main>
			</div>
			<Outlet/>
		</>
	)
}

export default App