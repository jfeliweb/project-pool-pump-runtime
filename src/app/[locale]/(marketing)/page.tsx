import type { Metadata } from 'next';
import { Calculator, Check, Clock, DollarSign, MapPin, Rocket, Sun } from 'lucide-react';
import Link from 'next/link';
import { ModernFooter } from '@/components/marketing/ModernFooter';
import { ModernHeader } from '@/components/marketing/ModernHeader';

export const metadata: Metadata = {
  title: 'PoolCalc - Stop Wasting $400/Year on Pool Pump Electricity',
  description: 'Free pool pump runtime calculator for US pool owners. Get personalized schedule optimization and save up to 60% on electricity costs. Climate-optimized for all 50 states.',
  keywords: ['pool pump calculator', 'pool pump runtime', 'save electricity', 'variable speed pump', 'pool pump schedule'],
};

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <ModernHeader currentPage="home" />

      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-teal-600">
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Decorative Blobs */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 size-32 rounded-full bg-white/20 blur-xl"></div>
          <div className="absolute top-40 right-20 size-24 rounded-full bg-teal-300/30 blur-lg"></div>
          <div className="absolute bottom-20 left-1/3 size-40 rounded-full bg-blue-300/20 blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative mx-auto max-w-7xl px-6 py-20 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl leading-tight font-bold text-white lg:text-6xl">
              Stop Wasting
              {' '}
              <span className="text-yellow-300">$400/Year</span>
              {' '}
              on Pool Pump Electricity
            </h1>
            <p className="mt-6 mb-8 text-xl leading-relaxed text-blue-100 lg:text-2xl">
              Optimize your pool pump runtime with our smart calculator and slash your electricity bills by up to 60%
            </p>
            <Link
              href="/calculator"
              className="inline-flex transform items-center rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 px-12 py-4 text-xl font-bold text-gray-900 shadow-2xl transition-all duration-200 hover:scale-105 hover:from-yellow-300 hover:to-orange-400"
            >
              <Calculator className="mr-3 size-6" />
              Calculate My Savings Free
            </Link>

            <div className="mt-8 flex items-center justify-center space-x-8 text-blue-200">
              <div className="flex items-center">
                <Check className="mr-2 size-5" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 size-5" />
                <span>No Email Required</span>
              </div>
              <div className="flex items-center">
                <Check className="mr-2 size-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Why Choose Our Pool Pump Calculator?
            </h2>
            <p className="mx-auto max-w-2xl text-xl text-gray-600">
              Get precise savings estimates tailored to your specific pool and location
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid gap-8 md:grid-cols-3">
            {/* Save Money Card */}
            <div className="transform rounded-2xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-6 flex size-16 items-center justify-center rounded-xl bg-gradient-to-r from-green-500 to-emerald-600">
                <DollarSign className="size-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Save Money</h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                Reduce your pool pump electricity costs by up to 60%. Our algorithm finds the perfect balance between energy efficiency and proper filtration.
              </p>
              <div className="flex items-center font-semibold text-green-600">
                <span className="mr-2 text-3xl font-bold">$400+</span>
                <span>Average Annual Savings</span>
              </div>
            </div>

            {/* Climate-Optimized Card */}
            <div className="transform rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-6 flex size-16 items-center justify-center rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600">
                <MapPin className="size-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">Climate-Optimized</h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                Specially calibrated for your climate zone, electricity rates, and pool usage patterns. Get recommendations that work across all 50 US states.
              </p>
              <div className="flex items-center font-semibold text-blue-600">
                <Sun className="mr-2 size-5" />
                <span>Year-Round Optimization</span>
              </div>
            </div>

            {/* 2-Min Setup Card */}
            <div className="transform rounded-2xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-8 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="mb-6 flex size-16 items-center justify-center rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600">
                <Clock className="size-8 text-white" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900">2-Min Setup</h3>
              <p className="mb-6 leading-relaxed text-gray-600">
                Quick and easy setup with just your pool size, pump type, and current runtime. No technical knowledge required - we handle the complex calculations.
              </p>
              <div className="flex items-center font-semibold text-purple-600">
                <Rocket className="mr-2 size-5" />
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-700 to-teal-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white lg:text-5xl">
            Ready to Start Saving on Your Pool Pump?
          </h2>
          <p className="mb-10 text-xl text-blue-100">
            Join thousands of pool owners who have already optimized their pump schedules
          </p>
          <Link
            href="/calculator"
            className="inline-flex transform items-center rounded-xl bg-white px-12 py-4 text-xl font-bold text-blue-700 shadow-2xl transition-all duration-200 hover:scale-105 hover:bg-gray-50"
          >
            <Calculator className="mr-3 size-6" />
            Start Your Free Calculation
          </Link>
          <div className="mt-8 flex items-center justify-center space-x-8 text-blue-200">
            <div className="flex items-center">
              <Check className="mr-2 size-5" />
              <span>100% Free</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 size-5" />
              <span>No Email Required</span>
            </div>
            <div className="flex items-center">
              <Check className="mr-2 size-5" />
              <span>Instant Results</span>
            </div>
          </div>
        </div>
      </section>

      <ModernFooter />
    </div>
  );
}
