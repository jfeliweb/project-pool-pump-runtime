'use client';

import { useClerk, useUser } from '@clerk/nextjs';
import { Calculator, ChevronDown, LayoutDashboard, LogOut, Menu, Settings } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type ModernHeaderProps = {
  currentPage?: 'home' | 'calculator' | 'help';
};

export const ModernHeader = ({ currentPage }: ModernHeaderProps) => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setIsDropdownOpen(false);
  };

  const handleDropdownItemClick = () => {
    setIsDropdownOpen(false);
  };

  const getUserInitials = () => {
    if (user?.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = () => {
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.emailAddresses?.[0]?.emailAddress) {
      return user.emailAddresses[0].emailAddress;
    }
    return 'User';
  };

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-700 to-teal-600">
                <Calculator className="size-4 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">PoolPumpCalc</span>
            </Link>
          </div>

          {/* Center: Navigation Links */}
          <nav className="hidden flex-1 md:flex md:justify-center">
            <div className="flex items-center space-x-8">
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

              {/* Show Pricing only for logged-out users */}
              {isLoaded && !user && (
                <Link
                  href="/pricing"
                  className="text-gray-600 transition-colors hover:text-blue-700"
                >
                  Pricing
                </Link>
              )}
            </div>
          </nav>

          {/* Right: Auth Buttons / User Menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {/* Logged-out: Sign In and Get Started buttons */}
            {isLoaded && !user && (
              <>
                <Link
                  href="/sign-in"
                  className="rounded-lg border-2 border-blue-700 px-4 py-2 text-blue-700 transition-colors hover:bg-blue-50"
                >
                  Sign In
                </Link>
                <Link
                  href="/sign-up"
                  className="rounded-lg bg-blue-700 px-4 py-2 text-white transition-colors hover:bg-blue-800"
                >
                  Get Started
                </Link>
              </>
            )}

            {/* Logged-in: User dropdown menu */}
            {isLoaded && user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 rounded-lg border-2 border-gray-200 px-3 py-2 transition-colors hover:border-blue-300 hover:bg-blue-50"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-700 to-teal-600 text-sm font-semibold text-white">
                    {getUserInitials()}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {getUserDisplayName()}
                  </span>
                  <ChevronDown className={`size-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg">
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        onClick={handleDropdownItemClick}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 transition-colors hover:bg-blue-50"
                      >
                        <LayoutDashboard className="size-5" />
                        <span className="font-medium">Dashboard</span>
                      </Link>
                      <Link
                        href="/dashboard/user-profile"
                        onClick={handleDropdownItemClick}
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 transition-colors hover:bg-blue-50"
                      >
                        <Settings className="size-5" />
                        <span className="font-medium">Account</span>
                      </Link>
                      <div className="my-1 border-t border-gray-200" />
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="flex w-full items-center space-x-3 px-4 py-3 text-left text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogOut className="size-5" />
                        <span className="font-medium">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button type="button" className="ml-auto md:hidden" aria-label="Open menu">
            <Menu className="size-6 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
};
