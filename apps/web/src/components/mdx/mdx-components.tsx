import { CodeWalkthrough, Step } from "./code-walkthrough";
import { PubSubSimulator } from "./events/pubsub-simulator";
import { RequestVsEvent } from "./events/request-vs-event";
import { Figure } from "./figure";
import { UNetExplorer } from "./unet/unet-explorer";
import { Shape, UNetTrace } from "./unet/unet-trace";

/** Components available by name inside blog `.mdx` posts. */
export const mdxComponents = {
  Figure,
  CodeWalkthrough,
  Step,
  UNetExplorer,
  UNetTrace,
  Shape,
  PubSubSimulator,
  RequestVsEvent,
};
