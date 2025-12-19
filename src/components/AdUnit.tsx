'use client';

import { useEffect, useRef, useState } from 'react';
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
  // Get client ID - hooks must be called before any early returns
  const clientId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  const { isPremium, isLoading } = useSubscription();
  const adRef = useRef<HTMLDivElement>(null);
  const insRef = useRef<HTMLModElement>(null);
  const adInitialized = useRef(false);
  const [adLoaded, setAdLoaded] = useState(false);
  const [shouldShow, setShouldShow] = useState(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const initTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const scriptLoadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Don't show ads for premium users or while loading
    if (isPremium || isLoading || adInitialized.current) {
      // Clean up any pending timeouts when premium or loading
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
        initTimeoutRef.current = null;
      }
      if (scriptLoadTimeoutRef.current) {
        clearTimeout(scriptLoadTimeoutRef.current);
        scriptLoadTimeoutRef.current = null;
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }
      return;
    }

    // Set timeout to hide ad if it doesn't load within 10 seconds
    timeoutRef.current = setTimeout(() => {
      if (!adLoaded) {
        setShouldShow(false);
      }
    }, 10000);

    // Monitor ad load status
    const checkAdStatus = () => {
      if (!insRef.current) {
        return;
      }

      const status = insRef.current.getAttribute('data-adsbygoogle-status');
      if (status === 'done') {
        // Ad loaded successfully
        setAdLoaded(true);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      } else if (status === 'error' || status === 'unfilled') {
        // Ad failed to load or no ad available
        setShouldShow(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    // Check ad status periodically
    const statusInterval = setInterval(checkAdStatus, 500);

    const initializeAd = () => {
      // Validate client ID is still present before initializing
      if (!clientId) {
        setShouldShow(false);
        return;
      }

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
        retryTimeoutRef.current = setTimeout(initializeAd, 100);
        return;
      }

      // Check if this ins element already has an ad
      const hasAd = insRef.current.hasAttribute('data-adsbygoogle-status');
      if (hasAd) {
        adInitialized.current = true;
        checkAdStatus();
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
                    if (scriptLoadTimeoutRef.current) {
                      clearTimeout(scriptLoadTimeoutRef.current);
                      scriptLoadTimeoutRef.current = null;
                    }
                    resolve();
                  }
                }, 50);
                // Timeout after 5 seconds
                scriptLoadTimeoutRef.current = setTimeout(() => {
                  clearInterval(checkInterval);
                  scriptLoadTimeoutRef.current = null;
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
            // Only set data-ad-client if client ID is valid
            if (clientId) {
              script.setAttribute('data-ad-client', clientId);
            }

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
            // Double-check that the element hasn't been initialized and client ID is still valid
            if (insRef.current && !insRef.current.hasAttribute('data-adsbygoogle-status') && clientId) {
              if (window.adsbygoogle) {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
                adInitialized.current = true;
              }
            }
          })
          .catch((error) => {
            console.error('Ad loading error:', error);
            setShouldShow(false);
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
          });
      } catch (error) {
        console.error('Ad initialization error:', error);
        setShouldShow(false);
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      }
    };

    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      // Small delay to ensure container has dimensions
      initTimeoutRef.current = setTimeout(initializeAd, 50);
    });

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (initTimeoutRef.current) {
        clearTimeout(initTimeoutRef.current);
      }
      if (scriptLoadTimeoutRef.current) {
        clearTimeout(scriptLoadTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      clearInterval(statusInterval);
    };
  }, [isPremium, isLoading, adLoaded, clientId]);

  // Safe fallback: Check for required AdSense configuration after all hooks are called
  if (!clientId || !slot) {
    return null;
  }

  // Don't render for premium users or if ad shouldn't be shown
  if (isPremium || isLoading || !shouldShow) {
    return null;
  }

  // Get size constraints based on format
  const getSizeClasses = () => {
    switch (format) {
      case 'rectangle':
        return 'max-w-md max-h-[300px] overflow-hidden';
      case 'horizontal':
        return 'max-w-full max-h-[100px] overflow-hidden';
      case 'vertical':
        return 'max-w-[160px] max-h-[600px] overflow-hidden';
      default:
        return 'max-w-full overflow-hidden';
    }
  };

  return (
    <div ref={adRef} className={`${getSizeClasses()} ${className}`}>
      <div className="mb-2 text-xs text-gray-400">Advertisement</div>
      <ins
        ref={insRef}
        className="adsbygoogle" // Google AdSense required class
        style={{ display: 'block' }}
        data-ad-client={clientId}
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
