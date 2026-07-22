'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

const STORAGE_KEY = 'wrm-cookie-consent';
const GA_ID = 'G-53GRHDW428';
// Microsoft Clarity project id — set NEXT_PUBLIC_CLARITY_ID in .env.local.
// Left empty, Clarity simply never loads.
const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

type Consent = 'accepted' | 'declined';

/**
 * GDPR-friendly consent gate for our analytics tools.
 *
 * Google Analytics 4 and Microsoft Clarity are opt-in: their scripts are only
 * injected AFTER the visitor clicks "Accept". Until a choice is stored in
 * localStorage the banner shows and no analytics cookies are set. Declining is
 * remembered and never loads either tool.
 */
export default function CookieConsent() {
  const [consent, setConsent] = useState<Consent | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'accepted' || stored === 'declined') {
        setConsent(stored);
      }
    } catch {
      /* localStorage unavailable (private mode) — treat as no choice yet */
    }
    setReady(true);
  }, []);

  const choose = (value: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore write failures */
    }
    setConsent(value);
  };

  return (
    <>
      {/* GA4 loads only once the visitor has accepted */}
      {consent === 'accepted' && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script
            id="ga4-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `,
            }}
          />

          {/* Microsoft Clarity — heatmaps & session replay, consent-gated */}
          {CLARITY_ID && (
            <Script
              id="clarity-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  (function(c,l,a,r,i,t,y){
                    c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                    t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                    y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                  })(window, document, "clarity", "script", "${CLARITY_ID}");
                `,
              }}
            />
          )}
        </>
      )}

      {/* Consent banner — only shown before a choice is made */}
      {ready && consent === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          className="fixed bottom-0 inset-x-0 z-[60] sm:bottom-4 sm:inset-x-4 sm:mx-auto sm:max-w-3xl"
        >
          <div className="bg-gray-950 text-gray-200 border-t border-gray-800 sm:border sm:rounded-2xl shadow-2xl px-5 py-4 sm:px-6 sm:py-5 flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-sm leading-relaxed flex-1 text-gray-300">
              We use cookies to run this site and, with your permission,
              analytics tools (Google Analytics and Microsoft Clarity) to
              understand how it&apos;s used. See our{' '}
              <Link href="/cookies" className="text-white font-semibold underline hover:no-underline">
                Cookie Policy
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-white font-semibold underline hover:no-underline">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => choose('declined')}
                className="px-4 py-2.5 rounded-md text-sm font-semibold border border-gray-700 text-gray-200 hover:bg-gray-800 transition-colors"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose('accepted')}
                className="px-5 py-2.5 rounded-md text-sm font-semibold bg-brand text-white hover:bg-brand-dark transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
