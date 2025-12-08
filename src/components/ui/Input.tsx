'use client';

import type { InputHTMLAttributes } from 'react';

export type InputProps = {
  label?: string;
  error?: string;
  helperText?: string;
} & InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ ref, label, error, helperText, className = '', id, ...props }: InputProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        ref={ref}
        className={`w-full rounded-md border px-3.5 py-2.5 text-sm text-gray-900 transition-all duration-150 focus:outline-none ${
          error
            ? 'border-red-500 shadow-[0_0_0_3px_rgba(239,68,68,0.1)] focus:border-red-500'
            : 'border-gray-300 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)]'
        } disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 ${className}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
        {...props}
      />
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${inputId}-helper`} className="mt-1 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
};

Input.displayName = 'Input';
