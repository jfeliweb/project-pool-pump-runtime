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
  const insRef = useRef<HTMLModElement>(null);
  const adInitialized = useRef(false);

  useEffect(() => {
    // Don't show ads for premium users or while loading
    if (isPremium || isLoading || adInitialized.current) {
      return;
    }

    const initializeAd = () => {
      // Check if ad is already initialized by checking if the ins element has been processed
      if (!insRef.current || adInitialized.current) {
        return;
      }

      // Check if the container has dimensions
      const container = adRef.current;
      if (!container) {
        return;
      }

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        // Container not ready, retry after a short delay
        setTimeout(initializeAd, 100);
        return;
      }

      // Check if this ins element already has an ad
      const hasAd = insRef.current.hasAttribute('data-adsbygoogle-status');
      if (hasAd) {
        adInitialized.current = true;
        return;
      }

      try {
        // Ensure AdSense script is loaded
        const loadScript = (): Promise<void> => {
          return new Promise((resolve, reject) => {
            // Check if script already exists
            const existingScript = document.querySelector('script[src*="adsbygoogle"]');
            if (existingScript) {
              // Script exists, wait for it to load if needed
              if (window.adsbygoogle) {
                resolve();
              } else {
                // Wait for script to load
                const checkInterval = setInterval(() => {
                  if (window.adsbygoogle) {
                    clearInterval(checkInterval);
                    resolve();
                  }
                }, 50);
                // Timeout after 5 seconds
                setTimeout(() => {
                  clearInterval(checkInterval);
                  reject(new Error('AdSense script load timeout'));
                }, 5000);
              }
              return;
            }

            // Create and load script
            const script = document.createElement('script');
            script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
            script.async = true;
            script.crossOrigin = 'anonymous';
            script.setAttribute('data-ad-client', process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || '');

            script.onload = () => {
              resolve();
            };
            script.onerror = () => {
              reject(new Error('Failed to load AdSense script'));
            };

            document.head.appendChild(script);
          });
        };

        loadScript()
          .then(() => {
            // Double-check that the element hasn't been initialized
            if (insRef.current && !insRef.current.hasAttribute('data-adsbygoogle-status')) {
              if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                adInitialized.current = true;
              }
            }
          })
          .catch((error) => {
            console.error('Ad loading error:', error);
          });
      } catch (error) {
        console.error('Ad initialization error:', error);
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Small delay to ensure container has dimensions
      setTimeout(initializeAd, 50);
    });
  }, [isPremium, isLoading]);

  // Don't render for premium users
  if (isPremium || isLoading) {
    return null;
  }

  return (
    <div ref={adRef} className={className}>
      <div className="mb-2 text-xs text-gray-400">Advertisement</div>
      <ins
        ref={insRef}
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
