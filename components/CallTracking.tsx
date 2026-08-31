'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Sends a GA4 `call_click` event whenever a visitor taps a phone number.
 *
 * The phone call IS the conversion for a call-out business, so without this
 * the analytics can only report which pages get read, never which ones get
 * the phone ringing.
 *
 * Deliberately a single delegated listener rather than an onClick on each
 * link: `tel:` links appear on roughly twenty pages, most of them server
 * components, and threading a handler through all of them would turn them
 * into client components for the sake of one event.
 *
 * No-ops when `window.gtag` is absent, which is the case until the visitor
 * accepts cookies in <CookieConsent />. Declining consent means no events,
 * with no extra bookkeeping here.
 */
export default function CallTracking() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;

      const link = target.closest<HTMLAnchorElement>('a[href^="tel:"]');
      if (!link) return;

      if (typeof window.gtag !== 'function') return;

      window.gtag('event', 'call_click', {
        // Which page earned the call — the whole point of the exercise.
        page_path: window.location.pathname,
        call_placement: placementOf(link),
        link_text: (link.textContent ?? '').trim().slice(0, 100),
        link_url: link.getAttribute('href') ?? '',
        // Tapping a number can hand the tab straight to the dialer; a beacon
        // still goes out if that happens.
        transport_type: 'beacon',
      });
    };

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}

/**
 * Where on the page the tapped number lives, so the report can separate a
 * considered call from the header's permanent one.
 *
 * Falls back to inferring from the surrounding landmark, which keeps every
 * existing `tel:` link reporting something useful without being edited. Set
 * `data-call-source` on a link to name a placement explicitly.
 */
function placementOf(link: HTMLAnchorElement): string {
  const explicit = link.closest<HTMLElement>('[data-call-source]')?.dataset.callSource;
  if (explicit) return explicit;

  if (link.closest('header')) return 'header';
  if (link.closest('footer')) return 'footer';
  if (link.closest('form')) return 'form';

  return 'in-page';
}
