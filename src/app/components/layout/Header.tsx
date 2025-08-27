'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCloudDropdownOpen, setIsCloudDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Add this line
  const pathname = usePathname();

  // Determine text color based on current route and scroll state
  const getTextColor = () => {
    // When scrolled, background is black, so text should always be white
    if (isScrolled) {
      return 'text-white';
    }
    
    // When not scrolled, use route-based colors
    const lightBackgroundRoutes = ['/energy', '/partner'];
    return lightBackgroundRoutes.includes(pathname) ? 'text-black' : 'text-white';
  };

  // Determine if we should invert logo (when background is white/light)
  const shouldInvertLogo = () => {
    // When scrolled, background is black, so don't invert (keep white logo)
    if (isScrolled) {
      return false;
    }
    
    // When not scrolled, invert logo for light backgrounds to make it black
    const lightBackgroundRoutes = ['/energy', '/partner'];
    return lightBackgroundRoutes.includes(pathname);
  };

  const textColor = getTextColor();
  const hoverColor = 'hover:text-[#fbbf24]';
  const shouldInvert = shouldInvertLogo();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.relative')) {
        setIsCloudDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    // Cleanup function to remove the event listeners
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const navLinks = [
    { name: 'Data Centers', href: '#' },
    { name: 'Energy', href: '/energy' },
    { name: 'About', href: '#' },
    { name: 'Partner with us', href: '/partner' }
  ];

  const cloudDropdownItems = [
    { name: 'GPU Pricing', href: '/gpu-pricing' },
    { name: 'Cloud Services', href: 'https://console.heliosenergy.io/', target: '_blank' },
    { name: 'Documentation', href: '#' }
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-black' : 'bg-transparent'}`}
      >
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Logo shouldInvert={shouldInvert} height={32} className="hover:opacity-80" />

        {/* Desktop Navigation Links */}
        <ul className="hidden lg:flex items-center space-x-6">
          {/* Cloud Dropdown */}
          <li className="relative">
            <button
              onClick={() => setIsCloudDropdownOpen(!isCloudDropdownOpen)}
              className={`flex items-center space-x-1 transition-colors ${textColor} ${hoverColor}`}
            >
              <span>Cloud</span>
              <svg 
                className={`w-4 h-4 transition-transform duration-200 ${isCloudDropdownOpen ? 'rotate-180' : ''}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Dropdown Menu */}
            {isCloudDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-sm shadow-lg border border-gray-100 z-50">
                <div className="py-2">
                  {cloudDropdownItems.map((item) => {
                    const isExternal = item.href.startsWith('http');
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-[#fbbf24] transition-colors"
                        onClick={() => setIsCloudDropdownOpen(false)}
                      >
                        {item.name}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </li>
          
          {/* Other Navigation Links */}
          {navLinks.map(link => (
            <li key={link.name}>
              <Link 
                href={link.href} 
                className={`transition-colors ${textColor} ${hoverColor} ${link.name === 'Partner with us' ? 'sheen-effect' : ''}`}
                style={link.name === 'Partner with us' ? {
                  '--base-text-color': textColor === 'text-white' ? 'white' : 'black',
                  '--sheen-highlight-color': 'rgba(255, 255, 255, 0.1)' // Subtle white sheen
                } as React.CSSProperties : undefined}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <a 
            href="https://console.heliosenergy.io/" 
            target="_blank" 
            rel="noopener noreferrer"
            className={`font-semibold transition-colors ${textColor} ${hoverColor}`}
          >
            Cloud login
          </a>
          <Button 
            variant="primary"
            onClick={() => window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer')}
          >
            Sign up
          </Button>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            aria-label="Open mobile menu"
          >
            <svg className={`w-8 h-8 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
      </nav>
    </header>

    {/* Mobile Menu Overlay (visible only on mobile, with animation) */}
    <div
      className={`fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-center lg:hidden
        transform transition-all duration-200 ease-in-out
        ${isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}`}
    >
      <button
        onClick={() => setIsMobileMenuOpen(false)}
        className="absolute top-6 right-6 p-2 text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        aria-label="Close mobile menu"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <ul className="flex flex-col items-center space-y-6 text-white text-2xl">
        {/* Cloud Dropdown for Mobile */}
        <li className="relative">
          <button
            onClick={() => setIsCloudDropdownOpen(!isCloudDropdownOpen)}
            className="flex items-center space-x-2"
          >
            <span>Cloud</span>
            <svg
              className={`w-5 h-5 transition-transform duration-200 ${isCloudDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isCloudDropdownOpen && (
            <div className="mt-4 flex flex-col items-center space-y-4 text-xl">
              {cloudDropdownItems.map((item) => {
                const isExternal = item.href.startsWith('http');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
                    className="block hover:text-[#fbbf24] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on link click
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </li>

        {/* Other Navigation Links for Mobile */}
        {navLinks.map(link => (
          <li key={link.name}>
            <Link
              href={link.href}
              className={`hover:text-[#fbbf24] transition-colors ${link.name === 'Partner with us' ? 'sheen-effect' : ''}`}
              style={link.name === 'Partner with us' ? {
                '--base-text-color': 'white', // Always white for mobile menu
                '--sheen-highlight-color': 'rgba(255, 255, 255, 0.1)'
              } as React.CSSProperties : undefined}
              onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on link click
            >
              {link.name}
            </Link>
          </li>
        ))}

        {/* Action Buttons for Mobile */}
        <li>
          <a
            href="https://console.heliosenergy.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold hover:text-[#fbbf24] transition-colors"
            onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu on link click
          >
            Cloud login
          </a>
        </li>
        <li>
          <Button
            variant="primary"
            onClick={() => {
              window.open('https://console.heliosenergy.io/', '_blank', 'noopener,noreferrer');
              setIsMobileMenuOpen(false); // Close mobile menu on button click
            }}
          >
            Sign up
          </Button>
        </li>
      </ul>
    </div>
    </>
  );
};

export default Header;