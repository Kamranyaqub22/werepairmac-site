'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { locations } from '@/lib/locations';
import { services } from '@/lib/services';
import { formatBytes, prepareImage, readJson } from '@/lib/browserImage';

/**
 * The publishing console: photos + a line about the job → a drafted case study
 * you check → a commit.
 *
 * Everything the model writes is editable here before it goes anywhere, and its
 * unanswered questions are shown at the top rather than buried, because the
 * whole design depends on gaps being visible instead of filled in.
 */

interface Gap {
  field: string;
  question: string;
}

interface Draft {
  slug: string;
  title: string;
  metaTitle: string;
  excerpt: string;
  locationSlug: string;
  serviceSlug: string;
  device: string;
  fault: string;
  visitType: 'on-site' | 'workshop' | 'on-site-then-workshop';
  turnaround: string;
  partsUsed: string[];
  theCall: string;
  diagnosis: string[];
  theRepair: string[];
  outcome: string;
  photoCaptions: { alt: string; caption: string }[];
  gaps: Gap[];
}

type Stage = 'auth' | 'capture' | 'review' | 'done';

/** Matches MAX_PHOTOS in both API routes. */
const MAX_PHOTOS = 6;

const VISIT_LABELS: Record<Draft['visitType'], string> = {
  'on-site': 'Fixed on site',
  workshop: 'Collected and returned',
  'on-site-then-workshop': 'Diagnosed on site, finished in the workshop',
};

export default function AdminRepairsPage() {
  const [stage, setStage] = useState<Stage>('auth');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [password, setPassword] = useState('');
  const [note, setNote] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [result, setResult] = useState<{ url: string; commitUrl: string } | null>(null);
  const [preparing, setPreparing] = useState(false);
  // Kept so the capture screen can show the before/after, which is the only way
  // to tell from the phone that conversion actually happened.
  const [originalBytes, setOriginalBytes] = useState(0);
  const fileInput = useRef<HTMLInputElement>(null);

  // Minted once per file set and revoked on replacement: building them inline
  // re-created a blob URL on every render and never released any of them, which
  // on a phone is a steady leak while you work through the review form.
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews]);

  async function onFilesChosen(chosen: File[]) {
    setError('');
    setPreparing(true);
    try {
      if (chosen.length > MAX_PHOTOS) {
        // Previously the extras were dropped silently, so you could pick eight
        // and never learn which two were missing.
        setError(`Only the first ${MAX_PHOTOS} photos were used.`);
      }
      const take = chosen.slice(0, MAX_PHOTOS);
      setOriginalBytes(take.reduce((n, f) => n + f.size, 0));

      const prepared: File[] = [];
      for (const file of take) {
        prepared.push(await prepareImage(file));
      }
      setFiles(prepared);
    } catch (err) {
      setFiles([]);
      setOriginalBytes(0);
      if (fileInput.current) fileInput.current.value = '';
      setError(err instanceof Error ? err.message : 'Could not read those photos.');
    } finally {
      setPreparing(false);
    }
  }

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await readJson(res);
      if (!res.ok) throw new Error(String(data.error ?? 'Sign-in failed.'));
      setPassword('');
      setStage('capture');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  async function generateDraft(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const body = new FormData();
      body.append('note', note);
      files.forEach((f) => body.append('photos', f));

      const res = await fetch('/api/admin/repairs/draft', { method: 'POST', body });
      const data = await readJson(res);
      if (!res.ok) throw new Error(String(data.error ?? 'Drafting failed.'));
      setDraft(data.draft as Draft);
      setStage('review');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Drafting failed.');
    } finally {
      setBusy(false);
    }
  }

  async function publish() {
    if (!draft) return;
    setBusy(true);
    setError('');
    try {
      const body = new FormData();
      body.append('draft', JSON.stringify(draft));
      files.forEach((f) => body.append('photos', f));

      const res = await fetch('/api/admin/repairs/publish', { method: 'POST', body });
      const data = await readJson(res);
      if (!res.ok) throw new Error(String(data.error ?? 'Publishing failed.'));
      setResult({ url: String(data.url), commitUrl: String(data.commitUrl) });
      setStage('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Publishing failed.');
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setNote('');
    setFiles([]);
    setOriginalBytes(0);
    setDraft(null);
    setResult(null);
    setError('');
    setStage('capture');
    if (fileInput.current) fileInput.current.value = '';
  }

  const patch = (fields: Partial<Draft>) => setDraft((d) => (d ? { ...d, ...fields } : d));
  const patchList = (key: 'diagnosis' | 'theRepair' | 'partsUsed', value: string) =>
    patch({ [key]: value.split('\n').filter((l) => l.trim()) } as Partial<Draft>);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Publish a repair</h1>
          <p className="text-gray-500 mt-2 leading-relaxed">
            Photos plus a line about the job. The draft comes back with anything it
            couldn&apos;t work out marked as a question — answer those rather than letting
            them be guessed.
          </p>
        </header>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}

        {stage === 'auth' && (
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
            <button type="submit" disabled={busy} className="btn-primary w-full justify-center">
              {busy ? 'Checking…' : 'Sign in'}
            </button>
          </form>
        )}

        {stage === 'capture' && (
          <form onSubmit={generateDraft} className="card p-6 space-y-5">
            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-2">
                Photos of the job
              </span>
              <input
                ref={fileInput}
                type="file"
                // HEIC is listed explicitly or the iOS picker greys out camera
                // roll photos. It is converted to JPEG before upload.
                accept="image/*,.heic,.heif"
                multiple
                onChange={(e) => onFilesChosen(Array.from(e.target.files ?? []))}
                className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm"
              />
              <span className="block text-xs text-gray-500 mt-2">
                Up to 6, straight from the camera roll — iPhone HEIC is fine. Check for serial
                numbers, screen contents and anything identifying the customer&apos;s home
                before uploading.
              </span>
              {preparing && (
                <span className="block text-xs text-brand font-semibold mt-2">
                  Preparing photos…
                </span>
              )}
              {!preparing && files.length > 0 && (
                <span className="block text-xs text-gray-500 mt-2">
                  {files.length} photo{files.length > 1 ? 's' : ''} ready —{' '}
                  <span className="line-through">{formatBytes(originalBytes)}</span>{' '}
                  <span className="font-semibold text-gray-700">
                    {formatBytes(files.reduce((n, f) => n + f.size, 0))}
                  </span>{' '}
                  after converting
                </span>
              )}
            </label>

            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {previews.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={src}
                    src={src}
                    alt={`Upload ${i + 1}`}
                    className="h-24 w-full rounded-lg object-cover border border-gray-200"
                  />
                ))}
              </div>
            )}

            <label className="block">
              <span className="block text-sm font-semibold text-gray-700 mb-2">
                One line about the job
              </span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                required
                rows={3}
                placeholder="MacBook Pro 2019, swollen battery lifting the trackpad, replaced on site in New Malden, about 90 minutes"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 leading-relaxed"
              />
              <span className="block text-xs text-gray-500 mt-2">
                Device, fault, what you did, town. Anything you leave out comes back as a
                question rather than an invention.
              </span>
            </label>

            <button
              type="submit"
              disabled={busy || preparing || files.length === 0}
              className="btn-primary w-full justify-center"
            >
              {busy ? 'Reading the photos…' : 'Write the draft'}
            </button>
          </form>
        )}

        {stage === 'review' && draft && (
          <div className="space-y-6">
            {draft.gaps.length > 0 && (
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <h2 className="font-bold text-amber-900 mb-2">
                  {draft.gaps.length} thing{draft.gaps.length > 1 ? 's' : ''} it couldn&apos;t
                  source
                </h2>
                <p className="text-sm text-amber-800 mb-3">
                  These were left out rather than guessed. Fill them in below, or publish
                  without them.
                </p>
                <ul className="space-y-2">
                  {draft.gaps.map((gap, i) => (
                    <li key={i} className="text-sm text-amber-900">
                      <span className="font-semibold">{gap.field}:</span> {gap.question}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card p-6 space-y-5">
              <Field label="Headline" value={draft.title} onChange={(v) => patch({ title: v })} />
              <Field
                label="Short title (SERP, ≤60 characters)"
                value={draft.metaTitle}
                onChange={(v) => patch({ metaTitle: v })}
                hint={`${draft.metaTitle.length} characters`}
              />
              <Field label="URL slug" value={draft.slug} onChange={(v) => patch({ slug: v })} />
              <Area label="Summary" value={draft.excerpt} onChange={(v) => patch({ excerpt: v })} />

              <div className="grid sm:grid-cols-2 gap-5">
                <Select
                  label="Town"
                  value={draft.locationSlug}
                  onChange={(v) => patch({ locationSlug: v })}
                  options={locations.map((l) => ({ value: l.slug, label: l.name }))}
                />
                <Select
                  label="Service page"
                  value={draft.serviceSlug}
                  onChange={(v) => patch({ serviceSlug: v })}
                  options={services.map((s) => ({ value: s.slug, label: s.title }))}
                />
                <Field label="Device" value={draft.device} onChange={(v) => patch({ device: v })} />
                <Field
                  label="Turnaround"
                  value={draft.turnaround}
                  onChange={(v) => patch({ turnaround: v })}
                />
                <Select
                  label="Where you worked"
                  value={draft.visitType}
                  onChange={(v) => patch({ visitType: v as Draft['visitType'] })}
                  options={Object.entries(VISIT_LABELS).map(([value, label]) => ({
                    value,
                    label,
                  }))}
                />
                <Field label="Reported fault" value={draft.fault} onChange={(v) => patch({ fault: v })} />
              </div>

              <Area label="The call" value={draft.theCall} onChange={(v) => patch({ theCall: v })} />
              <Area
                label="What we found (one per line)"
                value={draft.diagnosis.join('\n')}
                onChange={(v) => patchList('diagnosis', v)}
                rows={4}
              />
              <Area
                label="What we did (one per line)"
                value={draft.theRepair.join('\n')}
                onChange={(v) => patchList('theRepair', v)}
                rows={4}
              />
              <Area
                label="Parts fitted (one per line, blank if none)"
                value={draft.partsUsed.join('\n')}
                onChange={(v) => patchList('partsUsed', v)}
                rows={2}
              />
              <Area label="The result" value={draft.outcome} onChange={(v) => patch({ outcome: v })} />

              <div className="space-y-4 pt-2 border-t border-gray-100">
                <h3 className="font-semibold text-gray-900">Photo descriptions</h3>
                {draft.photoCaptions.map((cap, i) => (
                  <div key={i} className="flex gap-4">
                    {previews[i] && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previews[i]}
                        alt=""
                        className="h-20 w-20 rounded-lg object-cover border border-gray-200 flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        value={cap.alt}
                        onChange={(e) => {
                          const next = [...draft.photoCaptions];
                          next[i] = { ...next[i], alt: e.target.value };
                          patch({ photoCaptions: next });
                        }}
                        placeholder="What is visible"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                      <input
                        value={cap.caption}
                        onChange={(e) => {
                          const next = [...draft.photoCaptions];
                          next[i] = { ...next[i], caption: e.target.value };
                          patch({ photoCaptions: next });
                        }}
                        placeholder="Caption (optional)"
                        className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={publish} disabled={busy} className="btn-accent">
                {busy ? 'Committing…' : 'Publish'}
              </button>
              <button onClick={() => setStage('capture')} disabled={busy} className="btn-outline">
                Back
              </button>
            </div>
          </div>
        )}

        {stage === 'done' && result && (
          <div className="card p-6 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900">Committed</h2>
            <p className="text-gray-600 leading-relaxed">
              Vercel is rebuilding now — the page is usually live in about two minutes.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={result.url} target="_blank" rel="noreferrer" className="btn-primary">
                View the page
              </a>
              <a href={result.commitUrl} target="_blank" rel="noreferrer" className="btn-outline">
                See the commit
              </a>
              <button onClick={reset} className="btn-outline">
                Publish another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 mb-2">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5"
      />
      {hint && <span className="block text-xs text-gray-400 mt-1">{hint}</span>}
    </label>
  );
}

function Area({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 mb-2">{label}</span>
      <textarea
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 leading-relaxed"
      />
    </label>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="block">
      <span className="block text-sm font-semibold text-gray-700 mb-2">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-200 px-4 py-2.5 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
