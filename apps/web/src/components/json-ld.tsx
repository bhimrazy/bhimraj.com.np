import type { JsonLdObject } from "@/lib/structured-data";

/** One `<script type="application/ld+json">` per schema.org block. */
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
          dangerouslySetInnerHTML={{
            // Escape "<" so a title containing "</script>" can't end the tag.
            __html: JSON.stringify(block).replace(/</g, "\\u003c"),
          }}
        />
      ))}
    </>
  );
}
