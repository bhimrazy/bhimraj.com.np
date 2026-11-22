/** Scroll distance before the bar changes state, so jitter doesn't flicker it. */
const THRESHOLD = 8;

export type TabBarScroll = { hidden: boolean; anchorY: number };

/**
 * Hide while scrolling down, show while scrolling up. `anchorY` is where the
 * current direction began; `maxY` is the furthest the page can scroll.
 */
export function nextTabBarScroll(
  state: TabBarScroll,
  y: number,
  maxY: number,
): TabBarScroll {
  // At either end (including iOS overscroll) the bar is always shown.
  if (y <= 0 || y >= maxY) return { hidden: false, anchorY: y };
  const delta = y - state.anchorY;
  if (Math.abs(delta) < THRESHOLD) return state;
  return { hidden: delta > 0, anchorY: y };
}
