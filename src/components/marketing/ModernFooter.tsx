import { Calculator } from 'lucide-react';
import Link from 'next/link';

export const ModernFooter = () => {
  return (
    <footer className="bg-gray-900 py-12 text-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand Column */}
          <div>
            <div className="mb-4 flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-700 to-teal-600">
                <Calculator className="size-4 text-white" />
              </div>
              <span className="text-xl font-bold">PoolCalc</span>
            </div>
            <p className="text-gray-400">
              Helping US pool owners save money on electricity costs through smart pump optimization.
            </p>
          </div>

          {/* Product Column */}
          <div>
            <h4 className="mb-4 font-semibold">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/calculator" className="transition-colors hover:text-white">
                  Calculator
                </Link>
              </li>
              <li>
                <Link href="/#savings" className="transition-colors hover:text-white">
                  Savings Guide
                </Link>
              </li>
              <li>
                <Link href="/#pool-types" className="transition-colors hover:text-white">
                  Pool Types
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="mb-4 font-semibold">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/help" className="transition-colors hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <a href="#contact" className="transition-colors hover:text-white">
                  Contact Us
                </a>
              </li>
              <li>
                <Link href="/help" className="transition-colors hover:text-white">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="mb-4 font-semibold">Company</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-400">
          <p>
            &copy;
            {new Date().getFullYear()}
            {' '}
            PoolCalc. All rights reserved. Made in the USA
          </p>
        </div>
        <div className="text-center text-xs text-gray-500">
          <p>
            Disclosure: We earn a commission from qualifying purchases made through
            affiliate links. This helps keep our calculator free. Prices are the same
            whether you use our links or not.
          </p>
        </div>
      </div>
    </footer>
  );
};
