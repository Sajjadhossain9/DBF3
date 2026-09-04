import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type RefObject } from "react";

/* ---------- Media query ---------- */
export function useMediaQuery(query: string, initial = false) {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : initial,
  );
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/* ---------- Tiny shared store (so every component sees the same preference) ---------- */
function createStore<T>(initial: () => T) {
  let value: T | undefined; const subs = new Set<() => void>();
  return {
    get: () => (value === undefined ? (value = initial()) : value),
    set: (v: T) => { value = v; subs.forEach((s) => s()); },
    subscribe: (s: () => void) => { subs.add(s); return () => { subs.delete(s); }; },
  };
}

/* ---------- Reduced motion (system + user toggle) ---------- */
const motionStore = createStore<boolean>(() => { try { return localStorage.getItem("ap-motion") === "reduced"; } catch { return false; } });
export function useReducedMotion() {
  const system = useMediaQuery("(prefers-reduced-motion: reduce)");
  const user = useSyncExternalStore(motionStore.subscribe, motionStore.get, () => false);
  useEffect(() => {
    document.documentElement.setAttribute("data-motion", user || system ? "reduced" : "full");
  }, [user, system]);
  const toggle = useCallback(() => {
    const next = !motionStore.get();
    motionStore.set(next);
    try { localStorage.setItem("ap-motion", next ? "reduced" : "full"); } catch { /* ignore */ }
  }, []);
  return { reduced: user || system, userReduced: user, toggle };
}

/* ---------- Theme ---------- */
export type Theme = "dark" | "light";
const themeStore = createStore<Theme>(() => (document.documentElement.getAttribute("data-theme") === "light" ? "light" : "dark"));
export function useTheme() {
  const theme = useSyncExternalStore(themeStore.subscribe, themeStore.get, () => "dark" as Theme);
  const setTheme = useCallback((t: Theme) => {
    themeStore.set(t);
    document.documentElement.setAttribute("data-theme", t);
    try { localStorage.setItem("ap-theme", t); } catch { /* ignore */ }
  }, []);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => {
      try { if (localStorage.getItem("ap-theme")) return; } catch { /* ignore */ }
      const t: Theme = mq.matches ? "light" : "dark";
      themeStore.set(t);
      document.documentElement.setAttribute("data-theme", t);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  const toggle = useCallback(() => setTheme(themeStore.get() === "dark" ? "light" : "dark"), [setTheme]);
  return { theme, setTheme, toggle };
}

/* ---------- Device capability ---------- */
export interface Capability {
  lowPower: boolean;     // few cores / low memory / save-data
  saveData: boolean;
  touch: boolean;
  mobile: boolean;
  webgl: boolean;
}
export function useCapability(): Capability {
  const mobile = useMediaQuery("(max-width: 767px)");
  const [cap, setCap] = useState<Capability>({ lowPower: false, saveData: false, touch: false, mobile, webgl: true });
  useEffect(() => {
    const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number };
    const saveData = !!nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? "");
    const cores = navigator.hardwareConcurrency ?? 8;
    const mem = nav.deviceMemory ?? 8;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    let webgl = false;
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch { webgl = false; }
    setCap({ lowPower: saveData || mem <= 2 || (cores <= 2 && mem <= 4), saveData, touch, mobile, webgl });
  }, [mobile]);
  return cap;
}

/* ---------- Intersection observer ---------- */
export function useInView<T extends HTMLElement>(options: IntersectionObserverInit = { threshold: 0.15 }, once = true): [RefObject<T | null>, boolean] {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); if (once) io.disconnect(); }
      else if (!once) setInView(false);
    }, options);
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return [ref, inView];
}

/* ---------- Scroll progress (rAF throttled) ---------- */
export function useScrollProgress(target?: RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    let raf = 0;
    const compute = () => {
      raf = 0;
      if (target?.current) {
        const r = target.current.getBoundingClientRect();
        const total = r.height - window.innerHeight;
        setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
      } else {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(max > 0 ? window.scrollY / max : 0);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(compute); };
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [target]);
  return progress;
}

/* ---------- Local storage ---------- */
export function useLocalStorage<T>(key: string, initial: T): [T, (v: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try { const raw = localStorage.getItem(key); return raw ? (JSON.parse(raw) as T) : initial; } catch { return initial; }
  });
  const set = useCallback((v: T) => { setValue(v); try { localStorage.setItem(key, JSON.stringify(v)); } catch { /* ignore */ } }, [key]);
  return [value, set];
}

/* ---------- Copy to clipboard ---------- */
export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), timeout); } catch { /* ignore */ }
  }, [timeout]);
  return { copied, copy };
}

/* ---------- Keyboard shortcut ---------- */
export function useKey(handler: (e: KeyboardEvent) => void) {
  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
