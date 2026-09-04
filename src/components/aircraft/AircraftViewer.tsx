import { lazy, Suspense, useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { hotspots, type Hotspot } from "@/data/aircraft";
import { divisionById } from "@/data/divisions";
import { useCapability, useInView, useReducedMotion, useTheme } from "@/hooks";
import { AircraftWireframe, MeasureLine, EngineeringLabel } from "../graphics";
import { ArrowRight, Close } from "../ui";
import type { ViewName } from "./Aircraft3D";

const Aircraft3D = lazy(() => import("./Aircraft3D"));

const VIEWS: { id: ViewName; label: string }[] = [{ id: "iso", label: "Iso" }, { id: "side", label: "Side" }, { id: "top", label: "Top" }, { id: "front", label: "Front" }];

function HotspotPanel({ h, onClose }: { h: Hotspot; onClose: () => void }) {
  const d = divisionById(h.division);
  return (
    <div className="absolute inset-x-3 bottom-3 z-20 border border-line glass p-4 anim-fade-up sm:left-auto sm:right-3 sm:top-3 sm:bottom-auto sm:w-80">
      <button onClick={onClose} aria-label="Close" className="absolute right-2 top-2 grid h-8 w-8 place-items-center text-muted hover:text-fg"><Close className="h-4 w-4" /></button>
      <EngineeringLabel>{d?.code} · {h.label}</EngineeringLabel>
      <h4 className="mt-2 text-lg font-semibold">{h.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-muted">{h.body}</p>
      <Link to={`/engineering/${h.division}`} className="btn-arrow mt-3 inline-flex items-center gap-2 text-xs font-medium text-accent">{d?.name} division <ArrowRight className="h-3.5 w-3.5" /></Link>
    </div>
  );
}

/* ---------- 2D interactive fallback ---------- */
function Diagram2D({ active, onSelect, annotate }: { active: string | null; onSelect: (id: string) => void; annotate: boolean }) {
  return (
    <div className="relative h-full w-full">
      <AircraftWireframe className="h-full w-full text-fg" />
      {hotspots.map((h) => (
        <button key={h.id} onClick={() => onSelect(h.id)} aria-label={`Show ${h.label} details`} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${h.pos2d[0]}%`, top: `${h.pos2d[1]}%` }}>
          <span className={cn("hotspot-pulse relative grid h-6 w-6 place-items-center rounded-full border", active === h.id ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--accent)] bg-[var(--bg)]")}><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /></span>
          {annotate && <span className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap border border-line glass px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest">{h.label}</span>}
        </button>
      ))}
      {annotate && <><MeasureLine label="b = span" className="absolute inset-x-[4%] bottom-6 justify-between" /><MeasureLine label="l" vertical className="absolute right-[4%] top-1/2 -translate-y-1/2" /></>}
    </div>
  );
}

export default function AircraftViewer({ modelPath, posterId = 8244986, className }: { modelPath?: string; posterId?: number; className?: string }) {
  const cap = useCapability();
  const { reduced } = useReducedMotion();
  const { theme } = useTheme();
  const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.1 });
  const [mode, setMode] = useState<"3d" | "2d">(() => "3d");
  const [view, setView] = useState<ViewName>("iso");
  const [wire, setWire] = useState(false);
  const [annotate, setAnnotate] = useState(true);
  const [reset, setReset] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [modelStatus, setModelStatus] = useState<"loading" | "demo" | "glb">("loading");
  const [fs, setFs] = useState(false);
  const hotspotRefs = useRef(new Map<string, HTMLButtonElement>());
  const wrap = useRef<HTMLDivElement>(null);

  const can3d = cap.webgl && !cap.lowPower;
  const show3d = mode === "3d" && can3d && inView;
  const onModelStatus = useCallback((s: "demo" | "glb") => setModelStatus(s), []);

  const toggleFs = async () => {
    const el = wrap.current; if (!el) return;
    if (!document.fullscreenElement) { await el.requestFullscreen?.(); setFs(true); } else { await document.exitFullscreen(); setFs(false); }
  };
  const h = hotspots.find((x) => x.id === active);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <div ref={wrap} className={cn("relative overflow-hidden border border-line bg-elev", fs && "bg-surface")} style={{ aspectRatio: fs ? undefined : "16/10", height: fs ? "100vh" : undefined }}>
        <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-60" />
        {/* Status labels */}
        <div className="absolute left-3 top-3 z-10 flex flex-wrap gap-2">
          <EngineeringLabel className="glass">{show3d ? "WebGL viewer" : "2D diagram"}</EngineeringLabel>
          {show3d && modelStatus === "demo" && <EngineeringLabel className="glass border-amber-400/60 text-amber-500">Temporary demonstration model — not the team's design</EngineeringLabel>}
          {show3d && modelStatus === "glb" && <EngineeringLabel className="glass border-emerald-400/60 text-emerald-500">Team model loaded</EngineeringLabel>}
        </div>

        {show3d ? (
          <Suspense fallback={<img src={`https://images.pexels.com/photos/${posterId}/pexels-photo-${posterId}.jpeg?auto=compress&cs=tinysrgb&w=1200`} alt="Aircraft preview while the 3D model loads" className="absolute inset-0 h-full w-full object-cover opacity-70" width={1200} height={750} />}>
            <div className="absolute inset-0 cursor-grab active:cursor-grabbing">
              <Aircraft3D view={view} wireframe={wire} autoRotate={!reduced} resetSignal={reset} hotspots={hotspots} hotspotRefs={hotspotRefs} modelPath={modelPath} onModelStatus={onModelStatus} dark={theme === "dark"} />
            </div>
            {/* projected hotspots */}
            {hotspots.map((hs) => (
              <button key={hs.id} ref={(el) => { if (el) hotspotRefs.current.set(hs.id, el); else hotspotRefs.current.delete(hs.id); }} onClick={() => setActive(hs.id)} aria-label={`Show ${hs.label} details`} className="absolute left-0 top-0 z-10 will-change-transform" style={{ opacity: 0 }}>
                <span className={cn("hotspot-pulse relative grid h-6 w-6 place-items-center rounded-full border border-[var(--accent)]", active === hs.id ? "bg-[var(--accent)]" : "bg-[var(--bg)]/70")}><span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" /></span>
                {annotate && <span className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap border border-line glass px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-widest text-fg">{hs.label}</span>}
              </button>
            ))}
          </Suspense>
        ) : (
          <div className="absolute inset-0 p-6 md:p-10"><Diagram2D active={active} onSelect={setActive} annotate={annotate} /></div>
        )}

        {h && <HotspotPanel h={h} onClose={() => setActive(null)} />}

        {/* Controls */}
        <div className="absolute inset-x-3 bottom-3 z-10 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1">
            {show3d && VIEWS.map((v) => <button key={v.id} onClick={() => setView(v.id)} aria-pressed={view === v.id} className={cn("h-9 border px-3 font-mono text-[10px] uppercase tracking-widest glass", view === v.id ? "border-[var(--accent)] text-accent" : "border-line text-muted hover:text-fg")}>{v.label}</button>)}
          </div>
          <div className="flex flex-wrap gap-1">
            <button onClick={() => setWire((w) => !w)} aria-pressed={wire} className={cn("h-9 border px-3 font-mono text-[10px] uppercase tracking-widest glass", wire ? "border-[var(--accent)] text-accent" : "border-line text-muted")}>{wire ? "Solid" : "Wireframe"}</button>
            <button onClick={() => setAnnotate((a) => !a)} aria-pressed={annotate} className={cn("h-9 border px-3 font-mono text-[10px] uppercase tracking-widest glass", annotate ? "border-[var(--accent)] text-accent" : "border-line text-muted")}>Annotate</button>
            {show3d && <button onClick={() => { setView("iso"); setReset((r) => r + 1); }} className="h-9 border border-line px-3 font-mono text-[10px] uppercase tracking-widest glass text-muted hover:text-fg">Reset</button>}
            {can3d && <button onClick={() => setMode((m) => (m === "3d" ? "2d" : "3d"))} className="h-9 border border-line px-3 font-mono text-[10px] uppercase tracking-widest glass text-muted hover:text-fg">{mode === "3d" ? "2D" : "3D"}</button>}
            <button onClick={toggleFs} aria-label="Toggle full-screen viewer" className="grid h-9 w-9 place-items-center border border-line glass text-muted hover:text-fg"><svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg></button>
          </div>
        </div>
      </div>
      <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-faint">{can3d ? "Drag to rotate · scroll or pinch to zoom · click hotspots for details" : "Interactive 2D diagram (3D disabled on this device) · tap hotspots for details"}</p>
    </div>
  );
}
