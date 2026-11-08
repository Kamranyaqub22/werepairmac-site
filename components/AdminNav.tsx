import Link from 'next/link';

/**
 * Links between the admin tools. Each tool lived at its own address with
 * nothing pointing between them, so the Facebook console in particular was
 * effectively hidden unless you knew its URL.
 */
const LINKS = [
  { href: '/admin/repairs', label: 'Publish a repair' },
  { href: '/admin/photos', label: 'Photo library' },
  { href: '/admin/social', label: 'Facebook posts' },
  { href: '/admin/estimate', label: 'Estimates' },
];

export default function AdminNav() {
  return (
    <nav aria-label="Admin tools" className="print:hidden border-b border-gray-200 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-2 flex flex-wrap gap-2 text-sm">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-brand hover:border-brand"
          >
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
