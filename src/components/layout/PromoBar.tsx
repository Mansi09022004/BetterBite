const messages = [
  'Free shipping on orders over $35',
  '30-day happiness guarantee',
  'New: Coffee Caramel is here',
  'Subscribe & save up to 24%',
];

export function PromoBar() {
  const loop = [...messages, ...messages];

  return (
    <div className="overflow-hidden bg-cocoa-700 py-2 text-cream-100">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-xs font-semibold uppercase tracking-wider">
        {loop.map((msg, i) => (
          <span key={i} className="flex items-center gap-3">
            {msg}
            <span className="text-gold-500">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
