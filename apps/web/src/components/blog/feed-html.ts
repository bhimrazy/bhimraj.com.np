import { MDXContent } from "@content-collections/mdx/react";
import { createElement, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const nothing = () => null;

/**
 * A post's compiled MDX as static HTML for feed readers, rendered at build
 * time (Next won't bundle react-dom/server into a route). Interactive figures
 * can't run in a reader, so each becomes its caption plus a link to the post.
 * A component missing here fails the build, so new figures must be listed.
 */
export function feedHtml(mdx: string, postPath: string): string {
  const onSite = ({ caption }: { caption?: ReactNode }) =>
    createElement(
      "p",
      null,
      createElement(
        "em",
        null,
        caption,
        " ",
        createElement(
          "a",
          { href: postPath },
          "See the interactive figure on the site.",
        ),
      ),
    );
  return renderToStaticMarkup(
    createElement(MDXContent, {
      code: mdx,
      components: {
        Figure: onSite,
        CodeWalkthrough: onSite,
        Step: nothing,
        Shape: nothing,
        UNetExplorer: nothing,
        UNetTrace: nothing,
        RequestVsEvent: nothing,
      },
    }),
  );
}
