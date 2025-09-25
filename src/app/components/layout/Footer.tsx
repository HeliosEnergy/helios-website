'use client';

import React from 'react';
import Image from 'next/image';


const Footer = () => {
  const footerSections = {
    products: {
      title: 'Products',
      titleColor: 'text-[#fbbf24]',
      links: [
        { name: 'Energy', href: '/energy' },
      ]
    },
    developers: {
      title: 'Developers',
      titleColor: 'text-[#fbbf24]',
      links: [

      ]
    },
    about: {
      title: 'About us',
      titleColor: 'text-gray-300',
      links: [

      ]
    },
    other: {
      title: 'Other',
      titleColor: 'text-gray-300',
      links: [
        { name: 'Terms & Conditions', href: '/tnc' },
      ]
    }
  };

  return (
    <footer className="bg-black text-white relative overflow-hidden">
      {/* Subtle Logo Background */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/4 opacity-[0.02] pointer-events-none">
        <Image 
          src="/logo-white.svg" 
          alt="" 
          width={600}
          height={600}
          className="w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] object-contain"
        />
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/95 to-black/85 pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-20">
        {/* Top Action Bar */}
        <div className="flex flex-col items-start md:flex-row md:justify-end mb-12">
          <div className="flex flex-col space-y-2 text-sm text-gray-400 md:flex-row md:space-x-6 md:space-y-0">
  <a 
    href="https://console.heliosenergy.io/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="hover:text-[#fbbf24] transition-colors duration-300"
  >
    Cloud Console
  </a>
  <a 
    href="https://console.heliosenergy.io/" 
    target="_blank" 
    rel="noopener noreferrer"
    className="hover:text-[#fbbf24] transition-colors duration-300"
  >
    Login
  </a>
</div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-16">
          {Object.entries(footerSections).map(([key, section]) => (
            <div key={key} className="space-y-4">
              <h4 className={`text-sm font-semibold uppercase tracking-wider ${section.titleColor}`}>
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-300 text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 mb-8"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
          {/* Left Side - Social and Copyright */}
          <div className="flex flex-col space-y-4">
            {/* Social Links */}
            <div className="flex space-x-4">

            </div>
            
            {/* Copyright and Legal */}
            <div className="space-y-2 text-xs text-gray-500">
              <p>2025 Helios Energy Systems LLC, All rights reserved.</p>
              <div className="flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <span>•</span>
                <div className="flex items-center space-x-2">
                  <span>Helios is an NVIDIA Preferred Partner</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center - NVIDIA Logo */}
          <div className="md:text-center">
            <div className="flex items-center justify-start md:justify-center">
              <Image 
                src="/nvidia-inception-program-badge-rgb-for-screen.png" 
                alt="Nvidia Inception Program Badge" 
                width={100}
                height={40}
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>

          {/* Right Side - Helios Logo (Primary) */}
          <div className="md:text-right">
            <div className="flex items-center justify-start md:justify-end">
              <Image 
                src="/logo-black-1024x_refined(1)_light_lower_white.png" 
                alt="Helios Logo" 
                width={120}
                height={48}
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;