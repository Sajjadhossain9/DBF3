import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { divisions, divisionById } from "@/data/divisions";
import { team } from "@/data/team";
import { stages } from "@/data/aircraft";
import { gallery } from "@/data/gallery";
import CommandCentre from "@/components/home/CommandCentre";
import { Button, Heading, PageHeader, Picture, Reveal, ArrowRight } from "@/components/ui";
import { EngineeringLabel, BlueprintGrid, RadarSweep } from "@/components/graphics";
import { useScrollProgress } from "@/hooks";

export function EngineeringIndex() {
  return (
    <>
      <PageHeader num="02" kicker="Engineering" title="Divisions and the development pipeline">Eight engineering divisions collaborate through a gated design process. Explore how each contributes from requirements to competition.</PageHeader>
      <CommandCentre compact />
      <section className="container-x pb-24">
        <Reveal><Heading num="02.1" kicker="Divisions" title="All divisions" className="mb-8" /></Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{divisions.map((d, i) => (
          <Reveal key={d.id} delay={i * 50}><Link to={`/engineering/${d.id}`} className="card-lift group block h-full border border-line bg-elev"><Picture id={d.image} alt="" ratio="16/10" imgClassName="opacity-90" sizes="(min-width:1024px) 25vw, 50vw" /><div className="p-5"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: d.color }} /><span className="font-mono text-[10px] uppercase tracking-widest text-faint">{d.code}</span></div><h3 className="mt-2 font-semibold group-hover:text-accent">{d.name}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{d.summary}</p></div></Link></Reveal>
        ))}</div>
      </section>
    </>
  );
}

export function DivisionPage() {
  const { id = "" } = useParams();
  const d = divisionById(id);
  const progress = useScrollProgress();
  useEffect(() => { if (d) document.title = `${d.name} — Airborne Phoenix Engineering`; }, [d]);
  if (!d) return <Navigate to="/engineering" replace />;
  const members = team.filter((m) => m.division === d.id && m.season === "2025-26");
  const leads = members.filter((m) => m.tier !== "member"), rest = members.filter((m) => m.tier === "member");
  const media = gallery.filter((g) => g.pexelsId && (g.category.toLowerCase().includes(d.short.toLowerCase()) || g.pexelsId === d.image)).slice(0, 3);
  const idx = divisions.findIndex((x) => x.id === d.id);
  const next = divisions[(idx + 1) % divisions.length];
  return (
    <>
      <div aria-hidden="true" className="fixed left-0 top-0 z-[55] h-[2px] w-full"><div className="h-full origin-left" style={{ transform: `scaleX(${progress})`, background: d.color }} /></div>
      <PageHeader num={`02.${idx + 1}`} kicker={`${d.code} division`} title={d.name} crumb={d.name}>{d.summary}</PageHeader>
      <section className="container-x grid gap-12 py-16 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Reveal><Picture id={d.image} alt={`${d.name} division at work`} ratio="21/9" className="border border-line" priority /></Reveal>
          <Reveal className="mt-10"><Heading num="A" kicker="Scope" title="Responsibilities" className="mb-6" /></Reveal>
          <ul className="grid gap-3 sm:grid-cols-2">{d.responsibilities.map((r, i) => <Reveal key={r} delay={i * 40} as="li"><div className="tech-border flex h-full gap-3 border border-line bg-elev p-4 text-sm"><span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span>{r}</div></Reveal>)}</ul>
          <Reveal className="mt-12"><Heading num="B" kicker="Pipeline" title="Where this division works" className="mb-6" /></Reveal>
          <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">{stages.map((s) => { const on = d.stages.includes(s.n); return <li key={s.n} className="flex items-center gap-3 border border-line px-3 py-2.5 text-sm" style={on ? { borderColor: d.color } : undefined}><span className="grid h-6 w-6 shrink-0 place-items-center font-mono text-[10px]" style={on ? { background: d.color, color: "#fff" } : { border: "1px solid var(--line)", color: "var(--fg-faint)" }}>{s.n}</span><span className={on ? "" : "text-faint"}>{s.title}</span></li>; })}</ol>
          <Reveal className="mt-12"><Heading num="C" kicker="Tools" title="Tools & technologies" className="mb-6" /></Reveal>
          <div className="flex flex-wrap gap-2">{d.tools.map((t) => <EngineeringLabel key={t} className="px-3 py-1.5 text-[11px]">{t}</EngineeringLabel>)}</div>
          {media.length > 0 && <><Reveal className="mt-12"><Heading num="D" kicker="Media" title="Related images & video" className="mb-6" /></Reveal><div className="grid grid-cols-3 gap-3">{media.map((g) => <Link key={g.id} to={`/gallery#${g.id}`} className="img-mask block border border-line"><Picture id={g.pexelsId} alt={g.caption} ratio="4/3" sizes="30vw" /></Link>)}</div></>}
        </div>
        <aside className="lg:col-span-4">
          <div className="sticky top-24 space-y-6">
            <div className="relative overflow-hidden border border-line bg-elev p-6"><BlueprintGrid className="opacity-50" /><div className="relative">
              <div className="flex items-center justify-between"><EngineeringLabel>Division lead</EngineeringLabel><RadarSweep size={40} /></div>
              {leads.length ? leads.map((l) => <Link key={l.slug} to={`/team/${l.slug}`} className="mt-3 block"><div className="font-semibold hover:text-accent">{l.name}</div><div className="text-xs text-muted">{l.role}</div></Link>) : <div className="mt-3 text-sm text-faint">Lead pending confirmation</div>}
              <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-faint">Members ({rest.length})</div>
              <ul className="mt-2 space-y-1 text-sm">{rest.map((m) => <li key={m.slug}><Link to={`/team/${m.slug}`} className="text-muted hover:text-fg">{m.name} <span className="text-faint">· {m.role}</span></Link></li>)}{!rest.length && <li className="text-faint">Roster pending</li>}</ul>
            </div></div>
            <div className="border border-line bg-elev p-6"><div className="font-mono text-[10px] uppercase tracking-widest text-faint">Connected divisions</div><ul className="mt-3 space-y-2">{d.connections.map((c) => { const cd = divisionById(c); return cd && <li key={c}><Link to={`/engineering/${c}`} className="btn-arrow flex items-center justify-between text-sm hover:text-accent"><span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: cd.color }} />{cd.name}</span><ArrowRight className="h-3.5 w-3.5" /></Link></li>; })}</ul></div>
            <Button to="/team" variant="outline" className="w-full">Meet the team</Button>
          </div>
        </aside>
      </section>
      <section className="container-x pb-24"><Link to={`/engineering/${next.id}`} className="btn-arrow group flex items-center justify-between border border-line bg-elev p-6 hover:border-[var(--accent)]"><div><div className="font-mono text-[10px] uppercase tracking-widest text-faint">Next division</div><div className="mt-1 text-xl font-semibold group-hover:text-accent">{next.name}</div></div><ArrowRight /></Link></section>
    </>
  );
}
