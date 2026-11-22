"use client";

import { MagnifyingGlassIcon, VideoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "@/components/chip";
import { focusRing, surface } from "@/components/surface";
import { capture } from "@/lib/analytics";
import { formatHours } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ResourceCardData } from "./resources";
import {
  KIND_LABELS,
  RESOURCE_KINDS,
  RESOURCE_TOPICS,
  type ResourceKind,
  type ResourceTopic,
  STATUS_LABELS,
  TOPIC_LABELS,
} from "./taxonomy";

type Filters = {
  kind: ResourceKind | null;
  topic: ResourceTopic | null;
  q: string;
};

const EMPTY: Filters = { kind: null, topic: null, q: "" };

function haystack(r: ResourceCardData): string {
  return [
    r.title,
    r.source,
    r.term,
    r.tldr,
    r.note,
    KIND_LABELS[r.kind].one,
    ...r.people,
    ...r.topics.map((t) => TOPIC_LABELS[t]),
  ]
    .join(" ")
    .toLowerCase();
}

/** Every word in the query must appear somewhere in the entry. */
function matches(r: ResourceCardData, f: Filters, text: string): boolean {
  if (f.kind && r.kind !== f.kind) return false;
  if (f.topic && !r.topics.includes(f.topic)) return false;
  const words = f.q.toLowerCase().split(/\s+/).filter(Boolean);
  return words.every((w) => text.includes(w));
}

function readUrl(): Filters {
  const params = new URLSearchParams(window.location.search);
  const kind = params.get("kind");
  const topic = params.get("topic");
  return {
    kind: RESOURCE_KINDS.includes(kind as ResourceKind)
      ? (kind as ResourceKind)
      : null,
    topic: RESOURCE_TOPICS.includes(topic as ResourceTopic)
      ? (topic as ResourceTopic)
      : null,
    q: params.get("q") ?? "",
  };
}

/** Mirrors filters into the query string so a view can be shared. */
function writeUrl(f: Filters) {
  const params = new URLSearchParams();
  if (f.kind) params.set("kind", f.kind);
  if (f.topic) params.set("topic", f.topic);
  if (f.q.trim()) params.set("q", f.q.trim());
  const search = params.toString();
  window.history.replaceState(
    null,
    "",
    `${window.location.pathname}${search ? `?${search}` : ""}`,
  );
}

/**
 * The full list renders on the server; filtering happens here, in memory.
 * At this size an index or search library would only add weight.
 */
export function ResourceExplorer({
  resources,
}: {
  resources: ResourceCardData[];
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY);
  // False until filters are restored from the URL; until then, writing the
  // URL would wipe them.
  const [ready, setReady] = useState(false);
  // The restored state is not a filter action, so it sends no event.
  const isRestore = useRef(true);

  useEffect(() => {
    setFilters(readUrl());
    setReady(true);
  }, []);

  const texts = useMemo(
    () => new Map(resources.map((r) => [r.slug, haystack(r)])),
    [resources],
  );
  const visible = resources.filter((r) =>
    matches(r, filters, texts.get(r.slug) ?? ""),
  );

  useEffect(() => {
    if (!ready) return;
    writeUrl(filters);
    if (isRestore.current) {
      isRestore.current = false;
      return;
    }
    // Debounced so typing a word sends one event, not one per key.
    const id = setTimeout(() => {
      capture("resources_filtered", {
        kind: filters.kind,
        topic: filters.topic,
        query: filters.q.trim().toLowerCase().slice(0, 60) || null,
        results: visible.length,
      });
    }, 800);
    return () => clearTimeout(id);
  }, [ready, filters, visible.length]);

  // Counts ignore their own facet, so each chip shows what clicking it gives.
  const kindCounts = countBy(
    resources.filter((r) =>
      matches(r, { ...filters, kind: null }, texts.get(r.slug) ?? ""),
    ),
    (r) => [r.kind],
  );
  const topicCounts = countBy(
    resources.filter((r) =>
      matches(r, { ...filters, topic: null }, texts.get(r.slug) ?? ""),
    ),
    (r) => r.topics,
  );

  // Only facets with at least one entry get a chip.
  const kinds = RESOURCE_KINDS.filter((k) =>
    resources.some((r) => r.kind === k),
  );
  const topics = RESOURCE_TOPICS.filter((t) =>
    resources.some((r) => r.topics.includes(t)),
  );

  const groups = RESOURCE_KINDS.map((kind) => ({
    kind,
    items: visible.filter((r) => r.kind === kind),
  })).filter((g) => g.items.length > 0);

  const filtered = filters.kind || filters.topic || filters.q.trim();
  const summary = `${visible.length} of ${resources.length} ${resources.length === 1 ? "resource" : "resources"}`;

  return (
    <div>
      <div className="mb-10 flex flex-col gap-4">
        <label className="relative block max-w-md">
          <span className="sr-only">Search resources</span>
          <MagnifyingGlassIcon
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-site-text-tertiary"
          />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))}
            aria-label="Search resources"
            placeholder="Search by title, school, person or topic"
            className={cn(
              "h-11 w-full rounded-xl border border-site-border bg-site-card pr-4 pl-10 text-site-text text-sm placeholder:text-site-text-tertiary dark:border-white/8",
              focusRing,
            )}
          />
        </label>

        <FacetRow
          legend="Filter by kind"
          options={kinds.map((k) => ({
            value: k,
            label: KIND_LABELS[k].many,
            count: kindCounts.get(k) ?? 0,
          }))}
          active={filters.kind}
          onChange={(kind) => setFilters((f) => ({ ...f, kind }))}
        />
        <FacetRow
          legend="Filter by topic"
          options={topics.map((t) => ({
            value: t,
            label: TOPIC_LABELS[t],
            count: topicCounts.get(t) ?? 0,
          }))}
          active={filters.topic}
          onChange={(topic) => setFilters((f) => ({ ...f, topic }))}
          tone="neutral"
        />
      </div>

      <p
        aria-live="polite"
        className={cn(
          "mb-6 font-mono text-[12px] text-site-text-tertiary",
          !filtered && "sr-only",
        )}
      >
        {summary}
        {filtered && (
          <button
            type="button"
            onClick={() => setFilters(EMPTY)}
            className={cn(
              "ml-3 rounded-sm text-site-accent-text underline-offset-4 hover:underline",
              focusRing,
            )}
          >
            Clear filters
          </button>
        )}
      </p>

      {groups.length === 0 ? (
        <div className={cn(surface, "p-8 text-center")}>
          <p className="text-site-text">Nothing matches that yet.</p>
          <p className="mt-1 text-site-text-secondary text-sm">
            Try a broader word, or clear the filters.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-14">
          {groups.map((group) => (
            <section key={group.kind} aria-labelledby={`kind-${group.kind}`}>
              <h2
                id={`kind-${group.kind}`}
                className="mb-5 flex items-baseline gap-3 font-display font-semibold text-2xl text-site-text tracking-tight"
              >
                {KIND_LABELS[group.kind].many}
                <span className="font-mono font-normal text-site-text-tertiary text-xs">
                  {group.items.length}
                </span>
              </h2>
              <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {group.items.map((r) => (
                  <li key={r.slug}>
                    <ResourceCard
                      resource={r}
                      onTopic={(topic) => setFilters((f) => ({ ...f, topic }))}
                    />
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

function countBy<T, K>(items: T[], keys: (item: T) => K[]): Map<K, number> {
  const counts = new Map<K, number>();
  for (const item of items) {
    for (const key of keys(item)) counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return counts;
}

function FacetRow<V extends string>({
  legend,
  options,
  active,
  onChange,
  tone = "accent",
}: {
  legend: string;
  options: { value: V; label: string; count: number }[];
  active: V | null;
  onChange: (value: V | null) => void;
  tone?: "accent" | "neutral";
}) {
  return (
    <fieldset className="min-w-0 border-0 p-0">
      <legend className="sr-only">{legend}</legend>
      {/* One scrolling row on mobile; py-1 keeps the focus ring unclipped. */}
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
        {options.map((option) => {
          const isActive = option.value === active;
          // An empty facet stays visible so the layout doesn't jump, but
          // can't be picked unless it's the active one.
          const empty = option.count === 0 && !isActive;
          return (
            <button
              key={option.value}
              type="button"
              disabled={empty}
              aria-pressed={isActive}
              onClick={() => onChange(isActive ? null : option.value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 font-mono text-[12px] transition-colors disabled:opacity-40",
                focusRing,
                isActive
                  ? tone === "accent"
                    ? "bg-site-accent text-site-on-accent"
                    : "bg-site-text text-site-bg"
                  : "border border-site-border bg-site-card text-site-text-secondary enabled:hover:border-site-border-hover enabled:hover:text-site-text",
              )}
            >
              {option.label}
              <span className={cn(!isActive && "text-site-text-tertiary")}>
                {option.count}
              </span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function ResourceCard({
  resource: r,
  onTopic,
}: {
  resource: ResourceCardData;
  onTopic: (topic: ResourceTopic) => void;
}) {
  return (
    <article
      className={cn(
        surface,
        "flex h-full flex-col p-5 transition-colors hover:border-site-border-hover sm:p-6 dark:hover:border-white/10",
      )}
    >
      <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-2xs text-site-text-tertiary">
        <span className="text-site-text-secondary">{r.source}</span>
        {r.term && (
          <>
            <span aria-hidden>·</span>
            <span>{r.term}</span>
          </>
        )}
        <span className="ml-auto flex items-center gap-1.5">
          {r.video && (
            <Chip tone="neutral" className="gap-1">
              <VideoIcon aria-hidden className="size-3" />
              {r.lectureCount > 0
                ? `${r.lectureCount} lectures · ${formatHours(r.totalSec)}`
                : "Video"}
            </Chip>
          )}
          {r.status && <Chip>{STATUS_LABELS[r.status]}</Chip>}
        </span>
      </p>

      <h3 className="mt-3 text-pretty font-display font-semibold text-lg text-site-text leading-snug tracking-tight">
        {r.hasPage ? (
          <Link
            href={`/resources/${r.slug}`}
            onClick={() =>
              capture("resource_opened", { slug: r.slug, kind: r.kind })
            }
            className={cn(
              "group/link rounded-sm transition-colors hover:text-site-accent-text",
              focusRing,
            )}
          >
            {r.title}
            <span
              aria-hidden
              className="ml-1.5 inline-block text-site-accent-text text-sm transition-transform group-hover/link:translate-x-0.5"
            >
              →
            </span>
          </Link>
        ) : (
          <a
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              capture("resource_opened", { slug: r.slug, kind: r.kind })
            }
            className={cn(
              "group/link rounded-sm transition-colors hover:text-site-accent-text",
              focusRing,
            )}
          >
            {r.title}
            <span
              aria-hidden
              className="ml-1.5 inline-block text-site-accent-text text-sm transition-transform group-hover/link:translate-x-0.5"
            >
              ↗
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
      </h3>
      {r.people.length > 0 && (
        <p className="mt-1 text-site-text-tertiary text-xs">
          {formatPeople(r.people)}
        </p>
      )}

      <p className="mt-3 text-pretty text-site-text-secondary text-sm leading-relaxed">
        {r.tldr}
      </p>
      {r.note && (
        <p className="mt-3 text-pretty border-site-accent/40 border-l-2 pl-3 text-site-text text-sm italic leading-relaxed">
          {r.note}
        </p>
      )}

      <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
        {r.topics.map((topic) => (
          <li key={topic}>
            <button
              type="button"
              onClick={() => onTopic(topic)}
              className={cn("rounded-md", focusRing)}
            >
              <Chip
                tone="neutral"
                className="transition-colors hover:text-site-text"
              >
                {TOPIC_LABELS[topic]}
              </Chip>
            </button>
          </li>
        ))}
      </ul>
    </article>
  );
}

/** Long author lists (books) collapse to the first two. */
function formatPeople(people: string[]): string {
  if (people.length <= 3) return people.join(", ");
  return `${people.slice(0, 2).join(", ")} and ${people.length - 2} others`;
}
