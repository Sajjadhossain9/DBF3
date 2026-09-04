import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { divisions } from "@/data/divisions";
import { team } from "@/data/team";
import { stages } from "@/data/aircraft";
import { Heading, Picture, ArrowRight, Accordion } from "../ui";
import { EngineeringLabel as _E } from "../graphics";

/* Node positions on a 100×60 layout grid */
const POS: Record<string, [number, number]> = {
  management: [50, 8], aerodynamics: [18, 26], structures: [40, 30], propulsion: [62, 26], avionics: [84, 30],
  payload: [30, 52], manufacturing: [52, 54], "flight-test": [76, 52],
};

export default function CommandCentre({ compact = false }: { compact?: boolean }) {
  const [sel, setSel] = useState(divisions[0].id);
  const d = divisions.find((x) => x.id === sel)!;
  const members = useMemo(() => team.filter((m) => m.division === sel && m.season === "2025-26"), [sel]);
  const lead = members.find((m) => m.tier !== "member");
  const links = useMemo(() => divisions.flatMap((a) => a.connections.filter((b) => a.id < b).map((b) => [a.id, b] as const)), []);

  const detail = (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} /><span className="font-mono text-[10px] uppercase tracking-widest text-faint">{d.code}</span></div>
        <h3 className="mt-2 text-2xl font-semibold tracking-tight">{d.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">{d.summary}</p>
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">Responsibilities</div>
        <ul className="mt-2 space-y-1.5 text-sm text-muted">{d.responsibilities.map((r) => <li key={r} className="flex gap-2"><span className="mt-2 h-px w-3 shrink-0 bg-[var(--accent)]" />{r}</li>)}</ul>
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">Tools & technologies</div>
        <div className="mt-2 flex flex-wrap gap-1.5">{d.tools.map((t) => <_E key={t}>{t}</_E>)}</div>
      </div>
      <div>
        <Picture id={d.image} alt={`${d.name} at work`} ratio="16/10" className="border border-line" />
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">Lead & members</div>
        <div className="mt-2 text-sm"><span className="font-medium">{lead?.name ?? "Lead pending"}</span> <span className="text-faint">· {lead?.role ?? d.name}</span></div>
        <div className="mt-1 text-xs text-muted">{members.filter((m) => m.tier === "member").length} members · {members.filter((m) => m.tier === "member").map((m) => m.name.replace("Team Member ", "#")).join(", ") || "roster pending"}</div>
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">Pipeline position</div>
        <div className="mt-2 flex gap-1">{stages.map((s) => <span key={s.n} title={s.title} className={cn("h-6 flex-1 border text-center font-mono text-[9px] leading-6", d.stages.includes(s.n) ? "border-transparent text-white" : "border-line text-faint")} style={d.stages.includes(s.n) ? { background: d.color } : undefined}>{s.n}</span>)}</div>
        <Link to={`/engineering/${d.id}`} className="btn-arrow mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">Open division page <ArrowRight /></Link>
      </div>
    </div>
  );

  return (
    <section id="command-centre" className="relative bg-surface py-24 md:py-32">
      <div className="container-x">
        {!compact && <Heading num="05" kicker="Engineering command centre" title="Eight divisions, one pipeline.">Select a division to see its responsibilities, people, tools and where it sits in the development pipeline.</Heading>}

        {/* Desktop map */}
        <div className="hidden lg:block">
          <div className="relative border border-line bg-elev" style={{ aspectRatio: "100/60" }}>
            <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-70" />
            <svg aria-hidden="true" className="absolute inset-0 h-full w-full" viewBox="0 0 100 60" preserveAspectRatio="none" fill="none">
              {links.map(([a, b]) => { const [x1, y1] = POS[a], [x2, y2] = POS[b]; const on = a === sel || b === sel; return (
                <g key={a + b}><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? d.color : "var(--line-strong)"} strokeWidth={on ? 0.35 : 0.15} vectorEffect="non-scaling-stroke" style={{ transition: "stroke .4s" }} />
                  {on && <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="0.3" strokeDasharray="1 3" className="anim-flight-dash" vectorEffect="non-scaling-stroke" />}</g>); })}
            </svg>
            {divisions.map((x) => { const [px, py] = POS[x.id]; const on = x.id === sel; return (
              <button key={x.id} onClick={() => setSel(x.id)} aria-pressed={on} className={cn("absolute -translate-x-1/2 -translate-y-1/2 border px-3 py-2 text-left transition-[transform,border-color,background-color] duration-300 hover:-translate-y-[calc(50%+2px)]", on ? "border-transparent text-white shadow-xl" : "glass border-line text-fg")} style={{ left: `${px}%`, top: `${py}%`, background: on ? x.color : undefined }}>
                <div className={cn("font-mono text-[9px] uppercase tracking-widest", on ? "text-white/80" : "text-faint")}>{x.code}</div>
                <div className="text-xs font-semibold">{x.short}</div>
                {on && <span className="hotspot-pulse absolute -right-1 -top-1 h-3 w-3 rounded-full bg-white" />}
              </button>); })}
            {/* pipeline strip */}
            <div className="absolute inset-x-6 bottom-4 flex items-center gap-1">
              <span className="mr-2 font-mono text-[9px] uppercase tracking-widest text-faint">Pipeline</span>
              {stages.map((s) => <span key={s.n} className={cn("h-1.5 flex-1 transition-colors duration-500", d.stages.includes(s.n) ? "" : "bg-[var(--line)]")} style={d.stages.includes(s.n) ? { background: d.color } : undefined} />)}
            </div>
          </div>
          <div className="mt-6 border border-line bg-elev p-6 md:p-8">{detail}</div>
        </div>

        {/* Mobile accordion */}
        <div className="lg:hidden">
          <Accordion items={divisions.map((x) => ({ id: x.id, title: x.name, meta: <span className="h-2 w-2 rounded-full" style={{ background: x.color }} />, content: (
            <div>
              <p>{x.summary}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">{x.tools.map((t) => <_E key={t}>{t}</_E>)}</div>
              <div className="mt-3 flex gap-1">{stages.map((s) => <span key={s.n} className={cn("h-5 flex-1 border text-center font-mono text-[9px] leading-5", x.stages.includes(s.n) ? "border-transparent text-white" : "border-line text-faint")} style={x.stages.includes(s.n) ? { background: x.color } : undefined}>{s.n}</span>)}</div>
              <Link to={`/engineering/${x.id}`} className="btn-arrow mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">Open division page <ArrowRight /></Link>
            </div>) }))} />
        </div>
      </div>
    </section>
  );
}
