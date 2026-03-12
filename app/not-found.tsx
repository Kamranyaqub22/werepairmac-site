import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center bg-gray-50">
      <div className="text-center px-4">
        <div className="text-7xl mb-4">🔧</div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Sorry, that page does not exist. You can explore our services or contact us directly.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">← Back to Home</Link>
          <a href="tel:07378349222" className="btn-accent">📞 Call 0737 834 9222</a>
        </div>
      </div>
    </div>
  );
}
