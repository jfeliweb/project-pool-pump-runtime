'use client';

import type { SelectHTMLAttributes } from 'react';

export type SelectProps = {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string; label: string }>;
} & SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ ref, label, error, helperText, options, className = '', id, ...props }: SelectProps & { ref?: React.Ref<HTMLSelectElement> }) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={selectId}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={selectId}
          ref={ref}
          className={`w-full appearance-none rounded-md border px-3.5 py-2.5 pr-10 text-sm text-gray-900 transition-all duration-150 focus:outline-none ${
            error
              ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)] focus:border-red-500'
              : 'border-gray-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
          } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : helperText ? `${selectId}-helper` : undefined}
          {...props}
        >
          {options.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <svg className="size-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      {error && (
        <p id={`${selectId}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${selectId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

Select.displayName = 'Select';
