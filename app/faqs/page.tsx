import type { Metadata } from 'next';
import FAQAccordion from '@/components/FAQAccordion';

export const metadata: Metadata = {
  title: 'FAQs | Mac & Laptop Repair London | We Repair Mac',
  description:
    'Frequently asked questions about our Mac and laptop repair service in London. Learn about costs, same-day service, warranties and our No Fix, No Fee policy.',
  alternates: { canonical: 'https://www.werepairmac.co.uk/faqs' },
};

const faqCategories = [
  {
    category: 'General Service',
    faqs: [
      {
        q: 'Do you come to my home or office?',
        a: 'Yes - we are fully mobile. Our engineers visit you at your home, office, or any other convenient location across Greater London. There is no callout charge for this service.',
      },
      {
        q: 'What areas do you cover?',
        a: 'We cover all of Greater London and parts of Surrey. We are based in New Malden, KT3, and travel to all London boroughs including Kingston, Wimbledon, Croydon, Chelsea, Clapham, Brixton, Greenwich and everywhere in between.',
      },
      {
        q: 'How quickly can you come?',
        a: 'We offer same-day callouts when you book before 2pm. Evening and weekend appointments are also available. In many cases we can arrive within 2–4 hours of your call.',
      },
      {
        q: 'What are your working hours?',
        a: 'We are available 24 hours a day, 7 days a week. You can call or book at any time — we work around your schedule, whenever you need us.',
      },
    ],
  },
  {
    category: 'Pricing & Payment',
    faqs: [
      {
        q: 'What does "No Fix, No Fee" mean?',
        a: 'If we cannot repair your device, you pay absolutely nothing - no diagnostic fee, no callout charge, nothing at all. You only pay once the repair is complete and you are satisfied.',
      },
      {
        q: 'Is there a callout charge?',
        a: 'No. We never charge a callout or travel fee. You only pay for the repair itself.',
      },
      {
        q: 'How much does a repair cost?',
        a: 'Our labour rate is £100 per hour (minimum 1 hour), plus the cost of any parts required. We always give you a clear quote covering both labour and parts before we start — no surprises and no hidden fees. For simple software jobs with no parts needed, you just pay the hourly labour charge.',
      },
      {
        q: 'What payment methods do you accept?',
        a: 'We accept cash, bank transfer and major debit/credit cards. Payment is only due on completion of the repair.',
      },
    ],
  },
  {
    category: 'Mac & Laptop Repairs',
    faqs: [
      {
        q: 'Do you repair all MacBook models?',
        a: 'Yes. We repair all MacBook Pro and MacBook Air models, including M1, M2 and M3 chip variants, as well as older Intel models. We also repair iMac, Mac Mini, and Mac Studio.',
      },
      {
        q: 'Can you repair a MacBook with water damage?',
        a: 'Yes - but act fast. Do not turn it on after a liquid spill. Call us immediately. The sooner we assess it, the better the chance of a full recovery. We handle water and liquid damage repair as an emergency same-day service.',
      },
      {
        q: 'Can you recover data from a dead hard drive?',
        a: 'In most cases, yes. We recover data from failed hard drives, SSDs, corrupted partitions, accidentally formatted drives and more. We handle Mac APFS and Windows NTFS drives.',
      },
      {
        q: 'Do you repair gaming PCs and laptops?',
        a: 'Yes. We repair gaming desktops and laptops from all brands including Alienware, ASUS ROG, Razer, MSI and custom-built systems. We fix GPU faults, PSU failures, overheating, and Windows gaming issues.',
      },
    ],
  },
  {
    category: 'Warranty & After-Care',
    faqs: [
      {
        q: 'Do repairs come with a warranty?',
        a: 'Yes. All repairs carry a 90-day parts and labour warranty. If the same fault recurs within 90 days of the repair, we fix it at no extra charge.',
      },
      {
        q: 'What if I have a question after my repair?',
        a: 'Simply call or email us. We are available 7 days a week to answer any question after your repair. We consider our job done only when you are fully satisfied.',
      },
    ],
  },
];

// FAQ Schema
function FAQPageSchema() {
  const allFaqs = faqCategories.flatMap((c) => c.faqs);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allFaqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export default function FAQPage() {
  return (
    <>
      <FAQPageSchema />

      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-900 to-brand text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Frequently Asked Questions</h1>
          <p className="text-blue-100 text-lg">
            Everything you need to know about our Mac and laptop repair service across London.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 space-y-12">
          {faqCategories.map((cat) => (
            <div key={cat.category}>
              <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
                <span className="w-1 h-6 bg-brand rounded-full inline-block" />
                {cat.category}
              </h2>
              <FAQAccordion items={cat.faqs} />
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand text-white py-12 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-3">Still have a question?</h2>
          <p className="text-blue-100 mb-6">Call or email - we usually respond within 30 minutes.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <a href="tel:07378349222" className="btn-accent py-3 px-8">📞 0737 834 9222</a>
            <a href="mailto:info@werepairmac.co.uk" className="btn-outline border-white text-white hover:bg-white hover:text-brand py-3 px-6">
              ✉️ Email Us
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
