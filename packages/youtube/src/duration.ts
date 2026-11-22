/** Seconds in an ISO 8601 duration as YouTube returns it ("PT1H44M28S", "P1DT2H"). */
export function parseIsoDuration(value: string): number {
  const match = value.match(
    /^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?$/,
  );
  if (!match) throw new Error(`Unrecognised duration: ${value}`);
  const [, d = "0", h = "0", m = "0", s = "0"] = match;
  return Math.round(
    Number(d) * 86_400 + Number(h) * 3600 + Number(m) * 60 + Number(s),
  );
}
