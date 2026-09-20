'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { formatBytes, prepareImage, readJson } from '@/lib/browserImage';

/**
 * The photo library console.
 *
 * Upload bench photos once; they sit in photo-library/ until a post needs one.
 * Deliberately not a publishing tool — nothing here appears on the site until a
 * photo is chosen for a specific post and copied into public/images at the size
 * that post needs.
 */

/** Matches MAX_PHOTOS in the API route. */
const MAX_PHOTOS = 6;

interface LibraryPhoto {
  name: string;
  path: string;
  size: number;
  downloadUrl: string;
}

export default function AdminPhotosPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [preparing, setPreparing] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const [files, setFiles] = useState<File[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [naming, setNaming] = useState(false);
  const [library, setLibrary] = useState<LibraryPhoto[] | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  // Minted once per file set and revoked on replacement, so switching selection
  // does not leak object URLs.
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

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
      setAuthed(true);
      void loadLibrary();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  async function loadLibrary() {
    try {
      const res = await fetch('/api/admin/photos');
      const data = await readJson(res);
      if (!res.ok) throw new Error(String(data.error ?? 'Could not load the library.'));
      setLibrary((data.photos as LibraryPhoto[]) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load the library.');
    }
  }

  async function onFilesChosen(chosen: File[]) {
    setError('');
    setNotice('');
    if (!chosen.length) return;

    const take = chosen.slice(0, MAX_PHOTOS);
    if (chosen.length > MAX_PHOTOS) setError(`Only the first ${MAX_PHOTOS} photos were used.`);

    setPreparing(true);
    try {
      const prepared: File[] = [];
      for (const file of take) prepared.push(await prepareImage(file));
      setFiles(prepared);
      setLabels(prepared.map(() => ''));
      void suggestNames(prepared);
    } catch (err) {
      if (fileInput.current) fileInput.current.value = '';
      setError(err instanceof Error ? err.message : 'Could not read those photos.');
    } finally {
      setPreparing(false);
    }
  }

  /**
   * Fill the name boxes from the photos themselves.
   *
   * Failure is deliberately silent. Naming is a convenience — if the model is
   * unavailable the boxes simply stay empty and you type, which is exactly the
   * behaviour before this existed. Surfacing an error here would make a working
   * upload look broken.
   *
   * Anything already typed is preserved: a suggestion only fills a box that is
   * still empty, so a slow response cannot overwrite what you wrote while
   * waiting.
   */
  async function suggestNames(prepared: File[]) {
    setNaming(true);
    try {
      const body = new FormData();
      prepared.forEach((f) => body.append('photos', f));
      const res = await fetch('/api/admin/photos/label', { method: 'POST', body });
      if (!res.ok) return;
      const data = await readJson(res);
      const suggested = (data.labels as string[]) ?? [];
      setLabels((current) =>
        prepared.map((_, i) => (current[i]?.trim() ? current[i] : (suggested[i] ?? '')))
      );
    } catch {
      // Silent by design — see above.
    } finally {
      setNaming(false);
    }
  }

  async function upload(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const body = new FormData();
      files.forEach((f) => body.append('photos', f));
      labels.forEach((l) => body.append('labels', l));

      const res = await fetch('/api/admin/photos', { method: 'POST', body });
      const data = await readJson(res);
      if (!res.ok) throw new Error(String(data.error ?? 'Upload failed.'));

      const added = (data.added as string[]) ?? [];
      setNotice(
        `Added ${added.length} photo${added.length === 1 ? '' : 's'}. The site rebuilds in a couple of minutes — the library below is already up to date.`
      );
      setFiles([]);
      setLabels([]);
      if (fileInput.current) fileInput.current.value = '';
      void loadLibrary();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setBusy(false);
    }
  }

  const totalBytes = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">Photo library</h1>
          <p className="text-gray-500 mt-2 leading-relaxed">
            Your own repair photos, kept in one place so blog posts can use real pictures
            instead of stock. Each one is named from what is in the picture — check the name
            before uploading and correct it if it is wrong. Nothing goes on the site until a
            photo is picked for a specific post.
          </p>
        </header>

        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 leading-relaxed">
          <strong className="font-semibold">This repository is public.</strong> Anything
          uploaded is world-readable and stays in the history even after deletion. Check the
          screen and the background before uploading — no customer files, emails, paperwork,
          addresses or serial numbers in frame.
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
          </div>
        )}
        {notice && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {notice}
          </div>
        )}

        {!authed && (
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

        {authed && (
          <>
            <form onSubmit={upload} className="card p-6 space-y-5">
              <label className="block">
                <span className="block text-sm font-semibold text-gray-700 mb-2">
                  Add photos
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
                  Up to {MAX_PHOTOS} at a time, straight from the camera roll — iPhone HEIC is
                  fine. They are resized and stripped of location data in your browser before
                  they are sent.
                </span>
                {preparing && (
                  <span className="block text-xs text-gray-500 mt-2">Preparing photos…</span>
                )}
                {naming && (
                  <span className="block text-xs text-gray-500 mt-2">
                    Naming them from what&apos;s in the picture… you can start typing over the top.
                  </span>
                )}
              </label>

              {files.length > 0 && (
                <div className="space-y-3">
                  {files.map((file, i) => (
                    <div key={file.name + i} className="flex items-start gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={previews[i]}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover flex-shrink-0 border border-gray-200"
                      />
                      <div className="flex-1 min-w-0">
                        <input
                          type="text"
                          value={labels[i] ?? ''}
                          onChange={(e) =>
                            setLabels((l) => l.map((v, j) => (j === i ? e.target.value : v)))
                          }
                          placeholder={
                            naming ? 'Naming…' : 'What is it? e.g. macbook pro swollen battery removed'
                          }
                          className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                        />
                        <span className="block text-xs text-gray-400 mt-1.5">
                          {formatBytes(file.size)} · becomes the filename — check it describes
                          the device and the fault
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="text-xs text-gray-500">
                    {files.length} photo{files.length === 1 ? '' : 's'} · {formatBytes(totalBytes)}{' '}
                    total
                  </div>
                </div>
              )}

              <button
                type="submit"
                // Also blocked while naming: uploading mid-suggestion would
                // commit filenames from the empty boxes and land the names a
                // moment too late to matter.
                disabled={busy || preparing || naming || !files.length}
                className="btn-primary w-full justify-center"
              >
                {busy ? 'Uploading…' : `Upload ${files.length || ''} to the library`}
              </button>
            </form>

            <section className="mt-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                In the library {library ? `(${library.length})` : ''}
              </h2>

              {library === null && <p className="text-sm text-gray-500">Loading…</p>}
              {library?.length === 0 && (
                <p className="text-sm text-gray-500">
                  Nothing uploaded yet. Photos you add here will show up in this list.
                </p>
              )}

              {library && library.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {library.map((photo) => (
                    <figure key={photo.path} className="card overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo.downloadUrl}
                        alt={photo.name}
                        loading="lazy"
                        className="w-full h-32 object-cover"
                      />
                      <figcaption className="p-2.5">
                        <div className="text-[11px] font-medium text-gray-700 break-words leading-snug">
                          {photo.name.replace(/\.jpg$/i, '').replace(/-/g, ' ')}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">
                          {formatBytes(photo.size)}
                        </div>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
