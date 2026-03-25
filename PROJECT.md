# We Repair Mac — Project Bible

> **Single source of truth for all developers and AI assistants.**  
> Read this before writing any code, copy, or design for this project.

---

## 1. Business Overview

| Field | Value |
|---|---|
| **Business name** | We Repair Mac |
| **Website** | https://werepairmac.co.uk |
| **Phone** | 0737 834 9222 (tel:07378349222) |
| **Email** | info@werepairmac.co.uk |
| **WhatsApp** | https://wa.me/447378349222 |
| **Address** | 18 Vincent House, Burlington Road, New Malden, KT3 4NX |
| **Google Place ID** | ChIJw5ByVHEJdkgRUdKAOadEHgA |
| **Geo** | Lat 51.404, Lon -0.257 |

### What we do
Mobile Mac, laptop, PC and console repair service covering all of **Greater London**. Engineers come to the customer's **home or office** — no shop visit ever required. Most repairs are done **on-site within the hour**.

### Core USPs (use these in all copy)
1. **No shop visit, ever** — we come to you
2. **Same-day callout** (book before 2 pm)
3. **No Fix, No Fee** — customer pays nothing if repair fails
4. **Fixed price quotes** — no surprise bills
5. **90-day warranty** on all parts and labour
6. **Evening & weekend** appointments at no extra charge
7. **Covered: all of Greater London** — no callout charge to any area

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 14 (App Router, TypeScript) |
| **Styling** | Tailwind CSS v3 + custom component classes |
| **Font** | Inter (Google Fonts — loaded via `@import` in globals.css) |
| **Images** | `next/image` (optimised), Unsplash for stock images |
| **Email / Contact** | Nodemailer via `/api/contact` route, SMTP via Gmail app password |
| **Reviews** | Google Places API (polled server-side every hour) |
| **Deployment** | Vercel |
| **Analytics** | (not yet implemented — candidate for future) |

### Key directories
```
app/                  Next.js pages (App Router)
  layout.tsx          Root layout — global metadata, Header, Footer, WhatsApp
  page.tsx            Homepage
  [slug]/page.tsx     Dynamic route handles BOTH service pages and location pages
  about/              About page
  contact/            Contact page
  faqs/               FAQs page
  robots.ts           Robots.txt generation
  sitemap.ts          Sitemap XML generation
  globals.css         Global styles + Tailwind directives + component classes
components/           Shared UI components
  Header.tsx          Sticky top nav — top bar, logo, desktop nav, mobile drawer
  Footer.tsx          Footer — CTA band, links, contact info
  HeroSlider.tsx      Full-width hero section (homepage only)
  ServiceGrid.tsx     Grid of service cards (pulls from lib/services.ts)
  TrustBadges.tsx     Row of trust indicators (No Fix No Fee, same-day, warranty)
  FAQAccordion.tsx    Accordion component for FAQ sections
  GoogleReviews.tsx   Fetches and displays Google reviews
  ContactForm.tsx     Contact/quote form (posts to /api/contact)
  WhatsAppButton.tsx  Floating WhatsApp CTA (bottom-right)
  LocalBusinessSchema.tsx  JSON-LD structured data injected into <head>
  Icons.tsx           SVG icon library (all icons live here)
lib/
  services.ts         Master list of all services (slug, title, copy, meta, image)
  locations.ts        Master list of all London locations (slug, name, postcode)
public/
  logo.jpg / logo.png  Business logo
  og-image.jpg         Open Graph image (1200×630)
  images/              Photo assets
```

---

## 3. Design System

### 3.1 Colour Palette

| Token | Hex | Usage |
|---|---|---|
| `brand` (DEFAULT) | `#0f2b5b` | Primary navy — buttons, headings accent, top bar bg, icon bg |
| `brand-dark` | `#091d3e` | Button hover state |
| `brand-light` | `#1a45a0` | Gradient end, lighter accents |
| `accent` (DEFAULT) | `#e8540a` | CTA buttons ("Call Now"), urgency highlights |
| `accent-light` | `#ff6b2b` | Button hover |
| `gray-950` | Tailwind default | Footer background |
| `white` | `#ffffff` | Card backgrounds, nav |
| `gray-50` | Tailwind | Alternating section backgrounds |
| `amber-400` | Tailwind | Star ratings |

**Background alternation pattern for page sections:**
- Section 1 (e.g. hero): full-width gradient
- Section 2: `bg-white`
- Section 3: `bg-gray-50`
- Section 4: `bg-white border-t border-gray-100`
- (repeat white / gray-50 alternation)

### 3.2 Typography

- **Font family**: Inter (300–800 weights via Google Fonts)
- **`section-heading`** class: `text-2xl md:text-3xl font-bold text-gray-900 leading-snug tracking-tight`
- **Body**: `text-gray-500 leading-relaxed text-sm` or `text-base`
- **Small metadata / labels**: `text-xs text-gray-400`
- **Bold labels**: `font-semibold text-gray-900 text-sm`

### 3.3 Spacing & Layout

- **Max content width**: `max-w-7xl mx-auto px-4 sm:px-6`
- **Standard section padding**: `py-14`
- **Card gap**: `gap-5`
- **Grid columns**: `lg:grid-cols-4` for service cards, `md:grid-cols-2` for two-column

### 3.4 Component Classes (defined in `globals.css`)

| Class | Description |
|---|---|
| `.btn-primary` | Navy filled button (brand bg, white text) |
| `.btn-accent` | Orange filled button (accent bg) — main CTA |
| `.btn-outline` | Navy outlined button |
| `.btn-white` | White filled button (used on dark backgrounds) |
| `.btn-ghost-white` | Outlined white button (used on brand/dark bg) |
| `.section-heading` | Standard h2 style |
| `.card` | White card with border, shadow, hover state |
| `.tag` | Small pill label (blue-50 bg, brand text) |

### 3.5 Iconography

All SVG icons live in `components/Icons.tsx` and are exported as named React components.

**Available icons:**
`PhoneIcon`, `MailIcon`, `MapPinIcon`, `ArrowRightIcon`, `CheckIcon`, `ShieldCheckIcon`, `ClockIcon`, `TruckIcon`, `WrenchIcon`, `CurrencyPoundIcon`, `BoltIcon`, `StarIcon`, `ChevronDownIcon`, `MenuIcon`, `XIcon`

To add a new icon: add the SVG export to `Icons.tsx` and import it wherever needed.

### 3.6 Images

- **Service card images**: `h-44 object-cover` with gradient overlay (`bg-gradient-to-t from-brand/60`)
- **Hero images**: full viewport width, `object-cover`
- **All images**: use `next/image` with explicit `width`/`height` or `fill` + `sizes`
- **Alt text**: descriptive, keyword-aware — never empty for meaningful images

---

## 4. Services

Each service is defined in `lib/services.ts` as a `Service` object with:

```ts
interface Service {
  slug: string;          // URL slug — becomes /[slug]
  title: string;         // Full H1 title
  shortTitle: string;    // Short nav/card label
  icon: string;          // Emoji icon
  image: string;         // Unsplash URL or /public path
  description: string;   // Card blurb (~15 words)
  longDescription: string; // Page intro paragraph
  commonIssues: string[]; // Bullet list shown on service page
  metaTitle: string;     // <title> tag
  metaDescription: string; // <meta description>
}
```

### Current services (in order shown in nav/grid):

| Slug | Short Title |
|---|---|
| `macbook-repair-london` | MacBook Repair |
| `laptop-repair-london` | Laptop Repair |
| `data-recovery-london` | Data Recovery |
| `gaming-pc-repair-london` | Gaming PC Repair |
| `virus-removal-london` | Virus Removal |
| `macbook-screen-repair-london` | Screen Repair |
| `macbook-battery-replacement-london` | Battery Replacement |
| `water-damage-repair-london` | Water Damage Repair |
| `playstation-repair-london` | PlayStation Repair |

To add a new service:
1. Add a new object to the `services` array in `lib/services.ts`
2. The dynamic `[slug]/page.tsx` will automatically generate the page
3. The sitemap, header nav dropdown, footer links, and ServiceGrid all pull from `services` — no other files need updating

---

## 5. Location Pages

Defined in `lib/locations.ts` as `{ slug, name, postcode }`.  
URLs follow the pattern `/mac-repair-[slug]` (e.g. `/mac-repair-kingston`).  
The same dynamic `[slug]/page.tsx` handles location pages.

---

## 6. SEO Strategy

### On-page fundamentals
- Every page has a unique `<title>` and `<meta description>` — set via Next.js `Metadata`
- Canonical URLs set on all pages
- HomePage and service pages have OpenGraph + Twitter card metadata
- Structured data (JSON-LD) injected via `<LocalBusinessSchema />`

### Structured data implemented
- `LocalBusiness` schema on all pages (via `LocalBusinessSchema` component)
- `FAQPage` schema on pages with FAQ sections (via `FAQSchema` component — see SEO improvements)

### Local SEO
- Dedicated location landing pages for 50+ London boroughs/areas
- Location-specific meta titles and descriptions
- `areaServed` in LocalBusiness schema (40 km radius from New Malden)

### Keywords approach
- Primary: `[service] london` (e.g. "macbook repair london")
- Secondary: `[service] home visit london`, `mobile [service] london`
- Hyper-local: `[service] [area]` matched by location pages
- Long-tail: FAQ content targets conversational queries

### SEO improvement candidates (backlog)
- [ ] Add `AggregateRating` to LocalBusiness schema once review count is available
- [ ] Add `BreadcrumbList` schema to service/location pages
- [ ] Migrate font loading from `@import` to `next/font` for better CWV
- [ ] Add a blog/articles section for long-tail content
- [ ] Add `geo.region` and `geo.placename` meta tags
- [ ] Implement Core Web Vitals monitoring

---

## 7. Routing Architecture

| URL pattern | Handler | Notes |
|---|---|---|
| `/` | `app/page.tsx` | Homepage |
| `/[slug]` | `app/[slug]/page.tsx` | Service OR location page |
| `/about` | `app/about/page.tsx` | About page |
| `/contact` | `app/contact/page.tsx` | Contact + form |
| `/faqs` | `app/faqs/page.tsx` | Full FAQ page |
| `/api/contact` | `app/api/contact/route.ts` | Email POST handler |
| `/sitemap.xml` | `app/sitemap.ts` | Auto-generated |
| `/robots.txt` | `app/robots.ts` | Auto-generated |

The `[slug]/page.tsx` inspects the slug:
- If it matches a service slug → renders `ServicePage`
- If it matches `mac-repair-[locationSlug]` → renders `LocationPage`
- Otherwise → `notFound()`

---

## 8. Environment Variables

Stored in `.env.local` (never commit to git):

| Variable | Purpose |
|---|---|
| `GOOGLE_PLACES_API_KEY` | Google Places API — fetch reviews |
| `GOOGLE_PLACE_ID` | Business Place ID for reviews |
| `SMTP_HOST` | SMTP server (smtp.gmail.com) |
| `SMTP_PORT` | 587 |
| `SMTP_USER` | info@werepairmac.co.uk |
| `SMTP_PASSWORD` | Gmail app password (16-char) |
| `CONTACT_EMAIL` | Recipient for contact form emails |

---

## 9. Coding Conventions

- **TypeScript strict mode** — always type props and function signatures
- **Named exports for utilities** (`export function getService`), default exports for components
- **No inline styles** — use Tailwind utility classes only
- **Component structure**: large data arrays at the top of file, JSX below
- **Image sources**: prefer `/public/images/` for owned photos; Unsplash for stock (with `?w=600&auto=format&fit=crop&q=80` params)
    - All monetary figures: `£100/hr labour + parts` — the rate is £100 per hour (minimum 1 hour billing). Parts are quoted separately upfront. Never state a lower "from £XX" figure on the site
- **Phone number formats**:
  - Display: `0737 834 9222`
  - `href`: `tel:07378349222`  
  - WhatsApp: `+447378349222`
- **Tone of voice**: professional but friendly, direct, confidence-building. Avoid jargon. British English spelling (colour, realise, etc.)

---

## 10. Content Guidelines

### Headlines
- Lead with the benefit, not the feature
- Include location keyword where natural: "MacBook Repair London"
- Power words: same-day, no fix no fee, home visit, door to door, we come to you

### Body copy
- Short paragraphs (2–3 sentences)
- Use bullet lists for features/issues
- Always end sections with a CTA (phone number or button)

### Calls to action
- Primary: **"Call 0737 834 9222"** — phone call is highest-converting
- Secondary: **"WhatsApp Us"** or **"Email for a Quote"**
- Never use vague CTAs like "Click here" or "Learn more" without context

---

## 11. Deployment

- Hosted on **Vercel** (auto-deploy from git push to main)
- Domain: `werepairmac.co.uk`
- Vercel project in `.vercel/` directory
- Build command: `next build`
- Run locally: `npm run dev` (port 3000)

---

## 12. Future Roadmap (candidates)

- Blog / articles section for long-tail SEO content (high priority — no booking/shop needed, just useful how-to posts)
- Live chat widget (Tidio or Crisp) — lower friction than a form for mobile callout enquiries
- Core Web Vitals optimisation (move to `next/font`, image size audits)
- Loyalty / referral programme page
- iPhone / iPad repair expansion section
- Xbox repair service page

**Not suitable for this business:**
- Online booking system — callout times are flexible/ad-hoc, not fixed slots
- Fixed pricing page — labour is £100/hr + parts which varies per job; upfront pricing page would be misleading
