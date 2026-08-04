// Server-rendered price guidance for service pages.
//
// The interactive estimator in components/QuoteBooking.tsx is a client
// component and lives only on /quote, so none of its ranges ever reach the
// server-rendered HTML — search engines have never seen a single price on this
// site beyond the hourly labour rate. That is a problem on exactly the queries
// where price dominates the results ("macbook screen replacement london price"),
// so this module re-exposes the *same* vetted numbers from lib/quotes.ts as
// static content on the relevant service page.
//
// Two rules this file exists to enforce:
//
//  1. No new numbers. Every figure here is looked up from `deviceCategories`,
//     never redeclared, so the estimator and the service pages can never drift
//     apart. Editing lib/quotes.ts still updates everything.
//
//  2. Ranges only, never "from £X". A bare floor reads as a headline price and
//     sets up an argument on the doorstep; both ends of the range set an honest
//     expectation. See PROJECT.md on monetary figures.
//
// Services with no genuine fault data (printer setup, networking) are simply
// absent from the map. They render no price block at all rather than an
// invented one.

import { deviceCategories, type FaultEstimate } from '@/lib/quotes';

export interface PricedFault extends FaultEstimate {
  /** Device category the fault was drawn from, for disambiguation in the UI. */
  deviceLabel: string;
}

interface ServicePricing {
  /** One-line, service-specific framing. Keeps the block from reading as boilerplate. */
  intro: string;
  /** [deviceCategoryId, faultId] pairs, in display order. */
  faults: [string, string][];
}

const SERVICE_PRICING: Record<string, ServicePricing> = {
  'macbook-repair-london': {
    intro: 'The jobs we are called out to most often on a MacBook, and what they typically come to all-in.',
    faults: [['macbook', 'screen'], ['macbook', 'battery'], ['macbook', 'no-power'], ['macbook', 'liquid'], ['macbook', 'keyboard'], ['macbook', 'slow']],
  },
  'macbook-pro-repair-london': {
    intro: 'Typical all-in figures for the MacBook Pro faults we see most. Pro display assemblies sit at the upper end of the screen range, particularly the 16-inch Liquid Retina XDR.',
    faults: [['macbook', 'screen'], ['macbook', 'battery'], ['macbook', 'no-power'], ['macbook', 'liquid'], ['macbook', 'keyboard']],
  },
  'macbook-air-repair-london': {
    intro: 'What the common MacBook Air repairs usually come to. The Air is the cheaper machine to fix of the two — its panels and batteries cost less than the Pro equivalents.',
    faults: [['macbook', 'screen'], ['macbook', 'battery'], ['macbook', 'no-power'], ['macbook', 'liquid'], ['macbook', 'keyboard']],
  },
  // No battery row: an iMac is mains-powered, so offering a battery price would
  // be nonsense on this page even though it is valid for the same device group.
  'imac-repair-london': {
    intro: 'Typical all-in costs for desktop Mac work. An iMac runs from the mains, so there is no battery to replace — the common jobs are storage, display and power.',
    faults: [['macbook', 'no-power'], ['macbook', 'screen'], ['macbook', 'slow'], ['macbook', 'data']],
  },
  'macbook-screen-repair-london': {
    intro: 'MacBook display assemblies vary more in price than any other part, so the range is wide and honest rather than narrow and wrong.',
    faults: [['macbook', 'screen']],
  },
  'macbook-battery-replacement-london': {
    intro: 'What a MacBook battery replacement typically comes to, fitted at your home or office in a single visit.',
    faults: [['macbook', 'battery']],
  },
  'macbook-keyboard-replacement-london': {
    intro: 'What a MacBook keyboard replacement typically comes to — against the £450–£600 Apple commonly quotes to swap the whole top case.',
    faults: [['macbook', 'keyboard']],
  },
  // No dedicated logic-board row exists in the estimator, and inventing one
  // would be dishonest: board work is quoted per fault after a free inspection,
  // not from a range. These are the two symptoms that most often turn out to be
  // board-level, which is the closest honest guidance we can give in advance.
  'macbook-logic-board-repair-london': {
    intro: 'Board-level work is quoted per fault after a free inspection rather than from a price list, because a backlight fuse and a liquid-corroded power circuit are not the same job. These are the ranges the symptoms that lead here usually start from.',
    faults: [['macbook', 'no-power'], ['macbook', 'liquid']],
  },
  'xbox-repair-london': {
    intro: 'The Xbox faults we are called out for most, and what they typically come to including the part.',
    faults: [['console', 'hdmi'], ['console', 'no-power'], ['console', 'overheat'], ['console', 'disc'], ['console', 'drift']],
  },
  'water-damage-repair-london': {
    intro: 'Liquid damage is quoted after inspection because the cost follows the corrosion, not the spill. These are the ranges most jobs land in.',
    faults: [['macbook', 'liquid'], ['laptop', 'liquid']],
  },
  'laptop-repair-london': {
    intro: 'Typical all-in costs for Windows laptop repairs. Parts are the variable here — panels and batteries differ enormously between manufacturers and models.',
    faults: [['laptop', 'screen'], ['laptop', 'battery'], ['laptop', 'no-power'], ['laptop', 'charging'], ['laptop', 'keyboard'], ['laptop', 'slow']],
  },
  'windows-support-london': {
    intro: 'Most Windows problems are labour-only and finish inside the first hour, which puts them at the bottom of this range.',
    faults: [['laptop', 'slow'], ['pc', 'slow']],
  },
  'virus-removal-london': {
    intro: 'Virus and malware clean-ups carry no parts cost, so you are paying for labour alone — and many can be done remotely the same day without a visit.',
    faults: [['macbook', 'slow'], ['laptop', 'slow'], ['pc', 'slow']],
  },
  'hardware-upgrades-london': {
    intro: 'Fitting labour is usually well inside the hour; the spread in these figures is the cost of the drive, memory or card itself.',
    faults: [['laptop', 'upgrade'], ['pc', 'upgrade']],
  },
  'data-recovery-london': {
    intro: 'Logical recoveries are priced by the hour. A physically failed drive is quoted as a job after a free assessment, because the work involved is different in kind.',
    faults: [['macbook', 'data'], ['laptop', 'data'], ['pc', 'data']],
  },
  'gaming-pc-repair-london': {
    intro: 'Typical all-in costs for desktop and gaming PC work, including the thermal jobs that cause most in-game crashing and throttling.',
    faults: [['pc', 'no-power'], ['pc', 'overheat'], ['pc', 'upgrade'], ['pc', 'build'], ['pc', 'slow']],
  },
  'playstation-repair-london': {
    intro: 'The PlayStation faults we are called out for most, and what they typically come to including the part.',
    faults: [['console', 'hdmi'], ['console', 'no-power'], ['console', 'disc'], ['console', 'overheat'], ['console', 'drift']],
  },
  'gaming-console-repair-london': {
    intro: 'Console repair costs are consistent across PlayStation, Xbox and Switch, because the common failures and the parts behind them are much the same.',
    faults: [['console', 'hdmi'], ['console', 'no-power'], ['console', 'disc'], ['console', 'overheat'], ['console', 'drift']],
  },
  'ps5-hdmi-port-repair-london': {
    intro: 'A replacement HDMI port fitted and tested, at a fraction of the cost of replacing the console.',
    faults: [['console', 'hdmi']],
  },
};

/**
 * Priced faults for a service page, or null when we hold no honest figures for
 * it. Callers must handle null by rendering nothing.
 */
export function getServicePricing(slug: string): { intro: string; faults: PricedFault[] } | null {
  const entry = SERVICE_PRICING[slug];
  if (!entry) return null;

  const faults = entry.faults.flatMap(([deviceId, faultId]) => {
    const device = deviceCategories.find((d) => d.id === deviceId);
    const fault = device?.faults.find((f) => f.id === faultId);
    // A renamed or removed fault id must not silently vanish into a half-filled
    // table — drop it here and let the audit's coverage check catch it.
    if (!device || !fault) return [];
    return [{ ...fault, deviceLabel: device.label }];
  });

  return faults.length ? { intro: entry.intro, faults } : null;
}

/** Slugs with price data, for the audit script's coverage check. */
export const PRICED_SERVICE_SLUGS = Object.keys(SERVICE_PRICING);
