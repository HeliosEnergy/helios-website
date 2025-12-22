import React from 'react';

type ButtonProps = {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button = ({ children, variant = 'primary', className = '', onClick, ...props }: ButtonProps) => {
  const baseClasses = 'px-6 py-3 rounded-xs font-semibold transition-colors duration-300';
  
  const styles = {
    primary: 'bg-[#fbbf24] text-black hover:bg-white',
    secondary: 'bg-transparent border border-white text-white hover:bg-white hover:text-black',
  };

  return (
    <button 
      className={`${baseClasses} ${styles[variant]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;