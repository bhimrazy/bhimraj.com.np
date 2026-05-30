export type StarPoint = { t: number; stars: number };

export const STAR_HISTORY_MAX_PAGES = 12;
export const STAR_HISTORY_POINTS = 40;

/**
 * Downsamples sorted star timestamps into a cumulative growth series of at most
 * `STAR_HISTORY_POINTS` evenly-spaced points. The final point is bumped to the
 * repo's reported total in case pagination was capped.
 *
 * Pure and dependency-free so it can be unit-tested in isolation.
 *
 * @param timestamps - Star times (epoch ms), sorted ascending
 * @param totalStars - Repo's reported total, used to backfill the last point
 */
export function buildStarHistory(
  timestamps: number[],
  totalStars: number,
): StarPoint[] {
  const n = timestamps.length;
  if (n === 0) return [];
  if (n === 1) return [{ t: timestamps[0], stars: totalStars }];

  const sampleCount = Math.min(STAR_HISTORY_POINTS, n);
  const points: StarPoint[] = [];
  for (let i = 0; i < sampleCount; i++) {
    const idx = Math.round((i / (sampleCount - 1)) * (n - 1));
    points.push({ t: timestamps[idx], stars: idx + 1 });
  }
  points[points.length - 1].stars = Math.max(
    points[points.length - 1].stars,
    totalStars,
  );
  return points;
}
