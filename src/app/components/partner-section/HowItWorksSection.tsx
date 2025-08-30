import React from 'react';

const HowItWorksSection: React.FC = () => {
  return (
    <div className="w-full bg-white">
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-3xl md:text-4xl font-normal text-black mb-12 text-center">
          How it works
        </h2>
        
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="text-gray-400 font-mono text-sm mt-1">01</div>
            <div>
              <h3 className="text-lg font-medium text-black mb-2">Partnership Agreement</h3>
              <p className="text-gray-600 leading-relaxed">
                We establish a partnership to deploy modular data centers at your facility.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="text-gray-400 font-mono text-sm mt-1">02</div>
            <div>
              <h3 className="text-lg font-medium text-black mb-2">Installation & Operations</h3>
              <p className="text-gray-600 leading-relaxed">
                Helios handles complete deployment and ongoing operations of the data center infrastructure.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <div className="text-gray-400 font-mono text-sm mt-1">03</div>
            <div>
              <h3 className="text-lg font-medium text-black mb-2">Revenue Sharing</h3>
              <p className="text-gray-600 leading-relaxed">
                You receive higher returns per kWh compared to traditional grid sales while we manage AI compute services.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorksSection;