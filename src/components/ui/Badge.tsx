import type { HTMLAttributes, ReactNode } from 'react';

export type BadgeProps = {
  variant?: 'optimized' | 'warning' | 'error' | 'info' | 'neutral';
  children: ReactNode;
} & HTMLAttributes<HTMLSpanElement>;

export function Badge({
  variant = 'neutral',
  className = '',
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    optimized: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
