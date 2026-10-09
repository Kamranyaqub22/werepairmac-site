---
name: write-blog-post
description: Write and publish one high-quality blog post for werepairmac.co.uk, following the site's quality bar, avoiding overlap with existing posts, and getting it indexed. Use for the fortnightly scheduled post or whenever a new blog post is requested.
---

# Writing a blog post for We Repair Mac Call Out

One good post beats three thin ones. If no topic clears the bar below, publish
nothing and say why. A skipped fortnight costs nothing; a weak or near-duplicate
post drags down how Google rates the whole blog.

## 1. Pick the topic

1. Read `.claude/skills/write-blog-post/topic-backlog.md`. Take the highest unpublished topic.
2. Check it against every existing post before writing a word:
   - `grep -oE "^    (slug|title): '[^']+'" lib/blog.ts`
   - the case studies in `lib/case-studies.json`
   Reject it if an existing post already answers the same question for the same
   device, even under different wording. "MacBook won't charge" and "MacBook
   charging port broken" are the same search; "MacBook won't charge" and
   "MacBook battery swollen" are not.
3. Prefer topics where:
   - someone searching it is close to booking (a fault, a cost, a repair-or-replace decision),
   - the post links to a service in `lib/services.ts` that has few posts
     (`grep -oE "serviceSlug: '[^']+'" lib/blog.ts | sort | uniq -c`),
   - a real photo exists in `photo-library/` that shows the fault or repair.
4. If the backlog is empty or every item is taken, add 5 new vetted topics to the
   backlog first (same rules), then take the top one.

## 2. Facts and claims: the hard rules

- **Prices only from `lib/quotes.ts`** (`deviceCategories`, `LABOUR_RATE`). Quote
  them as ranges, never "from £X". If there is no row for it, say it is quoted
  after a free inspection. Never invent a figure.
- **Business facts only from `app/llms.txt/route.ts` and `PROJECT.md`**: on-site
  across Greater London, no callout charge, free diagnosis, No Fix No Fee,
  90-day warranty, 7 days a week. Board-level work, console HDMI ports, severe
  liquid damage and failed-drive recovery go to the workshop and take a few days —
  never say those are done on-site.
- **Technical claims must be true and checkable.** If unsure about a model year,
  an Apple policy or a menu name, verify it with a web search or leave it out.
  No made-up statistics, no "studies show", no invented customer stories.
- Do not name or criticise competitors. Apple may be mentioned factually.
- British English. Curly apostrophes in titles to match existing posts (’), plain
  apostrophes are fine in body text.

## 3. Write it

Append ONE new object to the end of `BLOG_BLUEPRINTS` in `lib/blog.ts`. Never
insert above existing entries (it re-dates indexed posts — see the comment on
`publishedAt`). Follow the shape of the last few entries exactly:

- `slug`: lowercase, hyphenated, describes the search, no dates, unique.
- `title`: a question or problem the customer would type, plus the angle.
  `metaTitle` (≤ 60 chars) if the title is longer than 60.
- `publishedAt`: now, as an ISO string. Not in the future.
- `excerpt`: 1–2 sentences, 120–155 chars, states the answer, not a teaser.
- `category`: the service's display name; `serviceSlug`: a real slug from `lib/services.ts`.
- `firstResponse`: **answer the question in the first two sentences**, then
  explain. This paragraph is what Google snippets and AI assistants quote.
- `whySpeedMatters`, `quickChecks` (4), `engineerChecks` (4), `preventionTips` (3).
- `sectionHeadings`: three headings specific to this fault — never the generic fallbacks.
- `diagnosisIntro`, `preventionIntro`: specific to this fault.

Quality bar, all must be true:
- Someone with this exact problem learns something they could not get from the
  first generic result: the actual cause, what to check, what it costs, whether
  it is worth repairing.
- No sentence could be pasted unchanged into another post. Re-read the two
  nearest existing posts and rewrite anything that echoes them.
- No filler: no "in today's digital world", no "look no further", no keyword
  stuffing, no repeating the town list. Mention London naturally once or twice at most.
- `quickChecks` are safe for a customer to do. Never tell them to open a device,
  use a hairdryer or rice, or keep powering on a wet machine.

## 4. Image

- If a fitting photo exists in `photo-library/` (landscape preferred, no customer
  data, serial numbers or screens with personal content visible — look at it),
  create `public/images/blog/<slug>.jpg`:
  `node -e "require('sharp')('photo-library/X.jpg').rotate().resize({width:1200}).jpeg({quality:72,mozjpeg:true}).toFile('public/images/blog/<slug>.jpg')"`
  then add the slug to `POSTS_WITH_DEDICATED_IMAGE` and set `image` to that path.
- Never use a photo of a customer's screen showing their desktop, menu bar,
  account name, files or wallpaper, even if the fault is the subject. These are
  known to contain customer data and must not be used:
  `macbook-battery-condition-replace-soon-menu.jpg`,
  `macbook-pro-battery-menu-twenty-five-percent.jpg`,
  `macbook-pro-system-report-battery-information.jpg`.
- Never use shop or shopfront photos: the business has no shop, and showing one
  contradicts the site.
- Prefer a photo no other blog post already uses — check `public/images/blog/`.
- Otherwise leave it out of that set; it falls back to the stock pool. Set `image`
  to what `pickBlogImage` would return.

## 5. Verify before publishing

All must pass, or do not push:

```
npx tsc --noEmit
npx next lint
npm run build
npm run seo:audit        # must report "No failures"; the new post must not appear in warnings
```

Also confirm `.next/server/app/blog/<slug>.html` exists and that the service page
`.next/server/app/<serviceSlug>.html` links to it.

## 6. Publish and get it indexed

1. Remove the topic from `.claude/skills/write-blog-post/topic-backlog.md` (move it to the Published list).
2. Commit with a clear message and push straight to `main` (the owner has
   approved direct publishing for blog posts only). Do not touch anything
   outside `lib/blog.ts`, `public/images/blog/` and the backlog file.
3. Wait until `https://www.werepairmac.co.uk/blog/<slug>` returns 200 (Vercel
   deploys in about two minutes), then run:
   `node scripts/indexnow.mjs https://www.werepairmac.co.uk/blog/<slug> https://www.werepairmac.co.uk/blog https://www.werepairmac.co.uk/sitemap.xml`
4. Google has no instant-submit API for blog posts; it picks the post up from the
   sitemap (which carries its `lastmod`) and the link on the service page. The
   owner can speed that up with Search Console → URL Inspection → Request indexing.
   Put the post URL in the summary so they can do that.

## 7. Report

End with: the post title and live URL, the service it supports, why the topic was
chosen, which photo was used, and the check results. If you skipped publishing,
say exactly why.
