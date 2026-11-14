const UTM =
  "utm_source=bhimraj.com.np&utm_medium=portfolio&utm_campaign=projects";

export function withUtm(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${UTM}`;
}
