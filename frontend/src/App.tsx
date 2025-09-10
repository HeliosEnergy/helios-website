import './App.css'
import { Outlet } from 'react-router-dom'

export function App() {

	return (
		<>
			<div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
				<h1>Helios Infrastructure Visualization</h1>
				<p>Welcome to the Helios infrastructure visualization platform.</p>
				
				<div style={{ marginTop: '20px' }}>
					<h2>Available Maps</h2>
					<ul>
						<li><a href="/map">Existing Map Implementation</a></li>
						<li><a href="/map-leaflet">Leaflet Map Implementation</a></li>
						<li><a href="/map-deckgl">Deck.gl Map Implementation (New)</a></li>
						<li><a href="/map-deckgl-simple">Deck.gl Simple Test</a></li>
					</ul>
				</div>
				
				<div style={{ marginTop: '20px' }}>
					<h2>Demo Information</h2>
					<p>For a detailed overview of the Deck.gl implementation, visit:</p>
					<p><a href="/DECKGL_DEMO.html">Deck.gl Implementation Demo</a></p>
				</div>
			</div>
			<Outlet/>
		</>
	)
}

export default App