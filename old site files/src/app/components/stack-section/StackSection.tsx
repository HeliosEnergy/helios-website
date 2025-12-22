'use client';

import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';

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
    title: 'Efficient AI Platform',
    description: 'A streamlined PaaS that reduces overhead.',
    details: [
      'Efficient model orchestration',
      'Auto-scaling that saves costs'
    ]
  },
  {
    id: 'compute-infrastructure',
    x: 25, // Data center building
    y: 35,
    title: 'Low-Cost Data Centers',
    description: 'Facilities built to minimize expenses.',
    details: [
      'Located at energy source to cut costs',
      'Hyper-efficient cooling systems'
    ]
  },
  {
    id: 'gpu-clusters',
    x: 75, // GPU cluster area
    y: 55,
    title: 'Affordable GPU Clusters',
    description: 'Top-tier hardware at a lower price point.',
    details: [
      'NVIDIA H100 & A100 GPUs',
      'Priced for cost-effective LLM training'
    ]
  },
  {
    id: 'energy-systems',
    x: 25, // Solar/energy infrastructure
    y: 75,
    title: 'Cost-Effective Energy',
    description: 'The foundation of our low prices.',
    details: [
      'Direct access to renewable energy',
      'Eliminates expensive grid fees'
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
    <section className={`py-12 md:py-16 bg-[#fcfcfc] ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center md:text-left mb-12">
          <h2 className="text-3xl md:text-4xl font-normal text-gray-900 mb-4">
            The Stack That Lowers Your AI Costs
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl md:mx-0 mx-auto">
            Our vertically integrated stack is engineered to reduce costs at every layer. See how we pass those savings on to you.
          </p>
        </div>

        {/* Interactive Stack Illustration */}
        <div className="relative max-w-5xl mx-auto">
          <div className="relative w-full h-0 pb-[75%]"> {/* Added aspect ratio container */}
            {/* Main Stack Image */}
            <Image
              src="/landing/helios-stack-illustration.jpeg"
              alt="Helios AI Infrastructure Stack"
              fill
              style={{ objectFit: 'contain' }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-sm"
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