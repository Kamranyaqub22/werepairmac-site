'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneIcon, CheckIcon, ArrowRightIcon } from '@/components/Icons';

const slides = [
  {
    src: '/images/revendo-7x0dGJqbfgk-unsplash.jpg',
    alt: 'Mac repair specialist at work - We Repair Mac London',
  },
  {
    src: '/images/nikolai-chernichenko-s6uS36SF91Y-unsplash.jpg',
    alt: 'MacBook repair - We Repair Mac London',
  },
  {
    src: '/images/revendo-DnLhg2eiozc-unsplash.jpg',
    alt: 'Apple device repair - We Repair Mac London',
  },
  {
    src: '/images/jay-wennington-3xf07twcxsY-unsplash.jpg',
    alt: 'Professional laptop repair London',
  },
  {
    src: '/images/nathan-anderson-KHSPGJ3zP0M-unsplash.jpg',
    alt: 'On-site Mac repair service London',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative bg-brand overflow-hidden">
      {/* Slider background images */}
      <div className="absolute inset-0 z-0">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              className="object-cover opacity-20"
              priority={i === 0}
            />
          </div>
        ))}
        {/* Dark gradient overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand/80 via-brand/60 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-14 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: copy */}
          <div>
            <p className="text-accent-light font-semibold text-sm uppercase tracking-wider mb-3">
              Mobile Repair Service - All of Greater London
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
              Mac repair that comes<br className="hidden sm:block" /> to <span className="text-accent-light">your door.</span>
            </h1>
            <p className="text-white/75 text-lg mb-3 leading-relaxed max-w-md">
              Skip the shop. Our engineer travels to your home or office, diagnoses and fixes your Mac or laptop <strong className="text-white">on-site in front of you</strong> - usually in under an hour.
            </p>
            <p className="text-white/55 text-sm mb-8 max-w-md">
              Unlike repair shops that ask you to drop off and wait days, we come to you - same day, 7 days a week, no callout charge.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <a href="tel:07378349222" className="btn-accent px-7 py-3.5 text-base">
                <PhoneIcon className="w-4 h-4" />
                Call 0737 834 9222
              </a>
              <a
                href="https://wa.me/447378349222?text=Hi%2C%20I%20need%20help%20with%20a%20Mac%20or%20laptop%20repair"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#1ebe5d] text-white font-semibold rounded-lg px-6 py-3.5 text-base transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current flex-shrink-0" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp
              </a>
              <Link href="/contact" className="btn-ghost-white py-3.5 px-6 text-base">
                Request a Callback
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-w-sm">
              {['No shop visit needed', 'Fixed at your home', 'Same-day available', 'No Fix, No Fee'].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckIcon className="w-4 h-4 text-accent-light flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right: slider images */}
          <div className="hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl h-[420px]">
              {slides.map((slide, i) => (
                <Image
                  key={slide.src}
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-1000"
                  style={{ opacity: i === current ? 1 : 0 }}
                  priority={i === 0}
                />
              ))}
              {/* Dot indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      i === current ? 'bg-white w-5' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
