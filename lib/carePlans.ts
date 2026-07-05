// Care Plan (subscription) + Remote Support data.
//
// All commercial numbers live here so they're trivial to adjust — nothing in the
// page components hard-codes a price. Annual billing only — no monthly option.
//
// Pricing rationale (July 2026 UK market research):
//   • The PC Crew (direct UK comparable) charges £12/mo for a single tier with
//     weaker remote support (5 min sessions, 1-2 day turnaround) than our Essential —
//     our Essential must sit at or above that, not well below it.
//   • UK B2B managed IT (RMM+AV+backup+helpdesk) runs £25-75/user/mo; our Complete
//     sits below that range since it's residential, not a business SLA.
//   • Monitoring/AV/patching is delivered via a free-tier RMM agent (e.g. ITarian,
//     free up to 50 endpoints) — real marginal cost is the owner's time responding
//     to alerts and honouring the discounts/free-labour promises, not software.

export interface CarePlanTier {
  id: string;
  name: string;
  tagline: string;
  annual: number;
  highlight?: boolean;
  features: string[];
}

export const carePlans: CarePlanTier[] = [
  {
    id: 'essential',
    name: 'Essential',
    tagline: 'Keep one device protected and monitored.',
    annual: 99,
    features: [
      '24/7 automated monitoring & alerts',
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
    annual: 169,
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
    annual: 299,
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
