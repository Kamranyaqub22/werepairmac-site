import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap' });
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LocalBusinessSchema from '@/components/LocalBusinessSchema';
import WhatsAppButton from '@/components/WhatsAppButton';

export const metadata: Metadata = {
  title: {
    default: 'Mobile Mac & Laptop Repair London | We Come To You | No Fix No Fee',
    template: '%s | We Repair Mac London',
  },
  description:
    'London\'s mobile Mac, laptop and console repair service. We come to your home or office - no shop visit needed. Same-day callout across Greater London. MacBook, data recovery, screen repair, PlayStation, Xbox, Nintendo Switch and virus removal. No fix, no fee. Call 0737 834 9222.',
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
  metadataBase: new URL('https://werepairmac.co.uk'),
  alternates: {
    canonical: 'https://werepairmac.co.uk',
  },
  openGraph: {
    type: 'website',
    locale: 'en_GB',
    url: 'https://werepairmac.co.uk',
    siteName: 'We Repair Mac',
    title: 'We Repair Mac | Mac, Laptop, PC & Console Repair London',
    description:
      'Same-day Mac, laptop, PC and console repairs across Greater London. No fix, no fee. Call 0737 834 9222.',
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
        <WhatsAppButton />
      </body>
    </html>
  );
}
