/** Renders a JSON-LD structured-data script (server component). */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON-LD is trusted, server-generated content.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
