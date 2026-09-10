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
  const [image, setImage] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<'real' | 'generated'>('real');
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
    setImage(null);
    try {
      const data = await call<Draft>('/api/admin/social/draft', { skip });
      setDraft(data);
      setMessage(data.composed);
      setPrompt(data.caption.imagePrompt);
      // Preselect the topic's own photograph — the common case is that the
      // repair's picture is the right picture.
      const own = data.photos.find((p) => p.group === 'This topic');
      setChosenPhoto(own?.src ?? data.photos[0]?.src ?? '');
      setImageSource('real');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not prepare a post.');
    } finally {
      setBusy(null);
    }
  }

  async function prepareImage(mode: 'real' | 'generated') {
    setBusy('image');
    setError(null);
    try {
      const data = await call<{ image: string }>('/api/admin/social/image', {
        mode,
        src: chosenPhoto,
        prompt,
      });
      setImage(data.image);
      setImageSource(mode);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not prepare the image.');
    } finally {
      setBusy(null);
    }
  }

  async function publish() {
    if (!draft) return;
    setBusy('publish');
    setError(null);
    try {
      const data = await call<{ permalink: string; warning?: string }>(
        '/api/admin/social/publish',
        { topicId: draft.topic.id, message, image, imageSource }
      );
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
            <p className="text-sm font-semibold text-gray-700">Image</p>

            <div className="flex flex-wrap gap-3">
              <select
                value={chosenPhoto}
                onChange={(e) => setChosenPhoto(e.target.value)}
                className="flex-1 min-w-[220px] rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                {draft.photos.map((p) => (
                  <option key={p.src} value={p.src}>
                    {p.group} — {p.src.split('/').pop()}
                  </option>
                ))}
              </select>
              <button
                onClick={() => prepareImage('real')}
                disabled={!!busy || !chosenPhoto}
                className="btn-outline text-sm"
              >
                {busy === 'image' && imageSource === 'real' ? 'Preparing…' : 'Use this photo'}
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
                <button onClick={() => prepareImage('generated')} disabled={!!busy} className="btn-outline text-sm">
                  {busy === 'image' && imageSource === 'generated' ? 'Generating…' : 'Generate an image instead'}
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-500">
                Image generation is off. Set OPENAI_API_KEY to enable it — real photos of your own
                work will almost always do better here anyway.
              </p>
            )}

            {image && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={`data:image/jpeg;base64,${image}`}
                alt="The image that will be attached to the post"
                className="w-full max-w-sm rounded-lg border border-gray-200"
              />
            )}
            {!image && (
              <p className="text-xs text-gray-500">
                No image attached yet. Publishing without one posts text only, which gets
                noticeably less reach.
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
