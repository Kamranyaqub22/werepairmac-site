'use client';

import { useEffect, useState } from 'react';
import { readJson } from '@/lib/browserImage';

/**
 * Repair estimate builder.
 *
 * Fills in a branded letterhead estimate a customer can hand to their
 * insurer. Everything happens client-side — nothing here is saved anywhere;
 * "Print / Save as PDF" is the browser's own print dialog. Gated behind the
 * same admin password as the rest of /admin (see lib/adminAuth.ts); noindex
 * and the /admin disallow rule already cover this route.
 */

interface LineItem {
  id: string;
  description: string;
  qty: string;
  price: string;
}

function newLineItem(): LineItem {
  return { id: crypto.randomUUID(), description: '', qty: '1', price: '' };
}

function parseNum(value: string): number {
  const n = parseFloat(value);
  return Number.isFinite(n) ? n : 0;
}

function formatGBP(n: number): string {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);
}

function formatDate(d: Date): string {
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

const DEFAULT_NOTES =
  'This is an estimate based on the fault(s) described above. If further faults are found once the device is opened, we will contact you before any extra work is carried out and the price may change. Valid for 30 days from the date of issue. No fix, no fee — you are only charged if the repair goes ahead.';

const inputClass =
  'w-full border-b border-gray-300 focus:border-brand outline-none bg-transparent py-0.5 text-gray-900 print:border-none print:py-0';

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block mb-3">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputClass}
      />
    </label>
  );
}

function TextBlock({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <div className="mb-3">
      <span className="block text-[11px] font-semibold uppercase tracking-wide text-gray-400 mb-1">
        {label}
      </span>
      {/* Printed separately below: a scrollable textarea only prints what's
          visible in its box, so long text would get clipped on the PDF. */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="print:hidden w-full border border-gray-300 rounded focus:border-brand outline-none bg-transparent p-2 text-gray-900 resize-y"
      />
      <p className="hidden print:block whitespace-pre-wrap text-gray-900 leading-relaxed">
        {value || '—'}
      </p>
    </div>
  );
}

export default function AdminEstimatePage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const [estimateNumber, setEstimateNumber] = useState('');
  const [dateIssued, setDateIssued] = useState('');
  const [validUntil, setValidUntil] = useState('');

  const [customerName, setCustomerName] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');

  const [device, setDevice] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [faultDescription, setFaultDescription] = useState('');

  const [lineItems, setLineItems] = useState<LineItem[]>([newLineItem()]);
  const [notes, setNotes] = useState(DEFAULT_NOTES);
  const [engineerName, setEngineerName] = useState('Kamran Yaqub');

  // Computed client-side only, after mount, so the server-rendered shell and
  // the first client render match (today's date and a random estimate
  // number would otherwise cause a hydration mismatch).
  useEffect(() => {
    const today = new Date();
    const later = new Date(today);
    later.setDate(later.getDate() + 30);
    setDateIssued(formatDate(today));
    setValidUntil(formatDate(later));
    const stamp = today.toISOString().slice(0, 10).replace(/-/g, '');
    const rand = Math.floor(100 + Math.random() * 900);
    setEstimateNumber(`WRM-${stamp}-${rand}`);
  }, []);

  // Browsers print this as the page header when "Headers and footers" is on
  // in the print dialog, so it's worth being something other than "Admin".
  useEffect(() => {
    document.title = estimateNumber
      ? `Repair Estimate ${estimateNumber} - We Repair Mac`
      : 'Repair Estimate - We Repair Mac';
  }, [estimateNumber]);

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.');
    } finally {
      setBusy(false);
    }
  }

  function updateLineItem(id: string, field: keyof Omit<LineItem, 'id'>, value: string) {
    setLineItems((items) => items.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
  }

  function removeLineItem(id: string) {
    setLineItems((items) => (items.length === 1 ? items : items.filter((it) => it.id !== id)));
  }

  function resetForm() {
    if (!window.confirm('Clear this estimate and start a new one?')) return;
    window.location.reload();
  }

  const amount = (item: LineItem) => parseNum(item.qty) * parseNum(item.price);
  const subtotal = lineItems.reduce((sum, item) => sum + amount(item), 0);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <form
          onSubmit={signIn}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-sm"
        >
          <h1 className="text-lg font-bold text-gray-900 mb-1">Estimate builder</h1>
          <p className="text-sm text-gray-500 mb-5">Sign in with the admin password.</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-3 outline-none focus:border-brand"
          />
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}
          <button
            type="submit"
            disabled={busy || !password}
            className="w-full bg-brand text-white font-semibold rounded-lg py-2 disabled:opacity-50"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 print:bg-white">
      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 16mm;
          }
          body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div className="print:hidden max-w-4xl mx-auto px-4 pt-6 pb-2 flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-bold text-gray-900">Repair estimate builder</h1>
        <div className="flex gap-3">
          <button
            onClick={resetForm}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50"
          >
            New estimate
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 rounded-lg bg-brand text-white font-semibold hover:bg-brand-dark"
          >
            Print / Save as PDF
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 print:p-0 print:max-w-none">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-10 print:shadow-none print:border-none print:rounded-none print:p-0">
          {/* Letterhead */}
          <div className="flex items-start justify-between gap-6 border-b-4 border-brand pb-6 mb-8">
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="We Repair Mac logo" className="h-16 w-16 object-contain" />
              <div>
                <p className="text-2xl font-extrabold text-brand leading-tight">We Repair Mac</p>
                <p className="text-sm text-gray-500">
                  Mobile Mac &amp; laptop repair specialists &middot; est. 2015
                </p>
              </div>
            </div>
            <div className="text-right text-sm text-gray-600 leading-relaxed whitespace-nowrap">
              <p>18 Vincent House, Burlington Road</p>
              <p>New Malden, KT3 4NX</p>
              <p>07378 349222</p>
              <p>info@werepairmac.co.uk</p>
              <p>www.werepairmac.co.uk</p>
            </div>
          </div>

          {/* Title + estimate meta */}
          <div className="flex flex-wrap justify-between items-end gap-6 mb-8">
            <h2 className="text-3xl font-extrabold text-brand-dark tracking-tight">
              Repair Estimate
            </h2>
            <div className="grid grid-cols-3 gap-6 text-sm min-w-[280px]">
              <Field label="Estimate no." value={estimateNumber} onChange={setEstimateNumber} />
              <Field label="Date issued" value={dateIssued} onChange={setDateIssued} />
              <Field label="Valid until" value={validUntil} onChange={setValidUntil} />
            </div>
          </div>

          {/* Customer / device */}
          <div className="grid md:grid-cols-2 print:grid-cols-2 gap-x-10 mb-8">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                Prepared for
              </h3>
              <Field label="Customer name" value={customerName} onChange={setCustomerName} />
              <TextBlock
                label="Address"
                value={customerAddress}
                onChange={setCustomerAddress}
                rows={2}
              />
              <Field label="Phone" value={customerPhone} onChange={setCustomerPhone} />
              <Field label="Email" value={customerEmail} onChange={setCustomerEmail} />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-2">
                Device &amp; fault
              </h3>
              <Field
                label="Device"
                value={device}
                onChange={setDevice}
                placeholder="e.g. MacBook Pro 13-inch, 2019"
              />
              <Field
                label="Serial / model number"
                value={serialNumber}
                onChange={setSerialNumber}
              />
              <TextBlock
                label="Fault / damage description"
                value={faultDescription}
                onChange={setFaultDescription}
                rows={4}
                placeholder="What's wrong with the device, and how the damage happened, if known"
              />
            </div>
          </div>

          {/* Line items */}
          <table className="w-full text-sm border-collapse mb-2">
            <thead>
              <tr className="border-b-2 border-brand text-left text-[11px] uppercase tracking-wide text-gray-400">
                <th className="py-2 pr-2 font-semibold">Description</th>
                <th className="py-2 px-2 w-16 text-right font-semibold">Qty</th>
                <th className="py-2 px-2 w-28 text-right font-semibold">Unit price</th>
                <th className="py-2 pl-2 w-28 text-right font-semibold">Amount</th>
                <th className="w-8 print:hidden" />
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id} className="border-b border-gray-200 align-top">
                  <td className="py-2 pr-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                      placeholder="e.g. Screen replacement (parts & labour)"
                      className="w-full bg-transparent outline-none rounded px-1 -mx-1 focus:bg-blue-50 print:focus:bg-transparent print:px-0 print:mx-0"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <input
                      type="text"
                      inputMode="decimal"
                      value={item.qty}
                      onChange={(e) => updateLineItem(item.id, 'qty', e.target.value)}
                      className="w-full bg-transparent outline-none rounded px-1 -mx-1 text-right focus:bg-blue-50 print:focus:bg-transparent print:px-0 print:mx-0"
                    />
                  </td>
                  <td className="py-2 px-2">
                    <div className="flex items-center justify-end gap-0.5">
                      <span className="text-gray-400">&pound;</span>
                      <input
                        type="text"
                        inputMode="decimal"
                        value={item.price}
                        onChange={(e) => updateLineItem(item.id, 'price', e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-transparent outline-none rounded px-1 -mx-1 text-right focus:bg-blue-50 print:focus:bg-transparent print:px-0 print:mx-0"
                      />
                    </div>
                  </td>
                  <td className="py-2 pl-2 text-right font-medium text-gray-900">
                    {formatGBP(amount(item))}
                  </td>
                  <td className="print:hidden text-center">
                    <button
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                      aria-label="Remove line"
                      className="text-gray-400 hover:text-red-600 disabled:opacity-30"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={() => setLineItems((items) => [...items, newLineItem()])}
            className="print:hidden text-sm text-brand font-semibold hover:underline mb-8"
          >
            + Add line item
          </button>

          <div className="flex justify-end mb-8">
            <div className="w-64">
              <div className="flex justify-between py-2 border-t-2 border-brand font-bold text-base text-brand-dark">
                <span>Total</span>
                <span>{formatGBP(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-400 mt-1">
                No VAT &mdash; We Repair Mac is not VAT registered.
              </p>
            </div>
          </div>

          <TextBlock label="Notes & terms" value={notes} onChange={setNotes} rows={4} />

          {/* Signature */}
          <div className="grid md:grid-cols-2 print:grid-cols-2 gap-10 mt-10 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500 mb-8 print:hidden">
                Signed for We Repair Mac
              </p>
              <div className="border-b border-gray-400 w-56 h-8 mb-1 print:hidden" />
              <Field label="Prepared by" value={engineerName} onChange={setEngineerName} />
            </div>
            <div className="text-sm text-gray-500 md:text-right self-end">
              <p>We Repair Mac &middot; est. 2015</p>
              <p>No fix, no fee.</p>
            </div>
          </div>

          <div className="mt-10 pt-4 border-t border-gray-200 text-center text-[11px] text-gray-400">
            We Repair Mac &middot; 18 Vincent House, Burlington Road, New Malden, KT3 4NX &middot;
            07378 349222 &middot; info@werepairmac.co.uk &middot; www.werepairmac.co.uk
          </div>
        </div>
      </div>
    </div>
  );
}
