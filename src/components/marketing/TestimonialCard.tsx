'use client';

type SavingsBreakdown = {
  label: string;
  value: string;
};

type TestimonialCardProps = {
  quote: string;
  text: string;
  author: string;
  pool: string;
  savings: SavingsBreakdown[];
};

export const TestimonialCard = ({
  quote,
  text,
  author,
  pool,
  savings,
}: TestimonialCardProps) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-lg">
      <div className="mb-4 text-2xl font-bold text-blue-700">{quote}</div>
      <p className="mb-6 text-gray-700">{text}</p>
      <div className="mb-4 border-t border-gray-200 pt-4">
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-sm text-gray-600">{pool}</div>
      </div>
      <div className="grid gap-3 rounded-lg bg-green-50 p-4 md:grid-cols-2">
        {savings.map(item => (
          <div key={item.label}>
            <div className="text-sm text-gray-600">{item.label}</div>
            <div className="text-xl font-bold text-green-700">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
