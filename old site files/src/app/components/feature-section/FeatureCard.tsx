import React from 'react';
import AnimatedGraphic from './AnimatedGraphic';

// Define the types for the props the card will accept
type FeatureCardProps = {
  title: string;
  description: string;
  // 'children' will be used for the accordion in the first card
  children?: React.ReactNode;
};

const FeatureCard = ({ title, description, children }: FeatureCardProps) => {
  return (
    <div 
      className="
        bg-lightBlueGray rounded-sm p-8 
        flex flex-col 
        transition-transform duration-300 ease-in-out hover:scale-[1.02]
      "
    >
      <AnimatedGraphic />
      <div className="flex-grow flex flex-col">
        <h3 className="text-[32px] font-medium text-black leading-tight">{title}</h3>
        <p className="mt-4 text-[16px] text-black/80 flex-grow">{description}</p>
        
        {/* Render accordion items if they are passed in */}
        {children && <div className="mt-6">{children}</div>}

      </div>
      {/* Decorative arrow - will be interactive later if needed */}
      <div className="self-end mt-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 5L12 19M12 5L6 11M12 5L18 11" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
};

export default FeatureCard;