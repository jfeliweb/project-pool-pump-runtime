import type { Metadata } from 'next';
import { CalculatorForm } from '@/components/calculator/CalculatorForm';

export const metadata: Metadata = {
  title: 'Pool Pump Runtime Calculator | PoolCalc',
  description: 'Calculate optimal pool pump runtime and save money on electricity. Get personalized schedule optimization based on your pool size, pump type, and location.',
};

export default function CalculatorPage() {
  return (
    <>
      {/* Hero Section - Calculator Specific */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white lg:text-5xl">
              Pool Pump Runtime Calculator
            </h1>
            <p className="mt-4 text-xl text-blue-100">
              Get your personalized optimization schedule in under 2 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Content */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <CalculatorForm />
        </div>
      </section>
    </>
  );
}
