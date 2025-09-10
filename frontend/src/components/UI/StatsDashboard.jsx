// StatsDashboard.jsx
import React from 'react';
import { calculatePowerPlantStats } from '../../utils/dataUtils';
import { getSourceColor } from '../../utils/colorUtils';

const StatsDashboard = ({ powerPlants, cables, terrestrialLinks }) => {
  const stats = calculatePowerPlantStats(powerPlants);
  
  // Calculate cable statistics
  const cableStats = {
    totalCables: cables.length,
    totalLength: cables.reduce((sum, cable) => sum + (cable.length || 0), 0),
    withCapacity: cables.filter(cable => cable.capacity).length
  };
  
  // Calculate terrestrial link statistics
  const terrestrialStats = {
    totalLinks: terrestrialLinks.length,
    byType: {}
  };
  
  terrestrialLinks.forEach(link => {
    const type = link.type || 'unknown';
    if (!terrestrialStats.byType[type]) {
      terrestrialStats.byType[type] = 0;
    }
    terrestrialStats.byType[type]++;
  });

  return (
    <div className="stats-dashboard">
      <h3 className="text-lg font-bold mb-3">Infrastructure Statistics</h3>
      
      <div className="grid grid-cols-1 gap-3">
        {/* Power Plant Stats */}
        <div className="bg-blue-50 p-3 rounded">
          <h4 className="font-semibold text-blue-800">Power Plants</h4>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Plants:</span>
              <span className="font-medium">{stats.plantCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Capacity:</span>
              <span className="font-medium">{Math.round(stats.totalCapacity).toLocaleString()} MW</span>
            </div>
          </div>
          
          {/* Source Breakdown */}
          <div className="mt-2">
            <h5 className="text-xs font-semibold text-gray-600 uppercase">By Source</h5>
            <div className="mt-1 space-y-1">
              {Object.entries(stats.sourceBreakdown).map(([source, data]) => (
                <div key={source} className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <span 
                      className="w-2 h-2 rounded-full mr-2" 
                      style={{ backgroundColor: `rgb(${getSourceColor(source).join(',')})` }}
                    ></span>
                    <span className="capitalize">{source}</span>
                  </div>
                  <div>
                    <span>{data.count} plants</span>
                    <span className="ml-2">({Math.round(data.capacity).toLocaleString()} MW)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Cable Stats */}
        <div className="bg-green-50 p-3 rounded">
          <h4 className="font-semibold text-green-800">Submarine Cables</h4>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Cables:</span>
              <span className="font-medium">{cableStats.totalCables}</span>
            </div>
            <div className="flex justify-between">
              <span>Total Length:</span>
              <span className="font-medium">{Math.round(cableStats.totalLength).toLocaleString()} km</span>
            </div>
            <div className="flex justify-between">
              <span>With Capacity Data:</span>
              <span className="font-medium">{cableStats.withCapacity}</span>
            </div>
          </div>
        </div>
        
        {/* Terrestrial Link Stats */}
        <div className="bg-purple-50 p-3 rounded">
          <h4 className="font-semibold text-purple-800">Terrestrial Links</h4>
          <div className="mt-2 space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Total Links:</span>
              <span className="font-medium">{terrestrialStats.totalLinks}</span>
            </div>
            
            {Object.keys(terrestrialStats.byType).length > 0 && (
              <>
                <h5 className="text-xs font-semibold text-gray-600 uppercase mt-2">By Type</h5>
                <div className="mt-1 space-y-1">
                  {Object.entries(terrestrialStats.byType).map(([type, count]) => (
                    <div key={type} className="flex justify-between text-xs">
                      <span className="capitalize">{type || 'Unknown'}:</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;