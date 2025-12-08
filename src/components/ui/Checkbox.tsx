'use client';

import type { InputHTMLAttributes } from 'react';

export type CheckboxProps = {
  label: string;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>;

export const Checkbox = ({ ref, label, className = '', id, ...props }: CheckboxProps & { ref?: React.Ref<HTMLInputElement> }) => {
  const checkboxId = id || label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="flex items-center">
      <input
        id={checkboxId}
        ref={ref}
        type="checkbox"
        className={`size-4 rounded border-gray-300 text-blue-600 transition-colors focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
      <label
        htmlFor={checkboxId}
        className="ml-2 text-sm font-medium text-gray-700"
      >
        {label}
      </label>
    </div>
  );
};

Checkbox.displayName = 'Checkbox';
