import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles = {
    primary: 'bg-gradient-to-br from-[#F59E0B] to-[#D97706] text-black shadow-[0_4px_12px_rgba(245,158,11,0.3)] hover:shadow-[0_6px_16px_rgba(245,158,11,0.4)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_8px_rgba(245,158,11,0.3)]',
    secondary: 'bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:border-blue-700',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-md',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-lg',
  };

  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type="button"
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
