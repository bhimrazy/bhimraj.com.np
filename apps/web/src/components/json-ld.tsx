import type { JsonLdObject } from "@/lib/structured-data";

/**
 * Renders one or more schema.org JSON-LD blocks as `<script>` tags.
 * Usage: `<JsonLd data={buildPersonJsonLd()} />` or
 * `<JsonLd data={[buildBlogPostingJsonLd(post), buildBreadcrumbJsonLd(trail)]} />`.
 */
export function JsonLd({ data }: { data: JsonLdObject | JsonLdObject[] }) {
  const blocks = Array.isArray(data) ? data : [data];

  return (
    <>
      {blocks.map((block, index) => (
        <script
          // biome-ignore lint/suspicious/noArrayIndexKey: fixed, short-lived list of structured-data blocks per page
          key={index}
          type="application/ld+json"
          // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON.stringify of typed, non-user data
          dangerouslySetInnerHTML={{ __html: JSON.stringify(block) }}
        />
      ))}
    </>
  );
}
