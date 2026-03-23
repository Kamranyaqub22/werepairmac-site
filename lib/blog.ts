import { NINTENDO_SWITCH_IMAGE, XBOX_CONSOLE_IMAGE } from '@/lib/consoleImages';

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  serviceSlug: string;
  image: string;
  readingTime: number;
  publishedAt: string;
  sections: BlogSection[];
}

interface BlogBlueprint {
  slug: string;
  title: string;
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
}

const BLOG_START_DATE = new Date('2026-03-11T09:00:00.000Z');
const BLOG_CADENCE_DAYS = 2;
const BLOG_CADENCE_MS = BLOG_CADENCE_DAYS * 24 * 60 * 60 * 1000;

const BLOG_BLUEPRINTS: BlogBlueprint[] = [
  {
    slug: 'macbook-wont-turn-on-london-guide',
    title: 'MacBook Won’t Turn On? What To Check Before You Panic',
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
  },
  {
    slug: 'macbook-battery-draining-fast-london',
    title: 'MacBook Battery Draining Fast? The Signs It Is Time For Replacement',
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
  },
  {
    slug: 'macbook-screen-lines-flicker-repair-advice',
    title: 'Lines, Flicker, or Black Screen on a MacBook: What It Usually Means',
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
  },
  {
    slug: 'water-damaged-laptop-first-steps',
    title: 'Spilled Water On a Laptop? The First 30 Minutes Matter Most',
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
  },
  {
    slug: 'slow-laptop-home-office-checklist',
    title: 'Slow Laptop At Home Or Work? Start With This Practical Checklist',
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
  },
  {
    slug: 'data-recovery-from-dead-drive-expectations',
    title: 'Data Recovery From a Dead Drive: What To Expect',
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
  },
  {
    slug: 'gaming-pc-keeps-crashing-during-games',
    title: 'Gaming PC Crashing During Games? The Fault Is Often Smaller Than It Looks',
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
  },
  {
    slug: 'virus-or-popups-on-your-computer-what-now',
    title: 'Virus Warnings, Redirects, Or Pop-Ups? What To Do Next',
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
  },
  {
    slug: 'ps5-hdmi-port-no-signal-repair-guide',
    title: 'PS5 No Signal? Broken HDMI Port Symptoms To Look For',
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
  },
  {
    slug: 'gaming-console-overheating-what-causes-it',
    title: 'Gaming Console Overheating: What Usually Causes It',
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
  },
  {
    slug: 'nintendo-switch-not-charging-ukb-c-port-signs',
    title: 'Nintendo Switch Not Charging? The Port Is Not Always The Whole Story',
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
  },
  {
    slug: 'xbox-series-x-no-display-repair-advice',
    title: 'Xbox Series X No Display? The Most Common Causes',
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
  },
  {
    slug: 'external-drive-not-showing-data-recovery-advice',
    title: 'External Drive Not Showing Up? How To Avoid Making Recovery Harder',
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
  },
  {
    slug: 'cracked-laptop-screen-repair-or-replace',
    title: 'Cracked Laptop Screen: Repair It Or Replace The Whole Laptop?',
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
  },
  {
    slug: 'macbook-not-charging-port-or-battery',
    title: 'MacBook Not Charging? How To Tell Battery Faults From Port Faults',
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
  },
  {
    slug: 'ps4-disc-drive-not-reading-discs',
    title: 'PS4 Disc Drive Not Reading Discs? What Usually Fails',
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
  },
];

function buildBlogPost(blueprint: BlogBlueprint, index: number): BlogPost {
  const publishedAt = new Date(BLOG_START_DATE.getTime() + index * BLOG_CADENCE_MS).toISOString();

  return {
    slug: blueprint.slug,
    title: blueprint.title,
    excerpt: blueprint.excerpt,
    category: blueprint.category,
    serviceSlug: blueprint.serviceSlug,
    image: blueprint.image,
    readingTime: blueprint.readingTime,
    publishedAt,
    sections: [
      {
        heading: 'What to do first',
        paragraphs: [
          blueprint.firstResponse,
          blueprint.whySpeedMatters,
        ],
        bullets: blueprint.quickChecks,
      },
      {
        heading: 'What we usually check on-site',
        paragraphs: [
          'A good repair visit should narrow the fault down quickly, explain what has failed, and tell you whether the problem is economical to repair before unnecessary work starts.',
        ],
        bullets: blueprint.engineerChecks,
      },
      {
        heading: 'How to reduce the chance of a repeat fault',
        paragraphs: [
          'Even when the immediate problem is fixed, a few simple habits can help keep the same issue from returning.',
        ],
        bullets: blueprint.preventionTips,
      },
    ],
  };
}

function getAllScheduledPosts(): BlogPost[] {
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

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}
