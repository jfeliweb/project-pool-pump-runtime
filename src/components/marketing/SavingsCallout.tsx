'use client';

type SavingsCalloutProps = {
  text: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
};

export const SavingsCallout = ({
  text,
  variant = 'default',
}: SavingsCalloutProps) => {
  const variantStyles = {
    default: 'border-blue-200 bg-blue-50 text-blue-900',
    success: 'border-green-200 bg-green-50 text-green-900',
    warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
    info: 'border-cyan-200 bg-cyan-50 text-cyan-900',
  };

  return (
    <div
      className={`rounded-lg border-2 p-4 font-semibold ${variantStyles[variant]}`}
    >
      {text}
    </div>
  );
};
