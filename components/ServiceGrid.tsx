import Link from 'next/link';
import Image from 'next/image';
import { services } from '@/lib/services';
import { ArrowRightIcon } from '@/components/Icons';

export default function ServiceGrid() {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl mb-10">
          <h2 className="section-heading mb-3">Repair services delivered to your door</h2>
          <p className="text-gray-500 text-base leading-relaxed">
            Every repair comes with a 90-day warranty and our No Fix, No Fee guarantee. We come to you anywhere across Greater London.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {services.map((s) => (
            <Link
              href={`/${s.slug}`}
              key={s.slug}
              className="group rounded-xl overflow-hidden border border-gray-100 hover:border-brand/20 hover:shadow-lg transition-all duration-200 bg-white"
            >
              {/* Photo */}
              <div className="relative h-44 overflow-hidden bg-gray-100">
                <Image
                  src={s.image}
                  alt={s.shortTitle}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand/60 to-transparent" />
                <div className="absolute bottom-3 left-3">
                  <span className="text-white font-semibold text-sm">{s.shortTitle}</span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{s.description}</p>
                <span className="inline-flex items-center gap-1 text-brand font-semibold text-xs group-hover:gap-2 transition-all duration-150">
                  Learn more
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
