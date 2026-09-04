import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import { useInView } from "@/hooks";

/* ---------- Icons (inline, small) ---------- */
export const ArrowRight = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={cn("h-4 w-4", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);
export const Close = ({ className }: { className?: string }) => (
  <svg aria-hidden="true" className={cn("h-5 w-5", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
);

/* ---------- Magnetic button (translate only, no cursor hijacking) ---------- */
interface BtnProps { to?: string; href?: string; onClick?: () => void; children: ReactNode; variant?: "primary" | "ghost" | "light" | "outline"; className?: string; arrow?: boolean; type?: "button" | "submit"; disabled?: boolean; download?: boolean }
export function Button({ to, href, onClick, children, variant = "primary", className, arrow = true, type = "button", disabled, download }: BtnProps) {
  const ref = useRef<HTMLElement | null>(null);
  const move = (e: MouseEvent) => {
    const el = ref.current; if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left - r.width / 2) * 0.12, y = (e.clientY - r.top - r.height / 2) * 0.18;
    el.style.transform = `translate(${x}px, ${y}px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  const base = cn(
    "btn-arrow group relative inline-flex min-h-11 items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium tracking-wide transition-[transform,background-color,color,border-color] duration-300 [transition-timing-function:var(--ease-out-expo)] disabled:opacity-50",
    variant === "primary" && "bg-[var(--accent)] text-white hover:bg-phoenix-400",
    variant === "light" && "bg-white text-navy-900 hover:bg-navy-100",
    variant === "ghost" && "border border-white/30 text-white hover:border-white/70 hover:bg-white/10",
    variant === "outline" && "border border-line-strong text-fg hover:border-[var(--accent)] hover:text-accent",
    className,
  );
  const inner = <>{children}{arrow && <ArrowRight />}</>;
  const handlers = { onMouseMove: move, onMouseLeave: leave };
  if (to) return <Link ref={ref as React.Ref<HTMLAnchorElement>} to={to} className={base} {...handlers}>{inner}</Link>;
  if (href) return <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} download={download} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className={base} {...handlers}>{inner}</a>;
  return <button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} disabled={disabled} className={base} {...handlers}>{inner}</button>;
}

/* ---------- Reveal on scroll ---------- */
export function Reveal({ children, className, delay = 0, mask = false, as: Tag = "div" }: { children: ReactNode; className?: string; delay?: number; mask?: boolean; as?: "div" | "section" | "li" | "article" | "span" }) {
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  const T = Tag as "div";
  return <T ref={ref} className={cn(mask ? "reveal-mask" : "reveal", inView && "is-visible", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</T>;
}

/* ---------- Count-up ---------- */
export function CountUp({ to, suffix = "", prefix = "", duration = 1400, className }: { to: number; suffix?: string; prefix?: string; duration?: number; className?: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>({ threshold: 0.6 });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(to); return; }
    let raf = 0; const start = performance.now();
    const tick = (t: number) => { const p = Math.min(1, (t - start) / duration); const e = 1 - Math.pow(1 - p, 4); setV(Math.round(to * e)); if (p < 1) raf = requestAnimationFrame(tick); };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);
  return <span ref={ref} className={className}>{prefix}{v.toLocaleString()}{suffix}</span>;
}

/* ---------- Section heading ---------- */
export function Heading({ title, kicker, num, children, className, light = false, align = "left" }: { title: string; kicker?: string; num?: string; children?: ReactNode; className?: string; light?: boolean; align?: "left" | "center" }) {
  return (
    <div className={cn("mb-10 md:mb-14", align === "center" && "text-center", className)}>
      {num && kicker && <div className={cn("mb-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.25em]", light ? "text-white/70" : "text-faint", align === "center" && "justify-center")}><span className="text-accent">{num}</span><span className="h-px w-6 bg-current opacity-50" /><span>{kicker}</span></div>}
      <h2 className={cn("text-balance text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl", light ? "text-white" : "text-fg")}>{title}</h2>
      {children && <p className={cn("mt-4 max-w-2xl text-base leading-relaxed md:text-lg", light ? "text-white/70" : "text-muted", align === "center" && "mx-auto")}>{children}</p>}
    </div>
  );
}

/* ---------- Modal ---------- */
export function Modal({ open, onClose, children, title, wide = false }: { open: boolean; onClose: () => void; children: ReactNode; title?: string; wide?: boolean }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow; document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label={title} className="fixed inset-0 z-[90] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm anim-fade-in" />
      <div className={cn("relative max-h-[92vh] w-full overflow-y-auto border border-line bg-elev shadow-2xl anim-fade-up sm:max-w-lg", wide && "sm:max-w-4xl")}>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center text-muted hover:text-fg"><Close /></button>
        {children}
      </div>
    </div>
  );
}

/* ---------- Accordion ---------- */
export function Accordion({ items, className }: { items: { id: string; title: ReactNode; content: ReactNode; meta?: ReactNode }[]; className?: string }) {
  const [open, setOpen] = useState<string | null>(items[0]?.id ?? null);
  return (
    <div className={cn("divide-y divide-[var(--line)] border-y border-line", className)}>
      {items.map((it) => (
        <div key={it.id}>
          <button onClick={() => setOpen(open === it.id ? null : it.id)} aria-expanded={open === it.id} className="flex w-full items-center justify-between gap-4 py-4 text-left">
            <span className="flex items-center gap-3">{it.meta}<span className="font-medium text-fg">{it.title}</span></span>
            <span aria-hidden="true" className={cn("grid h-6 w-6 shrink-0 place-items-center border border-line text-muted transition-transform duration-300", open === it.id && "rotate-45 border-[var(--accent)] text-accent")}>+</span>
          </button>
          <div className="accordion-panel" data-open={open === it.id}><div><div className="pb-5 text-sm leading-relaxed text-muted">{it.content}</div></div></div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Breadcrumbs ---------- */
const crumbNames: Record<string, string> = { aircraft: "Aircraft", engineering: "Engineering", team: "Team", gallery: "Gallery", timeline: "Timeline", sponsors: "Sponsors", news: "News", contact: "Contact", privacy: "Privacy", press: "Press kit" };
export function Breadcrumbs({ extra }: { extra?: string }) {
  const { pathname } = useLocation();
  const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return null;
  return (
    <nav aria-label="Breadcrumb" className="font-mono text-[11px] uppercase tracking-widest text-faint">
      <ol className="flex flex-wrap items-center gap-2">
        <li><Link to="/" className="hover:text-accent">Home</Link></li>
        {parts.map((p, i) => {
          const to = "/" + parts.slice(0, i + 1).join("/"); const last = i === parts.length - 1;
          const name = last && extra ? extra : crumbNames[p] ?? p.replace(/-/g, " ");
          return <li key={to} className="flex items-center gap-2"><span aria-hidden="true">/</span>{last ? <span aria-current="page" className="text-fg">{name}</span> : <Link to={to} className="hover:text-accent">{name}</Link>}</li>;
        })}
      </ol>
    </nav>
  );
}

/* ---------- Page header ---------- */
export function PageHeader({ num, kicker, title, children, crumb }: { num: string; kicker: string; title: string; children?: ReactNode; crumb?: string }) {
  return (
    <header className="relative overflow-hidden border-b border-line pt-28 pb-12 md:pt-36 md:pb-16">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 blueprint-grid opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="container-x relative">
        <Breadcrumbs extra={crumb} />
        <div className="mt-6 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.25em] text-faint"><span className="text-accent">{num}</span><span className="h-px w-6 bg-current opacity-50" /><span>{kicker}</span></div>
        <h1 className="mt-3 text-balance text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl anim-mask-up">{title}</h1>
        {children && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg anim-fade-up" style={{ animationDelay: ".15s" }}>{children}</p>}
      </div>
    </header>
  );
}

/* ---------- Responsive picture with blur-up ---------- */
export function Picture({ id, src, alt, className, ratio = "3/2", sizes = "(min-width:1024px) 50vw, 100vw", priority = false, imgClassName }: { id?: number; src?: string; alt: string; className?: string; ratio?: string; sizes?: string; priority?: boolean; imgClassName?: string }) {
  const [loaded, setLoaded] = useState(false);
  const base = id ? `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb` : null;
  const full = src ?? `${base}&w=1200`;
  const srcSet = base && !src ? `${base}&w=480 480w, ${base}&w=800 800w, ${base}&w=1200 1200w, ${base}&w=1600 1600w` : undefined;
  const blur = base && !src ? `${base}&w=24` : undefined;
  return (
    <div className={cn("relative overflow-hidden bg-sunk", className)} style={{ aspectRatio: ratio }}>
      {blur && <img aria-hidden="true" src={blur} alt="" className={cn("absolute inset-0 h-full w-full scale-110 object-cover blur-xl transition-opacity duration-700", loaded ? "opacity-0" : "opacity-100")} />}
      <img src={full} srcSet={srcSet} sizes={sizes} alt={alt} loading={priority ? "eager" : "lazy"} decoding="async" onLoad={() => setLoaded(true)} className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-700", loaded ? "opacity-100" : "opacity-0", imgClassName)} />
    </div>
  );
}

export function Tag({ children, active, onClick, className }: { children: ReactNode; active?: boolean; onClick?: () => void; className?: string }) {
  return (
    <button onClick={onClick} aria-pressed={active} className={cn("min-h-9 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest transition-colors duration-300", active ? "border-[var(--accent)] bg-[var(--accent)] text-white" : "border-line text-muted hover:border-line-strong hover:text-fg", className)}>{children}</button>
  );
}
