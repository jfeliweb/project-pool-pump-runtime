import Link from 'next/link';

export const DemoBanner = () => (
  <div className="bg-gradient-to-r from-blue-600 to-green-500 p-4 text-center text-lg font-semibold text-white [&_a]:text-yellow-300 [&_a:hover]:text-yellow-100">
    💡 Save up to $400/year on pool pump electricity -
    {' '}
    <Link href="/calculator">Try Our Free Calculator</Link>
  </div>
);
