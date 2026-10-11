import Link from 'next/link';
import { HONEYPOT_FIELD, CONTACT_METHODS } from '@/lib/enquiry';

/**
 * A field real visitors never see or reach. Form-filling bots tend to complete
 * every input they find, so anything typed here marks the submission as spam
 * (see lib/enquiry.ts). Hidden off-screen rather than display:none, which some
 * bots know to skip, and kept out of the tab order and the accessibility tree.
 */
export function HoneypotField() {
  return (
    <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
      <label>
        Leave this empty
        <input type="text" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" defaultValue="" />
      </label>
    </div>
  );
}

export function ContactMethodField({ className }: { className: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Best way to reach you</label>
      <select name="contactMethod" defaultValue="" className={className}>
        <option value="">No preference</option>
        {CONTACT_METHODS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}

export function PrivacyNote() {
  return (
    <p className="text-xs text-gray-400 text-center">
      We only use your details to reply about your repair.{' '}
      <Link href="/privacy" className="underline hover:text-gray-600">
        Privacy policy
      </Link>
    </p>
  );
}
