import { useEffect, useRef } from "react";
import { cn } from "@/utils/cn";

/* All components here are decorative and aria-hidden. */

export function BlueprintGrid({ className, animated = false }: { className?: string; animated?: boolean }) {
  return <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 blueprint-grid", animated && "blueprint-grid-animated", className)} />;
}

/** Slow animated aircraft flight path (dashed) */
export function FlightPath({ className, d = "M -50 380 C 200 300, 380 120, 700 160 S 1150 60, 1500 -20", trail = true }: { className?: string; d?: string; trail?: boolean }) {
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} viewBox="0 0 1440 400" preserveAspectRatio="none" fill="none">
      <path d={d} stroke="var(--fg-faint)" strokeOpacity=".35" strokeWidth="1" className="anim-flight-dash" />
      {trail && <path d={d} stroke="var(--accent)" strokeWidth="1.5" className="anim-trail" strokeLinecap="round" />}
    </svg>
  );
}

/** Phoenix-inspired energy trail */
export function EnergyTrail({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={cn("pointer-events-none", className)} viewBox="0 0 600 120" fill="none">
      <defs><linearGradient id="et" x1="0" x2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity="0" /><stop offset=".6" stopColor="var(--accent)" /><stop offset="1" stopColor="#ffd166" /></linearGradient></defs>
      <path d="M0 80 C 150 20, 250 110, 400 50 S 560 30, 600 40" stroke="url(#et)" strokeWidth="2" className="anim-trail" />
      <path d="M0 95 C 160 40, 260 120, 410 65 S 570 45, 600 55" stroke="url(#et)" strokeWidth="1" opacity=".5" className="anim-trail" style={{ animationDelay: "-2s" }} />
    </svg>
  );
}

export function RadarSweep({ size = 160, className }: { size?: number; className?: string }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 100 100" className={cn("pointer-events-none", className)}>
      {[48, 36, 24, 12].map((r) => <circle key={r} cx="50" cy="50" r={r} fill="none" stroke="var(--fg-faint)" strokeOpacity=".35" strokeWidth=".5" />)}
      <path d="M50 2 V98 M2 50 H98" stroke="var(--fg-faint)" strokeOpacity=".3" strokeWidth=".5" />
      <g className="anim-radar"><path d="M50 50 L50 2 A48 48 0 0 1 84 16 Z" fill="var(--accent)" fillOpacity=".25" /><line x1="50" y1="50" x2="50" y2="2" stroke="var(--accent)" strokeWidth="1" /></g>
      <circle cx="66" cy="30" r="1.6" fill="var(--accent)" className="anim-blink" />
      <circle cx="34" cy="62" r="1.2" fill="var(--signal-500, #38d9a9)" className="anim-blink" style={{ animationDelay: ".6s" }} />
    </svg>
  );
}

/** Top-view aircraft wireframe illustration (schematic, not the real design) */
export function AircraftWireframe({ className, stroke = "currentColor", detail = true }: { className?: string; stroke?: string; detail?: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 400 300" fill="none" className={cn(className)} stroke={stroke} strokeWidth="1.2" strokeLinejoin="round">
      {/* fuselage */}
      <path d="M200 20 C 208 40, 210 70, 210 100 L 212 230 C 212 250, 206 268, 200 280 C 194 268, 188 250, 188 230 L 190 100 C 190 70, 192 40, 200 20 Z" />
      {/* propeller */}
      <path d="M200 20 L 200 8 M 170 12 Q 200 20 230 12" opacity=".7" />
      <circle cx="200" cy="18" r="3" />
      {/* canopy */}
      <path d="M195 60 Q 200 50 205 60 L 206 90 Q 200 94 194 90 Z" opacity=".8" />
      {/* main wing */}
      <path d="M 210 105 L 385 118 L 388 134 L 210 148 Z M 190 105 L 15 118 L 12 134 L 190 148 Z" />
      {/* flaps / ailerons */}
      <path d="M 300 128 L 385 126 M 300 128 L 300 146 M 100 128 L 15 126 M 100 128 L 100 146" opacity=".7" />
      {/* tail */}
      <path d="M 210 238 L 268 250 L 270 262 L 212 264 Z M 190 238 L 132 250 L 130 262 L 188 264 Z" />
      {/* vertical fin */}
      <path d="M 200 236 L 200 270 M 197 240 L 203 240" opacity=".8" />
      {detail && (
        <g opacity=".5" strokeDasharray="3 4">
          <path d="M 200 8 V 292" />
          <path d="M 12 126 H 388" />
          {/* rib stations */}
          {Array.from({ length: 6 }).map((_, i) => <path key={i} d={`M ${230 + i * 26} 107 V 146 M ${170 - i * 26} 107 V 146`} />)}
        </g>
      )}
    </svg>
  );
}

/** Wing-section (airfoil) diagram */
export function WingSection({ className, label = "AP-2 root section" }: { className?: string; label?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 320 120" fill="none" className={cn(className)}>
      <path d="M10 70 C 40 20, 120 10, 200 30 C 250 42, 300 60, 312 68 C 300 72, 250 78, 200 76 C 120 78, 40 88, 10 70 Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M10 70 C 80 62, 200 50, 312 68" stroke="var(--accent)" strokeWidth="1" strokeDasharray="4 4" />
      <path d="M10 100 H 312" stroke="currentColor" strokeOpacity=".5" strokeWidth=".8" />
      <path d="M10 96 V 104 M312 96 V 104" stroke="currentColor" strokeOpacity=".5" strokeWidth=".8" />
      <text x="160" y="112" textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="currentColor" opacity=".7">c = 100 %</text>
      <text x="40" y="20" fontSize="8" fontFamily="var(--font-mono)" fill="currentColor" opacity=".7">{label}</text>
      {[0.25, 0.5, 0.75].map((f) => <path key={f} d={`M ${10 + 302 * f} 22 V 90`} stroke="currentColor" strokeOpacity=".2" strokeDasharray="2 3" />)}
    </svg>
  );
}

/** Technical measurement line */
export function MeasureLine({ label, className, vertical = false }: { label: string; className?: string; vertical?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-faint", vertical && "flex-col", className)}>
      <span className={cn("block bg-current", vertical ? "h-8 w-px" : "h-px w-8")} />
      <span className="relative"><span className="absolute -left-1 top-1/2 h-2 w-px -translate-y-1/2 bg-current" />{label}<span className="absolute -right-1 top-1/2 h-2 w-px -translate-y-1/2 bg-current" /></span>
      <span className={cn("block bg-current", vertical ? "h-8 w-px" : "h-px w-8")} />
    </div>
  );
}

/** Telemetry sparkline graph */
export function TelemetryGraph({ data, className, color = "var(--accent)", min, max, h = 48 }: { data: number[]; className?: string; color?: string; min?: number; max?: number; h?: number }) {
  const lo = min ?? Math.min(...data), hi = max ?? Math.max(...data);
  const range = hi - lo || 1;
  const w = 200;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - lo) / range) * (h - 4) - 2}`).join(" ");
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" className={cn("h-12 w-full", className)}>
      <defs><linearGradient id={`tg-${color}`} x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor={color} stopOpacity=".35" /><stop offset="1" stopColor={color} stopOpacity="0" /></linearGradient></defs>
      {[0.25, 0.5, 0.75].map((f) => <line key={f} x1="0" x2={w} y1={h * f} y2={h * f} stroke="currentColor" strokeOpacity=".12" />)}
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#tg-${color})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

/** Coordinate tick numbers along an edge */
export function CoordinateTicks({ className, count = 12, vertical = false }: { className?: string; count?: number; vertical?: boolean }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none flex justify-between font-mono text-[9px] tracking-widest text-faint/70", vertical && "flex-col", className)}>
      {Array.from({ length: count }).map((_, i) => <span key={i} className={cn("flex items-center gap-1", vertical && "flex-row")}><span className={cn("bg-current", vertical ? "h-px w-2" : "h-2 w-px")} />{String(i * 10).padStart(3, "0")}</span>)}
    </div>
  );
}

/** Section number label such as "01 / MISSION" */
export function SectionLabel({ num, label, className, light = false }: { num: string; label: string; className?: string; light?: boolean }) {
  return (
    <div className={cn("flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.25em]", light ? "text-white/70" : "text-faint", className)}>
      <span className="text-accent">{num}</span><span className="h-px w-6 bg-current opacity-50" /><span>{label}</span>
    </div>
  );
}

export function StatusDot({ status = "active", className }: { status?: "active" | "pending" | "planned" | "warn"; className?: string }) {
  const c = { active: "bg-emerald-400", pending: "bg-amber-400", planned: "bg-sky-400", warn: "bg-red-400" }[status];
  return <span aria-hidden="true" className={cn("relative inline-flex h-2 w-2", className)}><span className={cn("absolute inset-0 rounded-full opacity-60 anim-blink", c)} /><span className={cn("relative inline-flex h-2 w-2 rounded-full", c)} /></span>;
}

export function MissionBadge({ code, label, className }: { code: string; label: string; className?: string }) {
  return (
    <div className={cn("inline-flex items-center gap-2 border border-line-strong px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest", className)}>
      <svg aria-hidden="true" width="12" height="12" viewBox="0 0 24 24" fill="var(--accent)"><path d="M12 2 L21 17 L12 13.5 L3 17 Z" /></svg>
      <span className="text-accent">{code}</span><span className="text-muted">{label}</span>
    </div>
  );
}

export function EngineeringLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-block border border-line px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-muted", className)}>{children}</span>;
}

/** Phoenix emblem (SVG) */
export function Emblem({ className, size = 48 }: { className?: string; size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 64 64" className={className} fill="none">
      <path d="M32 6 L56 46 L32 36 L8 46 Z" fill="var(--accent)" />
      <path d="M32 36 L44 58 L32 52 L20 58 Z" fill="var(--accent)" opacity=".55" />
      <path d="M8 46 C 18 40, 26 34, 32 22 C 38 34, 46 40, 56 46" stroke="#ffd166" strokeWidth="1.2" opacity=".9" />
    </svg>
  );
}

/** Lightweight wind-flow particle canvas (rAF, density-aware, pauses when hidden) */
export function WindParticles({ className, density = 60, speed = 0.6, enabled = true }: { className?: string; density?: number; speed?: number; enabled?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current; if (!canvas || !enabled) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    let raf = 0, running = true, w = 0, h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    type P = { x: number; y: number; v: number; l: number; a: number };
    let ps: P[] = [];
    const reset = () => {
      const r = canvas.getBoundingClientRect(); w = r.width; h = r.height;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ps = Array.from({ length: density }, () => ({ x: Math.random() * w, y: Math.random() * h, v: (0.4 + Math.random()) * speed, l: 20 + Math.random() * 60, a: 0.1 + Math.random() * 0.3 }));
    };
    const style = getComputedStyle(document.documentElement);
    const draw = () => {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      const color = style.getPropertyValue("--fg-faint").trim() || "#8ea0c9";
      for (const p of ps) {
        p.x += p.v; if (p.x - p.l > w) { p.x = -p.l; p.y = Math.random() * h; }
        const yOff = Math.sin((p.x + p.y) * 0.01) * 4;
        ctx.strokeStyle = color; ctx.globalAlpha = p.a; ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x - p.l, p.y + yOff); ctx.lineTo(p.x, p.y + yOff); ctx.stroke();
      }
      raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) { cancelAnimationFrame(raf); raf = requestAnimationFrame(draw); } });
    io.observe(canvas);
    reset(); raf = requestAnimationFrame(draw);
    const ro = new ResizeObserver(reset); ro.observe(canvas);
    return () => { running = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, [density, speed, enabled]);
  if (!enabled) return null;
  return <canvas ref={ref} aria-hidden="true" className={cn("pointer-events-none absolute inset-0 h-full w-full", className)} />;
}

/** Vertical flight-stage indicator */
export function FlightStageIndicator({ stages, active, className }: { stages: string[]; active: number; className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex flex-col gap-5 font-mono text-[10px] uppercase tracking-widest", className)}>
      {stages.map((s, i) => (
        <div key={s} className="flex items-center gap-3">
          <span className={cn("h-px transition-all duration-500", i === active ? "w-6 bg-[var(--accent)]" : "w-3 bg-white/40")} />
          <span className={cn("transition-colors duration-500", i === active ? "text-white" : "text-white/40")}>{s}</span>
        </div>
      ))}
    </div>
  );
}
