/**
 * Structured data that is present in the server HTML.
 *
 * next/script with strategy="afterInteractive" injects JSON-LD only after
 * hydration, so it is missing from the HTML Google first fetches — product
 * prices, breadcrumbs and FAQ rich results were unreliable because of it.
 * A plain <script type="application/ld+json"> renders on the server.
 */
export default function JsonLd({
  id,
  data,
}: {
  id?: string;
  data: unknown;
}) {
  if (!data) return null;
  // Escape "<" so content like "</script>" inside strings can't break out.
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
