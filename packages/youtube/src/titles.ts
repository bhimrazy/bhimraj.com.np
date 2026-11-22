/**
 * Course channels pack the course name, term and lecture number into every
 * title ("Stanford CME295 … | Autumn 2026 | Lecture 1 - Transformers"). The
 * page already shows the course and a number column, so this keeps the part
 * that names the lecture.
 */

/** Words that mark a segment as course branding rather than the topic. */
const COURSE_MARKERS =
  /\b(stanford|mit|harvard|berkeley|cmu|autumn|fall|spring|winter|summer)\b|\b(cs|cme|ee|ms&e)\s?\d{2,3}[a-z]?\b|\b\d\.\d{3,4}\b/i;

const LECTURE_NUMBER = /\blec(?:ture)?\s*(\d{1,3})\b/i;

export type CleanTitle = {
  title: string;
  number: number | null;
  speakers: string | null;
};

export function cleanLectureTitle(raw: string): CleanTitle {
  const text = raw.replace(/\s+/g, " ").trim();
  const number = Number(text.match(LECTURE_NUMBER)?.[1]) || null;

  let speakers: string | null = null;
  const kept: string[] = [];
  for (const segment of text.split(/\s+\|\s+/)) {
    if (COURSE_MARKERS.test(segment)) {
      // "Stanford CS193T Lecture 7 with Cynthia Bailey" → speaker credit.
      speakers ??= segment.match(/\bwith\s+(.+)$/i)?.[1]?.trim() ?? null;
      continue;
    }
    kept.push(segment);
  }

  let title = (kept.length > 0 ? kept : [text]).join(" | ");
  title = title
    // Trailing "(MIT 6.5940 Fall 2026)"-style credits.
    .replace(/\s*\(([^()]*)\)\s*$/, (match, inner: string) =>
      COURSE_MARKERS.test(inner) ? "" : match,
    )
    // Leading "EfficientML.ai Lecture 19 - " or "Lecture 1: ".
    .replace(/^.*?\blecture\s*\d{1,3}\s*[-–—:]\s*/i, "")
    // MIT slide-file names: "Lec19-Distributed-Training (Part I)".
    .replace(/^lec\d{1,3}[-_](\S+)/i, (_, slug: string) =>
      slug.replace(/[-_]+/g, " "),
    )
    .trim();

  return { title: title || text, number, speakers };
}
