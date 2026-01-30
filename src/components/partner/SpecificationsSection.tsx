'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

const SpecificationsSection: React.FC = () => {
  return (
    <div className="w-full bg-black">
      <section className="max-w-4xl mx-auto px-6 py-16">
        <h2 className="text-3xl md:text-4xl font-normal text-white mb-12 text-center">
          Modular Data Center Specifications
        </h2>

        <div className="max-w-4xl mx-auto">
          {/* Specifications List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-6 mb-16">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Power Requirements</h3>
                <p className="text-white/70">500 kW per modular unit</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Deployment Timeline</h3>
                <p className="text-white/70">6 months from agreement to operational</p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Space Requirements</h3>
                <p className="text-white/70">1,000 sqft per megawatt capacity</p>
              </div>

              <div>
                <h3 className="text-lg font-medium text-white mb-2">Operations</h3>
                <p className="text-white/70">Fully managed by Helios</p>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="border-t border-white/20 pt-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="md:w-2/3">
                <h3 className="text-xl font-medium text-white mb-3">
                  Technical Documentation
                </h3>
                <p className="text-white/70 leading-relaxed">
                  Complete technical specifications, installation requirements, and operational procedures are available in our comprehensive documentation package.
                </p>
              </div>
              <div className="md:w-1/3 md:text-right">
                <Button
                  variant="outline"
                  onClick={() => {
                    // In a real implementation, this would trigger a PDF download
                    console.log('Download PDF Brochure');
                  }}
                  className="px-6 py-3 rounded-sm"
                >
                  Download PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpecificationsSection;
