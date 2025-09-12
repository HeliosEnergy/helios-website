import React from 'react';

const TestStyling = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Styling Test</h1>
      
      {/* Test if Tailwind is working */}
      <div className="mb-4 p-4 bg-blue-500 text-white rounded">
        This should have a blue background if Tailwind is working
      </div>
      
      {/* Test icon sizing */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Icon Sizing Test</h2>
        <div className="flex items-center space-x-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Small icon (h-4 w-4)</span>
        </div>
        
        <div className="flex items-center space-x-4 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Medium icon (h-6 w-6)</span>
        </div>
        
        <div className="flex items-center space-x-4 mt-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-sm">Large icon (h-8 w-8)</span>
        </div>
      </div>
      
      {/* Test colors */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Color Test</h2>
        <div className="flex space-x-2">
          <div className="w-8 h-8 bg-blue-500 rounded"></div>
          <div className="w-8 h-8 bg-green-500 rounded"></div>
          <div className="w-8 h-8 bg-red-500 rounded"></div>
          <div className="w-8 h-8 bg-yellow-500 rounded"></div>
        </div>
      </div>
      
      {/* Test spacing */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Spacing Test</h2>
        <div className="space-y-2">
          <div className="p-2 bg-gray-100 rounded">Element with padding (p-2)</div>
          <div className="p-4 bg-gray-200 rounded">Element with more padding (p-4)</div>
        </div>
      </div>
      
      {/* Test positioning */}
      <div className="mb-4 relative h-20 bg-gray-100 rounded">
        <h2 className="text-lg font-semibold mb-2">Positioning Test</h2>
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-xs">
          Positioned element
        </div>
      </div>
    </div>
  );
};

export default TestStyling;