# MDX figures

Blog posts (`src/content/blog/*.mdx`) are compiled with `@content-collections/mdx`
and rendered by `<MDXContent>` in `app/(web)/blog/[slug]/page.tsx`. Components in
`mdx-components.tsx` can be used by name inside a post, no imports needed.

## The bar for a figure

- Only where watching or poking beats prose; one idea, at most one or two controls.
- Derived from the post's real code or text: compute values, don't hand-type them.
- The server-rendered frame is meaningful (final or representative state, narration
  visible), so RSS, link previews, no-JS and reduced motion still get the point.
- Quiet: `<Figure>` frame, thin strokes, mono labels, amber only for the active thing,
  colors from `--site-*` tokens. Animate `transform`/`opacity`, CSS transitions or rAF,
  no motion library.
- `prefers-reduced-motion`: no autoplay, instant changes, controls still work. Pause
  offscreen and in hidden tabs. Anything that moves on its own for more than 5s has
  a pause button (WCAG 2.2.2).
- Accessible: real buttons with labels, keyboard operable, `<title>` on SVGs,
  `aria-live="polite"` narration.

## Primitives

```mdx
<Figure label="Short title" caption="What the reader should notice.">
  <MyFigure />
</Figure>
```

- `figure.tsx`: `Figure` (frame, label, caption; captions are numbered "Fig. N" by
  the article CSS) and `Narration` (one live sentence under a figure).
- `controls.tsx`: `ControlBar`, `ControlButton`, `PlayButton`, `Segmented`, `Scrubber`.
- `hooks.ts`: `usePlayback` (autoplay once in view unless reduced motion),
  `useInterval` (ticks only while running and the tab is visible), `useTimeline`
  (rAF clock that starts at the end so SSR shows the finished picture),
  `useMediaQuery`, `usePrefersReducedMotion`.
- `code-walkthrough.tsx`: step through one code block, highlighting lines per step.

~~~mdx
<CodeWalkthrough caption="…">

```python
…
```

<Step lines="2-3" title="Encode" aside={<UNetTrace at="input enc-0" />}>
Prose for this step.
</Step>

</CodeWalkthrough>
~~~

## Code blocks (every post and project)

`shiki-transformers.ts` adds: ```` ```py title="unet.py" ```` (filename bar),
```` ```py {1,4-6} ```` (highlight lines), and in-code comments
`# [!code highlight]`, `[!code focus]`, `[!code ++]` / `[!code --]`,
`[!code error]` / `[!code warning]`.

## Post-specific figures

- `unet/`: `UNetExplorer`, `UNetTrace`, `Shape` for the UNet post; shapes come from
  `unet-shapes.ts`, which mirrors the post's PyTorch code (tested).
- `events/`: `PubSubSimulator` (reducer in `broker-sim.ts`) and `RequestVsEvent`
  (timelines in `request-flow.ts`) for the event-driven architecture post.

After changing `content-collections.ts` or the Shiki transformers, delete
`apps/web/.content-collections`: its cache is keyed by content, not config.
