'use client';

import { useState } from 'react';

type Status = 'idle' | 'sending' | 'success' | 'error';

export default function ContactForm() {
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

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
      message: (form.elements.namedItem('body') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus('success');
        form.reset();
      } else {
        const json = await res.json();
        setError(json.error || 'Something went wrong. Please call us instead.');
        setStatus('error');
      }
    } catch {
      setError('Network error. Please call us on 0737 834 9222.');
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✅</div>
        <h3 className="text-lg font-bold text-green-800 mb-2">Request Sent!</h3>
        <p className="text-green-700 text-sm">
          We&apos;ll get back to you within 30 minutes. If it&apos;s urgent, call{' '}
          <a href="tel:07378349222" className="font-semibold underline">0737 834 9222</a>.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="mt-4 text-sm text-green-600 underline hover:text-green-800"
        >
          Send another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder="John Smith"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            type="tel"
            name="phone"
            required
            placeholder="07700 900000"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Device &amp; Fault *
        </label>
        <input
          type="text"
          name="device"
          required
          placeholder="e.g. MacBook Pro 2021 — cracked screen"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Your Area / Postcode *
        </label>
        <input
          type="text"
          name="area"
          required
          placeholder="e.g. Kingston, KT1"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Additional Details
        </label>
        <textarea
          name="body"
          rows={4}
          placeholder="Any other information about the fault..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
        />
      </div>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={status === 'sending'}
        className="btn-primary w-full justify-center py-3 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'sending' ? 'Sending…' : 'Send Request →'}
      </button>
      <p className="text-xs text-gray-400 text-center">
        Or call directly:{' '}
        <a href="tel:07378349222" className="text-brand font-semibold">
          0737 834 9222
        </a>
      </p>
    </form>
  );
}
