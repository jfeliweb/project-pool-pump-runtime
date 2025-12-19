import type { Metadata } from 'next';
import type { AccordionItem } from '@/components/ui/Accordion';
import { BookOpen, Info, Mail } from 'lucide-react';
import Link from 'next/link';
import { Accordion } from '@/components/ui/Accordion';

export const metadata: Metadata = {
  title: 'Help Center | PoolPumpCalc',
  description: 'Get help with the pool pump calculator and learn how to optimize your pool pump runtime',
};

const faqItems: AccordionItem[] = [
  {
    id: 'accuracy',
    title: 'How accurate is the calculator?',
    content: (
      <p>
        Our calculator uses industry-standard formulas and accounts for over 20 variables including pool size, pump type, climate zone, usage patterns, and local weather data. Results are typically within 5-10% of professional pool service recommendations.
      </p>
    ),
  },
  {
    id: 'what-info',
    title: 'What information do I need?',
    content: (
      <div className="space-y-2">
        <p>You'll need:</p>
        <ul className="list-inside list-disc space-y-1">
          <li>Pool dimensions (length, width, depth)</li>
          <li>Pump type and horsepower</li>
          <li>Your ZIP code</li>
          <li>Current electricity rate (found on your utility bill)</li>
          <li>Current pump runtime (hours per day)</li>
        </ul>
      </div>
    ),
  },
  {
    id: 'climate',
    title: 'Why does climate matter?',
    content: (
      <p>
        Water temperature affects algae growth, chemical effectiveness, and evaporation rates. Warmer climates require more filtration hours, while cooler climates need less. Our calculator automatically adjusts for your local climate zone and seasonal temperature variations.
      </p>
    ),
  },
  {
    id: 'variable-speed',
    title: 'What are variable-speed pumps?',
    content: (
      <p>
        Variable-speed pumps can adjust their speed to match your pool's needs. They run at lower speeds for longer periods, using up to 70% less energy than single-speed pumps while providing better filtration. Our calculator shows potential ROI if you upgrade.
      </p>
    ),
  },
  {
    id: 'savings-calc',
    title: 'How are savings calculated?',
    content: (
      <p>
        We calculate the difference between your current energy consumption and the optimized schedule. This includes analyzing your pump's wattage, runtime hours, and electricity rate. We also account for time-of-use pricing if you have it.
      </p>
    ),
  },
  {
    id: 'implementation',
    title: 'How do I implement the schedule?',
    content: (
      <div className="space-y-2">
        <p>Most pool pump timers can be programmed with multiple on/off periods. Steps:</p>
        <ol className="list-inside list-decimal space-y-1">
          <li>Access your pump timer settings</li>
          <li>Set the start and end times for each block shown in your schedule</li>
          <li>For variable-speed pumps, set the speed for each block</li>
          <li>Test for 1-2 weeks and adjust if needed</li>
        </ol>
      </div>
    ),
  },
];

export default function HelpPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-teal-600 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold text-white lg:text-5xl">
              Help Center
            </h1>
            <p className="mt-4 text-xl text-blue-100">
              Find answers to common questions about pool pump optimization
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-white py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="mb-12 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
            <Accordion items={faqItems} />
          </div>

          {/* Need More Help Cards */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Need More Help?
            </h2>
            <p className="mb-6 text-gray-600">
              Can't find what you're looking for? We're here to help!
            </p>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1 - Calculator Guide */}
              <Link
                href="/calculator"
                className="group rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-cyan-600">
                  <BookOpen className="size-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Calculator Guide</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Step-by-step walkthrough
                </p>
              </Link>

              {/* Card 2 - Email Support */}
              <Link
                href="mailto:info@poolpumpcalc.com"
                className="group rounded-xl border border-green-100 bg-gradient-to-br from-green-50 to-emerald-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
                  <Mail className="size-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">Email Support</h3>
                <p className="mt-2 text-sm text-gray-600">
                  We respond within 24 hours
                </p>
              </Link>

              {/* Card 3 - About */}
              <Link
                href="/"
                className="group rounded-xl border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-gradient-to-r from-purple-500 to-indigo-600">
                  <Info className="size-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">About PoolPumpCalc</h3>
                <p className="mt-2 text-sm text-gray-600">
                  Learn how it works
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
