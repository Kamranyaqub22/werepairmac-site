import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileCTABar from '@/components/MobileCTABar';
import CookieConsent from '@/components/CookieConsent';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'Mac, Laptop & Console Repair London | We Come To You',
    template: '%s | We Repair Mac',
  },
  description:
    'London\'s mobile Mac, laptop & console repair service. Same-day home or office visits, no shop needed. No fix, no fee. Call 07378 349222.',
  keywords: [
    'mobile mac repair london',
    'mac repair home visit london',
    'macbook repair callout london',
    'laptop repair home visit london',
    'mobile laptop repair london',
    'mac repair at home london',
    'macbook repair without shop visit',
    'same day mac repair london',
    'we come to you mac repair',
    'mobile computer repair london',
    'macbook screen repair london',
    'data recovery london',
    'virus removal london',
    'playstation repair london',
    'ps5 repair london',
    'ps4 repair london',
    'console repair london',
    'mac repair new malden',
    'mac repair kingston',
  ],
  authors: [{ name: 'We Repair Mac' }],
  creator: 'We Repair Mac',
  publisher: 'We Repair Mac',
  metadataBase: new URL('https://www.werepairmac.co.uk'),
  alternates: {
    canonical: 'https://www.werepairmac.co.uk',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://www.werepairmac.co.uk',
    siteName: 'We Repair Mac',
    title: 'We Repair Mac | Mac, Laptop, PC & Console Repair London',
    description:
      'Same-day Mac, laptop, PC and console repairs across Greater London. No fix, no fee. Call 07378 349222.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'We Repair Mac - London Mac, Laptop & Console Repair',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'We Repair Mac | Mac, Laptop, PC & Console Repair London',
    description: 'Same-day Mac, laptop, PC and console repairs across Greater London. No fix, no fee.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  // Site-ownership verification. Bing Webmaster Tools reads the msvalidate.01
  // meta tag; set BING_SITE_VERIFICATION in the environment to emit it.
  ...(process.env.BING_SITE_VERIFICATION
    ? {
        verification: {
          other: { 'msvalidate.01': process.env.BING_SITE_VERIFICATION },
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={inter.className}>
      <head>
        <LocalBusinessSchema />
        <meta name="geo.region" content="GB-LND" />
        <meta name="geo.placename" content="London" />
        <meta name="geo.position" content="51.404;-0.257" />
        <meta name="ICBM" content="51.404, -0.257" />
      </head>
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
        {/* Spacer so the fixed mobile bar never hides the footer's last row */}
        <div className="h-16 sm:hidden" aria-hidden="true" />
        <WhatsAppButton />
        <MobileCTABar />

        {/* Google Analytics 4 — loaded only after cookie consent */}
        <CookieConsent />
      </body>
    </html>
  );
}
