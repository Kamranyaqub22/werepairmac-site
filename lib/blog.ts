import { NINTENDO_SWITCH_IMAGE, XBOX_CONSOLE_IMAGE } from '@/lib/consoleImages';
import { hashSlug } from '@/lib/hash';

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  /**
   * Short form of `title` used for the <title> tag only. The on-page H1 keeps
   * the full conversational headline; this keeps the SERP title inside ~60
   * chars once the root layout appends " | We Repair Mac" (16 chars), so aim
   * for <= 44. Falls back to `title` when absent.
   */
  metaTitle?: string;
  excerpt: string;
  category: string;
  serviceSlug: string;
  image: string;
  readingTime: number;
  publishedAt: string;
  /** ISO date of the last substantive edit; falls back to publishedAt. */
  updatedAt?: string;
  sections: BlogSection[];
}

interface BlogBlueprint {
  slug: string;
  title: string;
  /** See BlogPost.metaTitle — short SERP title, <= 44 chars. */
  metaTitle?: string;
  /** ISO date of the last substantive edit; falls back to publishedAt. */
  updatedAt?: string;
  excerpt: string;
  category: string;
  serviceSlug: string;
  image: string;
  readingTime: number;
  firstResponse: string;
  whySpeedMatters: string;
  quickChecks: string[];
  engineerChecks: string[];
  preventionTips: string[];
  /**
   * Fault-specific H2s for the three body sections. Every post previously shared
   * the same three generic headings, which made 20 hand-written posts read as one
   * template to a crawler. Falls back to the generic set when absent.
   */
  sectionHeadings?: [string, string, string];
  /** Lead paragraph for the diagnosis section. Generic fallback if absent. */
  diagnosisIntro?: string;
  /** Lead paragraph for the prevention section. Generic fallback if absent. */
  preventionIntro?: string;
}

const FALLBACK_SECTION_HEADINGS: [string, string, string] = [
  'What to do first',
  'What we usually check on-site',
  'How to reduce the chance of a repeat fault',
];

const FALLBACK_DIAGNOSIS_INTRO =
  'A good repair visit should narrow the fault down quickly, explain what has failed, and tell you whether the problem is economical to repair before unnecessary work starts.';

const FALLBACK_PREVENTION_INTRO =
  'Even when the immediate problem is fixed, a few simple habits can help keep the same issue from returning.';

const BLOG_START_DATE = new Date('2026-03-11T09:00:00.000Z');
const BLOG_CADENCE_DAYS = 7;
const BLOG_CADENCE_MS = BLOG_CADENCE_DAYS * 24 * 60 * 60 * 1000;

const BLOG_BLUEPRINTS: BlogBlueprint[] = [
  {
    slug: 'macbook-wont-turn-on-london-guide',
    title: 'MacBook Won’t Turn On? What To Check Before You Panic',
    metaTitle: 'MacBook Won’t Turn On? What To Check',
    excerpt: 'A dead MacBook does not always mean a dead logic board. These are the first checks worth making before you assume the worst.',
    category: 'MacBook Repair',
    serviceSlug: 'macbook-repair-london',
    image: '/images/albert-vinas-F3t-AzyTbyU-unsplash.jpg',
    readingTime: 5,
    firstResponse: 'When a MacBook appears completely dead, the most helpful first step is to slow down and rule out the common faults. We regularly see machines that only need a charging reset, a cleaned USB-C port, or a battery diagnosis rather than a major repair.',
    whySpeedMatters: 'Repeatedly forcing a dead MacBook to power on can hide the real fault and, in liquid-damage cases, can make corrosion spread further across the board.',
    quickChecks: [
      'Try a known-good charger and cable, ideally one that works with another MacBook.',
      'Inspect the USB-C or MagSafe port for lint, bent pins, or signs of burning.',
      'Leave it on charge for at least 20 minutes before testing again.',
      'Disconnect docks, external drives, and accessories before another startup attempt.',
    ],
    engineerChecks: [
      'Battery health and charging negotiation on the board.',
      'Current draw readings to see whether the machine is waking correctly.',
      'Signs of liquid ingress near the keyboard, ports, or logic board.',
      'Screen and backlight behaviour in case the Mac is on but not displaying.',
    ],
    preventionTips: [
      'Do not keep swapping random third-party chargers in and out.',
      'Back up important files regularly so a no-power fault stays inconvenient rather than catastrophic.',
      'If the device recently got wet, stop testing it and get it inspected properly.',
    ],
    sectionHeadings: [
      'Before you assume the logic board has gone',
      'How we tell a power fault from a display fault',
      'Keeping a Mac powering on reliably',
    ],
    diagnosisIntro:
      'A no-power MacBook needs the fault narrowed to one of three places — the charging path, the battery, or the board itself — before any part is ordered. That is what the first twenty minutes of a visit are for.',
    preventionIntro:
      'Most of the dead MacBooks we collect had been giving smaller warnings for weeks. These habits keep those warnings from becoming a machine that will not start.',
  },
  {
    slug: 'macbook-battery-draining-fast-london',
    title: 'MacBook Battery Draining Fast? The Signs It Is Time For Replacement',
    metaTitle: 'MacBook Battery Draining Fast: Signs',
    excerpt: 'Fast battery drain, random shutdowns, and service warnings usually follow a pattern. Here is what to watch for.',
    category: 'Battery Replacement',
    serviceSlug: 'macbook-battery-replacement-london',
    image: '/images/zoshua-colah-HEIeRujWthM-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'MacBook batteries usually fail gradually before they fail dramatically. If your battery percentage drops in chunks, the machine dies at 20 to 30 percent, or it only behaves properly on charge, the battery is often the real bottleneck.',
    whySpeedMatters: 'A worn battery can swell, distort the trackpad, and put pressure on the case. Catching it early is cheaper and safer than waiting for the machine to become unstable.',
    quickChecks: [
      'Check for a “Service Recommended” warning in macOS battery settings.',
      'Notice whether the Mac runs significantly slower when unplugged.',
      'Look for uneven gaps around the trackpad or bottom case.',
      'Track whether battery life has fallen suddenly rather than gradually.',
    ],
    engineerChecks: [
      'Cycle count and full-charge capacity compared with the original design.',
      'Battery temperature and charging behaviour under load.',
      'Any board-level charging issues that may be imitating a bad battery.',
      'Physical signs of swelling or pressure inside the chassis.',
    ],
    preventionTips: [
      'Avoid leaving the MacBook at 100 percent on charge for weeks at a time.',
      'Use reputable chargers that negotiate power correctly.',
      'Do not ignore swelling, heat, or a lifting trackpad.',
    ],
    sectionHeadings: [
      'Reading the warning signs early',
      'How we confirm the battery is the bottleneck',
      'Getting more life out of the next battery',
    ],
    diagnosisIntro:
      'Fast drain can come from a worn cell, a charging circuit that is no longer negotiating properly, or software holding the machine awake. Cycle count alone does not settle it, so we measure rather than guess.',
    preventionIntro:
      'A replacement battery lasts considerably longer when it is not held at full charge and high temperature for months at a time.',
  },
  {
    slug: 'macbook-screen-lines-flicker-repair-advice',
    title: 'Lines, Flicker, or Black Screen on a MacBook: What It Usually Means',
    metaTitle: 'MacBook Screen Lines or Flicker: Causes',
    excerpt: 'Display faults are not all the same. Some point to panel damage, some to flex cables, and some to board issues.',
    category: 'Screen Repair',
    serviceSlug: 'macbook-screen-repair-london',
    image: '/images/revendo-DnLhg2eiozc-unsplash.jpg',
    readingTime: 5,
    firstResponse: 'A MacBook screen fault can look dramatic while still being straightforward to diagnose. Vertical lines, dim backlights, intermittent flicker, and a fully black panel each point toward a different part of the display system.',
    whySpeedMatters: 'Continued use with a failing screen cable or cracked panel can make the damage spread and makes data access harder if the display fails completely.',
    quickChecks: [
      'Test whether the Mac works correctly on an external monitor.',
      'Notice if the picture changes when the lid angle moves.',
      'Check for impact marks, pressure spots, or hairline cracks near the bezel.',
      'Listen for startup chime, keyboard backlight, or fan activity even when the screen stays black.',
    ],
    engineerChecks: [
      'Panel integrity, backlight function, and cable continuity.',
      'Whether the graphics system is outputting normally to external displays.',
      'Signs of hinge stress or liquid contamination around the display connector.',
      'Whether the issue is isolated to the screen assembly or the logic board.',
    ],
    preventionTips: [
      'Do not close anything between the keyboard and display.',
      'Avoid lifting the laptop by one corner of the screen.',
      'Use a padded sleeve when travelling with the machine.',
    ],
    sectionHeadings: [
      'Working out which part of the display failed',
      'How we isolate panel, cable or board',
      'Protecting the display and its hinge cable',
    ],
    diagnosisIntro:
      'Lines, flicker and a fully black panel each implicate a different component. An external monitor answers the biggest question in about a minute, and the rest follows from there.',
    preventionIntro:
      'Display flex cables fail from repeated bending and pressure far more often than from a single accident.',
  },
  {
    slug: 'water-damaged-laptop-first-steps',
    title: 'Spilled Water On a Laptop? The First 30 Minutes Matter Most',
    metaTitle: 'Water-Damaged Laptop: First Steps',
    excerpt: 'The best decision after a spill is usually what you stop doing. Here is the safest response after liquid gets into a laptop.',
    category: 'Water Damage',
    serviceSlug: 'water-damage-repair-london',
    image: '/images/revendo-7x0dGJqbfgk-unsplash.jpg',
    readingTime: 5,
    firstResponse: 'Liquid-damage jobs become much harder when the laptop is left switched on, recharged immediately, or “tested one more time”. Fast action matters because liquid keeps travelling long after the original spill.',
    whySpeedMatters: 'Corrosion starts quickly and can turn a recoverable keyboard or charging issue into a multi-part board repair or data-recovery job.',
    quickChecks: [
      'Power the device off immediately if it is still on.',
      'Disconnect the charger and every accessory right away.',
      'Turn the machine so excess liquid can drain away from the board.',
      'Do not use rice, a hairdryer, or repeated power-on tests.',
    ],
    engineerChecks: [
      'The exact path the liquid took through the board and connectors.',
      'Corrosion under shields, ports, battery connections, and keyboard layers.',
      'Whether the storage is safe and whether data backup should come first.',
      'Which parts need cleaning, rework, or replacement before power-up.',
    ],
    preventionTips: [
      'Keep drinks behind the laptop rather than beside it.',
      'Back up business-critical data before there is ever an accident.',
      'Treat sugary drinks, coffee, and alcohol spills as especially urgent.',
    ],
    sectionHeadings: [
      'The first thirty minutes after a spill',
      'What a liquid-damage inspection involves',
      'Limiting the damage if it happens again',
    ],
    diagnosisIntro:
      'Liquid damage is a cleaning and corrosion job before it is a parts job. The inspection decides how far the liquid travelled and what can still be saved.',
    preventionIntro:
      'Spills happen. What changes the outcome is how quickly the machine is powered down and how it is positioned afterwards.',
  },
  {
    slug: 'slow-laptop-home-office-checklist',
    title: 'Slow Laptop At Home Or Work? Start With This Practical Checklist',
    metaTitle: 'Slow Laptop? A Practical Checklist',
    excerpt: 'A sluggish laptop is usually a combination of storage, heat, startup apps, and age rather than one single problem.',
    category: 'Laptop Repair',
    serviceSlug: 'laptop-repair-london',
    image: '/images/nikolai-chernichenko-s6uS36SF91Y-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'When a laptop feels “old”, the cause is often measurable. Startup bloat, overheating, a failing SSD, low memory, and Windows corruption can all make the machine crawl long before it is truly beyond repair.',
    whySpeedMatters: 'Performance faults often arrive before bigger failures. A slow drive today can become a no-boot laptop next week, especially if it is already throwing read errors.',
    quickChecks: [
      'Restart the machine and compare performance before and after startup apps load.',
      'Check free storage space, especially if the drive is almost full.',
      'Listen for fan noise or feel for unusual heat around the base.',
      'Note whether slowness is constant or only happens in certain apps.',
    ],
    engineerChecks: [
      'SSD health, SMART warnings, and file-system errors.',
      'Thermal performance, dust buildup, and fan condition.',
      'Memory pressure, background processes, and startup load.',
      'Whether a clean OS repair, SSD swap, or RAM upgrade will give the biggest improvement.',
    ],
    preventionTips: [
      'Keep at least 15 to 20 percent of storage free where possible.',
      'Install updates deliberately rather than ignoring them for months.',
      'Do not let laptops run blocked on soft bedding or carpets.',
    ],
    sectionHeadings: [
      'Quick wins worth trying this afternoon',
      'What we look at when a laptop is genuinely slow',
      'Keeping a working laptop quick',
    ],
    diagnosisIntro:
      'A slow laptop is usually several small problems stacked together — a full drive, thermal throttling, and too much launching at startup. We measure each one rather than reinstalling and hoping.',
    preventionIntro:
      'Most of the speed a laptop loses over two or three years is recoverable with maintenance rather than replacement.',
  },
  {
    slug: 'data-recovery-from-dead-drive-expectations',
    title: 'Data Recovery From a Dead Drive: What To Expect',
    metaTitle: 'Data Recovery From a Dead Drive',
    excerpt: 'If your drive has failed, the right first move is not always to keep plugging it in. Here is what usually helps most.',
    category: 'Data Recovery',
    serviceSlug: 'data-recovery-london',
    image: '/images/samsung-memory-QTW80j6ZK4c-unsplash.jpg',
    readingTime: 5,
    firstResponse: 'Data recovery is as much about avoiding extra damage as it is about extracting files. Clicking hard drives, disappearing SSDs, and formatted external drives all need different handling from the start.',
    whySpeedMatters: 'Repeated reconnects, scan attempts, and DIY utilities can worsen physical failure or overwrite recoverable data.',
    quickChecks: [
      'Stop using the drive as soon as missing files or strange noises appear.',
      'Write down whether the issue followed a drop, deletion, formatting, or sudden power loss.',
      'Avoid installing recovery software onto the same drive you are trying to recover.',
      'If the drive clicks or disappears intermittently, do not keep power-cycling it.',
    ],
    engineerChecks: [
      'Whether the failure is logical, electrical, firmware-related, or physical.',
      'How safely the drive can be imaged before file recovery starts.',
      'Whether donor parts or specialist board work are needed.',
      'Which files are the highest priority if time or drive health is limited.',
    ],
    preventionTips: [
      'Keep two copies of critical files and one off-site or cloud copy.',
      'Replace backup drives that are ageing or intermittently disconnecting.',
      'Do not wait for clicking or mounting failures before reviewing backups.',
    ],
    sectionHeadings: [
      'What to do the moment a drive fails',
      'How a recovery attempt actually proceeds',
      'Making the next failure a non-event',
    ],
    diagnosisIntro:
      'Recovery odds are set largely by what happens in the first hour. Powering a failing drive on repeatedly is the most common way a recoverable disk becomes an unrecoverable one.',
    preventionIntro:
      'Recovery is always more expensive and less certain than a backup that already ran last night.',
  },
  {
    slug: 'gaming-pc-keeps-crashing-during-games',
    title: 'Gaming PC Crashing During Games? The Fault Is Usually Small',
    metaTitle: 'Gaming PC Crashing During Games: Fixes',
    excerpt: 'Game crashes can come from heat, RAM instability, GPU faults, power issues, or corrupt drivers. The trick is isolating them properly.',
    category: 'Gaming PC Repair',
    serviceSlug: 'gaming-pc-repair-london',
    image: '/images/nathan-anderson-KHSPGJ3zP0M-unsplash.jpg',
    readingTime: 5,
    firstResponse: 'Gaming PC failures often look random, but the pattern matters. Crashing only in certain titles, black-screening under GPU load, or rebooting after 20 minutes of play all point in different directions.',
    whySpeedMatters: 'Ignoring intermittent crashes can eventually damage Windows installs, corrupt game files, and hide failing hardware behind driver noise.',
    quickChecks: [
      'Note whether the PC crashes to desktop, blue-screens, or powers off entirely.',
      'Check temperatures during gaming rather than at idle.',
      'Return any recent overclocks to stock settings before more testing.',
      'Pay attention to whether the issue started after a driver, BIOS, or hardware change.',
    ],
    engineerChecks: [
      'GPU stability under load and signs of overheating or VRAM issues.',
      'RAM errors, XMP instability, and motherboard compatibility quirks.',
      'Power-supply behaviour when the system spikes under gaming load.',
      'Whether airflow, paste, or cooling hardware needs attention.',
    ],
    preventionTips: [
      'Keep dust out of front filters, radiators, and GPU fans.',
      'Make one hardware change at a time so faults stay traceable.',
      'Do not chase unstable benchmark scores with unsafe voltage tweaks.',
    ],
    sectionHeadings: [
      'Narrowing down a mid-game crash',
      'How we isolate heat, memory and power',
      'Keeping a stable machine stable',
    ],
    diagnosisIntro:
      'Crashes that only happen under load point at heat, power delivery or memory instability. Working out which one means stressing each subsystem separately rather than all at once.',
    preventionIntro:
      'Most gaming PCs that start crashing after two years are telling you about dust and dried thermal paste, not a failing component.',
  },
  {
    slug: 'virus-or-popups-on-your-computer-what-now',
    title: 'Virus Warnings, Redirects, Or Pop-Ups? What To Do Next',
    metaTitle: 'Virus Warnings or Pop-Ups? What To Do',
    excerpt: 'Not every scary pop-up is real, but every compromised machine deserves a careful cleanup and password review.',
    category: 'Virus Removal',
    serviceSlug: 'virus-removal-london',
    image: '/images/zoshua-colah-HEIeRujWthM-unsplash-2.jpg',
    readingTime: 4,
    firstResponse: 'A browser hijack or malware infection usually reveals itself through intrusive pop-ups, fake support warnings, slow performance, or unauthorised logins. The safest response is controlled cleanup, not random clicking.',
    whySpeedMatters: 'The longer a compromised machine stays online, the more chance there is of stolen passwords, browser session theft, and wider account compromise.',
    quickChecks: [
      'Disconnect from the internet if you suspect active malware or ransomware.',
      'Do not call phone numbers shown in fake security pop-ups.',
      'Take note of which accounts were used on the device recently.',
      'If files are encrypted or inaccessible, stop experimenting before recovery options are narrowed.',
    ],
    engineerChecks: [
      'Malicious startup items, browser extensions, and persistence mechanisms.',
      'Credential theft risk across browsers, email, and saved logins.',
      'Whether the infection is isolated or part of a deeper operating-system compromise.',
      'Post-cleanup security hardening so the same issue does not return.',
    ],
    preventionTips: [
      'Use a password manager and unique passwords everywhere.',
      'Keep browsers and operating systems up to date.',
      'Treat urgent warning banners and “call Microsoft/Apple now” prompts as suspicious.',
    ],
    sectionHeadings: [
      'What to do before clicking anything else',
      'How we clean a compromised machine',
      'Staying out of trouble afterwards',
    ],
    diagnosisIntro:
      'A cleanup is only half the work. The other half is establishing what the malware had access to, so you know which passwords and accounts genuinely need attention.',
    preventionIntro:
      'Nearly every infection we clean arrived through a browser prompt, a fake update, or a password reused from somewhere else.',
  },
  {
    slug: 'ps5-hdmi-port-no-signal-repair-guide',
    title: 'PS5 No Signal? Broken HDMI Port Symptoms To Look For',
    metaTitle: 'PS5 No Signal? HDMI Port Symptoms',
    excerpt: 'If a PS5 powers on but shows no picture, the HDMI port is one of the first things worth checking.',
    category: 'PlayStation Repair',
    serviceSlug: 'playstation-repair-london',
    image: XBOX_CONSOLE_IMAGE,
    readingTime: 4,
    firstResponse: 'A PS5 that lights up normally but gives no image on the TV often has a damaged HDMI port, especially if the console has been moved while a cable was still plugged in.',
    whySpeedMatters: 'A damaged port can lift pads from the board if it keeps getting used, turning a clean repair into a more involved board rebuild.',
    quickChecks: [
      'Try another HDMI cable and another TV input first.',
      'Inspect the port carefully for bent pins or a loose inner tongue.',
      'Notice whether the console still responds to controller sync or startup sounds.',
      'Avoid forcing the cable if it no longer inserts smoothly.',
    ],
    engineerChecks: [
      'Condition of the HDMI port, pads, filters, and retimer area.',
      'Whether the fault is only the port or includes board-level video issues.',
      'Signs of impact damage near the rear I/O panel.',
      'Overall console thermals and dust levels while the unit is open.',
    ],
    preventionTips: [
      'Do not lift or slide the console by the HDMI cable.',
      'Give the rear ports enough clearance from walls and furniture.',
      'Use a stable shelf so the console is not tugging against the cable.',
    ],
    sectionHeadings: [
      'Ruling out the cable and the TV first',
      'How we confirm the port is the fault',
      'Keeping the new port intact',
    ],
    diagnosisIntro:
      'A no-signal PS5 is usually a bent pin or a lifted pad on the HDMI port. Confirming that before any board work starts avoids a micro-soldering job on a console that only needed a different cable.',
    preventionIntro:
      'HDMI ports fail from sideways force on a plugged-in cable far more often than from ordinary wear.',
  },
  {
    slug: 'gaming-console-overheating-what-causes-it',
    title: 'Gaming Console Overheating: What Usually Causes It',
    metaTitle: 'Gaming Console Overheating: Causes',
    excerpt: 'Unexpected shutdowns, loud fans, and heat warnings are often a maintenance problem before they become a hardware failure.',
    category: 'Console Repair',
    serviceSlug: 'gaming-console-repair-london',
    image: XBOX_CONSOLE_IMAGE,
    readingTime: 4,
    firstResponse: 'Consoles overheat for the same reasons many computers do: blocked airflow, internal dust, failing fans, tired thermal material, or placement that traps hot air around the case.',
    whySpeedMatters: 'Persistent overheating shortens component life and can cause shutdown loops, storage errors, and long-term board stress.',
    quickChecks: [
      'Move the console into open space with clear vents on every side.',
      'Listen for unusual grinding, rattling, or fan surging.',
      'Check whether shutdowns happen only in demanding games.',
      'Feel whether hot air is actually exhausting or just building inside the unit.',
    ],
    engineerChecks: [
      'Fan condition, dust buildup, and vent obstruction.',
      'Thermal paste or liquid metal condition where relevant.',
      'Power-supply temperatures and airflow path integrity.',
      'Whether the fault is thermal alone or combined with board instability.',
    ],
    preventionTips: [
      'Do not keep consoles inside tightly closed TV cabinets.',
      'Clean external vents regularly and keep pets away from intake areas.',
      'If the fan suddenly becomes much louder, treat it as an early warning.',
    ],
    sectionHeadings: [
      'What overheating actually looks like',
      'What we find inside an overheating console',
      'Keeping a console running cool',
    ],
    diagnosisIntro:
      'Overheating is a maintenance problem before it becomes a hardware one. The question is whether the thermal system is blocked, dried out, or genuinely failing.',
    preventionIntro:
      'A console in a closed cabinet will overheat regardless of how clean it is inside.',
  },
  {
    slug: 'nintendo-switch-not-charging-usb-c-port-signs',
    title: 'Nintendo Switch Not Charging? The Port Is Not Always The Whole Story',
    metaTitle: 'Nintendo Switch Not Charging: Causes',
    excerpt: 'Charging issues on a Switch can come from the USB-C port, the battery, the dock, or the charging circuit itself.',
    category: 'Console Repair',
    serviceSlug: 'gaming-console-repair-london',
    image: NINTENDO_SWITCH_IMAGE,
    readingTime: 5,
    firstResponse: 'A Nintendo Switch that charges intermittently or not at all needs careful diagnosis because the symptom can come from several different places, not just a visibly worn port.',
    whySpeedMatters: 'Charging faults tend to worsen with continued cable movement, and repeated forcing can damage the port or surrounding board pads.',
    quickChecks: [
      'Test with an official or known-good charger before assuming the console is at fault.',
      'Inspect the USB-C port for bent pins, looseness, or compacted debris.',
      'See whether the issue changes when using the dock versus direct charging.',
      'Avoid wiggling the cable aggressively to “find a position” that works.',
    ],
    engineerChecks: [
      'USB-C port integrity and board-level charging behaviour.',
      'Battery health and whether it is accepting charge correctly.',
      'Dock behaviour and accessory-related charging conflicts.',
      'Any liquid, impact, or prior repair damage around the charging circuit.',
    ],
    preventionTips: [
      'Dock and undock the Switch carefully rather than at an angle.',
      'Keep the port clear of lint from bags and fabric cases.',
      'Replace damaged charging cables early instead of compensating with pressure.',
    ],
    sectionHeadings: [
      'Telling a port fault from a battery fault',
      'How we test a Switch charging path',
      'Protecting the USB-C port',
    ],
    diagnosisIntro:
      'A Switch that will not charge has four candidates — the cable, the port, the battery, or the charging circuit on the board. The symptoms usually separate them before anything is opened.',
    preventionIntro:
      'USB-C ports on handhelds fail mechanically, from the cable being knocked while the console is docked or played.',
  },
  {
    slug: 'xbox-series-x-no-display-repair-advice',
    title: 'Xbox Series X No Display? The Most Common Causes',
    metaTitle: 'Xbox Series X No Display: Common Causes',
    excerpt: 'A black screen on an Xbox can be a cable issue, HDMI damage, resolution confusion, or a deeper board fault.',
    category: 'Console Repair',
    serviceSlug: 'gaming-console-repair-london',
    image: XBOX_CONSOLE_IMAGE,
    readingTime: 4,
    firstResponse: 'If an Xbox powers up but gives no picture, it helps to separate simple video-path faults from hardware failures. HDMI ports, cables, TV handshakes, and board-level video problems can all look similar at first glance.',
    whySpeedMatters: 'Repeated plugging, unplugging, and forceful cable use can damage the port further if that is where the fault started.',
    quickChecks: [
      'Try a different HDMI cable and input before deeper troubleshooting.',
      'Inspect the port for looseness, bent pins, or signs of strain.',
      'Listen for normal startup sounds and controller connection behaviour.',
      'If the console was recently moved, treat physical port damage as a strong possibility.',
    ],
    engineerChecks: [
      'Port condition, solder joints, and video-path components.',
      'Whether the issue is display negotiation or true video failure.',
      'Any impact or overheating history that could affect the board.',
      'General thermal condition while the console is open for inspection.',
    ],
    preventionTips: [
      'Leave enough slack on HDMI cables so the port is not under tension.',
      'Avoid stacking hot devices directly on top of the console.',
      'Use stable shelving when consoles are connected to wall-mounted TVs.',
    ],
    sectionHeadings: [
      'Checking the simple causes first',
      'How we trace a no-display fault',
      'Avoiding a repeat',
    ],
    diagnosisIntro:
      'A black screen on an Xbox can be a resolution handshake, a cable, the HDMI port, or the board. Each is ruled out in order, cheapest first.',
    preventionIntro:
      'Most no-display faults we see trace back to the HDMI connection rather than the console itself.',
  },
  {
    slug: 'external-drive-not-showing-data-recovery-advice',
    title: 'External Drive Not Showing Up? How To Avoid Making Recovery Harder',
    metaTitle: 'External Drive Not Showing Up? Do This',
    excerpt: 'A drive that suddenly disappears is not a good place for random trial-and-error. These first steps protect the best recovery options.',
    category: 'Data Recovery',
    serviceSlug: 'data-recovery-london',
    image: '/images/samsung-memory-QTW80j6ZK4c-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'External drives often fail in stages. They may disconnect intermittently, ask to be formatted, mount read-only, or vanish altogether. The safest response is to stop treating the drive like normal storage until the cause is understood.',
    whySpeedMatters: 'If the fault is developing physically or electrically, repeated reconnects and scan attempts can reduce the chances of a clean image and full file recovery.',
    quickChecks: [
      'Try a different cable before assuming the drive itself has failed.',
      'Listen for clicking, spinning down, or repeated reconnect sounds.',
      'Do not agree to format or repair the drive until important files are secure.',
      'If the drive has been dropped, handle it as a priority recovery case.',
    ],
    engineerChecks: [
      'Cable, enclosure, and port faults versus actual drive failure.',
      'Whether the file system is damaged or the hardware is unstable.',
      'How safely the drive can be cloned before file extraction begins.',
      'Which files should be prioritised if the drive health is poor.',
    ],
    preventionTips: [
      'Keep important drives backed up instead of relying on a single copy.',
      'Replace loose or unreliable USB cables before they cause bigger issues.',
      'Do not move external drives while they are actively in use.',
    ],
    sectionHeadings: [
      'Stop before you reformat anything',
      'How we approach a drive that will not mount',
      'Making your data harder to lose',
    ],
    diagnosisIntro:
      'A drive that has stopped mounting still usually holds everything on it. The work is reading it safely once, rather than repeatedly asking a failing device to try again.',
    preventionIntro:
      'One copy on one external drive is not a backup — it is a single point of failure with a handle on it.',
  },
  {
    slug: 'cracked-laptop-screen-repair-or-replace',
    title: 'Cracked Laptop Screen: Repair It Or Replace The Whole Laptop?',
    metaTitle: 'Cracked Laptop Screen: Repair or Replace',
    excerpt: 'A cracked display looks expensive, but the screen is often the only part that needs attention. The key is confirming the rest of the laptop is healthy.',
    category: 'Laptop Repair',
    serviceSlug: 'laptop-repair-london',
    image: '/images/nikolai-chernichenko-s6uS36SF91Y-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'A damaged laptop screen does not automatically mean the entire laptop is finished. Many machines with cracked panels, ink spots, or broken hinges are otherwise in very good health and worth repairing.',
    whySpeedMatters: 'Continuing to open and close a laptop with hinge damage or exposed glass can worsen casing, cable, and webcam-area damage.',
    quickChecks: [
      'Test on an external monitor if possible to confirm the machine still boots normally.',
      'Look for frame separation or hinge resistance when opening the lid.',
      'Notice whether the image is only cracked or if the laptop also has no backlight.',
      'Avoid pressing on the panel, even lightly, once the glass is damaged.',
    ],
    engineerChecks: [
      'Panel type, resolution, and exact replacement compatibility.',
      'Condition of the hinge mounts and rear lid structure.',
      'Whether there is hidden damage to the display cable or webcam assembly.',
      'If repair cost still makes sense against the age and value of the machine.',
    ],
    preventionTips: [
      'Use a padded sleeve when carrying the laptop in a crowded bag.',
      'Do not pick the device up by the screen corner.',
      'Keep chargers, pens, and earbuds away from the keyboard before closing the lid.',
    ],
    sectionHeadings: [
      'Deciding whether the laptop is worth the screen',
      'What we check before quoting a screen',
      'Keeping the replacement intact',
    ],
    diagnosisIntro:
      'A screen quote only makes sense once the rest of the machine has been checked. Replacing a panel in a laptop with a failing battery and a full drive is rarely money well spent.',
    preventionIntro:
      'Most cracked panels we replace were cracked by pressure in a bag rather than by a drop.',
  },
  {
    slug: 'macbook-not-charging-port-or-battery',
    title: 'MacBook Not Charging? How To Tell Battery Faults From Port Faults',
    metaTitle: 'MacBook Not Charging: Battery or Port?',
    excerpt: 'Charging problems can come from the battery, charger, USB-C ports, MagSafe, or the board itself. The symptoms usually leave clues.',
    category: 'MacBook Repair',
    serviceSlug: 'macbook-repair-london',
    image: '/images/zoshua-colah-HEIeRujWthM-unsplash.jpg',
    readingTime: 5,
    firstResponse: 'A MacBook that charges only at certain angles, refuses to charge from one side, or keeps connecting and disconnecting does not always need the same repair. Ports, chargers, batteries, and board-level charging circuits all fail in different ways.',
    whySpeedMatters: 'Charging faults often worsen with continued stress on damaged ports, and ignoring them can leave you with a fully flat MacBook that is harder to diagnose under pressure.',
    quickChecks: [
      'Test every charging port individually if your model has more than one.',
      'Inspect the connector area for debris, scorching, or looseness.',
      'Try a known-good charger before assuming the laptop is at fault.',
      'Notice whether the battery percentage is dropping even while plugged in.',
    ],
    engineerChecks: [
      'Whether power negotiation is happening correctly through the port.',
      'Battery health, charging current, and behaviour under load.',
      'Port wear, liquid contamination, or board damage near the charging path.',
      'If the issue is isolated to a port assembly or needs board repair.',
    ],
    preventionTips: [
      'Avoid yanking chargers sideways when disconnecting.',
      'Keep charging ports clear of lint and dust from bags or sleeves.',
      'Replace damaged charging cables before they stress the connector further.',
    ],
    sectionHeadings: [
      'Separating a charger fault from a board fault',
      'How we test a MacBook charging path',
      'Charging habits that extend battery life',
    ],
    diagnosisIntro:
      'The symptom pattern usually says which part failed: intermittent charging points at the port or cable, while no charging at all points at the battery or the board.',
    preventionIntro:
      'Charging ports collect pocket lint and take strain from the angle of the cable — both are avoidable.',
  },
  {
    slug: 'ps4-disc-drive-not-reading-discs',
    title: 'PS4 Disc Drive Not Reading Discs? What Usually Fails',
    metaTitle: 'PS4 Disc Drive Not Reading Discs',
    excerpt: 'Disc-read errors can come from the drive mechanism, rollers, laser issues, or software trouble. The symptom pattern helps narrow it down.',
    category: 'PlayStation Repair',
    serviceSlug: 'playstation-repair-london',
    image: '/images/revendo-DnLhg2eiozc-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'A PS4 disc drive can fail gradually. Some consoles stop accepting discs cleanly, others spin up and fail to read, and some eject unexpectedly after trying to load a game.',
    whySpeedMatters: 'Forcing discs into a struggling drive or repeatedly retrying can damage the mechanism further and turn a clean repair into a parts-heavy one.',
    quickChecks: [
      'Try more than one disc to rule out a damaged game disc first.',
      'Listen for whether the drive pulls the disc in smoothly or struggles.',
      'Notice if the console makes clicking, grinding, or repeated spin-up sounds.',
      'Do not force a disc in if the intake rollers are not taking it properly.',
    ],
    engineerChecks: [
      'Laser condition, drive alignment, and intake roller behaviour.',
      'Whether the fault is mechanical, optical, or related to system firmware.',
      'Any signs of dust buildup or previous opening damage inside the console.',
      'Overall thermal condition while the console is apart.',
    ],
    preventionTips: [
      'Keep consoles in dust-managed spaces with some airflow.',
      'Do not leave discs partly inserted or force them against resistance.',
      'Address odd drive noises early rather than waiting for complete failure.',
    ],
    sectionHeadings: [
      'What the noises tell you',
      'How we test a disc drive',
      'Keeping the drive reading reliably',
    ],
    diagnosisIntro:
      'Disc-read faults split cleanly between mechanical problems you can hear and laser problems you cannot. Which one it is decides whether the drive is worth repairing.',
    preventionIntro:
      'A level console with a clear path to the disc slot has noticeably fewer read problems.',
  },
  {
    slug: 'macbook-keyboard-keys-sticking-cleaning-guide',
    title: 'MacBook Keys Sticking? Why Air Dusters Usually Are Not Enough',
    metaTitle: 'MacBook Keys Sticking? Cleaning Guide',
    excerpt: 'A sticky MacBook keyboard often points to trapped crumbs or dried liquid underneath the butterfly or scissor mechanisms.',
    category: 'MacBook Repair',
    serviceSlug: 'macbook-repair-london',
    image: '/images/albert-vinas-F3t-AzyTbyU-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'If your MacBook keys feel crunchy, repeat characters randomly, or refuse to press down cleanly, compressed air might just push the debris further back. It is important to know if you have a butterfly keyboard (2015-2019) or a newer scissor switch, as they require very different care.',
    whySpeedMatters: 'If the stickiness is from a liquid spill like coffee or juice, the longer it sits, the more likely the internal traces under the keycap will corrode, turning a quick clean into a full topcase swap.',
    quickChecks: [
      'Confirm whether multiple keys are failing or just an isolated key.',
      'Try holding the MacBook at an angle and using gentle compressed air.',
      'Avoid prying keys off unless you know the specific mechanism style.',
      'Test the keys in different applications to ensure it is not a software lag.'
    ],
    engineerChecks: [
      'Identify switch mechanism type and test keycap integrity.',
      'Look for signs of dried liquid ingress underneath the membrane.',
      'Clean contacts or replace broken hinge mechanisms safely without topcase replacement if possible.',
      'Check trackpad and battery swelling, which can mimic keyboard issues.'
    ],
    preventionTips: [
      'Use a keyboard cover only when the lid is open; remove it before closing.',
      'Avoid eating directly over the laptop.',
      'Wash hands before typing to prevent natural oil buildup.'
    ],
    sectionHeadings: [
      'Why compressed air often is not enough',
      'How we free a stuck key properly',
      'Keeping crumbs out of the keyboard',
    ],
    diagnosisIntro:
      'A sticking key is either debris under the mechanism or a failed butterfly or scissor clip. Blowing air at it tends to move the debris rather than remove it.',
    preventionIntro:
      'Butterfly-era keyboards in particular are intolerant of anything falling between the keys.',
  },
  {
    slug: 'pc-making-loud-grinding-noise',
    title: 'PC Making a Loud Grinding Noise? Here Are The Prime Suspects',
    metaTitle: 'PC Making a Loud Grinding Noise: Causes',
    excerpt: 'Is your computer suddenly sounding like a lawnmower? It is usually a mechanical failure involving a fan or a dying hard drive.',
    category: 'Gaming PC Repair',
    serviceSlug: 'gaming-pc-repair-london',
    image: '/images/nathan-anderson-KHSPGJ3zP0M-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'Loud rattling or grinding noises from a PC tower indicate a moving part is hitting something or a bearing has failed. While it is alarming, shutting down the computer quickly can prevent further damage to cables or data.',
    whySpeedMatters: 'If the noise is a mechanical hard drive failing, continuing to run the PC can permanently gouge the platters and destroy your data. If it is a cooler fan failing, the CPU could quickly overheat.',
    quickChecks: [
      'Power off the system immediately and look inside for loose cables touching fans.',
      'Listen closely to determine if the sound comes from the power supply, graphics card, or front panel.',
      'Do a quick visual check for heavy dust buildup on cooling arrays.',
      'Backup data immediately if you still use a mechanical HDD and suspect it.'
    ],
    engineerChecks: [
      'Isolate each fan (case, processor, GPU, PSU) to identify the culprit.',
      'Check SMART status of all mechanical and solid-state drives.',
      'Secure loose wire routings away from rotating fans.',
      'Ensure the AIO water cooling pump has not run dry or failed.'
    ],
    preventionTips: [
      'Use zip-ties or velcro straps to cleanly route internal cables.',
      'Clean dust filters on your PC case every 3 to 6 months.',
      'Keep the PC elevated off carpet floors to reduce dust intake.'
    ],
    sectionHeadings: [
      'Identifying where the noise comes from',
      'How we trace a grinding noise',
      'Keeping a PC quiet',
    ],
    diagnosisIntro:
      'Grinding is mechanical, so it comes from one of the few parts that actually move: a fan, a pump, or a hard drive. Telling them apart is largely a matter of listening in the right place.',
    preventionIntro:
      'Fan bearings and hard drives both give plenty of audible warning before they fail outright.',
  },
  {
    slug: 'macbook-pro-overheating-fan-noise-fix',
    title: 'MacBook Pro Getting Too Hot? Why The Fans Are Spinning So Loud',
    metaTitle: 'MacBook Pro Overheating & Loud Fans',
    excerpt: 'Loud fans and a hot aluminum chassis can indicate thermal throttling. Here is how to keep your MacBook Pro cool.',
    category: 'MacBook Repair',
    serviceSlug: 'macbook-repair-london',
    image: '/images/zoshua-colah-HEIeRujWthM-unsplash-2.jpg',
    readingTime: 5,
    firstResponse: 'It is normal for a MacBook Pro to get warm during heavy tasks like video rendering or gaming, but if the fans are jet-engine loud while you are just browsing, there is an underlying thermal issue. The aluminum body acts as a heatsink, so heat is by design, but restriction is not.',
    whySpeedMatters: 'Chronic overheating will degrade your battery at an accelerated rate, and thermal throttling means you are getting worse performance than what you paid for.',
    quickChecks: [
      'Check Activity Monitor for background apps consuming 100% CPU.',
      'Make sure you are not using the MacBook on a bed or soft pillow that blocks vents.',
      'Reset the SMC (System Management Controller) on Intel Macs.',
      'Listen for a clicking sound from the fan, meaning a bearing might be damaged.'
    ],
    engineerChecks: [
      'Inspect the internal vents and fan blades for severe dust accumulation.',
      'Evaluate whether thermal paste on the CPU/GPU has dried and cracked.',
      'Check for malware or crypto-miners running invisibly in the background.',
      'Monitor temperature sensors for false readings.'
    ],
    preventionTips: [
      'Use the laptop on a hard, flat surface.',
      'Close dozens of unused browser tabs to reduce memory and CPU load.',
      'Schedule a professional internal cleaning once every two years.'
    ],
    sectionHeadings: [
      'What loud fans are actually telling you',
      'How we check the cooling system',
      'Keeping a MacBook Pro cool',
    ],
    diagnosisIntro:
      'Constant fan noise means the machine cannot shed heat fast enough. That is either a blocked airflow path, dried thermal paste, or software keeping the processor busy.',
    preventionIntro:
      'A MacBook Pro used on soft surfaces will run hot no matter how clean its internals are.',
  },
  {
    slug: 'macbook-trackpad-not-clicking',
    title: 'MacBook Trackpad Not Clicking Anymore? It Might Be Your Battery',
    metaTitle: 'MacBook Trackpad Not Clicking: Why',
    excerpt: 'When a MacBook trackpad stops clicking or feels stuck, the trackpad itself is rarely at fault. It is usually the battery swelling underneath it.',
    category: 'MacBook Repair',
    serviceSlug: 'macbook-repair-london',
    image: '/images/albert-vinas-F3t-AzyTbyU-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'The trackpad in older MacBooks actually clicks mechanically, while modern MacBooks (2015 and newer) use haptic feedback. Regardless of the model, the battery sits directly underneath the trackpad. When lithium-ion batteries fail, they often expand and push up against the trackpad, stopping it from clicking.',
    whySpeedMatters: 'A swollen battery is a severe safety risk and a fire hazard. If it continues to expand, it can crack the trackpad glass and warp the aluminum chassis of your MacBook permanently.',
    quickChecks: [
      'Turn off "Tap to Click" in System Preferences to see if the physical click is truly gone.',
      'Look at the laptop from the side resting on a flat table—is the trackpad raised above the casing?',
      'Check the battery health status by holding the Option key and clicking the battery icon in the top right.',
      'Does the trackpad work normally if the bottom case is taken off?'
    ],
    engineerChecks: [
      'Safely execute a bottom chassis inspection for swollen battery cells.',
      'Check if the ribbon connecting the trackpad to the logic board has been damaged by the pressure.',
      'Assess haptic motor failure (Taptic Engine) versus physical battery pressure.',
      'Ensure accurate trackpad recalibration after battery replacement.'
    ],
    preventionTips: [
      'Do not keep your MacBook plugged in at 100% permanently.',
      'Do not expose the device to extreme temperatures.',
      'If you notice even a slight lift in the casing, get it checked immediately.'
    ],
    sectionHeadings: [
      'Why the trackpad is rarely the problem',
      'How we confirm a swollen battery',
      'Catching battery swelling early',
    ],
    diagnosisIntro:
      'A trackpad that will not click is usually being pushed from underneath by a swelling battery. Confirming that matters, because a swollen cell is a safety issue as well as a repair.',
    preventionIntro:
      'Swelling develops over months and gives visible warning long before it reaches the trackpad.',
  },
  {
    slug: 'why-are-my-games-lagging-suddenly-pc',
    title: 'PC Games Suddenly Lagging? Quick Solutions for Frame Drops',
    metaTitle: 'PC Games Suddenly Lagging? Frame Drops',
    excerpt: 'Game stuttering that came out of nowhere is incredibly frustrating, but usually reversible by diagnosing background interference, drivers, or thermals.',
    category: 'Gaming PC Repair',
    serviceSlug: 'gaming-pc-repair-london',
    image: '/images/nathan-anderson-KHSPGJ3zP0M-unsplash.jpg',
    readingTime: 4,
    firstResponse: 'If your games ran perfectly last week but are a stuttering mess today, hardware failure is unlikely the prime suspect. A sudden drop in frame rate normally points to a Windows update gone wrong, a driver conflict, or sudden thermal throttling.',
    whySpeedMatters: 'Frame drops can render competitive games unplayable, and if thermals are the underlying cause, playing through the lag is straining your graphics card and processor.',
    quickChecks: [
      'Make sure your monitor is plugged into the GPU, NOT the motherboard.',
      'Use Task Manager to check if an antivirus or background app is eating up your CPU.',
      'Make sure the game is not suddenly utilizing the integrated graphics rather than your dedicated GPU.',
      'Check if your system drive (C:) is 99% full, which causes extreme system hesitation.'
    ],
    engineerChecks: [
      'Monitor CPU & GPU utilization and thermals using specialized diagnostics.',
      'Clean install the latest Nvidia/AMD display drivers using Display Driver Uninstaller (DDU).',
      'Look for voltage irregularities or XMP profile disconnections in the BIOS.',
      'Reapply thermal paste or liquid metal if hardware throttling is detected.'
    ],
    preventionTips: [
      'Delay non-critical Windows updates to avoid buggy patches right before gaming.',
      'Do not install random "PC Optimizer" or "Game Booster" software.',
      'Keep your RAM running efficiently by maintaining your XMP profile.'
    ],
    sectionHeadings: [
      'When frame rates drop out of nowhere',
      'How we find the cause of sudden lag',
      'Keeping frame rates steady',
    ],
    diagnosisIntro:
      'Lag that appeared suddenly usually has a specific cause — a driver update, a background process, or thermal throttling that has only just crossed a threshold.',
    preventionIntro:
      'Frame-rate stability is mostly about heat and background load rather than raw hardware.',
  },
  {
    slug: 'spilled-water-on-keyboard-what-not-to-do',
    title: 'Spilled Water on Your Keyboard? Stop Doing These 3 Things',
    metaTitle: 'Spilled Water on Keyboard: What Not To Do',
    excerpt: 'When liquid touches electronics, the first few minutes dictate whether the device survives. Stop reaching for the rice bag.',
    category: 'Water Damage',
    serviceSlug: 'water-damage-repair-london',
    image: '/images/revendo-7x0dGJqbfgk-unsplash.jpg',
    readingTime: 5,
    firstResponse: 'We see hundreds of water-damaged laptops, and the damage done by the user’s reaction is often worse than the water itself. A spill is an emergency, but rushing to turn the laptop on to see if it "still works" acts as the killing blow by shorting the motherboard.',
    whySpeedMatters: 'Corrosion begins the second water touches the copper and solder on your motherboard. Fast, correct actions will save the data and the laptop.',
    quickChecks: [
      'Instantly force shut down the laptop by holding the power button for 10 seconds or disconnecting the power supply.',
      'DO NOT put the laptop in rice! Rice does not absorb internal moisture fast enough and leaves starch dust inside.',
      'DO NOT use a hairdryer! The heat will melt the delicate plastics of the keyboard.',
      'Immediately place it face down (tent formation if the lid opens completely) on a towel so gravity pulls the liquid out.'
    ],
    engineerChecks: [
      'Disassemble immediately to disconnect the battery and prevent further shorting.',
      'Use an ultrasonic cleaner and specialist board-cleaning solvents to clear corrosion.',
      'Check for blown capacitors, trace decay, or dead backlight fuses.',
      'Diagnose keyboard and trackpad connections which often fail first.'
    ],
    preventionTips: [
      'Use covered cups or bottles near your workstation.',
      'If an accident happens, prioritize data recovery before assuming the laptop is okay.',
      'React calmly and systematically. Force stopping power is your top priority.'
    ],
    sectionHeadings: [
      'The three things that make it worse',
      'What a keyboard-spill inspection covers',
      'Reducing the risk next time',
    ],
    diagnosisIntro:
      'Most of the damage from a keyboard spill is done after the spill, by powering the machine on to check whether it still works.',
    preventionIntro:
      'A keyboard cover and a drink kept away from the machine prevent nearly all of these jobs.',
  },
];

// Image variety: the generated blogs previously reused one image per category, so
// every MacBook post (etc.) looked identical. We deterministically spread posts
// across a topical pool keyed off the slug, so posts stay visually distinct while
// remaining relevant to the device they cover.
const MAC_LAPTOP_IMAGES = [
  '/images/albert-vinas-F3t-AzyTbyU-unsplash.jpg',
  '/images/nikolai-chernichenko-s6uS36SF91Y-unsplash.jpg',
  '/images/revendo-7x0dGJqbfgk-unsplash.jpg',
  '/images/revendo-DnLhg2eiozc-unsplash.jpg',
  '/images/nathan-anderson-KHSPGJ3zP0M-unsplash.jpg',
  '/images/jay-wennington-3xf07twcxsY-unsplash.jpg',
  '/images/zoshua-colah-HEIeRujWthM-unsplash.jpg',
  '/images/zoshua-colah-HEIeRujWthM-unsplash-2.jpg',
];
const DATA_RECOVERY_IMAGES = [
  '/images/samsung-memory-QTW80j6ZK4c-unsplash.jpg',
  '/images/nikolai-chernichenko-s6uS36SF91Y-unsplash.jpg',
  '/images/nathan-anderson-KHSPGJ3zP0M-unsplash.jpg',
];
const CONSOLE_IMAGES = [XBOX_CONSOLE_IMAGE, NINTENDO_SWITCH_IMAGE];

// Posts that have a dedicated, topic-matched photo at /images/blog/<slug>.jpg.
// Every hand-written post gets its own unique image (no repeats). Any future
// post not listed here falls back to the shared category pools below.
const POSTS_WITH_DEDICATED_IMAGE = new Set<string>([
  'macbook-wont-turn-on-london-guide',
  'macbook-battery-draining-fast-london',
  'macbook-screen-lines-flicker-repair-advice',
  'water-damaged-laptop-first-steps',
  'slow-laptop-home-office-checklist',
  'data-recovery-from-dead-drive-expectations',
  'gaming-pc-keeps-crashing-during-games',
  'virus-or-popups-on-your-computer-what-now',
  'ps5-hdmi-port-no-signal-repair-guide',
  'gaming-console-overheating-what-causes-it',
  'nintendo-switch-not-charging-usb-c-port-signs',
  'xbox-series-x-no-display-repair-advice',
  'external-drive-not-showing-data-recovery-advice',
  'cracked-laptop-screen-repair-or-replace',
  'macbook-not-charging-port-or-battery',
  'ps4-disc-drive-not-reading-discs',
  'macbook-keyboard-keys-sticking-cleaning-guide',
  'pc-making-loud-grinding-noise',
  'macbook-pro-overheating-fan-noise-fix',
  'macbook-trackpad-not-clicking',
  'why-are-my-games-lagging-suddenly-pc',
  'spilled-water-on-keyboard-what-not-to-do',
]);

function pickBlogImage(blueprint: BlogBlueprint): string {
  if (POSTS_WITH_DEDICATED_IMAGE.has(blueprint.slug)) {
    return `/images/blog/${blueprint.slug}.jpg`;
  }

  const cat = blueprint.category.toLowerCase();
  const title = blueprint.title.toLowerCase();
  const isConsole =
    cat.includes('console') || cat.includes('playstation') ||
    /xbox|playstation|nintendo|switch|ps5|ps4/.test(title);

  let pool = MAC_LAPTOP_IMAGES;
  if (isConsole) pool = CONSOLE_IMAGES;
  else if (cat.includes('data recovery')) pool = DATA_RECOVERY_IMAGES;

  return pool[hashSlug(blueprint.slug) % pool.length];
}

function buildBlogPost(blueprint: BlogBlueprint, index: number): BlogPost {
  const publishedAt = new Date(BLOG_START_DATE.getTime() + index * BLOG_CADENCE_MS).toISOString();
  const headings = blueprint.sectionHeadings ?? FALLBACK_SECTION_HEADINGS;

  return {
    slug: blueprint.slug,
    title: blueprint.title,
    metaTitle: blueprint.metaTitle,
    updatedAt: blueprint.updatedAt,
    excerpt: blueprint.excerpt,
    category: blueprint.category,
    serviceSlug: blueprint.serviceSlug,
    image: pickBlogImage(blueprint),
    readingTime: blueprint.readingTime,
    publishedAt,
    sections: [
      {
        heading: headings[0],
        paragraphs: [
          blueprint.firstResponse,
          blueprint.whySpeedMatters,
          `Need help right now? Our <a href="/${blueprint.serviceSlug}" class="text-brand font-semibold hover:underline">${blueprint.category}</a> engineers can come directly to your home or office anywhere in Greater London to diagnose and fix this for you.`
        ],
        bullets: blueprint.quickChecks,
      },
      {
        heading: headings[1],
        paragraphs: [blueprint.diagnosisIntro ?? FALLBACK_DIAGNOSIS_INTRO],
        bullets: blueprint.engineerChecks,
      },
      {
        heading: headings[2],
        paragraphs: [blueprint.preventionIntro ?? FALLBACK_PREVENTION_INTRO],
        bullets: blueprint.preventionTips,
      },
    ],
  };
}

function getAllScheduledPosts(): BlogPost[] {
  // Only hand-written, quality-reviewed posts are published. The previous
  // auto-generated set (generate_blogs.js → generated_blogs.json) was removed
  // because its formulaic device × fault × audience content was thin for SEO.
  return BLOG_BLUEPRINTS.map(buildBlogPost);
}

export function getAllBlogPosts({ includeFuture = false }: { includeFuture?: boolean } = {}): BlogPost[] {
  const now = Date.now();

  return getAllScheduledPosts()
    .filter((post) => includeFuture || new Date(post.publishedAt).getTime() <= now)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getBlogPost(slug: string, { includeFuture = false }: { includeFuture?: boolean } = {}): BlogPost | undefined {
  return getAllBlogPosts({ includeFuture }).find((post) => post.slug === slug);
}

export function getLatestBlogPosts(limit = 3): BlogPost[] {
  return getAllBlogPosts().slice(0, limit);
}

// Prioritises posts covering the same service, then the same category, before
// falling back to the newest other posts — keeps "related articles" topically
// tight instead of an arbitrary slice of the newest posts.
export function getRelatedBlogPosts(current: BlogPost, limit = 3): BlogPost[] {
  const others = getAllBlogPosts().filter((post) => post.slug !== current.slug);

  const scored = others.map((post) => {
    let score = 0;
    if (post.serviceSlug === current.serviceSlug) score += 2;
    if (post.category === current.category) score += 1;
    return { post, score };
  });

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((entry) => entry.post);
}

/**
 * Related posts for a page that has no service of its own to key off — town
 * hubs and service×town combos.
 *
 * Those 202 pages carried no blog links at all, which left the 21 posts on one
 * to four internal links each while every service page collected 254 from the
 * nav. Since Google discounts sitewide boilerplate, that meant the most
 * differentiated content on the site was effectively unlinked.
 *
 * The rotation matters as much as the links. Dropping an identical three-post
 * block onto all 202 pages would just mint new boilerplate and concentrate the
 * benefit on three posts. Seeding the starting offset from the page slug gives
 * each town a different set, deterministically — same slug, same picks, every
 * build — so the links spread across the whole archive.
 *
 * `preferredServiceSlugs` keeps relevance where the page has a topic: a combo
 * page rotates within its own family's posts first, and only tops up from the
 * wider archive if that family has too few.
 */
export function getRotatedBlogPosts(
  seed: string,
  preferredServiceSlugs: string[] = [],
  limit = 3,
): BlogPost[] {
  const all = getAllBlogPosts();
  if (!all.length) return [];

  const preferred = preferredServiceSlugs.length
    ? all.filter((post) => preferredServiceSlugs.includes(post.serviceSlug))
    : [];
  const preferredSlugs = new Set(preferred.map((post) => post.slug));
  const rest = all.filter((post) => !preferredSlugs.has(post.slug));

  const take = (pool: BlogPost[], count: number, poolSeed: string): BlogPost[] => {
    if (!pool.length || count <= 0) return [];
    const start = hashSlug(poolSeed) % pool.length;
    return Array.from({ length: Math.min(count, pool.length) }, (_, i) => pool[(start + i) % pool.length]);
  };

  const picked = take(preferred, limit, seed);
  return picked.length >= limit
    ? picked
    : [...picked, ...take(rest, limit - picked.length, `${seed}-topup`)];
}

// Blog posts that link to a given service — used on service pages to surface
// related advice articles and complete the internal-linking loop the other way.
export function getBlogPostsForService(serviceSlug: string, limit = 3): BlogPost[] {
  return getAllBlogPosts()
    .filter((post) => post.serviceSlug === serviceSlug)
    .slice(0, limit);
}

// Pull related repair-advice posts for a service, drawing first on posts tagged
// to the service itself, then topping up from related services (in order). This
// stops tightly-focused pages like PS5 HDMI Port Repair — which have no directly
// tagged posts — from rendering an empty "Related Repair Advice" section.
export function getBlogPostsForServices(serviceSlugs: string[], limit = 3): BlogPost[] {
  const seen = new Set<string>();
  const result: BlogPost[] = [];
  for (const slug of serviceSlugs) {
    for (const post of getAllBlogPosts()) {
      if (post.serviceSlug === slug && !seen.has(post.slug)) {
        seen.add(post.slug);
        result.push(post);
        if (result.length >= limit) return result;
      }
    }
  }
  return result;
}

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
