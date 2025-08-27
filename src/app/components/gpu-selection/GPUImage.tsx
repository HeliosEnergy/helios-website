import React from 'react';

// GPU Image placeholder component with proper aspect ratio and cropping
type GPUImageProps = {
  gpuModel: string;
};

const GPUImage = ({ gpuModel }: GPUImageProps) => {
  return (
    <div 
      className="
        relative w-full max-w-md mx-auto aspect-[4/3] bg-black rounded-lg overflow-hidden
        transition-all duration-500 ease-out
      "
    >
      {/* Placeholder GPU circuit board pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-black">
        {/* Grid pattern overlay to simulate circuit board */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '16px 16px'
          }} />
        </div>
        
        {/* GPU chip representation */}
        <div className="absolute inset-4 flex items-center justify-center">
          <div className="relative w-4/5 h-4/5 bg-gray-700 rounded border border-gray-500">
            {/* Chip grid pattern */}
            <div className="absolute inset-3 grid grid-cols-4 grid-rows-4 gap-1">
              {Array.from({ length: 16 }).map((_, i) => (
                <div 
                  key={i} 
                  className="bg-gray-600 rounded-sm border border-gray-500 flex items-center justify-center"
                >
                  <div className="w-2 h-2 bg-orange-400 rounded-full opacity-60" />
                </div>
              ))}
            </div>
            
            {/* GPU model label */}
            <div className="absolute bottom-2 left-2 right-2">
              <div className="text-orange-400 text-sm font-mono text-center leading-tight">
                {gpuModel}
              </div>
            </div>
          </div>
        </div>
        
        {/* Connection points */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-1 h-4 bg-yellow-500 rounded-sm" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPUImage;