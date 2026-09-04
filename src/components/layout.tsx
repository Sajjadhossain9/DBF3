import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate, useNavigation } from "react-router-dom";
import { cn } from "@/utils/cn";
import { nav, site } from "@/data/site";
import { team } from "@/data/team";
import { divisions } from "@/data/divisions";
import { aircraft } from "@/data/aircraft";
import { articles } from "@/data/news";
import { useCopy, useKey, useReducedMotion, useScrollProgress, useTheme } from "@/hooks";
import { Emblem, StatusDot } from "./graphics";
import { Close } from "./ui";

/* ---------- Theme & motion toggles ---------- */
function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggle } = useTheme();
  return (
    <button onClick={toggle} aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} className={cn("grid h-10 w-10 place-items-center border border-line text-muted transition-colors hover:border-line-strong hover:text-fg", className)}>
      {theme === "dark" ? <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
        : <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" /></svg>}
    </button>
  );
}

/* ---------- Command palette ---------- */
function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const items = useMemo(() => [
    ...nav.map((n) => ({ group: "Pages", label: n.label, to: n.to, hint: n.num })),
    ...aircraft.map((a) => ({ group: "Aircraft", label: `${a.designation} ${a.name}`, to: `/aircraft?a=${a.id}`, hint: a.year })),
    ...divisions.map((d) => ({ group: "Engineering", label: d.name, to: `/engineering/${d.id}`, hint: d.code })),
    ...team.filter((m) => m.tier !== "member").map((m) => ({ group: "Team", label: m.name, to: `/team/${m.slug}`, hint: m.role })),
    ...articles.map((a) => ({ group: "News", label: a.title, to: `/news/${a.slug}`, hint: a.category })),
  ], []);
  const results = useMemo(() => { const s = q.trim().toLowerCase(); return (s ? items.filter((i) => `${i.label} ${i.group} ${i.hint}`.toLowerCase().includes(s)) : items).slice(0, 12); }, [q, items]);
  useEffect(() => { if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current?.focus(), 30); } }, [open]);
  useEffect(() => { setIdx(0); }, [q]);
  if (!open) return null;
  const go = (to: string) => { onClose(); navigate(to); };
  return (
    <div role="dialog" aria-modal="true" aria-label="Search" className="fixed inset-0 z-[95] flex items-start justify-center px-4 pt-[12vh]">
      <button aria-label="Close search" onClick={onClose} className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm anim-fade-in" />
      <div className="relative w-full max-w-xl border border-line bg-elev shadow-2xl anim-fade-up">
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg aria-hidden="true" className="h-4 w-4 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(results.length - 1, i + 1)); } if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); } if (e.key === "Enter" && results[idx]) go(results[idx].to); }} placeholder="Search pages, aircraft, divisions, team, news…" className="h-14 w-full bg-transparent text-sm outline-none placeholder:text-faint" />
          <kbd className="hidden border border-line px-1.5 py-0.5 font-mono text-[10px] text-faint sm:block">ESC</kbd>
        </div>
        <ul role="listbox" className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted">No results.</li>}
          {results.map((r, i) => (
            <li key={r.to + r.label} role="option" aria-selected={i === idx}>
              <button onMouseEnter={() => setIdx(i)} onClick={() => go(r.to)} className={cn("flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left text-sm", i === idx ? "bg-accent-soft text-fg" : "text-muted")}>
                <span className="flex items-center gap-3"><span className="w-20 shrink-0 font-mono text-[10px] uppercase tracking-widest text-faint">{r.group}</span>{r.label}</span>
                <span className="font-mono text-[10px] text-faint">{r.hint}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- Navbar ---------- */
function Navbar({ onSearch }: { onSearch: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const { userReduced, toggle: toggleMotion } = useReducedMotion();
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    let raf = 0; const onScroll = () => { if (!raf) raf = requestAnimationFrame(() => { setScrolled(window.scrollY > 24); raf = 0; }); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true }); return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; return () => { document.body.style.overflow = ""; }; }, [open]);
  const onHome = pathname === "/";
  const dark = onHome && !scrolled;
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <header className={cn("fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500", scrolled || !onHome ? "glass border-b border-line" : "border-b border-transparent")}>
        <div className="container-x flex h-16 items-center justify-between md:h-[72px]">
          <Link to="/" className="flex items-center gap-3" aria-label="Airborne Phoenix home">
            <Emblem size={32} />
            <span className="flex flex-col leading-none">
              <span className={cn("text-sm font-semibold tracking-[.18em]", dark ? "text-white" : "text-fg")}>AIRBORNE PHOENIX</span>
              <span className={cn("mt-1 font-mono text-[9px] uppercase tracking-[.3em]", dark ? "text-white/60" : "text-faint")}>{site.team}</span>
            </span>
          </Link>
          <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
            {nav.slice(1).map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => cn("nav-link text-[13px] font-medium tracking-wide transition-colors", dark ? "text-white/80 hover:text-white" : "text-muted hover:text-fg", isActive && (dark ? "text-white" : "text-fg"))}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={onSearch} aria-label="Search (Ctrl+K)" className={cn("grid h-10 w-10 place-items-center border transition-colors", dark ? "border-white/25 text-white/80 hover:border-white/60" : "border-line text-muted hover:border-line-strong hover:text-fg")}>
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
            </button>
            <ThemeToggle className={cn("hidden sm:grid", dark && "border-white/25 text-white/80 hover:border-white/60")} />
            <button onClick={() => setOpen(true)} aria-label="Open menu" aria-expanded={open} className={cn("grid h-10 w-10 place-items-center border lg:hidden", dark ? "border-white/25 text-white" : "border-line text-fg")}>
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 7h18M3 12h18M3 17h18" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Full-screen drawer */}
      <div className={cn("fixed inset-0 z-[80] flex flex-col bg-navy-950 text-white transition-[opacity,visibility] duration-400", open ? "visible opacity-100" : "invisible opacity-0")} aria-hidden={!open}>
        <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-60" />
        <div className="container-x relative flex h-16 items-center justify-between">
          <span className="text-sm font-semibold tracking-[.18em]">MENU</span>
          <button onClick={() => setOpen(false)} aria-label="Close menu" className="grid h-10 w-10 place-items-center border border-white/25"><Close /></button>
        </div>
        <nav aria-label="Mobile" className="container-x relative flex flex-1 flex-col justify-center gap-1 overflow-y-auto py-6">
          {nav.map((n, i) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => cn("flex items-baseline gap-4 border-b border-white/10 py-3.5 text-2xl font-semibold tracking-tight transition-transform duration-500 sm:text-3xl", isActive ? "text-[var(--accent)]" : "text-white", open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0")} style={{ transitionDelay: `${60 + i * 40}ms` }}>
              <span className="font-mono text-xs text-white/40">{n.num}</span>{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="container-x relative flex items-center justify-between border-t border-white/10 py-4">
          <div className="flex items-center gap-2"><ThemeToggle className="border-white/25 text-white" />
            <button onClick={toggleMotion} className="h-10 border border-white/25 px-3 font-mono text-[10px] uppercase tracking-widest">{userReduced ? "Motion: reduced" : "Motion: full"}</button></div>
          <a href={`mailto:${site.email}`} className="font-mono text-[11px] uppercase tracking-widest text-white/70">{site.email}</a>
        </div>
      </div>
    </>
  );
}

/* ---------- Footer ---------- */
function Footer() {
  const { copied, copy } = useCopy();
  const { userReduced, toggle } = useReducedMotion();
  return (
    <footer className="relative border-t border-line bg-sunk">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 blueprint-grid opacity-40 [mask-image:linear-gradient(to_top,black,transparent)]" />
      <div className="container-x relative grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <div className="flex items-center gap-3"><Emblem size={36} /><div><div className="text-sm font-semibold tracking-[.18em]">AIRBORNE PHOENIX</div><div className="font-mono text-[10px] uppercase tracking-[.3em] text-faint">{site.tagline}</div></div></div>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-muted">{site.university}. A student aerospace engineering team designing, building and flying competition aircraft.</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button onClick={() => copy(site.email)} className="inline-flex min-h-10 items-center gap-2 border border-line px-3 font-mono text-[11px] tracking-wide text-muted hover:border-line-strong hover:text-fg">
              <span>{site.email}</span>
              <span className={cn("transition-colors", copied ? "text-emerald-400" : "text-faint")}>{copied ? "Copied ✓" : "Copy"}</span>
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 md:col-span-4">
          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[.25em] text-faint">Navigate</div>
            <ul className="space-y-2 text-sm">{nav.slice(1).map((n) => <li key={n.to}><Link className="text-muted hover:text-fg" to={n.to}>{n.label}</Link></li>)}</ul>
          </div>
          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[.25em] text-faint">Resources</div>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link className="hover:text-fg" to="/news/press-kit">Press kit</Link></li>
              <li><Link className="hover:text-fg" to="/sponsors#deck">Sponsorship deck</Link></li>
              <li><Link className="hover:text-fg" to="/aircraft#specs">Technical summary</Link></li>
              <li><Link className="hover:text-fg" to="/privacy">Privacy notice</Link></li>
              <li><button onClick={toggle} className="hover:text-fg">{userReduced ? "Enable motion" : "Reduce motion"}</button></li>
            </ul>
          </div>
        </div>
        <div className="md:col-span-3">
          <div className="mb-4 font-mono text-[10px] uppercase tracking-[.25em] text-faint">Status</div>
          <div className="space-y-3 border border-line p-4 font-mono text-[11px] uppercase tracking-widest">
            <div className="flex items-center justify-between"><span className="text-muted">Programme</span><span className="flex items-center gap-2"><StatusDot status="active" />AP-2 active</span></div>
            <div className="flex items-center justify-between"><span className="text-muted">Season</span><span>2025–26</span></div>
            <div className="flex items-center justify-between"><span className="text-muted">Recruiting</span><span className="flex items-center gap-2"><StatusDot status="pending" />Sponsors</span></div>
          </div>
        </div>
      </div>
      <div className="container-x relative flex flex-col gap-2 border-t border-line py-5 font-mono text-[10px] uppercase tracking-widest text-faint sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} Airborne Phoenix · {site.team}</span>
        <span>Placeholder imagery via Pexels · Replace with team assets</span>
      </div>
    </footer>
  );
}

/* ---------- Progress, back-to-top, route indicator ---------- */
function ProgressLine() {
  const p = useScrollProgress();
  return <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-[var(--accent)]" style={{ transform: `scaleX(${p})` }} />;
}
function BackToTop() {
  const p = useScrollProgress();
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} aria-label="Back to top" className={cn("fixed bottom-5 right-5 z-40 grid h-11 w-11 place-items-center border border-line glass text-fg transition-[opacity,transform] duration-300", p > 0.12 ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0")}>
      <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M12 19V5M6 11l6-6 6 6" /></svg>
    </button>
  );
}
function RouteIndicator() {
  const navigation = useNavigation();
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  useEffect(() => { setShow(true); const t = setTimeout(() => setShow(false), 500); return () => clearTimeout(t); }, [pathname]);
  const busy = navigation.state !== "idle" || show;
  return <div aria-hidden="true" className={cn("fixed inset-x-0 top-0 z-[70] h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent transition-opacity duration-300", busy ? "opacity-100" : "opacity-0")} style={{ animation: busy ? "marquee 1s linear infinite" : "none", width: "200%" }} />;
}
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) { const el = document.querySelector(hash); if (el) { el.scrollIntoView({ block: "start" }); return; } }
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname, hash]);
  return null;
}

export function PageFallback() {
  return <div className="container-x pt-40 pb-40"><div className="skeleton h-8 w-64" /><div className="skeleton mt-4 h-4 w-96 max-w-full" /><div className="skeleton mt-12 h-64 w-full" /></div>;
}

export default function Layout() {
  const [search, setSearch] = useState(false);
  useKey(useCallback((e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch((s) => !s); } }, []));
  return (
    <>
      <ScrollToTop />
      <RouteIndicator />
      <ProgressLine />
      <Navbar onSearch={() => setSearch(true)} />
      <CommandPalette open={search} onClose={() => setSearch(false)} />
      <main id="main"><Suspense fallback={<PageFallback />}><Outlet /></Suspense></main>
      <Footer />
      <BackToTop />
    </>
  );
}
