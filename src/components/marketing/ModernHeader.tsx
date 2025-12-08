'use client';

import { Calculator, Menu } from 'lucide-react';
import Link from 'next/link';

type ModernHeaderProps = {
  currentPage?: 'home' | 'calculator' | 'help';
};

export const ModernHeader = ({ currentPage }: ModernHeaderProps) => {
  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Left */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-700 to-teal-600">
              <Calculator className="size-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">PoolCalc</span>
          </Link>

          {/* Navigation Right */}
          <nav className="hidden items-center space-x-8 md:flex">
            <Link
              href="/#how-it-works"
              className={`transition-colors ${
                currentPage === 'home'
                  ? 'font-semibold text-blue-700'
                  : 'text-gray-600 hover:text-blue-700'
              }`}
            >
              How It Works
            </Link>
            <Link
              href="/calculator"
              className={`transition-colors ${
                currentPage === 'calculator'
                  ? 'font-semibold text-blue-700'
                  : 'text-gray-600 hover:text-blue-700'
              }`}
            >
              Calculator
            </Link>
            <Link
              href="/help"
              className={`transition-colors ${
                currentPage === 'help'
                  ? 'font-semibold text-blue-700'
                  : 'text-gray-600 hover:text-blue-700'
              }`}
            >
              Help
            </Link>
            <Link
              href="/calculator"
              className="rounded-lg bg-blue-700 px-4 py-2 text-white transition-colors hover:bg-blue-800"
            >
              Get Started
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button type="button" className="md:hidden" aria-label="Open menu">
            <Menu className="size-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
