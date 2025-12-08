import type { HTMLAttributes, ReactNode } from 'react';

export type CardProps = {
  children: ReactNode;
  variant?: 'default' | 'gradient';
  gradientColor?: 'blue' | 'green' | 'purple' | 'pink';
} & HTMLAttributes<HTMLDivElement>;

export function Card({
  children,
  variant = 'default',
  gradientColor = 'blue',
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-xl p-6';

  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-sm',
    gradient: getGradientStyles(gradientColor),
  };

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

function getGradientStyles(color: 'blue' | 'green' | 'purple' | 'pink'): string {
  const gradients = {
    blue: 'bg-gradient-to-br from-[#3B82F6] to-[#2563EB]',
    green: 'bg-gradient-to-br from-[#10B981] to-[#059669]',
    purple: 'bg-gradient-to-br from-[#A855F7] to-[#9333EA]',
    pink: 'bg-gradient-to-br from-[#EC4899] to-[#DB2777]',
  };

  return `${gradients[color]} shadow-md`;
}
