import { useState, useEffect, useRef } from "react";
import React from 'react';
import './Map.scss';
import { MdArrowForwardIos } from "react-icons/md";
import { DEFAULT_CAPACITY_WEIGHT, DEFAULT_COLORING_MODE, DEFAULT_SHOW_SUMMER_CAPACITY, DEFAULT_SIZE_MULTIPLIER, MapColorings, operatingStatusColors, operatingStatusDisplayNames, DEFAULT_SIZE_BY_OPTION, SizeByOption } from "./MapValueMappings";
import { fuelTypeColors, fuelTypeDisplayNames } from "./MapValueMappings";

const MapLeftSidebar = React.lazy(() => import('./components/MapLeftSidebar'));

const leftSideBarClosedWidth = 32;
const leftSideBarOpenWidth = 300;




// Simple debounce function without dependencies
function createDebounce(fn: Function, delay: number) {
	let timeoutId: number | null = null;
	return function (...args: any[]) {
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
	const [showSummerCapacity, setShowSummerCapacity] = useState(DEFAULT_SHOW_SUMMER_CAPACITY);

	// Add state for circle size multiplier (default to 15x)
	const [sizeMultiplier, setSizeMultiplier] = useState(DEFAULT_SIZE_MULTIPLIER);

	// Add state for capacity weight factor (default to 1.0)
	const [capacityWeight, setCapacityWeight] = useState(DEFAULT_CAPACITY_WEIGHT);

	// Add state for coloring by capacity factor
	const [coloringMode, setColoringMode] = useState<MapColorings>(DEFAULT_COLORING_MODE);

	// Add state for filters
	const [filters, setFilters] = useState({
		fuel_type: null as string[] | null,
		state: null as string[] | null,
		operating_status: null as string[] | null,
		min_capacity: null as number | null,
		max_capacity: null as number | null,
		min_capacity_factor: null as number | null,
		max_capacity_factor: null as number | null
	});

	// Add state for sizing by capacity factor
	const [sizeByOption, setSizeByOption] = useState<SizeByOption>(DEFAULT_SIZE_BY_OPTION);

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
			capacityWeight,
			coloringMode,
			sizeByOption
		});
	}, [showSummerCapacity, sizeMultiplier, capacityWeight, coloringMode, sizeByOption]);

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
							coloringMode={coloringMode}
							setColoringMode={setColoringMode}
							filters={filters}
							setFilters={setFilters}
							sizeByOption={sizeByOption}
							setSizeByOption={setSizeByOption}
						/>
					) : (
						<MdArrowForwardIos color="white" />
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

			<div style={{
				position: "absolute",
				top: 16,
				right: 16,
				maxWidth: "150px",
				maxHeight: "75%",
				border: "3px solid rgba(33, 33, 33, 1)",
				borderRadius: "6px",
				backgroundColor: "rgba(33, 33, 33, 0.85)",
				zIndex: 1000,
				padding: "16px",
				paddingTop: "8px",
				paddingBottom: "4px",
				color: "white",
				display: "flex",
				flexDirection: "column"
			}}>

				<h5 style={{ textAlign: "center" }}> {sizeByOption === "nameplate_capacity" ? "Nameplate Capacity" : sizeByOption === "capacity_factor" ? "Capacity Factor" : "Generation"}</h5>
				<div
					style={{
						marginTop: "6px",
						marginBottom: "4px",
						border: "1px solid white",
						borderRadius: "10px",
						textAlign: "center"
					}}>

				</div>
				<h5 style={{ margin: "0 0 6px 0", textAlign: "center" }}>{coloringMode === "fuelType" ? "Fuel Type" : "Capacity Factor"}</h5>

				<div style={{
					overflowY: "auto",
					marginTop: "0px",
					maxHeight: "calc(75vh - 50px)",
					scrollbarWidth: "thin",
					scrollbarColor: "rgba(255, 255, 255, 0.5) transparent"
				}}>
					{coloringMode === "capacityFactor" && (
						<div style={{ fontSize: '12px' }}>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#444444', marginRight: '5px', border: "1px solid white" }}></div>
								<span>N/A</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#00ff00', marginRight: '5px', border: "1px solid white" }}></div>
								<span>&lt;{Math.round((filters.max_capacity_factor || 100) * 0.2)}%</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#88ff00', marginRight: '5px', border: "1px solid white" }}></div>
								<span>{Math.round((filters.max_capacity_factor || 100) * 0.2)}-{Math.round((filters.max_capacity_factor || 100) * 0.4)}%</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ffff00', marginRight: '5px', border: "1px solid white" }}></div>
								<span>{Math.round((filters.max_capacity_factor || 100) * 0.4)}-{Math.round((filters.max_capacity_factor || 100) * 0.6)}%</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ff8800', marginRight: '5px', border: "1px solid white" }}></div>
								<span>{Math.round((filters.max_capacity_factor || 100) * 0.6)}-{Math.round((filters.max_capacity_factor || 100) * 0.8)}%</span>
							</div>
							<div style={{ display: 'flex', alignItems: 'center' }}>
								<div style={{ width: '12px', height: '12px', backgroundColor: '#ff0000', marginRight: '5px', border: "1px solid white" }}></div>
								<span>&gt;{Math.round((filters.max_capacity_factor || 100) * 0.8)}%</span>
							</div>
						</div>
					)}

					{coloringMode === "fuelType" && Object.entries(fuelTypeColors).map(([fuelType, color]) => (
						<div key={fuelType} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '16px' }}>
							<div style={{ width: '12px', height: '12px', backgroundColor: color, border: "1px solid white", marginRight: '5px' }}></div>
							<span>{fuelTypeDisplayNames[fuelType as keyof typeof fuelTypeDisplayNames]}</span>
						</div>
					))}

					{coloringMode === "operatingStatus" && Object.entries(operatingStatusColors).map(([operatingStatus, color]) => (
						<div key={operatingStatus} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px', fontSize: '16px' }}>
							<div style={{ width: '12px', height: '12px', backgroundColor: color, border: "1px solid white", marginRight: '5px' }}></div>
							<span>{operatingStatusDisplayNames[operatingStatus as keyof typeof operatingStatusDisplayNames]}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
