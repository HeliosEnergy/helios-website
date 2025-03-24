import { useState, useEffect, useRef } from "react";
import React from 'react';
import { Helmet } from 'react-helmet';

const MapLeftSidebar = React.lazy(() => import('./components/MapLeftSidebar'));

const leftSideBarClosedWidth = 32;
const leftSideBarOpenWidth = 300;

// Define the power plant data interface for TypeScript type checking
interface PowerPlant {
	id: number;
	name: string;
	latitude: number;
	longitude: number;
	fuel_type: string;
	nameplate_capacity_mw: number;
	net_summer_capacity_mw?: number;
	net_winter_capacity_mw?: number;
	operating_status: string;
	county?: string;
	state?: string;
	last_updated?: string;
}

// Simple debounce function without dependencies
function createDebounce(fn: Function, delay: number) {
	let timeoutId: number | null = null;
	return function(...args: any[]) {
		if (timeoutId) window.clearTimeout(timeoutId);
		timeoutId = window.setTimeout(() => {
			fn(...args);
		}, delay);
	};
}

export default function MapPage() {
	const [leftPanelOpen, setLeftPanelOpen] = useState(false);
	const iframeRef = useRef<HTMLIFrameElement>(null);
	
	// Add state for summer/winter capacity toggle
	const [showSummerCapacity, setShowSummerCapacity] = useState(true);
	
	// Add state for circle size multiplier (default to 15x)
	const [sizeMultiplier, setSizeMultiplier] = useState(15);
	
	// Add state for capacity weight factor (default to 1.0)
	const [capacityWeight, setCapacityWeight] = useState(1.0);

	// Add state for filters
	const [filters, setFilters] = useState({
		fuel_type: null as string | null,
		state: null as string[] | null,
		operating_status: null as string | null,
		min_capacity: null as number | null,
		max_capacity: null as number | null
	});
	
	// Create debounced function to send visual-only parameter changes
	const debouncedPostVisualParams = useRef(createDebounce((params: any) => {
		if (iframeRef.current?.contentWindow) {
			iframeRef.current.contentWindow.postMessage({
				type: 'visualParams',
				...params
			}, window.location.origin);
		}
	}, 100)).current;
	
	// Send visual parameters (debounced)
	useEffect(() => {
		debouncedPostVisualParams({
			showSummerCapacity,
			sizeMultiplier,
			capacityWeight
		});
	}, [showSummerCapacity, sizeMultiplier, capacityWeight]);
	
	// Send filter parameters (immediately, not debounced)
	useEffect(() => {
		if (iframeRef.current?.contentWindow) {
			iframeRef.current.contentWindow.postMessage({
				type: 'filterParams',
				filters
			}, window.location.origin);
		}
	}, [filters]);
	
	return (
		<div style={{ 
			height: "100vh", 
			width: "100%", 
			padding: 0, 
			margin: 0,
			position: "relative",
			overflow: "hidden" 
		}}>
			{/* Left Sidebar */}
			<div style={{
				position: "absolute",
				top: 0,
				left: 0,
				backgroundColor: "rgb(30, 30, 37)",
				borderRight: "2px solid grey",
				boxSizing: "border-box",
				zIndex: 1000,
				display: "flex",
				flexDirection: "row",
				justifyContent: "center",
				alignItems: "center",
				width: leftPanelOpen ? leftSideBarOpenWidth : leftSideBarClosedWidth,
				height: "100vh"
			}}
			onClick={() => {
				if (!leftPanelOpen) {
					setLeftPanelOpen(true)
				}
			}}
			>
				{
					leftPanelOpen ? (
						<MapLeftSidebar 
							open={leftPanelOpen} 
							setOpen={setLeftPanelOpen}
							showSummerCapacity={showSummerCapacity}
							setShowSummerCapacity={setShowSummerCapacity}
							sizeMultiplier={sizeMultiplier}
							setSizeMultiplier={setSizeMultiplier}
							capacityWeight={capacityWeight}
							setCapacityWeight={setCapacityWeight}
							filters={filters}
							setFilters={setFilters}
						/>
					) : (
						<button>{'>'}</button>
					)
				}
			</div>

			{/* Map Container (iframe) */}
			<div style={{ 
				position: "absolute",
				top: 0,
				left: leftPanelOpen ? leftSideBarOpenWidth : leftSideBarClosedWidth,
				right: 0,
				bottom: 0
			}}>
				<iframe 
					ref={iframeRef}
					src="/map-leaflet"
					style={{
						width: '100%',
						height: '100%',
						border: 'none'
					}}
					title="Map"
				/>
			</div>
		</div>
	);
}
