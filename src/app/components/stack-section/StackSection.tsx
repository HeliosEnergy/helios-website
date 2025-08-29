'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';

interface StackMarker {
  id: string;
  x: number; // Position as percentage from left
  y: number; // Position as percentage from top
  title: string;
  description: string;
  details: string[];
}

interface StackSectionProps {
  className?: string;
}

const stackMarkers: StackMarker[] = [
  {
    id: 'cloud-management',
    x: 75, // Top cloud/management layer
    y: 15,
    title: 'AI Software Platform',
    description: 'Managed platform as a service',
    details: [
      'Model deployment & orchestration',
      'Auto-scaling capabilities'
    ]
  },
  {
    id: 'compute-infrastructure',
    x: 25, // Data center building
    y: 35,
    title: 'Data Center Infrastructure',
    description: 'Enterprise computing facilities',
    details: [
      'Purpose-built AI facilities',
      'Advanced cooling systems'
    ]
  },
  {
    id: 'gpu-clusters',
    x: 75, // GPU cluster area
    y: 55,
    title: 'GPU Clusters',
    description: 'High-performance AI hardware',
    details: [
      'NVIDIA H100 & A100 GPUs',
      'Optimized for LLM training'
    ]
  },
  {
    id: 'energy-systems',
    x: 25, // Solar/energy infrastructure
    y: 75,
    title: 'Energy Systems',
    description: 'Sustainable power infrastructure',
    details: [
      'Solar arrays with storage',
      'Carbon-neutral operations'
    ]
  }
];

const StackSection: React.FC<StackSectionProps> = ({ className = '' }) => {
  const [activeMarker, setActiveMarker] = useState<string | null>(null);

  const handleMarkerClick = (markerId: string) => {
    setActiveMarker(activeMarker === markerId ? null : markerId);
  };

  const activeMarkerData = stackMarkers.find(marker => marker.id === activeMarker);

  return (
    <section className={`py-16 md:py-24 bg-[#fcfcfc] ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center md:text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4">
            The Complete AI Infrastructure Stack
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl md:mx-0 mx-auto">
            We design, build, and operate the infrastructure powering the next generation of artificial intelligence.
            Explore our integrated approach to AI computing.
          </p>
        </div>

        {/* Interactive Stack Illustration */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative">
            {/* Main Stack Image */}
            <img
              src="/landing/helios-stack-illustration.jpeg"
              alt="Helios AI Infrastructure Stack"
              className="w-full h-auto rounded-sm"
            />

            {/* Interactive Markers */}
            {stackMarkers.map((marker) => (
              <button
                key={marker.id}
                onClick={() => handleMarkerClick(marker.id)}
                className={`absolute w-8 h-8 bg-yellow-400 rounded-sm border-2 border-white shadow-lg 
                  flex items-center justify-center transition-all duration-300 hover:scale-110 hover:bg-yellow-300
                  ${activeMarker === marker.id ? 'scale-110 bg-yellow-300' : ''}`}
                style={{
                  left: `${marker.x}%`,
                  top: `${marker.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                aria-label={`Learn more about ${marker.title}`}
              >
                {activeMarker === marker.id ? (
                  <X className="w-4 h-4 text-gray-900" />
                ) : (
                  <Plus className="w-4 h-4 text-gray-900" />
                )}
              </button>
            ))}

            {/* Active Marker Details Popup - Desktop only */}
            {activeMarkerData && (
              <div className="hidden md:block absolute top-0 left-0 w-full h-full pointer-events-none">
                <div 
                  className="absolute bg-white rounded-sm shadow-xl border border-gray-200 p-4 max-w-xs pointer-events-auto z-10"
                  style={{
                    left: `${activeMarkerData.x}%`,
                    top: `${activeMarkerData.y + 8}%`,
                    transform: activeMarkerData.x > 50 ? 'translateX(-100%)' : 'translateX(0)'
                  }}
                >
                  {/* Arrow pointing to marker */}
                  <div 
                    className={`absolute w-3 h-3 bg-white border-gray-200 transform rotate-45 border-l border-t
                      ${activeMarkerData.x > 50 ? 'right-4' : 'left-4'}`}
                    style={{
                      top: '-6px'
                    }}
                  />
                  
                  <div className="relative z-10 bg-white">
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                      {activeMarkerData.title}
                    </h3>
                    <p className="text-xs text-gray-600 mb-3">
                      {activeMarkerData.description}
                    </p>
                    <ul className="space-y-1">
                      {activeMarkerData.details.map((detail, index) => (
                        <li key={index} className="text-xs text-gray-700 flex items-start">
                          <span className="w-1 h-1 bg-yellow-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile-friendly details panel */}
          <div className="md:hidden mt-6">
            {activeMarkerData && (
              <div className="bg-white rounded-sm shadow-lg border border-gray-200 p-4">
                <h3 className="text-base font-semibold text-gray-900 mb-1">
                  {activeMarkerData.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {activeMarkerData.description}
                </p>
                <ul className="space-y-1">
                  {activeMarkerData.details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="w-1 h-1 bg-yellow-400 rounded-full mt-1.5 mr-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-gray-700 mb-6">
            Ready to leverage our complete AI infrastructure stack for your next project?
          </p>
          <button 
            className="bg-black text-white px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors duration-300"
            onClick={() => window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')}
          >
            Get Started Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default StackSection;