import { MDXContent } from "@content-collections/mdx/react";
import { createElement, Fragment, type ReactNode } from "react";
import { renderToStaticMarkup } from "react-dom/server";

const nothing = () => null;

/**
 * A post's compiled MDX as static HTML for feed readers, rendered at build
 * time (Next won't bundle react-dom/server into a route). Interactive figures
 * can't run in a reader, so each becomes its caption plus a link to the post;
 * a code walkthrough keeps its code and step text. A component missing here
 * fails the build, so new figures must be listed.
 */
export function feedHtml(mdx: string, postPath: string): string {
  // Caption-less figures (chapter markers) carry nothing a reader needs.
  const onSite = ({ caption }: { caption?: ReactNode }) =>
    caption == null
      ? null
      : createElement(
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
  const passThrough = ({ children }: { children?: ReactNode }) =>
    createElement(Fragment, null, children);
  const step = ({ title, children }: { title: string; children?: ReactNode }) =>
    createElement(Fragment, null, createElement("h4", null, title), children);
  return renderToStaticMarkup(
    createElement(MDXContent, {
      code: mdx,
      components: {
        Figure: onSite,
        CodeWalkthrough: passThrough,
        Step: step,
        Shape: nothing,
        UNetExplorer: nothing,
        UNetTrace: nothing,
        RequestVsEvent: nothing,
        AttackPath: nothing,
        KeyTheft: nothing,
        EnvOnDisk: nothing,
        CveByYear: nothing,
        CooldownWindow: nothing,
        TagVsSha: nothing,
        LethalTrifecta: nothing,
      },
    }),
  );
}
