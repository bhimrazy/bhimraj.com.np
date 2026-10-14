/** The right-column chapters, in page order. Drives both the ids and the nav. */
export const SECTIONS = [
  { id: "currently", label: "Currently" },
  { id: "path", label: "The path so far" },
  { id: "made", label: "Things I've made" },
  { id: "writing", label: "Writing" },
  { id: "outside", label: "Outside work" },
  { id: "hello", label: "Say hello" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const labelFor = (id: SectionId) =>
  SECTIONS.find((s) => s.id === id)?.label ?? id;
