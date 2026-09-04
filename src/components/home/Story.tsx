import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { stages, type Stage } from "@/data/aircraft";
import { divisionById } from "@/data/divisions";
import { Heading, Picture, ArrowRight } from "../ui";
import { AircraftWireframe, WingSection, EngineeringLabel } from "../graphics";

/* Stage-specific schematic (SVG, lightweight) */
function Drawing({ kind }: { kind: Stage["drawing"] }) {
  const c = "stroke-current text-white";
  switch (kind) {
    case "mission": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1"><rect x="20" y="20" width="160" height="80" strokeDasharray="4 3" /><path d="M30 40h60M30 52h90M30 64h70M30 76h100" /><circle cx="160" cy="40" r="8" /><path d="M156 40l3 3 5-6" /></svg>);
    case "concept": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1"><path d="M40 60h120M100 20v80" strokeDasharray="3 3" opacity=".5" /><path d="M100 30l50 30-50 30-50-30z" /><path d="M100 45l25 15-25 15-25-15z" opacity=".6" /><circle cx="150" cy="60" r="3" fill="var(--accent)" /></svg>);
    case "cad": return (<AircraftWireframe className="h-full w-full text-white" />);
    case "cfd": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1">{Array.from({ length: 7 }).map((_, i) => <path key={i} d={`M0 ${20 + i * 13} C 60 ${20 + i * 13 - 8}, 90 ${60 - Math.abs(i - 3) * 6}, 200 ${20 + i * 13}`} opacity={0.3 + i * 0.1} className="anim-flight-dash" />)}<path d="M70 62 C 90 50, 130 50, 150 62 C 130 66, 90 66, 70 62Z" fill="var(--accent)" fillOpacity=".4" stroke="var(--accent)" /></svg>);
    case "fea": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth=".8">{Array.from({ length: 10 }).map((_, i) => <path key={i} d={`M${20 + i * 16} 40 L${20 + i * 16} 80`} opacity=".5" />)}{Array.from({ length: 4 }).map((_, i) => <path key={i} d={`M20 ${40 + i * 13} H164`} opacity=".5" />)}<rect x="20" y="40" width="144" height="40" /><path d="M20 40 Q 92 20 164 40" stroke="var(--accent)" strokeDasharray="3 2" /><path d="M164 60l14 0M178 55v10" /><text x="30" y="100" fontSize="7" fontFamily="var(--font-mono)" fill="currentColor">σ max @ root · SF 1.5</text></svg>);
    case "material": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1"><path d="M30 30h140v10H30zM30 45h140v10H30zM30 60h140v10H30zM30 75h140v10H30z" /><path d="M30 30l140 10M30 45l140 10M30 60l140 10M30 75l140 10" opacity=".4" /><text x="30" y="100" fontSize="7" fontFamily="var(--font-mono)" fill="currentColor">[0/±45/90]s · CFRP / GFRP / BALSA CORE</text></svg>);
    case "mfg": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1"><path d="M20 90h160" /><path d="M40 90v-40h120v40" /><path d="M60 50v-15h80v15" opacity=".7" /><circle cx="100" cy="30" r="6" stroke="var(--accent)" /><path d="M100 24v-14M96 14h8" stroke="var(--accent)" /><path d="M50 70h100" strokeDasharray="2 3" /></svg>);
    case "avionics": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1"><rect x="70" y="40" width="60" height="40" /><rect x="20" y="20" width="30" height="16" /><rect x="20" y="84" width="30" height="16" /><rect x="150" y="20" width="30" height="16" /><rect x="150" y="84" width="30" height="16" /><path d="M50 28h20v12M50 92h20v-12M150 28h-20v12M150 92h-20v-12" className="anim-flight-dash" /><circle cx="100" cy="60" r="4" fill="var(--accent)" className="anim-blink" /></svg>);
    case "ground": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1"><path d="M20 90h160" /><path d="M60 90v-30h80v30" /><path d="M100 60V40M80 40h40" /><path d="M20 40h30M20 50h20M20 60h25" stroke="var(--accent)" className="anim-flight-dash" /><text x="130" y="105" fontSize="7" fontFamily="var(--font-mono)" fill="currentColor">T = ---- N</text></svg>);
    case "flight": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1"><path d="M10 100 C 40 60, 60 40, 100 40 S 160 60, 190 20" className="anim-flight-dash" /><path d="M10 100 C 40 60, 60 40, 100 40 S 160 60, 190 20" stroke="var(--accent)" className="anim-trail" /><path d="M10 110h180" opacity=".4" /><text x="14" y="30" fontSize="7" fontFamily="var(--font-mono)" fill="currentColor">ALT · IAS · CLIMB · STALL</text></svg>);
    case "comp": return (<svg aria-hidden="true" viewBox="0 0 200 120" fill="none" className={cn("h-full w-full", c)} strokeWidth="1"><rect x="30" y="30" width="140" height="60" strokeDasharray="4 3" /><path d="M40 80h30v-30h-30zM85 80h30v-45h-30zM130 80h30v-20h-30z" /><path d="M85 35h30v0" stroke="var(--accent)" /><text x="40" y="105" fontSize="7" fontFamily="var(--font-mono)" fill="currentColor">M1 · M2 · M3 · GROUND MISSION</text></svg>);
  }
}

export default function Story() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i)); });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const s = stages[active];
  const div = divisionById(s.division);

  return (
    <section id="story" className="relative bg-surface py-24 md:py-32">
      <div className="container-x">
        <Heading num="02" kicker="From mission to flight" title="Eleven stages. One aircraft.">
          Every aircraft follows the same disciplined pipeline — from decoding the rules to the scored mission. Scroll to follow the process.
        </Heading>
      </div>
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-16">
        {/* Sticky media panel */}
        <div className="lg:col-span-6">
          <div className="sticky top-24 hidden lg:block">
            <div className="relative overflow-hidden border border-line bg-navy-950 text-white" style={{ aspectRatio: "4/3" }}>
              {stages.map((st, i) => (
                <div key={st.n} aria-hidden={i !== active} className={cn("absolute inset-0 transition-[opacity,transform] duration-700 [transition-timing-function:var(--ease-out-expo)]", i === active ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]")}>
                  {Math.abs(i - active) <= 1 && <Picture id={st.image} alt={st.title} ratio="4/3" className="h-full w-full" imgClassName="opacity-70" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-navy-950/40" />
                  <div className="absolute right-5 top-5 h-28 w-44 opacity-90"><Drawing kind={st.drawing} /></div>
                </div>
              ))}
              <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[.3em] text-white/70">Stage {String(s.n).padStart(2, "0")} / 11</div>
              <div className="absolute inset-x-5 bottom-5">
                <div className="flex items-center gap-2"><EngineeringLabel className="border-white/30 text-white/80">{div?.code}</EngineeringLabel><EngineeringLabel className="border-white/30 text-white/80">{s.tool}</EngineeringLabel></div>
                <div className="mt-3 text-2xl font-semibold">{s.title}</div>
              </div>
              {/* progress bars */}
              <div aria-hidden="true" className="absolute inset-x-5 top-12 flex gap-1">{stages.map((_, i) => <span key={i} className={cn("h-px flex-1 transition-colors duration-500", i <= active ? "bg-[var(--accent)]" : "bg-white/20")} />)}</div>
            </div>
            <div className="mt-4 flex items-center justify-between border border-line px-4 py-3 text-xs text-muted">
              <span className="flex items-center gap-3"><span className="font-mono text-[10px] uppercase tracking-widest text-faint">Division</span>{div?.name}</span>
              <WingSection className="h-8 w-28 text-fg" label="" />
            </div>
          </div>
        </div>

        {/* Scrolling stages */}
        <ol className="lg:col-span-6">
          {stages.map((st, i) => {
            const d = divisionById(st.division);
            return (
              <li key={st.n} ref={(el) => { refs.current[i] = el; }} data-i={i} className={cn("border-l py-10 pl-6 transition-colors duration-500 md:py-14 md:pl-10", i === active ? "border-[var(--accent)]" : "border-line")}>
                <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[.25em] text-faint"><span className={cn("transition-colors", i === active && "text-accent")}>{String(st.n).padStart(2, "0")}</span><span className="h-px w-6 bg-current opacity-50" /><span>{d?.name}</span></div>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">{st.title}</h3>
                <p className="mt-3 max-w-md text-muted leading-relaxed">{st.body}</p>
                {/* mobile media */}
                <div className="mt-5 lg:hidden">
                  <div className="relative overflow-hidden border border-line bg-navy-950">
                    <Picture id={st.image} alt={st.title} ratio="16/9" imgClassName="opacity-80" />
                    <div className="absolute right-3 top-3 h-16 w-28 text-white opacity-90"><Drawing kind={st.drawing} /></div>
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2"><EngineeringLabel>{st.tool}</EngineeringLabel><EngineeringLabel>{d?.code}</EngineeringLabel></div>
                <Link to={st.link} className="btn-arrow mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">Open engineering page <ArrowRight /></Link>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
