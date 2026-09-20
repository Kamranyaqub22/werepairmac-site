# Photo library

Put your own repair photos in this folder. Nothing here is rendered on the site
on its own — this is the pool Claude picks from when writing a blog post or a
case study, so that posts can use real pictures of your work instead of stock
photography.

## Read this first: the repository is public

`github.com/Kamranyaqub22/werepairmac-site` is a **public** repository. Anything
committed here is world-readable and stays in the git history even if it is
deleted later. "Not used on the site" is not the same as "not visible".

So treat this folder as if every photo in it were already published:

- Never upload a photo showing a customer's **files, emails, messages, browser
  tabs, photos or desktop** — check the screen before you shoot.
- Never upload anything showing a **name, address, phone number, invoice or
  serial number**, including on paperwork in the background.
- If a photo is only safe once cropped, crop it **before** uploading. Deleting it
  afterwards does not remove it from the history.

If you want a photo pool that is genuinely private, that needs a separate private
repository or a cloud-storage folder — say so and it can be set up instead.

## How to add photos

**The easy way — the admin console:**

Go to **https://www.werepairmac.co.uk/admin/photos**, sign in, pick photos, type a
few words describing each one, and press upload. Up to 6 at a time.

It handles iPhone HEIC files, fixes sideways photos, resizes them, and strips the
GPS location out of them in your browser before anything is sent. Your
description becomes the filename. Uploading commits them here automatically, and
the page shows you everything already in the library.

**The other way — GitHub directly:**

1. Go to https://github.com/Kamranyaqub22/werepairmac-site/tree/main/photo-library
2. Click **Add file → Upload files**
3. Drag the photos in, then click **Commit changes**

Better for a big batch, since the console is capped at 6 per upload. Nothing is
resized on this path, so the files stay as they came off the camera.

Either way, just mention in chat that there are new photos.

## Naming them

The filename is how a photo gets found later, so describe what is in it:

```
macbook-pro-swollen-battery-removed.jpg
imac-27-inch-open-on-bench-dust.jpg
ps5-liquid-metal-reapplied.jpg
laptop-screen-cracked-before.jpg
laptop-screen-replaced-after.jpg
```

Rough device and fault is plenty. `IMG_4821.jpg` still works — the photos get
looked at, not just read — but a descriptive name makes the right one easier to
find when there are two hundred in here.

## What makes a photo usable on the site

- **Landscape** where you can manage it. Blog headers are wide, so portrait shots
  get cropped top and bottom.
- **Reasonably lit and in focus.** A bench lamp is enough.
- **Before and after pairs** are the most valuable thing you can take. They are
  what a customer deciding whether to trust you actually wants to see.
- **No customer data on screen** — no names, emails, addresses, files or serial
  numbers visible. Check the screen before you shoot, and check the background
  for paperwork.
- Straight off the phone is fine. They get resized and compressed before use.

## Uploading does not redeploy the site

A commit that touches only this folder skips the Vercel build. That is the
`ignoreCommand` in `vercel.json`, which compares the push against everything
outside `photo-library/` and cancels the build when nothing else changed. Such a
deployment shows as "Canceled" in Vercel — that is the feature working, not an
error.

Nothing is lost by skipping it. The upload is a commit written straight through
the GitHub API, and the console lists the library by reading the branch through
that same API, so both work regardless of when the site last built. The
thumbnails come from `raw.githubusercontent.com`, not from the site.

The moment a photo is actually used in a post it is copied into
`public/images/`, which is outside this folder, so that change deploys normally.

## What happens to them

When a photo is used, it is resized to 1200px wide, compressed, and copied to
`public/images/blog/` or `public/images/repairs/` under a name matching the post
it belongs to. The original stays here untouched, so the same photo can be
reused later.

Photos that sit here unused cost nothing but a little repository size. If this
folder grows very large over the years, the oldest unused originals can be
cleared out without affecting anything already published.
