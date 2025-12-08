'use client';

import type { InputHTMLAttributes } from 'react';

export type SliderProps = {
  label?: string;
  showValue?: boolean;
  unit?: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Slider = ({ label, showValue = true, unit = '', className = '', id, value, ...props }: SliderProps) => {
  const sliderId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="mb-2 flex items-center justify-between">
          {label && (
            <label
              htmlFor={sliderId}
              className="text-sm font-medium text-gray-700"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-blue-600">
              {value}
              {unit}
            </span>
          )}
        </div>
      )}
      <input
        id={sliderId}
        type="range"
        value={value}
        className={`h-2 w-full appearance-none rounded-lg bg-gray-200 outline-none [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:hover:bg-blue-700 [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:hover:bg-blue-700 ${className}`}
        {...props}
      />
    </div>
  );
};

Slider.displayName = 'Slider';
