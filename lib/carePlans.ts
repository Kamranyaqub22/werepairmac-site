// Care Plan (subscription) + Remote Support data.
//
// All commercial numbers live here so they're trivial to adjust — nothing in the
// page components hard-codes a price. Annual price = ~2 months free vs monthly.
//
// Pricing rationale (July 2026 UK market research):
//   • Mirrors proven UK residential ladder (Optima £72/yr → £10/mo → £30/mo)
//   • Sits below Geek Squad Total (~£155/yr) on the whole-home comparison
//   • Bottom two tiers are almost pure software margin (monitoring/AV/backup)

export interface CarePlanTier {
  id: string;
  name: string;
  tagline: string;
  monthly: number;
  annual: number;
  highlight?: boolean;
  features: string[];
}

export const carePlans: CarePlanTier[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Keep one device protected and monitored.',
    monthly: 6.99,
    annual: 69,
    features: [
      '24/7 remote system monitoring',
      'Enterprise antivirus & malware protection',
      'Automatic security patching & updates',
      'Priority booking on all repairs',
      '10% off any on-site labour',
      'Email & phone support',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    tagline: 'Our most popular plan for home workers.',
    monthly: 12.99,
    annual: 129,
    highlight: true,
    features: [
      'Everything in Essential',
      'Cloud backup monitoring',
      '2 remote support sessions per year included',
      'Annual device health check',
      '15% off on-site labour',
      'No 1-hour callout minimum',
    ],
  },
  {
    id: 'complete',
    name: 'Complete',
    tagline: 'Total peace of mind, hands-off.',
    monthly: 24.99,
    annual: 249,
    features: [
      'Everything in Plus',
      'Unlimited remote support (business hours)',
      'Free labour on out-of-warranty repairs*',
      'Annual on-site tune-up & internal clean',
      'Priority same-day visits',
      '*parts extra · fair-use policy',
    ],
  },
];

// Shown as a separate "contact us" card — deliberately not fixed-priced, so a solo
// operator never over-commits SLAs before the work is scoped.
export const businessPlan = {
  name: 'Business / Managed IT',
  tagline: 'For offices & teams across London.',
  from: 35, // £/device/month, from
  features: [
    'Per-device monitoring, patching & antivirus',
    'Priority remote & on-site support',
    'Backup & cybersecurity management',
    'Tailored to your team — quoted to fit',
  ],
};

export function annualSaving(tier: CarePlanTier): number {
  return Math.round(tier.monthly * 12 - tier.annual);
}

// ── Remote Support (one-off) ──
export const REMOTE_SESSION_PRICE = 49;

export const remoteFixables: string[] = [
  'Virus, malware & pop-up removal',
  'Slow computer speed-ups & tune-ups',
  'macOS / Windows software problems',
  'Email, iCloud & account setup',
  'Printer & Wi-Fi connection issues',
  'Software installs & updates',
  'New device setup & data transfer help',
  'General “how do I…” tech advice',
];

export const remoteSteps: { title: string; desc: string }[] = [
  { title: 'Get in touch', desc: 'Call, WhatsApp or book online. We confirm the fix is doable remotely and agree the price.' },
  { title: 'Connect securely', desc: 'You download a small, safe screen-sharing app and give one-time permission — nothing stays installed.' },
  { title: 'We fix it live', desc: 'You watch as our engineer sorts the problem, usually within the session. Nothing to drop off, no visit needed.' },
  { title: 'Pay on completion', desc: 'Settle by bank transfer once it’s done. Care Plan members pay nothing for included sessions.' },
];
