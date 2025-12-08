'use client';

import type { ReactNode } from 'react';
import { useState } from 'react';

export type TooltipProps = {
  content: string;
  children: ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
};

export function Tooltip({ content, children, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div
          className={`absolute z-50 rounded-md bg-gray-900 px-3 py-1.5 text-xs whitespace-nowrap text-white shadow-lg ${positionStyles[position]}`}
          role="tooltip"
        >
          {content}
        </div>
      )}
    </div>
  );
}
