'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Button from '../ui/Button';
import Logo from '../ui/Logo';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCloudDropdownOpen, setIsCloudDropdownOpen] = useState(false);
  const pathname = usePathname();

  // Determine text color based on current route and scroll state
  const getTextColor = () => {
    // When scrolled, background is black, so text should always be white
    if (isScrolled) {
      return 'text-white';
    }
    
    // When not scrolled, use route-based colors
    const lightBackgroundRoutes = ['/energy'];
    return lightBackgroundRoutes.includes(pathname) ? 'text-black' : 'text-white';
  };

  // Determine if we should invert logo (when background is white/light)
  const shouldInvertLogo = () => {
    // When scrolled, background is black, so don't invert (keep white logo)
    if (isScrolled) {
      return false;
    }
    
    // When not scrolled, invert logo for light backgrounds to make it black
    const lightBackgroundRoutes = ['/energy'];
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
    { name: 'Manufacturing', href: '#' },
    { name: 'Energy', href: '/energy' },
    { name: 'About', href: '#' },
    { name: 'Resources', href: '#' }
  ];

  const cloudDropdownItems = [
    { name: 'GPU Pricing', href: '/gpu-pricing' },
    { name: 'Cloud Services', href: 'https://console.heliosenergy.io/', target: '_blank' },
    { name: 'Documentation', href: '#' }
  ];

  return (
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
                className={`transition-colors ${textColor} ${hoverColor}`}
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
        
        {/* Mobile Menu Button (functionality not implemented) */}
        <div className="lg:hidden">
            <svg className={`w-8 h-8 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
        </div>
      </nav>
    </header>
  );
};

export default Header;