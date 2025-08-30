'use client';

import React, { useContext, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useSelectedLayoutSegment } from 'next/navigation';
import { LayoutRouterContext } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Custom hook to track previous value
function usePreviousValue<T>(value: T): T | undefined {
  const prevValue = useRef<T | undefined>(undefined);

  useEffect(() => {
    prevValue.current = value;
    return () => {
      prevValue.current = undefined;
    };
  }, [value]);

  return prevValue.current;
}

// FrozenRouter component to prevent context changes during transitions
function FrozenRouter({ children }: { children: React.ReactNode }) {
  const context = useContext(LayoutRouterContext);
  const prevContext = usePreviousValue(context) || null;

  const segment = useSelectedLayoutSegment();
  const prevSegment = usePreviousValue(segment);

  // Only change context when segment actually changes
  const changed = segment !== prevSegment && segment !== undefined && prevSegment !== undefined;

  return (
    <LayoutRouterContext.Provider value={changed ? prevContext : context}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

interface LayoutTransitionProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const LayoutTransition: React.FC<LayoutTransitionProps> = ({ 
  children, 
  className = '',
  style = {}
}) => {
  const segment = useSelectedLayoutSegment();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={segment || 'root'}
        initial={{ 
          opacity: 0,
          y: 8
        }}
        animate={{ 
          opacity: 1,
          y: 0 
        }}
        exit={{ 
          opacity: 0,
          y: -8
        }}
        transition={{
          duration: 0.2,
          ease: [0.22, 1, 0.36, 1],
          opacity: { duration: 0.15 },
          y: { duration: 0.2 }
        }}
        className={`min-h-screen page-transition-wrapper ${className}`}
        style={{
          ...style,
          willChange: 'auto',
          backfaceVisibility: 'hidden',
          perspective: 1000
        }}
      >
        <FrozenRouter>
          {children}
        </FrozenRouter>
      </motion.div>
    </AnimatePresence>
  );
};

export default LayoutTransition;