'use client';

import React from 'react';
import Image from 'next/image';


const Footer = () => {
  const footerSections = {
    products: {
      title: 'Products',
      titleColor: 'text-[#fbbf24]',
      links: [
        { name: 'Helios Cloud', href: '#' },
        { name: 'Data Centers', href: '#' },
        { name: 'Energy', href: '/energy' },
      ]
    },
    developers: {
      title: 'Developers',
      titleColor: 'text-[#fbbf24]',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'Github', href: '#' },
        { name: 'Cookbook', href: '#' },
      ]
    },
    about: {
      title: 'About us',
      titleColor: 'text-gray-300',
      links: [
        { name: 'Our Mission', href: '#' },
        { name: 'Our Impact', href: '#' },
        { name: 'Leadership', href: '#' },
        { name: 'Careers', href: '#' },
      ]
    },
    other: {
      title: 'Other',
      titleColor: 'text-gray-300',
      links: [
        { name: 'Blog', href: '#' },
        { name: 'Newsroom', href: '#' },
        { name: 'Manufacturing', href: '#' },
        { name: 'Support', href: '#' },
        { name: 'Trust Center', href: '#' },
        { name: 'Legal Center', href: '#' },
        { name: 'Report Abuse', href: '#' },
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
  <a href="#" className="hover:text-[#fbbf24] transition-colors duration-300">Contact Us</a>
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
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors duration-300"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
            
            {/* Copyright and Legal */}
            <div className="space-y-2 text-xs text-gray-500">
              <p>2025 Helios Energy Systems LLC, All rights reserved.</p>
              <div className="flex flex-col items-start space-y-2 md:flex-row md:items-center md:space-x-4 md:space-y-0">
                <a href="#" className="hover:text-gray-300 transition-colors duration-300">Privacy Policy</a>
                <span>•</span>
                <div className="flex items-center space-x-2">
                  <span>Helios is an NVIDIA Preferred Partner</span>
                  
                  <Image 
                    src="/nvidia-inception-program-badge-rgb-for-screen.png" 
                    alt="Nvidia Inception Program Badge" 
                    width={32}
                    height={32}
                    className="h-8 w-auto ml-2"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Logo */}
          <div className="md:text-right">
            <div className="flex items-center justify-start md:justify-end">
              <Image 
                src="/logo-black-1024x_refined(1)_light_lower_white.png" 
                alt="Helios Logo" 
                width={48}
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