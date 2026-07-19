'use client';

import { useState, useRef } from 'react';
import Link from 'next/link';
import {
  deviceCategories, getDevice, formatRange, LABOUR_RATE,
  type FaultEstimate,
} from '@/lib/quotes';
import { CheckIcon, ArrowRightIcon, PhoneIcon, CurrencyPoundIcon } from '@/components/Icons';

type Status = 'idle' | 'sending' | 'success' | 'error';
const TIME_WINDOWS = ['Morning (8am–12pm)', 'Afternoon (12pm–5pm)', 'Evening (5pm–9pm)', 'As soon as possible'];

export default function QuoteBooking() {
  // ── Estimator state ──
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [fault, setFault] = useState<FaultEstimate | null>(null);

  // ── Form state ──
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  const device = deviceId ? getDevice(deviceId) : undefined;

  // Prefilled "device & fault" description passed into the request form.
  const prefill = device && fault ? `${device.label} — ${fault.label}` : '';

  function selectDevice(id: string) {
    setDeviceId(id);
    setFault(null);
  }

  function bookThis() {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus('sending');
    setError('');

    const form = e.currentTarget;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      device: (form.elements.namedItem('device') as HTMLInputElement).value,
      area: (form.elements.namedItem('area') as HTMLInputElement).value,
      preferredDay: (form.elements.namedItem('preferredDay') as HTMLInputElement).value,
      timeWindow: (form.elements.namedItem('timeWindow') as HTMLSelectElement).value,
      estimate: fault ? formatRange(fault) : '',
      message: (form.elements.namedItem('body') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/request-visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const json = await res.json().catch(() => ({}));
        setError(json.error || 'Something went wrong. Please call us instead.');
        setStatus('error');
      }
    } catch {
      setError('Network error. Please call us on 07378 349222.');
      setStatus('error');
    }
  }

  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand';

  return (
    <div className="space-y-12">
      {/* ─────────── STEP 1: ESTIMATOR ─────────── */}
      <div>
        <div className="text-center mb-8">
          <span className="tag bg-brand/10 text-brand">Step 1 · Instant estimate</span>
          <h2 className="section-heading mt-3">Get a price estimate</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Pick your device and the fault to see a typical price range. No database of every model — just honest, realistic ranges. The exact price is always confirmed before any work starts.
          </p>
        </div>

        {/* Device chooser */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {deviceCategories.map((d) => {
            const active = d.id === deviceId;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => selectDevice(d.id)}
                aria-pressed={active}
                className={`text-left rounded-xl border p-4 transition-all ${
                  active
                    ? 'border-brand bg-brand/5 ring-2 ring-brand/30'
                    : 'border-gray-200 bg-white hover:border-brand/50 hover:shadow-sm'
                }`}
              >
                <div className="text-2xl mb-2">{d.icon}</div>
                <div className="font-bold text-gray-900 text-sm">{d.label}</div>
                <div className="text-xs text-gray-400 mt-0.5 leading-snug">{d.blurb}</div>
              </button>
            );
          })}
        </div>

        {/* Fault chooser */}
        {device && (
          <div className="bg-gray-50 rounded-2xl border border-gray-200 p-5 sm:p-7">
            <h3 className="font-bold text-gray-900 mb-4">
              What&apos;s wrong with your <span className="text-brand">{device.label}</span>?
            </h3>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {device.faults.map((f) => {
                const active = fault?.id === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFault(f)}
                    aria-pressed={active}
                    className={`flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left transition-all ${
                      active
                        ? 'border-brand bg-white ring-2 ring-brand/30'
                        : 'border-gray-200 bg-white hover:border-brand/50'
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-800">{f.label}</span>
                    <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">{formatRange(f)}</span>
                  </button>
                );
              })}
            </div>

            {/* Estimate result */}
            {fault && (
              <div className="mt-6 bg-white rounded-xl border border-brand/20 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">Estimated price</div>
                    <div className="text-3xl font-extrabold text-brand flex items-center gap-1">
                      <CurrencyPoundIcon className="w-6 h-6" />
                      {fault.min} – £{fault.max}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Includes labour (£{LABOUR_RATE}/hr) + typical parts · confirmed before any work
                    </div>
                  </div>
                  <button type="button" onClick={bookThis} className="btn-primary py-3 px-6 justify-center whitespace-nowrap">
                    Request this repair <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
                {fault.note && (
                  <p className="mt-4 text-xs text-gray-500 border-t border-gray-100 pt-3 leading-relaxed">
                    ℹ️ {fault.note}
                  </p>
                )}
                {fault.remoteFixable && (
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3 justify-between bg-brand/5 border border-brand/15 rounded-lg px-4 py-3">
                    <p className="text-xs text-gray-700 leading-relaxed">
                      ✅ This is often <strong>fixable remotely from £49</strong> — no visit needed, usually same day.
                    </p>
                    <Link href="/remote-support" className="text-sm font-semibold text-brand whitespace-nowrap inline-flex items-center gap-1 hover:underline">
                      Remote support <ArrowRightIcon className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─────────── STEP 2: REQUEST A VISIT ─────────── */}
      <div ref={formRef} className="scroll-mt-24">
        <div className="text-center mb-8">
          <span className="tag bg-accent/10 text-accent">Step 2 · Request a visit</span>
          <h2 className="section-heading mt-3">Request your home visit</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto">
            Tell us when suits you and we&apos;ll confirm a time by phone or WhatsApp. We don&apos;t lock you into a fixed slot — we agree a time that works around your day.
          </p>
        </div>

        {status === 'success' ? (
          <div className="max-w-xl mx-auto bg-green-50 border border-green-200 rounded-xl p-8 text-center">
            <div className="text-4xl mb-3">✅</div>
            <h3 className="text-lg font-bold text-green-800 mb-2">Request received!</h3>
            <p className="text-green-700 text-sm">
              We&apos;ll call or message you shortly to confirm a visit time. If it&apos;s urgent, call{' '}
              <a href="tel:07378349222" className="font-semibold underline">07378 349222</a>.
            </p>
            <button onClick={() => setStatus('idle')} className="mt-4 text-sm text-green-600 underline hover:text-green-800">
              Send another request
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input type="text" name="name" required placeholder="John Smith" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input type="tel" name="phone" required placeholder="07700 900000" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input type="email" name="email" placeholder="you@example.com" className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Device &amp; Fault *</label>
              <input
                type="text"
                name="device"
                required
                defaultValue={prefill}
                key={prefill /* re-seed default when estimate changes */}
                placeholder="e.g. MacBook Pro 2021 — cracked screen"
                className={inputClass}
              />
              {fault && (
                <p className="text-xs text-brand mt-1 flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5" /> Estimated {formatRange(fault)} — filled in from your selection above
                </p>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Your Area / Postcode *</label>
                <input type="text" name="area" required placeholder="e.g. Kingston, KT1" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                <input type="date" name="preferredDay" className={inputClass} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time *</label>
              <select name="timeWindow" required defaultValue="" className={inputClass}>
                <option value="" disabled>Choose a time window…</option>
                {TIME_WINDOWS.map((w) => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Details</label>
              <textarea name="body" rows={3} placeholder="Anything else we should know about the fault…" className={`${inputClass} resize-none`} />
            </div>

            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">{error}</div>
            )}

            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {status === 'sending' ? 'Sending…' : 'Request My Visit →'}
            </button>
            <p className="text-xs text-gray-400 text-center">
              Prefer to talk? Call{' '}
              <a href="tel:07378349222" className="text-brand font-semibold">07378 349222</a>{' '}
              — we&apos;ll confirm a time that suits you.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
