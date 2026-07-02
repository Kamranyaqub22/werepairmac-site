// Fault-based quote estimator data.
//
// Deliberately NOT a per-model database (unmaintainable). Instead we group by
// device type and common fault, giving an honest price *range* that covers
// labour (£100/hr) plus typical parts. The exact figure is always confirmed on
// site before any work starts — the ranges below just set expectations and
// pre-qualify the enquiry.
//
// 👉 These are editable business numbers. Adjust min/max to match your real
//    pricing whenever you like — nothing else needs to change.

export interface FaultEstimate {
  id: string;
  label: string;
  /** Typical all-in price range (labour + parts), in GBP. */
  min: number;
  max: number;
  note?: string;
  /** Software-type faults that can often be fixed remotely (no visit needed). */
  remoteFixable?: boolean;
}

export interface DeviceCategory {
  id: string;
  label: string;
  icon: string;
  blurb: string;
  faults: FaultEstimate[];
}

export const LABOUR_RATE = 100; // £/hr, minimum 1 hour

export const deviceCategories: DeviceCategory[] = [
  {
    id: 'macbook',
    label: 'MacBook / iMac',
    icon: '💻',
    blurb: 'MacBook Pro, MacBook Air, iMac & Mac Mini',
    faults: [
      { id: 'screen', label: 'Cracked / faulty screen', min: 180, max: 450 },
      { id: 'battery', label: 'Battery not holding charge', min: 120, max: 220 },
      { id: 'no-power', label: "Won't turn on / no power", min: 100, max: 300, note: 'Diagnosis first — logic board faults quoted after inspection.' },
      { id: 'liquid', label: 'Liquid / water damage', min: 150, max: 400, note: 'Depends on corrosion — assessed on site.' },
      { id: 'slow', label: 'Slow / macOS / virus', min: 100, max: 150, remoteFixable: true },
      { id: 'charging', label: 'Charging port (MagSafe / USB-C)', min: 120, max: 220 },
      { id: 'keyboard', label: 'Keyboard replacement', min: 150, max: 350 },
      { id: 'data', label: 'Data recovery', min: 150, max: 500, note: 'Priced by drive condition after assessment.' },
    ],
  },
  {
    id: 'laptop',
    label: 'Windows Laptop',
    icon: '🖥️',
    blurb: 'HP, Dell, Lenovo, Asus, Acer & more',
    faults: [
      { id: 'screen', label: 'Cracked / faulty screen', min: 120, max: 280 },
      { id: 'battery', label: 'Battery replacement', min: 90, max: 180 },
      { id: 'no-power', label: "Won't turn on / no power", min: 100, max: 250 },
      { id: 'liquid', label: 'Liquid / water damage', min: 120, max: 300 },
      { id: 'slow', label: 'Slow / virus removal / reinstall', min: 100, max: 150, remoteFixable: true },
      { id: 'charging', label: 'Charging port / DC jack', min: 110, max: 200 },
      { id: 'keyboard', label: 'Keyboard replacement', min: 100, max: 220 },
      { id: 'upgrade', label: 'SSD / RAM upgrade', min: 120, max: 300, note: 'Great value speed boost for older machines.' },
      { id: 'data', label: 'Data recovery', min: 120, max: 450 },
    ],
  },
  {
    id: 'pc',
    label: 'Desktop / Gaming PC',
    icon: '🕹️',
    blurb: 'Custom builds, gaming rigs & office desktops',
    faults: [
      { id: 'no-power', label: "Won't turn on / no display", min: 100, max: 300 },
      { id: 'overheat', label: 'Overheating / cleaning / repaste', min: 100, max: 180 },
      { id: 'slow', label: 'Slow / virus / Windows reinstall', min: 100, max: 180, remoteFixable: true },
      { id: 'upgrade', label: 'Upgrade (SSD / RAM / GPU)', min: 120, max: 400, note: 'Parts quoted to your budget and needs.' },
      { id: 'build', label: 'New build / BIOS tuning', min: 120, max: 250 },
      { id: 'data', label: 'Data recovery', min: 120, max: 450 },
    ],
  },
  {
    id: 'console',
    label: 'Games Console',
    icon: '🎮',
    blurb: 'PS5, PS4, Xbox Series X/S & Nintendo Switch',
    faults: [
      { id: 'hdmi', label: 'HDMI port replacement', min: 120, max: 220 },
      { id: 'no-power', label: "Won't power on", min: 100, max: 250 },
      { id: 'overheat', label: 'Overheating / fan / cleaning', min: 90, max: 180 },
      { id: 'disc', label: 'Disc drive not reading', min: 110, max: 220 },
      { id: 'drift', label: 'Controller / joystick drift', min: 60, max: 120 },
    ],
  },
];

export function getDevice(id: string): DeviceCategory | undefined {
  return deviceCategories.find((d) => d.id === id);
}

export function formatRange(fault: FaultEstimate): string {
  return `£${fault.min} – £${fault.max}`;
}
