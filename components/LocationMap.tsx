interface LocationMapProps {
  name: string;
  postcode?: string;
}

export default function LocationMap({ name, postcode }: LocationMapProps) {
  const query = encodeURIComponent(`${name} ${postcode || ''} UK`.trim());

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-80">
      <iframe
        title={`Map of ${name}`}
        src={`https://www.google.com/maps?q=${query}&output=embed`}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
