import { ShieldCheckIcon, ClockIcon, TruckIcon, CurrencyPoundIcon, WrenchIcon, ComputerDesktopIcon } from '@/components/Icons';

const badges = [
  { Icon: TruckIcon, title: 'We Come To You', desc: 'No shop visit - we travel to your door' },
  { Icon: ClockIcon, title: 'Same-Day Callout', desc: 'Book before 2pm - we come today' },
  { Icon: ShieldCheckIcon, title: 'No Fix, No Fee', desc: 'Pay nothing if we can\'t fix it' },
  { Icon: CurrencyPoundIcon, title: 'Free Callout', desc: 'No travel or visit charges' },
  { Icon: WrenchIcon, title: 'Fixed On-Site', desc: 'Repaired in front of you, under an hour' },
  { Icon: ComputerDesktopIcon, title: 'All of London', desc: 'Every borough, 7 days a week' },
];

export default function TrustBadges() {
  return (
    <section className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {badges.map(({ Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center text-center py-6 px-4 gap-2.5">
              <div className="w-10 h-10 rounded-full bg-brand/8 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-brand" />
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-sm leading-tight">{title}</div>
                <div className="text-xs text-gray-400 mt-0.5">{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
