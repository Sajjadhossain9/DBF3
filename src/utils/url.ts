/** Build an absolute, shareable URL for an in-app route that works with both browser and hash routing. */
export const isHashRouting = () => true;

export function absUrl(route: string, fragment?: string) {
  const base = window.location.href.split("#")[0];
  const cleanRoute = route.startsWith("/") ? route : `/${route}`;
  const frag = fragment ? `#${fragment}` : "";
  return `${base}#${cleanRoute}${frag}`;
}
