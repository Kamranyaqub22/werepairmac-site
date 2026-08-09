import Link from 'next/link';
import CommonIssueCard from '@/components/CommonIssueCard';
import { issuesForService } from '@/lib/commonIssues';
import { serviceLower, type Service } from '@/lib/services';
import { ArrowRightIcon } from '@/components/Icons';

/**
 * The symptom-level detail for a service page.
 *
 * The `commonIssues` bullets elsewhere on these pages name the fault and stop
 * there. This section answers it — the cause and what we actually do about it —
 * which is both the thing a reader came for and unique body copy on pages that
 * otherwise share a template.
 *
 * The safe self-help half of each fault lives on the fault-finder hub instead,
 * not here; see the `variant` note in CommonIssueCard for why the two surfaces
 * are split rather than duplicated.
 *
 * Renders nothing for services with no issue data yet (consoles, upgrades), so
 * those pages are unchanged rather than padded out.
 */
export default function ServiceCommonIssues({ service }: { service: Service }) {
  const issues = issuesForService(service.slug);
  if (!issues.length) return null;

  return (
    <section className="py-14 bg-gray-50 border-t border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <h2 className="section-heading">
          {/* serviceLower, not toLowerCase — see lib/services.ts on proper nouns. */}
          The {serviceLower(service)} faults we see most, and what we do about them
        </h2>
        <p className="text-gray-600 mt-2 mb-6 leading-relaxed">
          What each fault usually turns out to be, what we actually do about it, and roughly what
          it comes to. Where there is something worth trying yourself first, each one links to it —
          some of these you will fix in five minutes without us, and we would rather you did.
        </p>

        <div className="space-y-3">
          {issues.map((issue) => (
            <CommonIssueCard
              key={issue.id}
              issue={issue}
              variant="service"
              open={issues.length <= 3}
              hideServiceLink
            />
          ))}
        </div>

        <p className="text-sm text-gray-500 mt-6">
          <Link
            href="/common-computer-problems-london"
            className="text-brand font-semibold hover:underline inline-flex items-center gap-1"
          >
            See every fault we are called out for <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </p>
      </div>
    </section>
  );
}
