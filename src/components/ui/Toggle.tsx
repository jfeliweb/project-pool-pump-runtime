'use client';

import type { InputHTMLAttributes } from 'react';

export type ToggleProps = {
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Toggle = ({ ref, label, className = '', id, checked, ...props }: ToggleProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const toggleId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`flex items-center ${className}`}>
      <label htmlFor={toggleId} className="relative inline-block h-6 w-11 cursor-pointer">
        <input
          id={toggleId}
          ref={ref}
          type="checkbox"
          checked={checked}
          className="peer sr-only"
          {...props}
        />
        <span className="absolute inset-0 rounded-full bg-gray-300 transition-colors peer-checked:bg-blue-600 peer-focus:ring-2 peer-focus:ring-blue-600 peer-focus:ring-offset-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-50" />
        <span className="absolute top-1 left-1 size-4 rounded-full bg-white transition-transform peer-checked:translate-x-5" />
      </label>
      <span className="ml-3 text-sm font-medium text-gray-700">{label}</span>
    </div>
  );
};

Toggle.displayName = 'Toggle';
