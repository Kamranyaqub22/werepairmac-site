'use client';

import { useState } from 'react';

/**
 * The Facebook console: draft a post, check it, publish it.
 *
 * Deliberately one screen with one action. The whole value of holding posts
 * back for approval is lost if approving them is a chore, so the default path
 * is: open, read, press Publish.
 */

interface Topic {
  id: string;
  kind: 'repair' | 'advice' | 'service';
  subject: string;
  url: string;
  photos: string[];
}

interface Caption {
  text: string;
  hashtags: string[];
  imagePrompt: string;
  gaps: string[];
}

interface PhotoOption {
  src: string;
  group: string;
}

interface Draft {
  topic: Topic;
  caption: Caption;
  composed: string;
  photos: PhotoOption[];
  canGenerate: boolean;
  facebookReady: boolean;
  lastPostedAt: string | null;
}

/** Matches MAX_IMAGES in the publish route. */
const MAX_PHOTOS = 6;

interface AttachedPhoto {
  /** The photo's web path, or a unique key for a generated image. */
  key: string;
  label: string;
  /** Post-ready JPEG, base64. */
  data: string;
  source: 'real' | 'generated';
}

const KIND_LABEL: Record<Topic['kind'], string> = {
  repair: 'Real repair',
  advice: 'Advice article',
  service: 'Service',
};

export default function SocialAdminPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [draft, setDraft] = useState<Draft | null>(null);
  const [message, setMessage] = useState('');
  const [prompt, setPrompt] = useState('');
  const [attached, setAttached] = useState<AttachedPhoto[]>([]);
  const [chosenPhoto, setChosenPhoto] = useState<string>('');
  const [skipped, setSkipped] = useState<string[]>([]);
  const [published, setPublished] = useState<{ permalink: string; warning?: string } | null>(null);

  async function call<T>(url: string, body?: unknown): Promise<T> {
    const res = await fetch(url, {
      method: 'POST',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? 'Something went wrong.');
    return data as T;
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy('auth');
    setError(null);
    try {
      await call('/api/admin/session', { password });
      setSignedIn(true);
      await loadDraft([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed.');
    } finally {
      setBusy(null);
    }
  }

  async function loadDraft(skip: string[]) {
    setBusy('draft');
    setError(null);
    setPublished(null);
    setAttached([]);
    try {
      const data = await call<Draft>('/api/admin/social/draft', { skip });
      setDraft(data);
      setMessage(data.composed);
      setPrompt(data.caption.imagePrompt);
      // Attach all of the topic's own photographs straight away — for a repair
      // that is usually a before and an after, which is the post worth making.
      // Previously one photo was merely selected in a dropdown and nothing was
      // attached until a second button was pressed, so posts went out text-only.
      const own = data.photos.filter((p) => p.group === 'This topic').map((p) => p.src);
      const initial = (own.length ? own : data.photos.slice(0, 1).map((p) => p.src)).slice(0, MAX_PHOTOS);
      setChosenPhoto(data.photos.find((p) => !initial.includes(p.src))?.src ?? data.photos[0]?.src ?? '');
      const list: AttachedPhoto[] = [];
      for (const src of initial) {
        const img = await fetchImage('real', src);
        if (img) list.push({ key: src, label: fileName(src), data: img, source: 'real' });
      }
      setAttached(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not prepare a post.');
    } finally {
      setBusy(null);
    }
  }

  /** Prepares one post-ready image; returns it, or null (with the error shown). */
  async function fetchImage(mode: 'real' | 'generated', src = ''): Promise<string | null> {
    try {
      const data = await call<{ image: string }>('/api/admin/social/image', { mode, src, prompt });
      return data.image;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not prepare the image.');
      return null;
    }
  }

  async function addPhoto() {
    if (!chosenPhoto) return;
    if (attached.some((a) => a.key === chosenPhoto)) {
      setError('That photo is already attached.');
      return;
    }
    if (attached.length >= MAX_PHOTOS) {
      setError(`A post can carry at most ${MAX_PHOTOS} photos here.`);
      return;
    }
    setBusy('image');
    setError(null);
    const img = await fetchImage('real', chosenPhoto);
    if (img) {
      const src = chosenPhoto;
      setAttached((prev) => [...prev, { key: src, label: fileName(src), data: img, source: 'real' }]);
    }
    setBusy(null);
  }

  async function addGenerated() {
    if (attached.length >= MAX_PHOTOS) {
      setError(`A post can carry at most ${MAX_PHOTOS} photos here.`);
      return;
    }
    setBusy('generate');
    setError(null);
    const img = await fetchImage('generated');
    if (img) {
      setAttached((prev) => [
        ...prev,
        { key: `generated-${Date.now()}`, label: 'Generated image', data: img, source: 'generated' },
      ]);
    }
    setBusy(null);
  }

  function removePhoto(key: string) {
    setAttached((prev) => prev.filter((a) => a.key !== key));
  }

  /** Moves a photo one place earlier. The first photo is the one Facebook shows largest. */
  function moveEarlier(key: string) {
    setAttached((prev) => {
      const i = prev.findIndex((a) => a.key === key);
      if (i <= 0) return prev;
      const next = [...prev];
      [next[i - 1], next[i]] = [next[i], next[i - 1]];
      return next;
    });
  }

  async function publish() {
    if (!draft) return;
    if (!attached.length && !window.confirm('No photo is attached. Post text only?')) return;
    setBusy('publish');
    setError(null);
    try {
      const data = await call<{ permalink: string; warning?: string }>('/api/admin/social/publish', {
        topicId: draft.topic.id,
        message,
        images: attached.map((a) => a.data),
        imageSource: attached.some((a) => a.source === 'generated') ? 'generated' : 'real',
      });
      setPublished(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publishing failed.');
    } finally {
      setBusy(null);
    }
  }

  function skipTopic() {
    if (!draft) return;
    const next = [...skipped, draft.topic.id];
    setSkipped(next);
    void loadDraft(next);
  }

  /* ---------------------------------------------------------------- */

  if (!signedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-2xl font-extrabold mb-6">Facebook posts</h1>
        <form onSubmit={signIn} className="card p-6 space-y-4">
          <label className="block">
            <span className="block text-sm font-semibold text-gray-700 mb-2">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              className="w-full rounded-lg border border-gray-200 px-4 py-3"
            />
          </label>
          <button type="submit" disabled={busy === 'auth'} className="btn-primary w-full justify-center">
            {busy === 'auth' ? 'Checking…' : 'Sign in'}
          </button>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-baseline justify-between gap-4">
        <h1 className="text-2xl font-extrabold">Facebook posts</h1>
        <button onClick={() => loadDraft(skipped)} disabled={!!busy} className="btn-outline text-sm">
          {busy === 'draft' ? 'Writing…' : 'New draft'}
        </button>
      </div>

      {error && (
        <div className="card p-4 border-l-4 border-red-500">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {published && (
        <div className="card p-5 border-l-4 border-green-600 space-y-2">
          <p className="font-semibold text-green-800">Posted to Facebook.</p>
          <a href={published.permalink} target="_blank" rel="noopener noreferrer" className="text-brand underline text-sm">
            View the post
          </a>
          {published.warning && <p className="text-sm text-amber-700">{published.warning}</p>}
          <button onClick={() => loadDraft(skipped)} className="btn-primary mt-2">
            Draft the next one
          </button>
        </div>
      )}

      {draft && !published && (
        <>
          {!draft.facebookReady && (
            <div className="card p-4 border-l-4 border-amber-500">
              <p className="text-sm text-amber-800">
                Facebook is not connected yet — set FACEBOOK_PAGE_ID and FACEBOOK_PAGE_TOKEN.
                You can still draft and edit here; Publish will fail until those are set.
              </p>
            </div>
          )}

          <div className="card p-5 space-y-1">
            <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-gray-500">
              <span className="tag bg-gray-100">{KIND_LABEL[draft.topic.kind]}</span>
              {draft.lastPostedAt && (
                <span>Last posted {new Date(draft.lastPostedAt).toLocaleDateString('en-GB')}</span>
              )}
            </div>
            <p className="font-semibold">{draft.topic.subject}</p>
            <a href={draft.topic.url} target="_blank" rel="noopener noreferrer" className="text-sm text-brand underline">
              {draft.topic.url.replace('https://www.werepairmac.co.uk', '')}
            </a>
          </div>

          {draft.caption.gaps.length > 0 && (
            <div className="card p-4 border-l-4 border-amber-500">
              <p className="text-sm font-semibold text-amber-800 mb-1">
                The model would not invent these — check the post reads right without them:
              </p>
              <ul className="text-sm text-amber-800 list-disc pl-5">
                {draft.caption.gaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </div>
          )}

          <label className="card p-5 block">
            <span className="block text-sm font-semibold text-gray-700 mb-2">
              Post text
              <span className="font-normal text-gray-500"> — {message.length} characters</span>
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={8}
              className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm leading-relaxed"
            />
            <span className="block text-xs text-gray-500 mt-2">
              Facebook shows about the first 250 characters before &ldquo;See more&rdquo;.
            </span>
          </label>

          <div className="card p-5 space-y-4">
            <p className="text-sm font-semibold text-gray-700">
              Photos
              <span className="font-normal text-gray-500">
                {' '}
                — {attached.length} of up to {MAX_PHOTOS}. The first one shows largest on Facebook.
              </span>
            </p>

            {attached.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {attached.map((a, i) => (
                  <div key={a.key} className="space-y-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={`data:image/jpeg;base64,${a.data}`}
                      alt={`Photo ${i + 1} that will be attached to the post`}
                      className="w-full rounded-lg border border-gray-200"
                    />
                    <div className="flex items-center justify-between gap-2 text-xs text-gray-600">
                      <span className="truncate" title={a.label}>
                        {i + 1}. {a.label}
                      </span>
                      <span className="flex gap-1 shrink-0">
                        {i > 0 && (
                          <button
                            onClick={() => moveEarlier(a.key)}
                            disabled={!!busy}
                            className="px-2 py-1 rounded border border-gray-200"
                            aria-label={`Move photo ${i + 1} earlier`}
                          >
                            ←
                          </button>
                        )}
                        <button
                          onClick={() => removePhoto(a.key)}
                          disabled={!!busy}
                          className="px-2 py-1 rounded border border-gray-200"
                          aria-label={`Remove photo ${i + 1}`}
                        >
                          ✕
                        </button>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                {busy === 'draft'
                  ? 'Attaching photos…'
                  : 'No photo attached. Publishing without one posts text only, which gets noticeably less reach.'}
              </p>
            )}

            <div className="flex flex-wrap gap-3">
              <select
                value={chosenPhoto}
                onChange={(e) => setChosenPhoto(e.target.value)}
                className="flex-1 min-w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {draft.photos.map((p) => (
                  <option key={p.src} value={p.src}>
                    {p.group} — {fileName(p.src)}
                  </option>
                ))}
              </select>
              <button
                onClick={addPhoto}
                disabled={!!busy || !chosenPhoto || attached.length >= MAX_PHOTOS}
                className="btn-outline text-sm"
              >
                {busy === 'image' ? 'Adding…' : 'Add photo'}
              </button>
            </div>

            {draft.canGenerate ? (
              <div className="space-y-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                <button
                  onClick={addGenerated}
                  disabled={!!busy || attached.length >= MAX_PHOTOS}
                  className="btn-outline text-sm"
                >
                  {busy === 'generate' ? 'Generating…' : 'Add a generated image'}
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Image generation is off. Set OPENAI_API_KEY to enable it — real photos of your own
                work will almost always do better here anyway.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <button onClick={publish} disabled={!!busy || !message.trim()} className="btn-primary">
              {busy === 'publish' ? 'Posting…' : 'Publish to Facebook'}
            </button>
            <button onClick={skipTopic} disabled={!!busy} className="btn-outline">
              Skip this topic
            </button>
          </div>
        </>
      )}

      {!draft && busy === 'draft' && <p className="text-sm text-gray-500">Writing a draft…</p>}
    </div>
  );
}

function fileName(src: string): string {
  return src.split('/').pop() ?? src;
}
