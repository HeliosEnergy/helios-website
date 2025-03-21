import React from 'react';

interface MapLeftSidebarProps {
	open: boolean;
	setOpen: (open: boolean) => void;
	showSummerCapacity: boolean;
	setShowSummerCapacity: (show: boolean) => void;
	sizeMultiplier: number;
	setSizeMultiplier: (multiplier: number) => void;
}

export function MapLeftSidebar({ 
	open, 
	setOpen, 
	showSummerCapacity, 
	setShowSummerCapacity,
	sizeMultiplier,
	setSizeMultiplier
}: MapLeftSidebarProps) {
	return (
		<div style={{ width: '100%', height: '100%', padding: '16px', color: 'white' }}>
			<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
				<h2>Map Controls</h2>
				<button onClick={() => setOpen(false)}>{'<'}</button>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h3>Filter Options</h3>
				{/* Add your filter options here */}
			</div>

			{/* Circle Size Control */}
			<div style={{ marginBottom: '20px' }}>
				<h3>Circle Size</h3>
				<div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
					<input 
						type="range" 
						min="0.25" 
						max="20" 
						step="0.25" 
						value={sizeMultiplier} 
						onChange={(e) => setSizeMultiplier(parseFloat(e.target.value))}
						style={{ width: '100%' }}
					/>
					<div style={{ display: 'flex', justifyContent: 'space-between' }}>
						<span>0.25x</span>
						<span>{sizeMultiplier.toFixed(2)}x</span>
						<span>20x</span>
					</div>
				</div>
			</div>

			<div style={{ marginBottom: '20px' }}>
				<h3>Solar Capacity Display</h3>
				<div style={{ 
					display: 'flex', 
					alignItems: 'center',
					background: '#333',
					borderRadius: '20px',
					padding: '5px',
					width: 'fit-content'
				}}>
					<button 
						onClick={() => setShowSummerCapacity(true)}
						style={{
							padding: '8px 16px',
							borderRadius: '15px',
							border: 'none',
							backgroundColor: showSummerCapacity ? '#4CAF50' : 'transparent',
							color: showSummerCapacity ? 'white' : '#ccc',
							fontWeight: showSummerCapacity ? 'bold' : 'normal',
							cursor: 'pointer'
						}}
					>
						Summer
					</button>
					<button 
						onClick={() => setShowSummerCapacity(false)}
						style={{
							padding: '8px 16px',
							borderRadius: '15px',
							border: 'none',
							backgroundColor: !showSummerCapacity ? '#2196F3' : 'transparent',
							color: !showSummerCapacity ? 'white' : '#ccc',
							fontWeight: !showSummerCapacity ? 'bold' : 'normal',
							cursor: 'pointer'
						}}
					>
						Winter
					</button>
				</div>
				<p style={{ fontSize: '0.8rem', marginTop: '5px' }}>
					Toggle between summer and winter capacity for solar plants
				</p>
			</div>

			<div>
				<h3>Legend</h3>
				<div style={{ marginTop: '10px' }}>
					{Object.entries({
						'SOLAR': '#FFD700',
						'WIND': '#87CEEB',
						'COAL': '#A9A9A9',
						'NATURAL GAS': '#4682B4',
						'NUCLEAR': '#FF6347',
						'HYDRO': '#1E90FF',
						'OTHER': '#808080'
					}).map(([type, color]) => (
						<div key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
							<div style={{ 
								width: '15px', 
								height: '15px', 
								backgroundColor: color as string, 
								marginRight: '10px',
								borderRadius: '50%'
							}} />
							<span>{type}</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
