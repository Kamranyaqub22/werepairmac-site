import Link from 'next/link';
import { PhoneIcon, ArrowRightIcon } from '@/components/Icons';

// Sticky bottom action bar shown on phones only (the header "Get a Quote" button
// is hidden below lg). Keeps the two highest-value actions — call and book —
// one tap away from every page, so the booking form is never buried.
export default function MobileCTABar() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-[90] sm:hidden grid grid-cols-2 gap-2 p-2.5 bg-white/95 backdrop-blur border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <a href="tel:07378349222" className="btn-accent justify-center py-3 text-sm">
        <PhoneIcon className="w-4 h-4" /> Call Now
      </a>
      <Link href="/quote" className="btn-primary justify-center py-3 text-sm">
        Get a Quote <ArrowRightIcon className="w-4 h-4" />
      </Link>
    </div>
  );
}
