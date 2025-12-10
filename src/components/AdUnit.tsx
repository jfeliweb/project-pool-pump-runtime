'use client';

import { useEffect, useRef } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';

type AdUnitProps = {
  slot: string;
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical';
  className?: string;
};

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdUnit = ({ slot, format = 'auto', className = '' }: AdUnitProps) => {
  const { isPremium, isLoading } = useSubscription();
  const adRef = useRef<HTMLDivElement>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    // Don't show ads for premium users or while loading
    if (isPremium || isLoading || adInitialized.current) {
      return;
    }

    try {
      // Load AdSense script if not already loaded
      if (!document.querySelector('script[src*="adsbygoogle"]')) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        script.async = true;
        script.crossOrigin = 'anonymous';
        script.setAttribute('data-ad-client', process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '');
        document.head.appendChild(script);
      }

      // Push ad
      if (window.adsbygoogle && adRef.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        adInitialized.current = true;
      }
    } catch (error) {
      console.error('Ad loading error:', error);
    }
  }, [isPremium, isLoading]);

  // Don't render for premium users
  if (isPremium || isLoading) {
    return null;
  }

  return (
    <div ref={adRef} className={className}>
      <div className="mb-2 text-xs text-gray-400">Advertisement</div>
      <ins
        className="adsbygoogle" // Google AdSense required class
        style={{ display: 'block' }}
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Specific ad unit presets
export const HorizontalAd = ({ className }: { className?: string }) => {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_HEADER || '1111111111'}
      format="horizontal"
      className={className}
    />
  );
};

export const RectangleAd = ({ className }: { className?: string }) => {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || '3333333333'}
      format="rectangle"
      className={className}
    />
  );
};

export const FooterAd = ({ className }: { className?: string }) => {
  return (
    <AdUnit
      slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || '2222222222'}
      format="horizontal"
      className={className}
    />
  );
};
