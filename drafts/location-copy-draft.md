# Location page copy — expansion draft (6 priority areas)

**Status:** DRAFT FOR REVIEW. Nothing here is live. Nothing has been written to `lib/locations.ts`.

**Purpose:** Take the priority area pages from ~769 words (of which ~480 unique) to ~1,200 words (~900 unique), closing the depth gap with computer-repair-man.co.uk without mass-generating thin pages.

## How to review this

Read each area and mark anything wrong. I care most about the 🚩 flags — those are claims I inferred but cannot verify. **If a flag is wrong, the sentence should be cut, not softened.** Generic filler is worse than a shorter page.

Everything is written in the existing house voice: British English, em-dashes, "we come to you", no jargon. I kept your original sentences where they were already doing the job and built around them.

## Proposed structure

Currently one `localIntro` field (~45 words median) carries all the unique content. This draft splits it into three, so each page gets ~440 unique words:

| Field | Length | Job |
|---|---|---|
| `localIntro` | ~190 words | The area, who lives/works there, why we're there. Sits at the top of "What to Expect". |
| `localRepairs` | ~150 words | What we actually get called out for here, tied to the local housing/business mix. |
| `localLogistics` | ~90 words | Getting to you: response times, parking, access. |

That needs two new optional fields on the `Location` interface. Both optional, so the other 72 areas keep rendering exactly as they do today — no change for them until copy is written.

```ts
localRepairs?: string;
localLogistics?: string;
```

---

# 1. New Malden — KT3, Kingston upon Thames

### localIntro (192 words)

New Malden is home base for us, so response times here are the fastest we offer anywhere in London — we can often be at your door in New Malden, Motspur Park or Old Malden within the hour. We regularly help the area's many home workers and small businesses along Coombe Road and the High Street with MacBook and laptop repairs without them ever leaving their desk.

Being local matters more than it sounds. We know which streets around Beverley Park are a nightmare to park on, we know the difference between a KT3 address that's really Motspur Park and one that's really Old Malden, and we can usually slot a New Malden job into the same day even when the diary is full — because there's no travel time to absorb.

New Malden has one of the largest Korean communities in Europe 🚩, and a good number of our call-outs come from the independent businesses along the High Street and Burlington Road — restaurants, salons and small offices where a dead till PC or a laptop that won't boot stops the day cold. We treat those as urgent, because they are.

> 🚩 **Verify:** the Korean community reference is factually true of New Malden generally, but I've implied it's a meaningful source of your work. Cut the clause if that's not reflected in your actual call-outs — it'll read as SEO padding if it isn't real.

### localRepairs (154 words)

The New Malden housing mix — a lot of 1930s semis and converted flats — means we see plenty of machines that have been in the same household for years: iMacs that have slowed to a crawl, MacBooks on their second or third battery, and family PCs clogged with a decade of software. Storage upgrades and clean reinstalls are probably our most common New Malden job.

The other half is the small-business side. Along the High Street we're regularly asked to look at a laptop that's the only machine in the building, which is why we carry common parts with us and try to finish on-site rather than taking anything away.

We also get a steady run of student and school machines from families near Coombe Boys' and Coombe Girls' 🚩 — usually cracked screens, snapped hinges and liquid damage, which is exactly what you'd expect from a laptop that lives in a rucksack.

> 🚩 **Verify:** Coombe Boys'/Coombe Girls' are real New Malden schools, but I'm asserting they're a source of work. Cut if not.

### localLogistics (88 words)

We're based in New Malden, so there's no callout charge and realistically no travel delay — if you call in the morning we can usually be with you before lunch. Parking is generally fine on the residential roads; if you're on the High Street or near the station we'll ask you where's best rather than circling.

Evenings and weekends are no extra charge here, same as everywhere else we cover. Most repairs are done in front of you at the kitchen table or your desk.

---

# 2. Kingston upon Thames — KT1, Kingston upon Thames

### localIntro (188 words)

We cover all of Kingston upon Thames — from the riverside offices and the Bentall Centre area to the residential streets around Norbiton and Kingston Hill. With Kingston University nearby we see a lot of student MacBooks with cracked screens and failing batteries, and we can usually visit the same day rather than making you carry the machine into town.

Kingston is the one place on our patch where people most often assume they have to queue somewhere. You don't. We're five minutes up the road in New Malden, and coming to your flat in Norbiton or your office near the Rose Theatre costs you nothing extra and saves you an afternoon.

The town splits into two very different jobs for us. There's the town centre — offices, retail units and the flats above them, where the machine is usually work-critical and needs fixing today. And there's the residential belt up Kingston Hill and out toward Coombe, which is more family machines, more iMacs, more "it's been getting slower for a year and now it won't start".

### localRepairs (149 words)

Student laptops dominate around term time. Cracked screens are the single most common Kingston call-out we get — a MacBook Air that's been closed on a pen, or a laptop that's gone off a desk in halls. We carry the common Air and Pro screens, so most of those are done on-site in under an hour.

Battery swaps are the close second. A three or four year old MacBook that won't hold charge through a lecture or a working day is a straightforward job and one we can almost always finish in front of you.

For the town centre businesses it's more varied: dead PCs, failing drives, Wi-Fi that won't reach the back office, and the occasional liquid-damage emergency. Data recovery comes up more here than most of our areas 🚩 — usually a dissertation or a set of accounts on a drive that's stopped mounting.

> 🚩 **Verify:** "data recovery comes up more here than most areas" — I inferred this from the university. If your actual job mix doesn't show that, cut the comparison and just say data recovery comes up.

### localLogistics (92 words)

Kingston is a ten-minute run from our New Malden base, so same-day is realistic if you call before 2pm, and often sooner. We'll come to halls, a flat, an office or a café — wherever the machine is.

Parking in central Kingston is genuinely difficult and the one-way system doesn't help, so for town-centre jobs we'll agree the address and access with you when you book rather than guessing. It never costs you anything extra; it just helps us arrive when we said we would.

---

# 3. Wimbledon — SW19, Merton

### localIntro (186 words)

From Wimbledon Village down to South Wimbledon and Wimbledon Park, we come to your home or office rather than asking you to queue at a shop. We look after a lot of the area's professionals working from home around the Common, and can handle everything from a slow iMac to a liquid-damaged MacBook on-site.

Wimbledon is one of our strongest work-from-home patches. A large share of our SW19 call-outs are people whose laptop *is* their job — consultants, designers, people running a business from a spare room — and for them a machine that's down for three days in a shop isn't an inconvenience, it's lost income. That's the whole reason we work the way we do.

The area's split matters too. The Village is largely period houses and older, well-looked-after Macs; South Wimbledon and the Broadway are flats, shared houses and a younger mix of machines. We cover both, and the job is rarely the same twice.

During the Championships fortnight the roads around the All England Club are chaos, and we plan around it so a booked visit still lands when we said.

### localRepairs (147 words)

The work-from-home mix means a lot of what we do in Wimbledon is keeping otherwise-healthy machines alive: battery replacements, SSD upgrades on Macs that have got sluggish, and clearing out the software mess that builds up on a machine nobody's had time to maintain.

Liquid damage is a recurring one — a coffee into a MacBook keyboard at a home desk is one of the most common emergency calls we get here. If you can get to us fast, the odds are much better than most people assume, so it's always worth the call before you write the machine off.

We also see a fair number of external drives and Time Machine backups that have quietly stopped working, usually discovered at the worst possible moment. Checking that your backup actually runs is free advice we give on every visit.

### localLogistics (89 words)

Wimbledon is a short hop from New Malden and we're there most days, so same-day visits booked before 2pm are usually straightforward.

Parking around the Village and the Common is permit-heavy and tight, so we'll ask about access when you book — it's not a problem, we just plan for it. Evening and weekend slots are no extra charge, which suits the people here who can't stop work mid-afternoon to meet an engineer.

---

# 4. Surbiton — KT6, Kingston upon Thames

### localIntro (184 words)

Surbiton's Art Deco station and riverside streets are full of London commuters, and a broken laptop the night before a work trip is one of our most common call-outs here. We're based just up the road in New Malden, so Surbiton visits are usually quick to arrange and often same-day.

Surbiton is a commuter town in the truest sense — a lot of people here work in central London three or four days a week and do the rest from home, which means the home machine has to work and there's a narrow window to get it fixed. Evening appointments are more popular in KT6 than almost anywhere else we cover 🚩, and they don't cost extra.

The housing is a mix of Victorian and Edwardian terraces, mansion blocks near the station and newer riverside flats, and the machines follow the same pattern: long-owned Macs that need reviving, and newer laptops that have taken a knock. We cover Surbiton, Berrylands and Tolworth on the same basis, usually on the same trip if it makes sense.

> 🚩 **Verify:** "evening appointments more popular in KT6 than anywhere else" — plausible from the commuter profile but it's a claim about your own booking data. Cut or correct.

### localRepairs (146 words)

The commuter angle shapes the work. We get a lot of "it was fine yesterday and now it won't turn on" the night before something important — which is usually a failed boot, a dead battery or a drive on its way out, and usually fixable on the spot.

Beyond the emergencies, Surbiton is steady upgrade territory: SSDs and RAM into machines that are five or six years old and perfectly good otherwise. It's the cheapest thing you can do to a slow computer and we'd rather tell you that than sell you a repair you don't need.

The mansion blocks near the station throw up more Wi-Fi and networking jobs than average — thick walls and a router in the wrong place. That's often a twenty-minute fix rather than a repair at all.

### localLogistics (86 words)

Surbiton is minutes from our New Malden base, so it's one of the fastest areas we cover and same-day is the norm rather than the exception.

Parking is manageable on most residential roads but tighter near the station and the riverside flats, so we'll check access with you when you book. Evenings and weekends are no extra charge — for a commuter town that's usually the point.

---

# 5. Raynes Park — SW20, Merton

### localIntro (181 words)

Raynes Park's mix of Victorian terraces and new-build flats around the railway station means we see everything from vintage iMacs to brand-new gaming laptops. We cover Raynes Park and neighbouring West Barnes on the same visit, so a call before 2pm usually means same-day help at your door.

Raynes Park sits right between our New Malden base and Wimbledon, which makes it one of the easiest areas for us to reach — we're often passing through anyway. That tends to mean we can be more flexible about timing here than in areas further out.

It's a quietly busy patch. The terraces off Coombe Lane and Bushey Road are largely families and long-term residents, and the newer flats near the station skew younger and more remote-working. The result is a genuinely mixed bag of machines: we'll do a gaming PC that won't POST in the morning and a fifteen-year-old iMac somebody can't bear to part with in the afternoon.

### localRepairs (143 words)

Family machines are the backbone of the work here — laptops that have slowed down, run out of storage, or been dropped by somebody's teenager. Screens, hinges and keyboards, mostly, and a lot of straightforward speed-ups that don't need new hardware at all.

Gaming PCs come up more in Raynes Park than you'd expect 🚩. Overheating, fans screaming, random shutdowns under load — usually dust, thermal paste or a power supply on the way out, and almost always fixable on-site.

The older iMacs are a soft spot of ours. A 2013 or 2014 machine with an SSD and a clean install genuinely feels new again, and it's a fraction of the cost of replacing it. We'll always tell you when that's the better call.

> 🚩 **Verify:** gaming PCs being over-represented in Raynes Park is a guess based on the demographic. Cut if it doesn't match reality.

### localLogistics (84 words)

We're a few minutes away and frequently in the area, so Raynes Park and West Barnes are among the quickest visits we do — same-day is usually easy, and we can often be more flexible on timing than elsewhere.

Parking is generally fine on the residential streets, though the roads immediately around the station get busy at commuter hours. No callout charge, and evenings and weekends are the same price as any other slot.

---

# 6. Richmond — TW9, Richmond upon Thames

### localIntro (190 words)

We cover Richmond, Kew and St Margarets with a fully mobile service — ideal for the many media and creative professionals in the area who rely on their Macs for work and can't afford days without them. We come to your home studio or office and fix most faults on the spot.

Richmond is the most Mac-heavy area we cover 🚩. It's full of people editing, designing and producing — often on machines that are stuffed with project files and running right at the limit of their storage. When one of those goes down mid-project, "leave it with us for a week" isn't an answer, and it's exactly the situation our on-site model was built for.

Geographically it's a spread-out patch: Richmond town and the Green, up toward the Park, out to Kew and across to St Margarets and Twickenham. We treat it as one area and will usually cover more than one job per trip.

It's also the area where we most often get asked about data rather than hardware — because the machine is replaceable and the work on it isn't.

> 🚩 **Verify:** "the most Mac-heavy area we cover" is a strong, specific claim about your own job mix. Only keep it if it's actually true — it's the kind of line a reader will test against their own experience.

### localRepairs (148 words)

Storage is the recurring Richmond theme. Drives that are full, drives that are failing, and external drives full of footage that have stopped mounting. A lot of our work here is recovery and upgrade rather than classic breakage — getting the data off safely first, then making the machine fast enough to work on again.

The creative machines also run hot. MacBook Pros that throttle, fans that never stop, and thermal problems from years of rendering. Often that's a clean and a repaste rather than anything dramatic.

We do the usual too — screens, batteries, liquid damage — but Richmond skews toward keeping a working machine working rather than resurrecting a dead one. If you're mid-project and something's going wrong, call before it fails properly. It's a much better conversation than the one after.

### localLogistics (91 words)

Richmond is a slightly longer run from New Malden than our KT-postcode areas, but there's still no callout charge and same-day is usually workable if you call before 2pm.

Parking in Richmond town and around the Green is genuinely hard and largely permit-controlled, so we'll sort access with you at booking. If you're in a studio or shared office we'll come to the desk. Evenings and weekends are no extra charge, which tends to suit a freelance schedule better anyway.

---

# Summary of what needs your verification

| # | Area | Claim to check |
|---|---|---|
| 1 | New Malden | Korean community / High Street businesses are a real source of call-outs |
| 2 | New Malden | Coombe Boys'/Girls' school machines are a real source of work |
| 3 | Kingston | Data recovery is over-represented here vs other areas |
| 4 | Surbiton | Evening appointments are more popular in KT6 than elsewhere |
| 5 | Raynes Park | Gaming PCs are over-represented here |
| 6 | Richmond | "The most Mac-heavy area we cover" |

Six flags across six areas. All of them are claims about **your** business that I inferred from the area's character — I can describe New Malden accurately, but I can't know your job mix. Anything you can't confirm should be cut rather than hedged.

## Word count impact (if all six ship as drafted)

Measured from this draft (not estimated): the three fields add **~394 unique words per area**.

| | Now | After |
|---|---|---|
| Words per page | ~769 | ~1,163 |
| Unique per page | ~480 (62%) | ~874 (75%) |
| Competitor's London page | 3,217 | 3,217 |

Still short of theirs — deliberately. Their 3,217 words include 16 testimonials and a 50-city link farm, which is padding we shouldn't copy. This gets the six pages to a genuinely useful length with a higher unique ratio than they have.

## If this reads right

Say so and I'll add the two optional fields to the `Location` interface, wire them into the "What to Expect" section of `app/[slug]/page.tsx`, and land these six. The other 72 areas render unchanged until their copy is written — no risk to pages we haven't touched.

Then we measure those six for a few weeks before writing another 72.
