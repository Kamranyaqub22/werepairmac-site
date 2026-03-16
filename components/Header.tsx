'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { services } from '@/lib/services';
import { PhoneIcon, ChevronDownIcon, MenuIcon, XIcon } from '@/components/Icons';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-brand text-white text-xs py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-2">
          <span className="text-white/80">Based in New Malden · Serving all of Greater London</span>
          <div className="flex items-center gap-4">
            <a href="tel:07378349222" className="flex items-center gap-1.5 font-semibold text-white hover:text-white/80 transition-colors text-sm">
              <PhoneIcon className="w-3.5 h-3.5" />
              0737 834 9222
            </a>
            <a href="mailto:info@werepairmac.co.uk" className="hidden sm:block text-white/70 hover:text-white transition-colors">
              info@werepairmac.co.uk
            </a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="We Repair Mac"
              width={44}
              height={44}
              className="rounded-lg object-cover flex-shrink-0"
              priority
            />
            <div className="leading-none">
              <div className="font-bold text-gray-900 text-[15px]">We Repair Mac</div>
              <div className="text-[11px] text-gray-400 font-normal">Mac · Laptop · PC · Data Recovery</div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center gap-7 text-[13px] font-medium text-gray-600">
            <Link href="/" className="hover:text-brand transition-colors">Home</Link>

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="flex items-center gap-1 hover:text-brand transition-colors">
                Services
                <ChevronDownIcon className="w-3.5 h-3.5 text-gray-400" />
              </button>

              {servicesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-72">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="p-2">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          href={`/${s.slug}`}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 transition-colors group"
                        >
                          <div className="w-8 h-8 bg-brand/8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm">
                            {s.icon}
                          </div>
                          <div>
                            <div className="font-medium text-gray-800 text-[13px] group-hover:text-brand transition-colors">{s.shortTitle}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/about" className="hover:text-brand transition-colors">About</Link>
            <Link href="/faqs" className="hover:text-brand transition-colors">FAQs</Link>
            <Link href="/contact" className="hover:text-brand transition-colors">Contact</Link>
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <a href="tel:07378349222" className="btn-accent px-5 py-2.5">
              <PhoneIcon className="w-4 h-4" />
              Call Now
            </a>
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-1 text-[14px] font-medium text-gray-700">
            <Link href="/" onClick={() => setMenuOpen(false)} className="py-2.5 hover:text-brand transition-colors">Home</Link>

            <div className="py-1">
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 pt-2">Services</div>
              {services.map((s) => (
                <Link
                  key={s.slug}
                  href={`/${s.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 py-2 pl-2 hover:text-brand transition-colors"
                >
                  <span className="text-base">{s.icon}</span>
                  {s.shortTitle}
                </Link>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-2 mt-1 flex flex-col gap-1">
              <Link href="/about" onClick={() => setMenuOpen(false)} className="py-2.5 hover:text-brand">About</Link>
              <Link href="/faqs" onClick={() => setMenuOpen(false)} className="py-2.5 hover:text-brand">FAQs</Link>
              <Link href="/contact" onClick={() => setMenuOpen(false)} className="py-2.5 hover:text-brand">Contact</Link>
            </div>

            <a href="tel:07378349222" className="btn-accent mt-3 justify-center py-3">
              <PhoneIcon className="w-4 h-4" />
              0737 834 9222
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
