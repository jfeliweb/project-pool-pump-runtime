import Link from 'next/link';
import { ModernFooter } from '@/components/marketing/ModernFooter';
import { ModernHeader } from '@/components/marketing/ModernHeader';
import { CheckoutButton } from '@/components/SubscriptionCheckout';

export default function PricingPage() {
  return (
    <div className="min-h-screen">
      <ModernHeader />

      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
          <p className="mt-4 text-lg text-gray-600">
            Unlock premium features and remove ads
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:gap-12">
          {/* Free Plan */}
          <div className="rounded-2xl border-2 border-gray-200 p-8">
            <h3 className="text-2xl font-bold">Free</h3>
            <p className="mt-2 text-gray-600">Perfect for trying out the calculator</p>

            <div className="mt-6">
              <span className="text-4xl font-bold">$0</span>
              <span className="text-gray-600">/forever</span>
            </div>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Complete pool pump calculator</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Energy cost estimates</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">1 saved pool configuration</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Product recommendations</span>
              </li>
              <li className="flex items-start text-gray-400">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="ml-3">Includes ads</span>
              </li>
            </ul>

            <Link
              href="/sign-up"
              className="mt-8 block w-full rounded-lg bg-gray-200 py-3 text-center font-semibold text-gray-600 hover:bg-gray-300"
            >
              Get Started Free
            </Link>
          </div>

          {/* Premium Plan */}
          <div className="relative rounded-2xl border-2 border-blue-500 p-8">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-1 text-sm font-semibold text-white">
              POPULAR
            </div>

            <h3 className="text-2xl font-bold">Premium</h3>
            <p className="mt-2 text-gray-600">For serious pool owners</p>

            <div className="mt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold">$49</span>
                <span className="text-gray-600">/year</span>
              </div>
              <p className="mt-1 text-sm text-gray-500">or $5/month</p>
            </div>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3 font-semibold">Everything in Free, plus:</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3"><strong>Ad-free experience</strong></span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Unlimited PDF downloads</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Unlimited saved pools</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Historical savings tracking</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Seasonal optimization calendar</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">What-if scenario modeling</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="ml-3">Priority support</span>
              </li>
            </ul>

            <div className="mt-8 space-y-3">
              <CheckoutButton
                planType="annual"
                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Get Premium - Annual
              </CheckoutButton>

              <CheckoutButton
                planType="monthly"
                className="w-full rounded-lg border-2 border-blue-600 py-3 font-semibold text-blue-600 hover:bg-blue-50"
              >
                Get Premium - Monthly
              </CheckoutButton>
            </div>

            <p className="mt-4 text-center text-sm text-gray-500">
              Cancel anytime. No questions asked.
            </p>
          </div>
        </div>

        <div className="mt-16 text-center">
          <p className="text-sm text-gray-500">
            30-day money-back guarantee • Secure payment via Stripe
          </p>
        </div>
      </div>

      <ModernFooter />
    </div>
  );
}
