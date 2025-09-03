import React from 'react';

const DealsStructureSection: React.FC = () => {
  return (
    <div className="w-full bg-gray-50">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-normal text-black mb-10 text-center">
          Partnership Structure
        </h2>
        
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Helios provides AI compute services to companies through our data centers. 
            You invest in the infrastructure and retain the majority of revenue generated 
            from your energy allocation, achieving 2-3 year ROI while we handle all operations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-2xl font-semibold text-black mb-2">2-3 Years</div>
              <div className="text-sm text-gray-600">Return on Investment</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-black mb-2">Zero</div>
              <div className="text-sm text-gray-600">Operational Overhead</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-black mb-2">6 Months</div>
              <div className="text-sm text-gray-600">Deployment Timeline</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DealsStructureSection;