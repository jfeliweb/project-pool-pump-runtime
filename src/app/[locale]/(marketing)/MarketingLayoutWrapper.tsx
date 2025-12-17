'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

type MarketingLayoutWrapperProps = {
  children: ReactNode;
  baseTemplateContent: ReactNode;
  locale: string;
};

export const MarketingLayoutWrapper = ({
  children,
  baseTemplateContent,
  locale,
}: MarketingLayoutWrapperProps) => {
  const pathname = usePathname();

  // Pages with custom modern design (don't use BaseTemplate)
  const modernPages = ['/', '/calculator', '/help', '/pricing', '/about'];
  const isModernPage = modernPages.some(
    page =>
      pathname === page
      || pathname === `/${locale}${page}`
      || pathname === `/${locale}${page}/`
      || pathname === `${page}/`,
  );

  // For modern pages, render children directly (they have their own headers/footers)
  // For other pages, render with BaseTemplate wrapper
  return isModernPage ? <>{children}</> : <>{baseTemplateContent}</>;
};
