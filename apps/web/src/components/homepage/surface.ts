/**
 * Shared card surfaces for the homepage, so every section draws from the same
 * border / background / hover language instead of re-typing it per file.
 */

/** Static card: warm gradient in dark mode, plain card in light. */
export const surface =
  "relative overflow-hidden rounded-2xl border border-site-border bg-site-card dark:border-white/5 dark:bg-linear-to-br dark:from-site-card dark:to-site-bg-secondary";

/** Card that lifts on hover. Put `group` on the element (or a parent link). */
export const surfaceInteractive = `${surface} transition-[translate,border-color,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-site-border-hover hover:shadow-xl/5 motion-reduce:hover:translate-y-0 dark:hover:border-white/10`;

/** Small mono chip for tags and tech labels. */
export const chip =
  "inline-flex items-center gap-1.5 rounded-md border border-site-border bg-site-bg-secondary px-2 py-0.5 font-mono text-[11px] text-site-text-secondary dark:border-white/6 dark:bg-white/3";
