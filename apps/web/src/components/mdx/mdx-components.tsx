import type { ComponentProps } from "react";
import { Callout } from "./callout";
import { CodeWalkthrough, Step } from "./code-walkthrough";
import { Details } from "./details";
import { PubSubSimulator } from "./events/pubsub-simulator";
import { RequestVsEvent } from "./events/request-vs-event";
import { Exercise } from "./exercise";
import { Figure } from "./figure";
import { Level } from "./level";
import { Path, Paths, SeriesParts } from "./series-blocks";
import { Tab, Tabs } from "./tabs";
import { UNetExplorer } from "./unet/unet-explorer";
import { Shape, UNetTrace } from "./unet/unet-trace";

/** Components available by name inside blog `.mdx` posts. */
const mdxComponents = {
  Figure,
  CodeWalkthrough,
  Step,
  UNetExplorer,
  UNetTrace,
  Shape,
  PubSubSimulator,
  RequestVsEvent,
  Callout,
  Details,
  Level,
  Tabs,
  Tab,
  Exercise,
  Paths,
  Path,
  SeriesParts,
};

/**
 * `mdxComponents` with the series blocks bound to the post's series, so a
 * hub can write `<SeriesParts />` and `<Path parts="1,3">` without an id.
 */
export function mdxComponentsFor(series: string | undefined) {
  if (!series) return mdxComponents;
  return {
    ...mdxComponents,
    Path: (props: ComponentProps<typeof Path>) => (
      <Path {...props} series={series} />
    ),
    SeriesParts: () => <SeriesParts series={series} />,
  };
}
