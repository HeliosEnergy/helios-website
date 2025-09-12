// StatsDashboard.jsx
import React, { useState } from 'react';
import { calculatePowerPlantStats } from '../../utils/dataUtils';
import { getSourceColor } from '../../utils/colorUtils';

const StatsDashboard = ({ powerPlants, cables, terrestrialLinks }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
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

  // REPLACE the collapsed state return with:
  if (isCollapsed) {
    return (
      <div className="bg-white/95 p-2 rounded-lg shadow-lg backdrop-blur-sm">
        <button 
          onClick={() => setIsCollapsed(false)}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span>Stats</span>
        </button>
      </div>
    );
  }

  // AND update the main return to be more compact:
  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg">
      <div className="p-3">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-sm font-bold text-white">Infrastructure Stats</h3>
          <button 
            onClick={() => setIsCollapsed(true)}
            className="text-gray-300 hover:text-white focus:outline-none"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        </div>
        
        <div className="space-y-2">
          {/* Power Plant Stats */}
          <div className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-2 rounded border border-blue-700/50">
            <div className="flex items-center mb-1">
              <div className="p-1 bg-blue-600 rounded">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-200 ml-1 text-xs">Power Plants</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">Total:</span>
                <span className="font-medium text-white">{stats.plantCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Capacity:</span>
                <span className="font-medium text-white">{Math.round(stats.totalCapacity).toLocaleString()} MW</span>
              </div>
            </div>
            
            {/* Source Breakdown */}
            <div className="mt-1 pt-1 border-t border-blue-700/50">
              <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">By Source</h5>
              <div className="mt-1 space-y-1">
                {Object.entries(stats.sourceBreakdown).map(([source, data]) => (
                  <div key={source} className="flex items-center justify-between text-xs">
                    <div className="flex items-center">
                      <span 
                        className="w-2 h-2 rounded-full mr-1 border border-gray-400" 
                        style={{ backgroundColor: `rgb(${getSourceColor(source).join(',')})` }}
                      ></span>
                      <span className="capitalize text-white">{source}</span>
                    </div>
                    <div className="text-white">
                      <span className="font-medium">{data.count.toLocaleString()}</span>
                      <span className="ml-1">({Math.round(data.capacity).toLocaleString()} MW)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Cable Stats */}
          <div className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-2 rounded border border-green-700/50">
            <div className="flex items-center mb-1">
              <div className="p-1 bg-green-600 rounded">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
              <h4 className="font-semibold text-green-200 ml-1 text-xs">Submarine Cables</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">Total:</span>
                <span className="font-medium text-white">{cableStats.totalCables.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Length:</span>
                <span className="font-medium text-white">{Math.round(cableStats.totalLength).toLocaleString()} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">With Capacity:</span>
                <span className="font-medium text-white">{cableStats.withCapacity.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          {/* Terrestrial Link Stats */}
          <div className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-2 rounded border border-purple-700/50">
            <div className="flex items-center mb-1">
              <div className="p-1 bg-purple-600 rounded">
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-purple-200 ml-1 text-xs">Terrestrial Links</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-300">Total:</span>
                <span className="font-medium text-white">{terrestrialStats.totalLinks.toLocaleString()}</span>
              </div>
              
              {Object.keys(terrestrialStats.byType).length > 0 && (
                <div className="pt-1 border-t border-purple-700/50">
                  <h5 className="text-xs font-semibold text-gray-300 uppercase tracking-wide">By Type</h5>
                  <div className="mt-1 space-y-1">
                    {Object.entries(terrestrialStats.byType).map(([type, count]) => (
                      <div key={type} className="flex justify-between text-xs">
                        <span className="capitalize text-white">{type || 'Unknown'}:</span>
                        <span className="font-medium text-white">{count.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;