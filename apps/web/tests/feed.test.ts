import { describe, expect, it } from "vitest";
import { buildRssFeed } from "@/lib/feed";

const post = {
  title: "Post & title",
  description: "d",
  slug: "s",
  publishedAt: "2023-04-11",
  tags: ["a"],
};

function body(html: string, updatedAt?: string) {
  const xml = buildRssFeed([{ ...post, html, updatedAt }]);
  return {
    xml,
    encoded: xml.split("<![CDATA[")[1].split("]]>")[0],
  };
}

describe("buildRssFeed", () => {
  it("makes root-relative URLs absolute and leaves protocol-relative ones alone", () => {
    const { encoded } = body(
      '<p><img src="/blog/x.png"><a href="/blog/y">y</a><a href="//cdn/x">c</a></p>',
    );
    expect(encoded).toContain('src="https://bhimraj.com.np/blog/x.png"');
    expect(encoded).toContain('href="https://bhimraj.com.np/blog/y"');
    expect(encoded).toContain('href="//cdn/x"');
  });

  it("drops heading permalinks and escaped MDX figure tags but keeps the prose", () => {
    const { encoded } = body(
      '<p>&#x3C;Step lines="2-3" title="Into the encoder" aside={}>\nShape is <code>x</code>.</p><p>&#x3C;/Step></p><h2 id="a">A<a class="heading-anchor" href="#a" aria-label="Link to A"></a></h2>',
    );
    expect(encoded).toBe('<p>Shape is <code>x</code>.</p><h2 id="a">A</h2>');
  });

  it("escapes channel text and uses the newest publish or update date", () => {
    const { xml } = body("<p>x</p>", "2024-01-02");
    expect(xml).toContain("<title>Post &amp; title</title>");
    expect(xml).toContain("<lastBuildDate>Tue, 02 Jan 2024 00:00:00 GMT");
  });

  it("fails loudly on an invalid date", () => {
    expect(() =>
      buildRssFeed([{ ...post, html: "", publishedAt: "not a date" }]),
    ).toThrow(/Invalid post date/);
  });
});
