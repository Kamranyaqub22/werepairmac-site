'use client';

import { useState } from 'react';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: FAQAccordionProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="divide-y divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
      {items.map((item, i) => (
        <div key={i} className="bg-white">
          <button
            className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(open === i ? null : i)}
          >
            <span>{item.q}</span>
            <span className="ml-4 text-brand text-lg">{open === i ? '−' : '+'}</span>
          </button>
          {open === i && (
            <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
