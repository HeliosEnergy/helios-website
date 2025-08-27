'use client';

import React from 'react';
import Logo from './Logo';

interface PricingData {
  gpu: string;
  heliosCompute: string;
  aws: string;
  googleCloud: string;
  runPod: string;
  modal: string;
}

const pricingData: PricingData[] = [
  {
    gpu: 'H100 NVL',
    heliosCompute: '2.47',
    aws: '5.88',
    googleCloud: 'Not listed',
    runPod: '2.79',
    modal: '3.95'
  },
  {
    gpu: 'H100 SXM',
    heliosCompute: '2.25',
    aws: '4.40',
    googleCloud: '11.06',
    runPod: '2.69',
    modal: '3.95'
  },
  {
    gpu: 'RTX 6000',
    heliosCompute: '0.45',
    aws: '1.38',
    googleCloud: '0.35',
    runPod: '0.77',
    modal: 'Not listed'
  },
  {
    gpu: 'L40S',
    heliosCompute: '0.87',
    aws: '1.86-2.24',
    googleCloud: 'Not listed',
    runPod: '0.86',
    modal: '1.95'
  },
  {
    gpu: 'A100',
    heliosCompute: '1.35',
    aws: '3.67-4.10',
    googleCloud: '3.67',
    runPod: '1.64',
    modal: '2.50'
  }
];

const PricingTable = () => {
  return (
    <div className="w-full bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-black mb-6">
            GPU Pricing Comparison
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compare our competitive GPU pricing against leading cloud providers. 
          </p>
          <div className="mt-6 text-sm text-gray-500">
            <span className="font-medium">All prices shown in USD/hr</span>
          </div>
        </div>

        {/* Pricing Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white rounded-sm shadow-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  GPU
                </th>
                <th className="text-left py-8 px-8">
                  <div className="flex items-center space-x-3">
                    <div className="bg-[#fbbf24] text-black px-4 py-2 rounded-full flex items-center space-x-2">
                      <Logo 
                        shouldInvert={true} 
                        height={20} 
                        linkToHome={false}
                        className="opacity-90"
                      />
          
                    </div>
                  </div>
                </th>
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  AWS
                </th>
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  Google Cloud
                </th>
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  RunPod
                </th>
                <th className="text-left py-8 px-8 font-semibold text-gray-900 text-lg">
                  Modal
                </th>
              </tr>
            </thead>
            <tbody>
              {pricingData.map((row, index) => (
                <tr 
                  key={row.gpu} 
                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="py-8 px-8 font-semibold text-gray-900 text-lg">
                    {row.gpu}
                  </td>
                  <td className="py-8 px-8">
                    <span className="text-black font-bold text-lg">
                      ${row.heliosCompute}
                    </span>
                  </td>
                  <td className="py-8 px-8 text-gray-600 text-base">
                    {row.aws === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.aws}</span>
                    ) : (
                      `$${row.aws}`
                    )}
                  </td>
                  <td className="py-8 px-8 text-gray-600 text-base">
                    {row.googleCloud === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.googleCloud}</span>
                    ) : (
                      `$${row.googleCloud}`
                    )}
                  </td>
                  <td className="py-8 px-8 text-gray-600 text-base">
                    {row.runPod === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.runPod}</span>
                    ) : (
                      `$${row.runPod}`
                    )}
                  </td>
                  <td className="py-8 px-8 text-gray-600 text-base">
                    {row.modal === 'Not listed' ? (
                      <span className="text-gray-400 italic">{row.modal}</span>
                    ) : (
                      `$${row.modal}`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Prices are subject to change. {' '}
            <button 
              onClick={() => window.open('https://calendly.com/jose-helios/30min', '_blank', 'noopener,noreferrer')}
              className="text-[#fbbf24] hover:text-black underline transition-colors duration-200 cursor-pointer"
            >
              Contact us
            </button>
            {' '} for enterprise pricing and volume discounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingTable;