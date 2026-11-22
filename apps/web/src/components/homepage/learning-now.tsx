import Link from "next/link";
import {
  selectInProgress,
  selectNextUp,
  watchedShare,
} from "@/components/resources/paths";
import {
  getPathsWith,
  getSortedResources,
  type ResourceCardData,
  toCardData,
} from "@/components/resources/resources";
import { STATUS_LABELS } from "@/components/resources/taxonomy";
import { ArrowLink } from "@/components/section-heading";
import { focusRing, surface } from "@/components/surface";
import { formatHours } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ColumnTitle } from "./column-title";

type Slot = { resource: ResourceCardData; next: boolean };

/**
 * Up to two slots from the resource files: what I've marked in progress,
 * then the newest "queued" entry if a slot is left. Empty until a file sets
 * a status, which is the homepage's cue to keep the hand-written row.
 */
export function getLearningSlots(): Slot[] {
  const resources = getSortedResources().map(toCardData);
  const current = selectInProgress(resources, 2);
  if (current.length === 0) return [];
  const slots = current.map((resource) => ({ resource, next: false }));
  const nextUp = current.length < 2 ? selectNextUp(resources) : undefined;
  return nextUp ? [...slots, { resource: nextUp, next: true }] : slots;
}

function href(r: ResourceCardData) {
  return r.hasPage ? `/resources/${r.slug}` : r.url;
}

function SlotLink({
  resource: r,
  label,
}: {
  resource: ResourceCardData;
  label: string;
}) {
  const className = cn(
    "-my-3 inline-flex min-h-11 items-center gap-1.5 rounded-sm py-3 font-medium text-site-accent-text text-sm transition-colors hover:text-site-text dark:hover:text-site-accent-hover",
    focusRing,
  );
  return r.hasPage ? (
    <Link href={href(r)} className={className}>
      {label}
      <span aria-hidden>→</span>
      <span className="sr-only">: {r.title}</span>
    </Link>
  ) : (
    <a
      href={r.url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {label}
      <span aria-hidden>↗</span>
      <span className="sr-only">: {r.title} (opens in a new tab)</span>
    </a>
  );
}

function SlotTile({ slot }: { slot: Slot }) {
  const r = slot.resource;
  const share = slot.next ? null : watchedShare(r.watched, r.lectureCount);
  const inPath = getPathsWith(r.slug)[0];
  // "Learning now" is the column title, so only the other states get a label.
  const label = slot.next
    ? "Next up"
    : r.status && r.status !== "learning"
      ? STATUS_LABELS[r.status]
      : null;

  return (
    <div className="flex flex-col px-6 py-5 sm:px-7">
      <p className="flex flex-wrap items-center gap-x-2 font-mono text-2xs text-site-text-tertiary">
        {label && (
          <>
            <span className="text-site-accent-text uppercase tracking-wider">
              {label}
            </span>
            <span aria-hidden>·</span>
          </>
        )}
        <span>{[r.source, r.term].filter(Boolean).join(" · ")}</span>
      </p>
      <h4 className="mt-2 text-pretty font-display font-semibold text-site-text leading-snug">
        {r.title}
      </h4>

      {share !== null ? (
        <div className="mt-4">
          <svg
            aria-hidden
            className="block h-1 w-full overflow-hidden rounded-full"
          >
            <rect
              width="100%"
              height="100%"
              className="fill-site-bg-tertiary"
            />
            <rect
              width={`${share * 100}%`}
              height="100%"
              rx="2"
              className="fill-site-accent"
            />
          </svg>
          <p className="mt-2 font-mono text-2xs text-site-text-tertiary">
            {share === 1
              ? `All ${r.lectureCount} lectures watched`
              : `${r.watched} of ${r.lectureCount} lectures watched`}
          </p>
        </div>
      ) : (
        <p className="mt-2 text-pretty text-site-text-tertiary text-sm leading-relaxed">
          {r.lectureCount > 0
            ? `${r.lectureCount} lectures · ${formatHours(r.totalSec)}`
            : r.tldr}
        </p>
      )}

      <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-4">
        <SlotLink
          resource={r}
          label={slot.next ? "Have a look" : "Follow along"}
        />
        {inPath && (
          <Link
            href={`/resources/paths/${inPath.path.slug}`}
            className={cn(
              "-my-3 inline-flex min-h-11 items-center rounded-sm py-3 text-site-text-tertiary text-xs transition-colors hover:text-site-text",
              focusRing,
            )}
          >
            Step {inPath.position} of {inPath.path.steps.length} in a learning
            path
            <span className="sr-only">: {inPath.path.title}</span>
          </Link>
        )}
      </div>
    </div>
  );
}

/** What I'm learning now, with my own lecture count; nothing when unset. */
export function LearningNow({ slots }: { slots: Slot[] }) {
  if (slots.length === 0) return null;
  return (
    <div className="mt-8 flex flex-1 flex-col">
      <ColumnTitle
        title="Learning now"
        action={
          <ArrowLink href="/resources" className="-my-3 py-3">
            All resources
          </ArrowLink>
        }
      />
      {/* Side by side on tablets; stacked when it shares the row on desktop. */}
      <div
        className={cn(
          surface,
          "grid flex-1 grid-cols-1 divide-y divide-site-border/60 dark:divide-white/5",
          slots.length > 1 &&
            "sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-1 lg:divide-x-0 lg:divide-y",
        )}
      >
        {slots.map((slot) => (
          <SlotTile key={slot.resource.slug} slot={slot} />
        ))}
      </div>
    </div>
  );
}
