import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { useInView, useReducedMotion } from "@/hooks";
import { Heading } from "../ui";
import { RadarSweep, TelemetryGraph, StatusDot } from "../graphics";

/* Deterministic flight profile: t in seconds (0..240), loops. Not real data. */
const DURATION = 240;
const PHASES = [
  { until: 20, name: "PRE-FLIGHT" }, { until: 40, name: "TAKE-OFF" }, { until: 90, name: "CLIMB" },
  { until: 170, name: "MISSION LEG" }, { until: 215, name: "DESCENT" }, { until: 240, name: "LANDING" },
];
function sample(t: number) {
  const s = (f: number, ph = 0) => Math.sin(t * f + ph);
  const climb = Math.min(1, Math.max(0, (t - 30) / 60));
  const descend = Math.min(1, Math.max(0, (t - 170) / 60));
  const alt = Math.max(0, 120 * climb * (1 - descend) + 3 * s(0.9)) ;
  const ias = t < 20 ? 0 : t < 40 ? ((t - 20) / 20) * 14 : 16 + 2 * s(0.4) - 6 * descend + (t > 232 ? -(t - 232) : 0);
  const batt = 25.2 - (t / DURATION) * 3.2 - (ias > 5 ? 0.35 : 0) + 0.05 * s(2);
  const amps = t < 20 ? 0.6 : t < 90 ? 32 + 4 * s(1.3) : t < 170 ? 18 + 3 * s(0.7) : 8 + 2 * s(1.1);
  const heading = (90 + (t > 40 ? ((t - 40) * 2.2) % 360 : 0)) % 360;
  const roll = t < 40 ? 0 : 12 * s(0.25) + 2 * s(1.7);
  const pitch = t < 20 ? 0 : t < 40 ? 4 : t < 90 ? 9 + s(1.1) : t < 170 ? 2 + s(0.8) : -4 + s(0.9);
  const yaw = 1.5 * s(0.6);
  const phase = PHASES.find((p) => t < p.until)?.name ?? "LANDING";
  return { alt, ias: Math.max(0, ias), batt, amps: Math.max(0, amps), heading, roll, pitch, yaw, phase, sats: t < 8 ? 6 : 14, rssi: 88 - 12 * climb + 3 * s(0.5) };
}

function Gauge({ value, min, max, label, unit, color = "var(--accent)" }: { value: number; min: number; max: number; label: string; unit: string; color?: string }) {
  const p = Math.min(1, Math.max(0, (value - min) / (max - min)));
  const r = 40, c = Math.PI * r; // half circle
  return (
    <div className="flex flex-col items-center">
      <svg aria-hidden="true" viewBox="0 0 100 60" className="w-full max-w-[140px]">
        <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke="currentColor" strokeOpacity=".15" strokeWidth="6" />
        <path d="M10 55 A40 40 0 0 1 90 55" fill="none" stroke={color} strokeWidth="6" strokeDasharray={c} strokeDashoffset={c * (1 - p)} strokeLinecap="butt" style={{ transition: "stroke-dashoffset .4s ease-out" }} />
        {[0, 0.25, 0.5, 0.75, 1].map((f) => { const a = Math.PI * (1 - f); return <line key={f} x1={50 + 33 * Math.cos(a)} y1={55 - 33 * Math.sin(a)} x2={50 + 30 * Math.cos(a)} y2={55 - 30 * Math.sin(a)} stroke="currentColor" strokeOpacity=".4" />; })}
        <text x="50" y="50" textAnchor="middle" fontSize="15" fontFamily="var(--font-mono)" fontWeight="600" fill="currentColor">{value.toFixed(value < 10 ? 1 : 0)}</text>
      </svg>
      <div className="font-mono text-[10px] uppercase tracking-widest text-faint">{label} <span className="text-muted">{unit}</span></div>
    </div>
  );
}

function AttitudeIndicator({ roll, pitch }: { roll: number; pitch: number }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" className="h-28 w-28">
      <defs><clipPath id="ai-clip"><circle cx="60" cy="60" r="50" /></clipPath></defs>
      <g clipPath="url(#ai-clip)">
        <g style={{ transform: `rotate(${-roll}deg) translateY(${pitch * 1.6}px)`, transformOrigin: "60px 60px", transition: "transform .4s ease-out" }}>
          <rect x="-40" y="-100" width="200" height="160" fill="#2b5c8f" /><rect x="-40" y="60" width="200" height="160" fill="#6b4a1f" />
          <line x1="-40" y1="60" x2="160" y2="60" stroke="#fff" strokeWidth="1" />
          {[-20, -10, 10, 20].map((d) => <g key={d}><line x1={60 - (d % 20 === 0 ? 16 : 10)} y1={60 - d * 1.6} x2={60 + (d % 20 === 0 ? 16 : 10)} y2={60 - d * 1.6} stroke="#fff" strokeWidth=".8" /></g>)}
        </g>
      </g>
      <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeOpacity=".4" />
      <path d="M30 60h18M72 60h18M60 60v6" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="60" cy="60" r="2" fill="var(--accent)" />
    </svg>
  );
}

export default function MissionControl() {
  const { reduced, toggle, userReduced } = useReducedMotion();
  const [ref, inView] = useInView<HTMLElement>({ threshold: 0.1 }, false);
  const [t, setT] = useState(0);
  const [paused, setPaused] = useState(false);
  const hist = useRef<{ alt: number[]; ias: number[]; amps: number[] }>({ alt: Array(60).fill(0), ias: Array(60).fill(0), amps: Array(60).fill(0) });

  useEffect(() => {
    if (paused || !inView) return;
    if (reduced) { setT(120); return; }
    let raf = 0, last = performance.now(), acc = 0;
    const tick = (now: number) => {
      const dt = (now - last) / 1000; last = now; acc += dt;
      if (acc > 0.1) { setT((v) => (v + acc * 3) % DURATION); acc = 0; }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [paused, inView, reduced]);

  const d = useMemo(() => sample(t), [t]);
  useEffect(() => { const h = hist.current; h.alt = [...h.alt.slice(1), d.alt]; h.ias = [...h.ias.slice(1), d.ias]; h.amps = [...h.amps.slice(1), d.amps]; }, [d]);

  const mm = String(Math.floor(t / 60)).padStart(2, "0"), ss = String(Math.floor(t % 60)).padStart(2, "0");

  return (
    <section ref={ref} id="mission-control" className="relative overflow-hidden bg-navy-950 py-24 text-white md:py-32">
      <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-70 [--grid:rgba(142,160,201,.08)]" />
      <div className="container-x relative">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Heading num="04" kicker="Mission control" title="Telemetry, visualised." light className="mb-0">
            An interactive avionics demonstration modelled on the ground-station view the flight-test crew uses during a sortie.
          </Heading>
          <div className="flex flex-wrap items-center gap-2">
            <button onClick={() => setPaused((p) => !p)} className="h-10 border border-white/25 px-4 font-mono text-[10px] uppercase tracking-widest hover:border-white/60" aria-pressed={paused}>{paused ? "Resume" : "Pause"}</button>
            <button onClick={() => { setT(0); hist.current = { alt: Array(60).fill(0), ias: Array(60).fill(0), amps: Array(60).fill(0) }; setPaused(false); }} className="h-10 border border-white/25 px-4 font-mono text-[10px] uppercase tracking-widest hover:border-white/60">Restart</button>
            <button onClick={toggle} className="h-10 border border-white/25 px-4 font-mono text-[10px] uppercase tracking-widest hover:border-white/60" aria-pressed={userReduced}>{userReduced ? "Motion: reduced" : "Reduce motion"}</button>
          </div>
        </div>

        <div role="note" className="mt-8 flex items-center gap-3 border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[.2em] text-amber-200 md:text-[11px]">
          <StatusDot status="pending" />INTERACTIVE AVIONICS DEMONSTRATION — NOT LIVE FLIGHT DATA
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-12">
          {/* Primary */}
          <div className="grid grid-cols-2 gap-4 lg:col-span-8 lg:grid-cols-4">
            {[
              { l: "Altitude", v: d.alt.toFixed(1), u: "m AGL", data: hist.current.alt, max: 130 },
              { l: "Airspeed", v: d.ias.toFixed(1), u: "m/s", data: hist.current.ias, max: 22 },
              { l: "Battery", v: d.batt.toFixed(2), u: "V · 6S", data: undefined, max: 0 },
              { l: "Motor current", v: d.amps.toFixed(1), u: "A", data: hist.current.amps, max: 40 },
            ].map((c) => (
              <div key={c.l} className="tech-border border border-white/15 bg-white/[.03] p-4">
                <div className="font-mono text-[10px] uppercase tracking-widest text-white/50">{c.l}</div>
                <div className="mt-1 font-mono text-2xl font-semibold tabular-nums md:text-3xl">{c.v}<span className="ml-1 text-xs font-normal text-white/50">{c.u}</span></div>
                {c.data ? <TelemetryGraph data={c.data} min={0} max={c.max} className="mt-3 h-10" /> : (
                  <div className="mt-3 flex h-10 items-end gap-0.5">{Array.from({ length: 6 }).map((_, i) => { const frac = (d.batt - 21.0) / (25.2 - 21.0); return <span key={i} className={cn("flex-1 transition-colors", i / 6 < frac ? (frac < 0.3 ? "bg-amber-400/80" : "bg-emerald-400/80") : "bg-white/10")} style={{ height: `${40 + i * 10}%` }} />; })}</div>
                )}
              </div>
            ))}
            <div className="col-span-2 grid grid-cols-3 gap-4 border border-white/15 bg-white/[.03] p-4 lg:col-span-4">
              <Gauge value={d.roll} min={-45} max={45} label="Roll" unit="°" />
              <Gauge value={d.pitch} min={-20} max={20} label="Pitch" unit="°" color="#38bdf8" />
              <Gauge value={d.yaw} min={-10} max={10} label="Yaw" unit="°/s" color="#34d399" />
            </div>
          </div>
          {/* Status column */}
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
            <div className="flex items-center gap-4 border border-white/15 bg-white/[.03] p-4">
              <AttitudeIndicator roll={d.roll} pitch={d.pitch} />
              <div className="font-mono text-[11px] uppercase tracking-widest">
                <div className="text-white/50">Flight phase</div><div className="mt-1 text-base text-[var(--accent)]">{d.phase}</div>
                <div className="mt-3 text-white/50">T+</div><div className="tabular-nums text-base">{mm}:{ss}</div>
              </div>
            </div>
            <div className="border border-white/15 bg-white/[.03] p-4 font-mono text-[11px] uppercase tracking-widest">
              <div className="flex items-center justify-between py-1.5"><span className="text-white/50">Heading</span><span className="tabular-nums">{d.heading.toFixed(0).padStart(3, "0")}°</span></div>
              <div className="flex items-center justify-between py-1.5"><span className="text-white/50">GPS</span><span className="flex items-center gap-2"><StatusDot status={d.sats > 8 ? "active" : "pending"} />{d.sats} SAT · 3D FIX</span></div>
              <div className="flex items-center justify-between py-1.5"><span className="text-white/50">Link</span><span className="flex items-center gap-2"><StatusDot status="active" />RSSI {d.rssi.toFixed(0)}%</span></div>
              <div className="flex items-center justify-between py-1.5"><span className="text-white/50">Mode</span><span>{d.phase === "PRE-FLIGHT" ? "STABILIZE" : "FBWA"}</span></div>
              <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3"><span className="text-white/50">Ground track</span><RadarSweep size={64} /></div>
            </div>
          </div>
        </div>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-white/40">Deterministic simulation for interface demonstration. Values do not represent measured aircraft performance.</p>
      </div>
    </section>
  );
}
