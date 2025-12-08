'use client';

import type { InputHTMLAttributes } from 'react';

export type RadioProps = {
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Radio = ({ ref, label, className = '', id, ...props }: RadioProps & { ref?: React.RefObject<HTMLInputElement | null> }) => {
  const radioId = id || `${props.name}-${props.value}`;

  return (
    <div className="flex items-center">
      <input
        id={radioId}
        ref={ref}
        type="radio"
        className={`size-4 border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      <label
        htmlFor={radioId}
        className="ml-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
    </div>
  );
};

Radio.displayName = 'Radio';
