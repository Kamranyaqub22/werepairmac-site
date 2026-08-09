// Symptom-first fault guidance: "my printer says offline", not "printer repair".
//
// Why this module exists
// ----------------------
// Every service page already lists `commonIssues` (lib/services.ts), but they
// are bare strings — a symptom with a tick beside it and no answer. They are
// dead ends for a reader and worth nothing to a crawler. Meanwhile the 22 blog
// posts in lib/blog.ts *do* answer these questions, but they sit in /blog where
// nobody reading a service page ever finds them.
//
// This file is the missing middle: for each symptom, what it usually turns out
// to be, what you can safely try yourself, what we actually do about it, and
// where the work happens. It feeds both the service pages and the fault-finder
// hub at /common-computer-problems-london.
//
// Rules this file exists to enforce
// ---------------------------------
//  1. No new prices. `price` is a [deviceCategoryId, faultId] pair looked up
//     from lib/quotes.ts, exactly as lib/servicePricing.ts does. Faults with no
//     honest range — printer and network work, which is labour-only — carry no
//     price and say so, rather than getting an invented one.
//
//  2. Self-help stays safe. `selfHelp` is what a customer can genuinely do
//     without tools and without voiding anything: cables, restarts, settings,
//     observation. Nothing that involves opening a case, removing a battery, or
//     "just reinstall Windows". If the honest advice is *stop touching it*
//     (liquid damage, a failing drive), that is what it says.
//
//  3. `likelyCause` is what it usually turns out to be on a real callout, not
//     a list of everything it could theoretically be. Hedged, exhaustive
//     causes are what makes generic troubleshooting content useless.
//
// Printer and network faults are here deliberately. They are the highest-volume
// symptom queries of the four areas and the site currently answers none of
// them, despite both being live services with real callout demand.

import { deviceCategories, LABOUR_RATE, type FaultEstimate } from '@/lib/quotes';

/** Where the work realistically happens. Drives the badge on each fault card. */
export type FixLocation = 'on-site' | 'remote' | 'workshop' | 'either';

export const FIX_LOCATION_LABEL: Record<FixLocation, string> = {
  'on-site': 'Fixed at your door',
  remote: 'Often fixable remotely',
  workshop: 'Workshop job',
  either: 'Door or workshop',
};

export interface CommonIssue {
  /** Stable id, used for anchors on the hub page. */
  id: string;
  /** The symptom in the customer's own words. This is the heading and the query. */
  symptom: string;
  /** What it usually turns out to be on a real visit. */
  likelyCause: string;
  /** Safe checks worth trying before calling anyone. No opening anything. */
  selfHelp: string[];
  /** What our engineer does when the safe checks have not solved it. */
  whatWeDo: string;
  where: FixLocation;
  /** Service page that owns this fault. */
  serviceSlug: string;
  /** [deviceCategoryId, faultId] into lib/quotes.ts. Omit where no honest range exists. */
  price?: [string, string];
  /** Deep-dive blog post, where one already covers this symptom properly. */
  blogSlug?: string;
}

export interface IssueArea {
  id: string;
  /** Section heading on the hub, e.g. "Mac & MacBook problems". */
  label: string;
  /** Short label for the jump nav. */
  navLabel: string;
  icon: string;
  /** One-paragraph framing. Unique per area so the sections do not read as one template. */
  intro: string;
  issues: CommonIssue[];
}

export const ISSUE_AREAS: IssueArea[] = [
  {
    id: 'mac',
    label: 'Mac & MacBook problems',
    navLabel: 'Mac',
    icon: '🍎',
    intro:
      'Macs fail in a narrower set of ways than Windows machines, which makes them easier to diagnose and harder to bluff. The faults below account for the large majority of the Mac callouts we get across London. Where a symptom has more than one cause, the difference usually shows up in the first ten minutes of testing rather than after a part has already been ordered.',
    issues: [
      {
        id: 'mac-no-power',
        symptom: 'My MacBook will not turn on at all',
        likelyCause:
          'Far less often a dead logic board than people fear. The usual culprits are a failed charger or cable, a charging port packed with pocket lint, a battery that has discharged so deeply it needs a long charge before it will respond, or a Mac that is actually running with a dark screen.',
        selfHelp: [
          'Try a different charger and cable — ideally ones you have seen work on another machine. A failed cable is the single most common cause.',
          'Look into the USB-C or MagSafe port with a torch. Compacted lint stops the connector seating and is easy to mistake for a dead machine.',
          'Leave it plugged in for a solid 20–30 minutes before testing again. A deeply flat battery will not respond instantly.',
          'Unplug every dock, hub, external drive and adapter, then try to start it with nothing but the charger attached.',
          'On an Apple Silicon Mac, hold the power button for 10 seconds, release, then press it again. On an older Intel Mac an SMC reset does the same job.',
          'In a dark room, look closely at the screen while it starts. A faint Apple logo means the Mac is running and the fault is the display or backlight, not the power.',
        ],
        whatWeDo:
          'We measure what the machine is actually drawing from the charger, which separates the three possibilities immediately: no draw at all points at the charging circuit, a normal draw with a black screen points at the display or backlight, and an erratic draw points at the board. That measurement is the difference between a charging-port repair and a logic-board job — two very different bills — and we take it before quoting anything.',
        where: 'either',
        serviceSlug: 'macbook-repair-london',
        price: ['macbook', 'no-power'],
        blogSlug: 'macbook-wont-turn-on-london-guide',
      },
      {
        id: 'mac-battery',
        symptom: 'The battery drains in an hour, or macOS says "Service Recommended"',
        likelyCause:
          'A battery at the end of its life. Apple rates most MacBook cells for around 1,000 charge cycles, and after roughly four to five years of daily use the chemistry simply will not hold what it used to. "Service Recommended" is macOS telling you the cell has degraded past its threshold, not that anything has broken.',
        selfHelp: [
          'Check the real numbers: hold Option, click the Apple menu, choose System Information, then Power. Look at Cycle Count and Condition.',
          'Open Activity Monitor and sort by Energy. A single runaway browser tab or sync app can imitate a failing battery convincingly.',
          'Note whether it also shuts down abruptly at 30–40% rather than draining smoothly. That pattern is a failing cell rather than heavy usage.',
          'If the case or trackpad has started to bulge even slightly, stop using it and stop charging it — a swollen cell needs replacing now, not later.',
        ],
        whatWeDo:
          'We confirm the cycle count and health readings before recommending anything, because a fair number of "battery" callouts turn out to be a software process eating power on a perfectly good cell. Where the battery genuinely is spent, we fit a replacement at your desk and recalibrate it, usually inside the hour.',
        where: 'on-site',
        serviceSlug: 'macbook-battery-replacement-london',
        price: ['macbook', 'battery'],
        blogSlug: 'macbook-battery-draining-fast-london',
      },
      {
        id: 'mac-screen',
        symptom: 'The screen has lines, flickering, or a dark band across it',
        likelyCause:
          'Usually the display assembly itself — the panel, its ribbon cable, or the backlight. Vertical lines that stay put as the picture changes point at the panel; flickering that varies with the lid angle points at the cable; a picture you can only see with a torch held at an angle is a backlight fault, which is often repairable on the board rather than needing a whole new screen.',
        selfHelp: [
          'Take a screenshot with Shift-Command-3 and open it on another device. If the screenshot looks perfect, the fault is the display hardware, not macOS.',
          'Plug into an external monitor or TV. A clean external picture confirms the Mac itself is fine.',
          'Open and close the lid slowly and watch for the flicker changing with the angle — that points at the display cable.',
          'Shine a torch at the screen in a dark room. If you can just make out windows and menus, the picture is being drawn and only the backlight has failed.',
        ],
        whatWeDo:
          'We establish first whether you need a whole display assembly or something far cheaper, because those two answers differ by several hundred pounds. Backlight faults and display-cable faults are frequently board-level repairs costing a fraction of a full display assembly, and we would rather do the cheaper version of the job than sell you the dearer one.',
        where: 'either',
        serviceSlug: 'macbook-screen-repair-london',
        price: ['macbook', 'screen'],
        blogSlug: 'macbook-screen-lines-flicker-repair-advice',
      },
      {
        id: 'mac-charging',
        symptom: 'It only charges at certain cable angles, or not at all',
        likelyCause:
          'Either the port or the battery, and the distinction matters because they are different repairs. Intermittent charging that responds to wiggling the cable is a worn or lifted port. Charging that works but never rises above a certain percentage is the battery or its management circuit.',
        selfHelp: [
          'Test every USB-C port on the machine. If one charges and another does not, the fault is the port, not the charger.',
          'Try a different charger and cable before anything else — chargers fail far more often than Macs do.',
          'Check the port for lint with a torch. Do not dig at it with anything metal.',
          'Note what the menu bar says: "Not Charging" with the charger connected is a different fault from no charging icon appearing at all.',
        ],
        whatWeDo:
          'We test the charging negotiation on the board and the battery health together, so you find out whether you are paying for a port, a battery, or the charging circuit before anything is ordered. Ports and batteries are both fitted at your desk.',
        where: 'on-site',
        serviceSlug: 'macbook-repair-london',
        price: ['macbook', 'charging'],
        blogSlug: 'macbook-not-charging-port-or-battery',
      },
      {
        id: 'mac-overheating',
        symptom: 'The fans run constantly and it is hot doing nothing',
        likelyCause:
          'On an older Intel MacBook, almost always dust packed into the heatsink fins plus thermal paste that has dried out after four or five years. On an M-series Mac, which barely uses its fans in normal work, constant fan noise is far more likely to be a runaway software process than a thermal problem.',
        selfHelp: [
          'Open Activity Monitor, sort by CPU, and look at the top of the list. A stuck process, a runaway browser tab or a Spotlight re-index will pin the fans for hours.',
          'If a process called mds or mdworker is at the top, leave the Mac plugged in and idle for a couple of hours — Spotlight is rebuilding its index and will finish.',
          'Take it off soft surfaces. Beds and sofas block the vents along the hinge completely.',
          'Note whether it is hot at the hinge or under the palm rest. Heat at the hinge is the heatsink; heat under the palm rest is more often the battery.',
        ],
        whatWeDo:
          'We check the software side first, because opening a Mac to clean a heatsink that was never the problem is a waste of your money. Where it genuinely is thermal, we strip the cooling assembly, clear the fins and re-paste the chip, and you get before-and-after temperature readings rather than an assurance.',
        where: 'on-site',
        serviceSlug: 'macbook-repair-london',
        // The estimator has no Mac-specific thermal row, but a strip-clean-and-
        // repaste is the same job on either platform, so the PC row is the
        // honest figure rather than falling back to a labour-only line that
        // would claim "no parts" for work that uses thermal compound.
        price: ['pc', 'overheat'],
        blogSlug: 'macbook-pro-overheating-fan-noise-fix',
      },
      {
        id: 'mac-slow',
        symptom: 'macOS is slow, beachballing, or apps take forever to open',
        likelyCause:
          'Usually a full startup disk, too many login items and background agents, or a mechanical hard drive still doing the work — Apple shipped spinning and Fusion drives in the 21.5-inch iMac as late as 2019, and they are the single biggest cause of a slow desktop Mac. Genuine hardware failure is a distant fourth. A Mac that has crossed about 90% full storage will slow down dramatically regardless of how fast the rest of it is.',
        selfHelp: [
          'Check free space in System Settings, General, Storage. Below roughly 10% free, macOS struggles no matter what else is true.',
          'Look at System Settings, General, Login Items and turn off anything you do not recognise starting with the Mac.',
          'Restart properly. A Mac that has only been closed and reopened for six weeks has never actually restarted.',
          'Open Activity Monitor and check the Memory tab. Sustained red memory pressure means you are short of RAM, not short of speed.',
        ],
        whatWeDo:
          'We find out what is actually consuming the machine rather than running a generic clean-up, then either clear it or tell you honestly that the hardware is the limit. On an older iMac or Mac Mini still running a mechanical drive, an SSD is the single biggest improvement available and costs a fraction of replacing the Mac. Many of these are fixable over a remote session with no visit at all.',
        where: 'remote',
        serviceSlug: 'macbook-repair-london',
        price: ['macbook', 'slow'],
        blogSlug: 'mac-startup-disk-almost-full',
      },
      {
        id: 'mac-liquid',
        symptom: 'I spilled a drink on my MacBook',
        likelyCause:
          'The damage is corrosion, not the liquid, and it keeps progressing for days after the spill. Sugary and alcoholic drinks are considerably worse than water. What decides whether this is a repair or a write-off is almost entirely how quickly it is opened and cleaned, which is why this one is genuinely urgent.',
        selfHelp: [
          'Shut it down immediately — hold the power button. Do not wait for it to close things down politely.',
          'Unplug the charger and anything else connected.',
          'Turn it upside down like a tent so the liquid drains away from the board rather than into it.',
          'Do not try to power it on to "see if it still works". Powering a wet board is what turns a cleanable spill into a dead one.',
          'Do not use rice, a hairdryer or a radiator. Rice does nothing for corrosion already underway, and heat warps components.',
          'Call the same day. The realistic difference between a next-day clean and a next-week one is large.',
        ],
        whatWeDo:
          'Liquid damage is workshop work: the board comes out, gets inspected under a microscope, and is ultrasonically cleaned to remove corrosion the eye cannot see. We then repair or replace the components that have actually failed. We give you an honest view on viability first — if it has gone too far, we say so and concentrate on getting your data off instead.',
        where: 'workshop',
        serviceSlug: 'water-damage-repair-london',
        price: ['macbook', 'liquid'],
        blogSlug: 'spilled-water-on-keyboard-what-not-to-do',
      },
      {
        id: 'mac-keyboard',
        symptom: 'Keys are sticking, repeating, or not registering',
        likelyCause:
          'On 2016–2019 MacBooks, the butterfly mechanism, which fails from a single crumb of debris and is a known design weakness. On newer Magic Keyboard models, far more often a spill or general debris. A whole row failing at once is usually the ribbon connection rather than the keys.',
        selfHelp: [
          'Blow compressed air across the affected keys at an angle, in a Z pattern, with the Mac on its side. Apple documents this and it genuinely works on butterfly keyboards.',
          'Check the Keyboard Viewer to see exactly which keys register — this separates a hardware fault from a stuck modifier key.',
          'Turn off Sticky Keys and Slow Keys in Accessibility settings, which imitate a broken keyboard convincingly.',
          'Do not prise the keycaps off a butterfly keyboard. They break on removal and turn one bad key into several.',
        ],
        whatWeDo:
          'We establish whether it is debris, a single key mechanism, or the whole assembly. Where the top case does need replacing, we do it at your desk. Worth knowing: Apple frequently quotes for the entire top case — keyboard, battery and trackpad together — where the failed part is only one of the three.',
        where: 'on-site',
        serviceSlug: 'macbook-keyboard-replacement-london',
        price: ['macbook', 'keyboard'],
        blogSlug: 'macbook-keyboard-keys-sticking-cleaning-guide',
      },
      {
        id: 'mac-trackpad',
        symptom: 'The trackpad will not click, or clicks by itself',
        likelyCause:
          'On any MacBook more than three years old, the first thing to rule out is a swollen battery pressing up against the underside of the trackpad from below. It is the most common cause and the most important one to catch, because a swelling cell is a safety issue rather than an inconvenience.',
        selfHelp: [
          'Put the Mac on a flat table and check whether it rocks, or whether there is a visible gap along the bottom case. Both point at a swollen battery.',
          'Turn on Tap to Click in Trackpad settings. If tapping works but pressing does not, the mechanism is being blocked from underneath.',
          'Check the battery cycle count and condition in System Information under Power.',
          'If you suspect swelling, stop charging it and stop carrying it in a bag. Do not press on the trackpad to test it further.',
        ],
        whatWeDo:
          'We check the battery before the trackpad, every time. Where the cell has swollen we remove and dispose of it safely and fit a replacement, which usually restores the click on its own. Where the trackpad itself has failed, it is a straightforward part swap at your desk.',
        where: 'on-site',
        serviceSlug: 'macbook-repair-london',
        price: ['macbook', 'battery'],
        blogSlug: 'macbook-trackpad-not-clicking',
      },
    ],
  },
  {
    id: 'windows',
    label: 'Windows PC & laptop problems',
    navLabel: 'Windows',
    icon: '🪟',
    intro:
      'Windows fails in more ways than macOS because it runs on far more hardware, and the same symptom can have a software cause on one machine and a hardware cause on the next. The saving grace is that most of it is diagnosable without opening anything, and a large share of Windows callouts are labour-only jobs finished inside the first hour.',
    issues: [
      {
        id: 'win-boot-loop',
        symptom: 'It is stuck on a restart loop, or "Preparing Automatic Repair"',
        likelyCause:
          'Usually a Windows update that failed partway, a corrupted boot configuration, or a drive that is beginning to fail. The loop itself is Windows trying and failing to repair itself, and repeated forced restarts tend to make it worse rather than better.',
        selfHelp: [
          'Disconnect every USB device, dock and external drive, then restart. A machine trying to boot from a USB stick looks exactly like this.',
          'Let it complete a full cycle at least once without interrupting — some update rollbacks genuinely do take 30 minutes or more.',
          'Note down any error code it shows. It narrows the diagnosis considerably.',
          'Stop forcing restarts once you have seen the loop three times. If the drive is failing, every extra attempt costs you data.',
        ],
        whatWeDo:
          'We check the health of the drive before attempting any repair, because running Windows recovery tools on a dying SSD is how people lose files permanently. Once the drive is confirmed sound, we repair the boot configuration or roll the failed update back, keeping your data and installed programs in place.',
        where: 'on-site',
        serviceSlug: 'windows-support-london',
        // Same row as win-bsod: both are Windows software labour, and quoting
        // two different ranges for them on the same service page invites the
        // obvious question with no good answer.
        price: ['pc', 'slow'],
      },
      {
        id: 'win-bsod',
        symptom: 'Blue screen crashes, at random or during the same task',
        likelyCause:
          'A blue screen is Windows stopping to protect itself, and the cause splits roughly into drivers and memory. Crashes that started after a specific update or a new device are almost always drivers. Crashes that happen at random, across different applications, are more often faulty RAM or a failing drive.',
        selfHelp: [
          'Write down the stop code on the blue screen. It is the most useful single piece of information and it is on screen for seconds.',
          'Note what you were doing each time. A pattern — always in one game, always when a webcam starts — points straight at a driver.',
          'Roll back the most recent driver if the crashes started right after an update or a new device.',
          'Run Windows Memory Diagnostic. It is built in, safe, and takes one restart.',
        ],
        whatWeDo:
          'We read the crash dumps Windows has already written, which name the offending driver or module directly rather than leaving it to guesswork. From there it is either a driver fix, a memory module replacement, or a drive that needs cloning before it fails completely. Most of the diagnosis is done in the first half hour on-site.',
        where: 'on-site',
        serviceSlug: 'windows-support-london',
        price: ['pc', 'slow'],
      },
      {
        id: 'win-slow',
        symptom: 'It takes minutes to start up and everything is slow',
        likelyCause:
          'On any machine still running a mechanical hard drive, the drive — and nothing else. That single upgrade transforms a laptop more than any other change available. On machines that already have an SSD, the usual causes are a startup list that has accumulated years of software, a nearly-full drive, or too little RAM for how the machine is now used.',
        selfHelp: [
          'Open Task Manager, go to the Startup tab, and disable anything you do not need starting with Windows.',
          'Check the Performance tab: if Disk sits at 100% while nothing is happening, the drive is the bottleneck.',
          'Look at whether the drive is listed as HDD or SSD in Task Manager. If it says HDD, that is your answer.',
          'Free up space if the system drive is nearly full. Windows needs headroom to work at all.',
        ],
        whatWeDo:
          'We measure where the time is actually going before recommending anything, then either clear it out or fit an SSD and clone Windows across so everything comes back exactly as you left it. Software-only slowness is frequently fixable in a remote session with no visit at all.',
        where: 'remote',
        serviceSlug: 'windows-support-london',
        price: ['laptop', 'slow'],
        blogSlug: 'slow-laptop-home-office-checklist',
      },
      {
        id: 'win-virus',
        symptom: 'Pop-ups, browser redirects, or a warning telling me to call a number',
        likelyCause:
          'Almost always browser-level adware or a hijacked search setting rather than a virus in the traditional sense. The full-screen "your computer is infected, call this number" page is a scam, not a diagnosis — it is a web page designed to look like a system alert, and the number belongs to the people who put it there.',
        selfHelp: [
          'Never call the number on the warning, and never let anyone who calls you connect to your machine. That is the actual attack.',
          'Force-quit the browser rather than clicking anything in the pop-up, including its close button.',
          'Check your browser extensions and remove anything you did not deliberately install.',
          'If you did let someone connect remotely, disconnect from the internet and change your banking and email passwords from a different device.',
        ],
        whatWeDo:
          'We remove the adware, reset the hijacked browser and search settings, and check what else was installed alongside it — these things rarely arrive alone. Where someone has already been given remote access, we go further and check what was changed and what may have been taken. Most clean-ups can be done remotely the same day.',
        where: 'remote',
        serviceSlug: 'virus-removal-london',
        price: ['pc', 'slow'],
        blogSlug: 'virus-or-popups-on-your-computer-what-now',
      },
      {
        id: 'win-no-power',
        symptom: 'The laptop will not turn on, or powers on with no display',
        likelyCause:
          'A dead charger or a failed DC jack accounts for most of these. Where the machine powers on — fans spin, lights come on — but shows nothing, the fault is usually the screen, its cable, or the graphics chip rather than anything to do with power.',
        selfHelp: [
          'Check the charger has a light on it and the wall socket works. Chargers fail far more often than laptops.',
          'Hold the power button for 30 seconds with the charger unplugged, then reconnect and try again.',
          'Listen and look: fans spinning or keyboard lights coming on means it has power and the fault is the display.',
          'Connect an external monitor. A picture there confirms the laptop is running and narrows it to the screen.',
        ],
        whatWeDo:
          'We test the charger, the power rail and the board in sequence, so you learn which of the three has failed rather than replacing all of them. Charging jacks and screens are done at your desk; a genuinely failed board comes back with us, and we will tell you plainly when it is not worth repairing.',
        where: 'either',
        serviceSlug: 'laptop-repair-london',
        price: ['laptop', 'no-power'],
      },
      {
        id: 'win-cracked-screen',
        symptom: 'The laptop screen is cracked or has spreading black ink',
        likelyCause:
          'Physical damage to the panel — usually from a knock to the lid, something left on the keyboard when it was closed, or a drop. The spreading black blot is liquid crystal leaking out, and it will keep spreading. The panel is a separate part from everything else, so nothing else in the machine is affected.',
        selfHelp: [
          'Stop opening and closing the lid more than you have to. Flexing spreads the damage.',
          'Plug in an external monitor so you can keep working in the meantime.',
          'Find your exact model number — on Dell a service tag, on HP and Lenovo a serial on the base. Panels are model-specific and this is what lets us arrive with the right one.',
          'Back up anything important now, while the machine is still usable.',
        ],
        whatWeDo:
          'We identify the exact panel your model takes before ordering — a Dell XPS panel and an HP Pavilion panel of the same size are not interchangeable — then fit it at your home or office, usually inside an hour. On a cheap older laptop we will show you the arithmetic on repair versus replacement rather than quietly billing you for it.',
        where: 'on-site',
        serviceSlug: 'laptop-repair-london',
        price: ['laptop', 'screen'],
        blogSlug: 'cracked-laptop-screen-repair-or-replace',
      },
      {
        id: 'win-noise',
        symptom: 'It is making a loud whirring, grinding or rattling noise',
        likelyCause:
          'A fan, in one of three states: choked with dust so it has to spin far harder than it should, running a worn bearing, or catching on a cable. All three are noisy rather than dangerous. The one noise that is not a fan — a rhythmic click with a pause, unrelated to how hard the machine is working — is a mechanical hard drive failing, and that is a different problem entirely.',
        selfHelp: [
          'Work out whether the noise tracks with load. Rising and falling as the machine works harder means it is a fan.',
          'Check the intake vents and filters. On a desktop three or four years old, a visible mat of dust is usually most of the answer.',
          'Make sure a laptop is on a hard surface. Blocked vents make the fan work far harder than it needs to.',
          'If the noise is a regular click-click-pause with no relation to load, stop — that is a failing drive, not a fan. Back up now and read the drive fault below.',
        ],
        whatWeDo:
          'We strip and clean the cooling assembly, replace the fan where the bearing has gone, and repaste the chip while it is open, then give you before-and-after temperatures rather than an assurance. Done at your desk. If it turns out to be a drive rather than a fan, we stop and treat it as a recovery job first — your files matter more than the noise.',
        where: 'on-site',
        serviceSlug: 'gaming-pc-repair-london',
        price: ['pc', 'overheat'],
        blogSlug: 'pc-making-loud-grinding-noise',
      },
      {
        id: 'win-gaming-crash',
        symptom: 'Games stutter, crash to desktop, or the PC reboots mid-game',
        likelyCause:
          'Heat and power, in that order. A desktop that has been running three or four years accumulates enough dust to push the graphics card into thermal throttling, which shows up as stutter first and crashes later. Sudden reboots under load, with no error, are more often a power supply that can no longer deliver peak current.',
        selfHelp: [
          'Run a temperature monitor while playing and watch the GPU and CPU. Anything sustained above the high 80s is throttling.',
          'Look at the intake filters and fans. If you can see a mat of dust, that is a real part of the problem.',
          'Note the pattern: stutter that worsens the longer you play is thermal; an instant reboot with no warning is usually power.',
          'Update the graphics driver with a clean install if the problem started after a driver update.',
        ],
        whatWeDo:
          'We work on desktops in your home rather than taking them away, which matters here — half the value of the diagnosis is testing it in the setup it actually fails in. We clean and repaste, check power delivery under load, and give you before-and-after temperatures. Where the platform is genuinely the limit, we will say what an upgrade would and would not buy you.',
        where: 'on-site',
        serviceSlug: 'gaming-pc-repair-london',
        price: ['pc', 'overheat'],
        blogSlug: 'gaming-pc-keeps-crashing-during-games',
      },
      {
        id: 'win-liquid',
        symptom: 'I spilled something on my Windows laptop',
        likelyCause:
          'The same corrosion problem as on a Mac, with one difference in your favour: many Windows laptops have a drainage channel under the keyboard, so a small spill sometimes never reaches the board at all. What decides the outcome is still how fast it is opened and cleaned, not how much went in.',
        selfHelp: [
          'Hold the power button down until it switches off. Do not shut it down through Windows — that takes too long.',
          'Unplug the charger and, if the battery is a removable one on an older model, take it out.',
          'Turn it upside down like a tent so the liquid runs out rather than further in.',
          'Do not power it up to check whether it survived. That is what turns a cleanable spill into a dead board.',
          'Skip the rice and the hairdryer. Rice does nothing about corrosion that has already started, and heat warps plastics and components.',
          'Ring the same day. A next-day clean and a next-week one are very different jobs with very different outcomes.',
        ],
        whatWeDo:
          'The board comes out and is inspected and cleaned properly rather than dried and hoped for. On a Windows laptop we will also be blunt with you about economics sooner than we would on a Mac: on a mid-range machine a board-level liquid repair can approach what the laptop is worth, and if that is the case we will say so and get your data off instead.',
        where: 'workshop',
        serviceSlug: 'water-damage-repair-london',
        price: ['laptop', 'liquid'],
        blogSlug: 'water-damaged-laptop-first-steps',
      },
      {
        id: 'win-data',
        symptom: 'My files have gone, or the drive is not detected',
        likelyCause:
          'Either a logical fault — a corrupted partition table, a failed update, a deleted account profile, where the data is all still physically present — or a genuine hardware failure of the drive. The two need completely different handling, and the wrong approach on the wrong one destroys recoverable data.',
        selfHelp: [
          'Stop using the machine. Every write to a drive reduces what can be recovered.',
          'Do not run recovery software downloaded onto the same drive you are trying to recover, and do not let a repair tool "fix" the disk yet.',
          'Check whether the drive appears in Disk Management or Disk Utility at all — visible but unreadable is a much better sign than not visible.',
          'If the drive is clicking or was dropped, do not power it on again.',
        ],
        whatWeDo:
          'We assess whether it is logical or physical before touching anything, and we work from an image of the drive rather than the drive itself wherever possible. Logical recoveries are priced by the hour. A physically failed drive is quoted as a job after a free assessment, and we tell you what is realistically recoverable before you commit to anything.',
        where: 'workshop',
        serviceSlug: 'data-recovery-london',
        price: ['laptop', 'data'],
        blogSlug: 'data-recovery-from-dead-drive-expectations',
      },
      {
        id: 'win-external-drive',
        symptom: 'My external hard drive is not showing up',
        likelyCause:
          'Often the cable or the enclosure rather than the drive inside it, which is the good news — a failed USB bridge board leaves the disk itself perfectly healthy. Where the drive is a portable one that has been dropped, or a desktop one that now clicks, the mechanism itself has usually gone.',
        selfHelp: [
          'Try a different cable and a different port, ideally directly on the machine rather than through a hub.',
          'Listen to it. Spinning up normally and then falling silent is different from clicking, which is different from complete silence.',
          'Check Disk Management on Windows or Disk Utility on a Mac — a drive that appears there without a letter or mount point is usually a logical problem, not a dead drive.',
          'Do not format it, and do not agree when Windows offers to initialise the disk. That is the one click that turns a recoverable drive into a much harder job.',
        ],
        whatWeDo:
          'We test the drive outside its enclosure first, since a failed bridge board is common and cheap to work around. If the disk is sound, we recover your data straight off it. If the mechanism has failed, we tell you honestly what the odds and the costs look like before you spend anything.',
        where: 'workshop',
        serviceSlug: 'data-recovery-london',
        price: ['laptop', 'data'],
        blogSlug: 'external-drive-not-showing-data-recovery-advice',
      },
    ],
  },
  {
    id: 'printer',
    label: 'Printer problems',
    navLabel: 'Printers',
    icon: '🖨️',
    intro:
      'Printers generate more callouts than almost anything else we do, and the reason is consistent: the printer is rarely broken. What has usually failed is the connection between the printer and the computer — an address that changed, a driver that an update removed, a queue that jammed. That is why nearly all of this is fixed in one visit for labour alone, with no parts involved.',
    issues: [
      {
        id: 'printer-offline',
        symptom: 'The printer says "Offline" but it is switched on',
        likelyCause:
          'The computer has lost track of where the printer is. Most home routers hand out addresses on a lease, so after a router restart or a power cut the printer can come back on a different address while the computer is still looking at the old one. Windows also sets printers to "Use Printer Offline" on its own after enough failed attempts and then never clears it.',
        selfHelp: [
          'On Windows, open the printer queue, click Printer in the menu, and untick "Use Printer Offline". This alone fixes it surprisingly often.',
          'Print the printer\'s own network configuration page from its front panel and check the IP address matches what the computer thinks it is.',
          'Restart in order: printer first, then the computer. Restarting only the computer will not help if the address moved.',
          'Clear the print queue completely — a single stuck job holds everything behind it and reports as offline.',
        ],
        whatWeDo:
          'We fix the cause rather than the symptom: give the printer a fixed address on your network so it cannot move again, then rebuild the connection on each computer that needs it. That is the difference between it working today and it working next month. You watch a test page print from every device before we leave.',
        where: 'on-site',
        serviceSlug: 'printer-setup-repair-london',
      },
      {
        id: 'printer-wifi',
        symptom: 'The printer will not connect to Wi-Fi, or drops off after a router change',
        likelyCause:
          'Most home and small-office printers only support the 2.4GHz band. If your router broadcasts both bands under a single network name — which most modern routers do by default — the printer may never see a network it can join. A new router, or a broadband provider swapping your hardware, breaks it the same way: the stored network name and password no longer exist.',
        selfHelp: [
          'Move the printer near the router while setting it up, then move it back afterwards. Setup needs a stronger signal than printing does.',
          'Check whether your router shows separate 2.4GHz and 5GHz network names. If it does, join the printer to the 2.4GHz one specifically.',
          'Re-enter the Wi-Fi password on the printer itself after any router change — it will not update on its own.',
          'Use the printer\'s WPS button with the router\'s WPS button if both have one. It skips the password entry entirely.',
        ],
        whatWeDo:
          'We get the printer onto the right band with a reserved address, then reconnect every computer, phone and tablet in the house or office to it. Where the router is the real problem — a provider box with band-steering that will not cooperate — we sort the router configuration rather than fighting the printer.',
        where: 'on-site',
        serviceSlug: 'printer-setup-repair-london',
      },
      {
        id: 'printer-queue',
        symptom: 'Nothing prints — the jobs just sit in the queue',
        likelyCause:
          'A stuck job at the front of the queue, or the Windows Print Spooler service having stopped. Everything sent afterwards stacks up behind it, and cancelling from the queue often will not clear it because the spooler is the thing that has failed, not the job.',
        selfHelp: [
          'Try cancelling all documents from the queue first. If they will not clear, the spooler has stopped.',
          'Restart the computer — this restarts the spooler and clears most stuck queues.',
          'Check the printer\'s own front panel for a jam, an out-of-paper state, or a cover-open warning. It is often waiting for something physical.',
          'Try printing a test page from the printer itself. If that works, the printer is fine and the fault is entirely on the computer.',
        ],
        whatWeDo:
          'We clear the spooler properly, remove the stuck job at file level where the queue will not release it, and then look at why it happened — usually a corrupted driver or two conflicting printer entries for the same machine. Clearing it without fixing that just means you call us again next month.',
        where: 'remote',
        serviceSlug: 'printer-setup-repair-london',
      },
      {
        id: 'printer-update',
        symptom: 'The printer disappeared after a Windows or macOS update',
        likelyCause:
          'Major updates remove printer drivers they consider outdated, particularly for printers more than a few years old, and replace them with a generic driver that supports basic printing but loses scanning, duplex and tray selection. Sometimes the printer entry vanishes entirely.',
        selfHelp: [
          'Check whether the printer is still listed at all, or has been replaced by a second entry with "(Copy 1)" or a generic name.',
          'Remove every entry for that printer before re-adding it. Duplicates fight each other.',
          'Get the driver from the manufacturer\'s own support site rather than accepting the generic one, if you want scanning to work again.',
          'On a Mac, remove the printer in Settings and re-add it — AirPrint models often reinstall cleanly this way.',
        ],
        whatWeDo:
          'We install the correct full-feature driver for your exact model rather than the cut-down one the update left behind, clear the duplicate entries, and confirm scanning and the paper trays work as well as printing. On older printers where the manufacturer has stopped supporting the current OS, we will tell you that plainly instead of charging you to chase a driver that does not exist.',
        where: 'on-site',
        serviceSlug: 'printer-setup-repair-london',
      },
      {
        id: 'printer-airprint',
        symptom: 'I cannot print from my iPhone or iPad',
        likelyCause:
          'Either the printer does not support AirPrint, or — far more often — the phone and the printer are on different networks. A phone on the 5GHz band or the guest network cannot see a printer sitting on 2.4GHz behind client isolation, even though both are technically on "your Wi-Fi".',
        selfHelp: [
          'Check the phone is on your home Wi-Fi and not on mobile data or the guest network.',
          'Confirm your printer model actually supports AirPrint — many budget models do not.',
          'Restart the printer. AirPrint advertises itself on the network, and that broadcast sometimes stops.',
          'Turn off any VPN on the phone. A VPN routes the traffic away from your local network entirely.',
        ],
        whatWeDo:
          'We get the phone and the printer onto the same network segment, turn off the client isolation that most provider routers enable by default, and test printing from each device. Where the printer genuinely has no AirPrint support, we set up a working alternative rather than pretending the feature exists.',
        where: 'on-site',
        serviceSlug: 'printer-setup-repair-london',
      },
      {
        id: 'printer-quality',
        symptom: 'Prints are streaky, faded or blank even with full ink',
        likelyCause:
          'On an inkjet, dried ink blocking the print head — the standard result of leaving a printer unused for a few weeks. On a laser, a toner cartridge that has settled or a drum unit at the end of its life. Blank pages with full cartridges are usually a head that has clogged completely rather than an ink problem.',
        selfHelp: [
          'Run the printer\'s own head-cleaning cycle from its front panel, then print a nozzle check. Two cycles is reasonable; five is wasting ink.',
          'On a laser, take the toner cartridge out and rock it gently side to side to redistribute the toner, then refit it.',
          'Check whether the streaks appear in the same place on every page — a repeating mark at a regular interval is the drum, not the toner.',
          'If you use third-party cartridges, try a genuine one. Blocked heads and unrecognised-cartridge errors trace back to these more often than not.',
        ],
        whatWeDo:
          'We establish whether the head is recoverable before you spend money on cartridges that will not help. Blocked heads can often be cleared properly rather than with repeated automatic cycles. Where a drum or head has genuinely failed on a cheap inkjet, we will tell you honestly that the part costs more than the printer is worth.',
        where: 'on-site',
        serviceSlug: 'printer-setup-repair-london',
      },
      {
        id: 'printer-scan',
        symptom: 'Scan to computer or scan to email has stopped working',
        likelyCause:
          'Scanning uses a different piece of software from printing, so it breaks independently — and it is the first thing lost when an update swaps your full driver for a generic print-only one. Scan-to-email breaks separately again, usually because the mail provider tightened its authentication and the printer is still using a password that no longer works.',
        selfHelp: [
          'Check whether printing still works. Printing fine but scanning failing points straight at a missing full-feature driver.',
          'Try scanning from the computer rather than from the printer\'s panel, and see which direction fails.',
          'For scan-to-email, note whether it reports an authentication error — that means the credentials, not the scanner.',
          'Restart the printer and the computer together before reinstalling anything.',
        ],
        whatWeDo:
          'We reinstall the full scanning software for your model and reconnect it to the computers that need it, including scan-to-folder on a network share where that is more useful than scan-to-email. For scan-to-email we set up the modern authentication your mail provider now requires, which is the part most people get stuck on.',
        where: 'on-site',
        serviceSlug: 'printer-setup-repair-london',
      },
      {
        id: 'printer-shared',
        symptom: 'I need one printer working from every computer and phone in the house',
        likelyCause:
          'Not a fault so much as a setup that was never finished. A printer set up from one laptop is usually only known to that laptop, and the common workaround — leaving that computer on so others can print through it — breaks the moment it sleeps.',
        selfHelp: [
          'Set the printer up on the network directly rather than by USB to one computer. Every device can then reach it independently.',
          'Give the printer a fixed address in the router settings so it does not move and break every device at once.',
          'Add it separately on each computer using its network address rather than sharing it from another machine.',
        ],
        whatWeDo:
          'We put the printer on the network properly with a reserved address, add it to every Mac, PC, phone and tablet you want printing from it, and set up scan-to-computer where the printer supports it. It ends up independent of any one machine being switched on, which is the part that makes it stay working.',
        where: 'on-site',
        serviceSlug: 'printer-setup-repair-london',
      },
    ],
  },
  {
    id: 'network',
    label: 'Wi-Fi & network problems',
    navLabel: 'Wi-Fi',
    icon: '📶',
    intro:
      'Wi-Fi complaints are almost never about the broadband. The speed arriving at the front door is usually exactly what you pay for, and what fails is the distribution of it around the building — router placement, wall construction, band selection, and hardware from a provider optimised for cost rather than coverage. All of which is testable, and most of which is fixable without buying anything.',
    issues: [
      {
        id: 'net-deadspot',
        symptom: 'Wi-Fi is fine near the router and useless in the back bedroom',
        likelyCause:
          'Distance and building materials. The 5GHz band, which is what gives you speed, is badly weakened by solid walls — and London housing stock is full of exactly what kills it: thick brick, foil-backed insulation, chimney breasts. Provider routers are also frequently installed wherever the phone socket happens to be, which is often the worst spot in the building.',
        selfHelp: [
          'Get the router out into the open and off the floor. Inside a cabinet or behind a TV costs you a surprising amount of range.',
          'Run a speed test standing next to the router, then in the bad room, and compare. If it is fast at the router, the broadband is fine and this is a coverage problem.',
          'Check what is between the two points. A chimney breast or a foil-insulated wall is often the entire explanation.',
          'Try the 2.4GHz band in the far room if your router separates them — slower, but it travels much further.',
        ],
        whatWeDo:
          'We survey the actual signal in the rooms you complain about rather than next to the router where everything always looks perfect. Often it is repositioning and reconfiguring what you already own, which costs nothing but the labour. Where hardware genuinely is needed, we recommend the smallest thing that solves it and tell you where to put it.',
        where: 'on-site',
        serviceSlug: 'home-office-networking-london',
      },
      {
        id: 'net-dropping',
        symptom: 'Devices randomly drop off the Wi-Fi and reconnect',
        likelyCause:
          'Interference or a band-steering fight. In a London flat your router is competing with a dozen neighbouring networks on the same channels, and if it has been left on automatic it may be sitting on the busiest one. Where a router pushes both bands under one name, devices at the edge of range flip between them repeatedly and drop the connection each time.',
        selfHelp: [
          'Note whether it affects everything at once or one device only. One device is that device; everything at once is the router.',
          'Restart the router once and leave it. Restarting it daily is a workaround, not a fix, and it hides the pattern.',
          'Check whether the drops coincide with something — a microwave, a baby monitor, a neighbour arriving home. 2.4GHz shares space with all of them.',
          'If your router lets you, split the 2.4GHz and 5GHz networks into separate names and join devices to one deliberately.',
        ],
        whatWeDo:
          'We scan the airwaves to see what your router is competing with, move it to a clear channel, and separate the bands where band-steering is causing the drops. Where the provider router is simply not up to the building, we say so — and we would rather reconfigure what you have than sell you a mesh system you do not need.',
        where: 'on-site',
        serviceSlug: 'home-office-networking-london',
      },
      {
        id: 'net-video-calls',
        symptom: 'Video calls break up but speed tests look fine',
        likelyCause:
          'Upload bandwidth or Wi-Fi contention, neither of which a headline speed test shows you. Most broadband packages are heavily asymmetric — plenty of download, a fraction of it for upload — and a video call needs sustained upload. A speed test measures a few seconds at best conditions; a call needs consistency for an hour.',
        selfHelp: [
          'Run a speed test and look specifically at the upload figure, not the download one. Under about 5Mbps upload and calls will struggle.',
          'Check what else is running: a cloud backup or a game update in the background will take the upload capacity a call needs.',
          'Test a call over mobile data. If it is clean, the problem is your network, not the service.',
          'Try the call with an ethernet cable if you can. If that fixes it, the fault is Wi-Fi contention rather than broadband.',
        ],
        whatWeDo:
          'We measure the connection properly over time rather than in a five-second burst, then fix what is actually limiting it — usually prioritising the working device, moving it off a congested band, or running a single ethernet cable to the desk. For a home office that has to be reliable, one ethernet run is the best money available and less disruptive to install than most people expect.',
        where: 'on-site',
        serviceSlug: 'home-office-networking-london',
      },
      {
        id: 'net-slow-broadband',
        symptom: 'The broadband is far slower than what I pay for',
        likelyCause:
          'Where you measure decides what you find. The advertised speed is what arrives at the router, and by the time it has crossed the building over Wi-Fi to a laptop two rooms away, losing most of it is normal rather than exceptional. Genuine line faults exist, but they are the minority of what we are called out for.',
        selfHelp: [
          'Test with an ethernet cable plugged straight into the router. That figure is your actual broadband speed — everything else is a Wi-Fi measurement.',
          'Compare that to what your provider promised in writing. A real shortfall is a provider issue and they are obliged to act on it.',
          'Check whether older devices are the ones reporting slow speeds. A laptop from 2015 cannot reach modern speeds regardless of the line.',
          'Test at different times of day. Consistently poor evenings suggests congestion rather than a fault.',
        ],
        whatWeDo:
          'We separate the line from the network in the first ten minutes, which tells you whether this is a conversation with your provider or a job for us. If the line is fine, we fix the distribution. If it genuinely is not, we give you the measurements to take to the provider, which is considerably more effective than describing it over the phone.',
        where: 'on-site',
        serviceSlug: 'home-office-networking-london',
      },
      {
        id: 'net-devices-invisible',
        symptom: 'After a new router, the printer and shared drive have vanished',
        likelyCause:
          'A new router means a new network, and everything that was addressed on the old one is now looking for something that no longer exists. Devices with saved settings — printers, network drives, cameras, smart speakers — do not rediscover themselves. Provider routers also commonly enable client isolation by default, which stops devices seeing each other even once they have all rejoined.',
        selfHelp: [
          'Re-enter the new Wi-Fi details on each device individually. Nothing carries over from the old router.',
          'Check the router settings for "client isolation" or "AP isolation" and turn it off if it is on.',
          'Look at the router\'s device list to see what has actually rejoined the network and what has not.',
          'Reconnect network drives by address rather than by the saved shortcut, which is pointing at the old network.',
        ],
        whatWeDo:
          'We rejoin every device, turn off the isolation that stops them seeing each other, and give the ones that matter — printer, NAS, network drives — fixed addresses so a future router restart does not repeat the whole exercise. That last part is what stops it happening again.',
        where: 'on-site',
        serviceSlug: 'home-office-networking-london',
      },
      {
        id: 'net-smart-home',
        symptom: 'Smart plugs, cameras or speakers will not join the network',
        likelyCause:
          'Nearly always the 2.4GHz issue. Smart-home devices are cheap by design and almost none support 5GHz, so when the router broadcasts both bands under one name and the setup phone is connected to 5GHz, the pairing fails with an unhelpful error that says nothing about bands.',
        selfHelp: [
          'Temporarily connect the phone you are pairing with to the 2.4GHz network, complete the setup, then switch it back.',
          'Check the device\'s specification — if it says 2.4GHz only, that is your answer before you troubleshoot anything else.',
          'Move the device near the router for pairing. Setup is more signal-sensitive than normal use.',
          'Turn off the VPN on the pairing phone. It blocks the local discovery step that setup depends on.',
        ],
        whatWeDo:
          'We split the bands into separate network names so 2.4GHz devices have something they can reliably join, pair the devices, and put them on their own network segment where that makes sense — cheap smart-home hardware is not something you want sharing a network with a work laptop.',
        where: 'on-site',
        serviceSlug: 'home-office-networking-london',
      },
      {
        id: 'net-guest-security',
        symptom: 'I want visitors and smart devices off my work network',
        likelyCause:
          'Not a fault, but the single most worthwhile network change most homes and small offices can make. By default everything shares one flat network: the work laptop, the children\'s tablets, the visitors, and every cheap internet-connected device in the building, most of which will never receive another security update.',
        selfHelp: [
          'Check whether your router has a guest network option — most do, and most people never switch it on.',
          'Change the router\'s own admin password if it is still the one printed on the sticker.',
          'Make sure the router firmware is up to date, or set to update itself.',
        ],
        whatWeDo:
          'We set up a separate guest network for visitors and smart-home devices, secure the router itself properly, and make sure the things that need to reach each other still can — a printer that everyone can use, without the printer sitting on the same network as your work machine. Done in a single visit for labour alone.',
        where: 'on-site',
        serviceSlug: 'home-office-networking-london',
      },
    ],
  },
];

/** Resolved price range for an issue, or null where we hold no honest figures. */
export function issuePrice(issue: CommonIssue): FaultEstimate | null {
  if (!issue.price) return null;
  const [deviceId, faultId] = issue.price;
  const device = deviceCategories.find((d) => d.id === deviceId);
  const fault = device?.faults.find((f) => f.id === faultId);
  // Fail the build rather than degrade quietly. Returning null here would fall
  // through to the labour-only line, which is a *wrong* price on a hardware
  // fault rather than a missing one — the kind of thing nobody notices until a
  // customer quotes it back at the engineer on the doorstep.
  if (!fault) {
    throw new Error(
      `lib/commonIssues.ts: issue "${issue.id}" references unknown fault ${deviceId}/${faultId} in lib/quotes.ts`,
    );
  }
  return fault;
}

/**
 * Fallback price line for work the estimator holds no range for — printers and
 * networking, which are labour-led rather than parts-led. The hourly rate is
 * the honest answer here, and it must not claim "no parts": several of these
 * faults end in a replacement drum, a cable run or a mesh node, and the card
 * body says so a few lines above this note.
 */
export const LABOUR_ONLY_NOTE = `£${LABOUR_RATE}/hr labour with a one-hour minimum, and most of these are finished inside it. Any hardware is quoted separately and only where it is genuinely needed`;

/** Every issue across all areas, flattened. */
export function allIssues(): CommonIssue[] {
  return ISSUE_AREAS.flatMap((area) => area.issues);
}

/**
 * Issues owned by a service page. Used to deepen the service pages themselves,
 * so this content is not stranded on the hub.
 */
export function issuesForService(slug: string): CommonIssue[] {
  return allIssues().filter((i) => i.serviceSlug === slug);
}
