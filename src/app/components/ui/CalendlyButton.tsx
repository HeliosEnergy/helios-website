'use client';

import React from 'react';

type CalendlyButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  calendlyUrl: string;
  openInPopup?: boolean;
} & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'>;

const CalendlyButton = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  calendlyUrl,
  openInPopup = true,
  ...props 
}: CalendlyButtonProps) => {
  const baseClasses = 'px-6 py-3 rounded-xs font-semibold transition-colors duration-300';
  
  const styles = {
    primary: 'bg-[#fbbf24] text-black hover:bg-white',
    secondary: 'bg-transparent border border-white text-white hover:bg-white hover:text-black',
  };

  const handleCalendlyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (openInPopup) {
      // Open Calendly in a popup window
      const popupFeatures = 'width=800,height=600,scrollbars=yes,resizable=yes';
      window.open(calendlyUrl, 'calendly', popupFeatures);
    } else {
      // Open Calendly in a new tab
      window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <button 
      className={`${baseClasses} ${styles[variant]} ${className}`}
      onClick={handleCalendlyClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default CalendlyButton;