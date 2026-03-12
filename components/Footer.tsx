import Link from 'next/link';
import { services } from '@/lib/services';
import { locations } from '@/lib/locations';
import { PhoneIcon, MailIcon, MapPinIcon } from '@/components/Icons';

export default function Footer() {
  const featuredLocations = locations.slice(0, 18);

  return (
    <footer className="bg-gray-950 text-gray-400">
      {/* CTA band */}
      <div className="bg-brand py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Need a repair?</h2>
            <p className="text-blue-200 text-sm">Same-day home &amp; office visits across Greater London. No fix, no fee.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="tel:07378349222" className="btn-white">
              <PhoneIcon className="w-4 h-4 text-brand" />
              0737 834 9222
            </a>
            <a href="mailto:info@werepairmac.co.uk" className="btn-ghost-white">
              <MailIcon className="w-4 h-4" />
              Email for a Quote
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 bg-brand rounded-lg flex items-center justify-center">
              <span className="text-white font-black text-sm">WR</span>
            </div>
            <span className="font-bold text-white text-[15px]">We Repair Mac</span>
          </Link>
          <p className="text-sm leading-relaxed mb-5 text-gray-500">
            Professional Mac, laptop &amp; PC repair across Greater London. Home and office visits, 7 days a week.
          </p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPinIcon className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
              <span className="text-gray-500">18 Vincent House, Burlington Road<br />New Malden, KT3 4NX</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <a href="tel:07378349222" className="hover:text-white transition-colors">0737 834 9222</a>
            </div>
            <div className="flex items-center gap-2">
              <MailIcon className="w-4 h-4 text-gray-600 flex-shrink-0" />
              <a href="mailto:info@werepairmac.co.uk" className="hover:text-white transition-colors">info@werepairmac.co.uk</a>
            </div>
          </div>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Services</h3>
          <ul className="space-y-2.5 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="hover:text-white transition-colors">
                  {s.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Areas We Cover</h3>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {featuredLocations.map((l) => (
              <li key={l.slug}>
                <Link href={`/mac-repair-${l.slug}`} className="hover:text-white transition-colors">
                  {l.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links + trust */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Company</h3>
          <ul className="space-y-2.5 text-sm mb-8">
            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>

          <h3 className="text-white font-semibold mb-3 text-sm uppercase tracking-wider">Our Guarantee</h3>
          <ul className="space-y-1.5 text-xs text-gray-500">
            <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> No Fix, No Fee</li>
            <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> No Callout Charge</li>
            <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> Same-Day Available</li>
            <li className="flex items-center gap-1.5"><span className="text-green-500">✓</span> 90-Day Warranty</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-900 px-4 sm:px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
        <span>© {new Date().getFullYear()} We Repair Mac · New Malden, London</span>
        <span>Mac · Laptop · PC Repair across Greater London &amp; Surrey</span>
      </div>
    </footer>
  );
}
