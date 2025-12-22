'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface LogoProps {
  /** Whether to invert the logo color (for white backgrounds) */
  shouldInvert?: boolean;
  /** Additional CSS classes to apply to the container */
  className?: string;
  /** Logo height in pixels (default: 40) */
  height?: number;
  /** Logo width in pixels (will auto-scale based on height if not provided) */
  width?: number;
  /** Whether the logo should be clickable and link to home */
  linkToHome?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  shouldInvert = false, 
  className = '', 
  height = 40,
  width,
  linkToHome = true 
}) => {
  // Always use the same logo file (which contains white logo)
  const logoSrc = '/logo-black-1024x_refined(1)_light_lower_white.png';
  const altText = 'Helios Logo';
  
  // Calculate width based on aspect ratio if not provided
  const logoWidth = width || Math.round(height * 3.2);

  // Apply invert filter when we need black logo on white background
  const filterClass = shouldInvert ? 'invert' : '';

  const logoElement = (
    <Image
      src={logoSrc}
      alt={altText}
      width={logoWidth}
      height={height}
      className={`transition-opacity duration-300 ${filterClass} ${className}`}
      priority
    />
  );

  if (linkToHome) {
    return (
      <Link href="/" className="flex items-center">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};

export default Logo;