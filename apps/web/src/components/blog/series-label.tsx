import { LayersIcon } from "@radix-ui/react-icons";
import type { BlogPost } from "./posts";
import { partCountLabel, seriesOfHub } from "./series";

/** "Series · 7 parts" on a series hub; nothing on other posts. */
export default function SeriesLabel({ post }: { post: BlogPost }) {
  const series = seriesOfHub(post);
  if (!series) return null;
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-medium font-mono text-[10px] text-site-accent uppercase tracking-[1.5px]">
      <LayersIcon aria-hidden className="size-3" />
      Series · {partCountLabel(series)}
    </span>
  );
}
