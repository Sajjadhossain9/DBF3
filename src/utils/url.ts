/** Build an absolute, shareable URL for an in-app route that works with both browser and hash routing. */
export const isHashRouting = () =>
  typeof window !== "undefined" &&
  (window.location.hash.startsWith("#/") ||
    window.location.protocol === "file:" ||
    /\.html$/.test(window.location.pathname) ||
    window.location.hostname.endsWith("github.io"));

export function absUrl(route: string, fragment?: string) {
  const base = window.location.href.split("#")[0];
  const frag = fragment ? `#${fragment}` : "";
  if (isHashRouting()) return `${base}#${route}${frag}`;
  const origin = window.location.origin;
  return `${origin}${route}${frag}`;
}
