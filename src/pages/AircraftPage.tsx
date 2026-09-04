import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import { aircraft, specMeta, type Aircraft } from "@/data/aircraft";
import { divisionById } from "@/data/divisions";
import { site } from "@/data/site";
import { px } from "@/data/media";
import AircraftViewer from "@/components/aircraft/AircraftViewer";
import { Button, Heading, PageHeader, Picture, Reveal, Tag, Modal, ArrowRight } from "@/components/ui";
import { EngineeringLabel, MeasureLine, StatusDot, WingSection, AircraftWireframe } from "@/components/graphics";
import { useCopy, useScrollProgress } from "@/hooks";
import { absUrl } from "@/utils/url";

const statusLabel: Record<Aircraft["status"], { l: string; s: "active" | "pending" | "planned" | "warn" }> = { concept: { l: "Concept", s: "planned" }, "in-development": { l: "In development", s: "pending" }, "flight-tested": { l: "Flight tested", s: "active" }, retired: { l: "Retired", s: "warn" } };

function SpecCard({ label, spec, unitHint }: { label: string; spec: Aircraft["specs"]["wingspan"]; unitHint: string }) {
  return (
    <div className="tech-border border border-line bg-elev p-5">
      <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-faint"><span>{label}</span>{unitHint && <span>[{unitHint}]</span>}</div>
      {spec ? (<><div className="mt-2 text-xl font-semibold leading-tight md:text-2xl">{spec.value}</div>{spec.status === "target" && <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-amber-500"><StatusDot status="pending" />Design target</div>}{spec.status === "verified" && <div className="mt-2 inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-emerald-500"><StatusDot status="active" />Verified</div>}</>)
        : <div className="mt-2 text-sm leading-snug text-faint">Specification pending team verification</div>}
    </div>
  );
}

export default function AircraftPage() {
  const [params, setParams] = useSearchParams();
  const id = params.get("a") ?? "ap-2";
  const a = aircraft.find((x) => x.id === id) ?? aircraft[1];
  const [compare, setCompare] = useState(false);
  const [media, setMedia] = useState<number | null>(null);
  const progress = useScrollProgress();
  const { copied, copy } = useCopy();
  useEffect(() => { document.title = `${a.designation} ${a.name} — Airborne Phoenix`; }, [a]);
  const others = useMemo(() => aircraft.filter((x) => x.id !== a.id), [a]);

  return (
    <>
      <div aria-hidden="true" className="fixed left-0 top-0 z-[55] h-[2px] w-full bg-transparent"><div className="h-full bg-emerald-400/70 origin-left" style={{ transform: `scaleX(${progress})` }} /></div>
      <PageHeader num="01" kicker="Aircraft explorer" title={`${a.designation} · ${a.name}`} crumb={a.designation}>{a.summary}</PageHeader>

      <section className="container-x py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Select aircraft">{aircraft.map((x) => <Tag key={x.id} active={x.id === a.id} onClick={() => setParams({ a: x.id })}>{x.designation} · Gen {x.generation}</Tag>)}</div>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => copy(absUrl(`/aircraft?a=${a.id}`))} className="h-10 border border-line px-3 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-fg">{copied ? "Link copied ✓" : "Share aircraft"}</button>
            <button onClick={() => setCompare(true)} className="h-10 border border-line px-3 font-mono text-[10px] uppercase tracking-widest text-muted hover:text-fg">Compare generations</button>
            {site.documents.technicalSummary.available ? <a href={site.documents.technicalSummary.path} download className="h-10 border border-[var(--accent)] px-3 font-mono text-[10px] uppercase leading-10 tracking-widest text-accent">Technical summary PDF</a> : <span className="h-10 border border-line px-3 font-mono text-[10px] uppercase leading-10 tracking-widest text-faint">Technical summary — pending</span>}
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8"><AircraftViewer modelPath={a.modelPath} posterId={a.hero} /></div>
          <aside className="lg:col-span-4">
            <div className="border border-line bg-elev p-6">
              <div className="flex items-center justify-between"><EngineeringLabel>Project status</EngineeringLabel><span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest"><StatusDot status={statusLabel[a.status].s} />{statusLabel[a.status].l}</span></div>
              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex justify-between border-b border-line pb-2"><dt className="text-faint">Generation</dt><dd className="font-medium">Gen {a.generation}</dd></div>
                <div className="flex justify-between border-b border-line pb-2"><dt className="text-faint">Season</dt><dd className="font-medium">{a.year}</dd></div>
                <div className="flex justify-between border-b border-line pb-2"><dt className="text-faint">Divisions</dt><dd className="font-medium">{a.divisions.length}</dd></div>
                <div className="flex justify-between"><dt className="text-faint">3D model</dt><dd className="font-medium">{a.modelPath ? "Slot: /models/…aircraft.glb" : "Not provided"}</dd></div>
              </dl>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-widest text-faint">Development timeline</div>
              <ol className="mt-3 space-y-2">{a.timeline.map((t, i) => <li key={t.label} className="flex items-center gap-3 text-sm"><span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span><span className="flex-1 border-b border-dashed border-line pb-1">{t.label}</span><span className="font-mono text-[10px] uppercase tracking-widest text-faint">{t.date ?? "Date TBC"}</span></li>)}</ol>
            </div>
          </aside>
        </div>
      </section>

      {/* Specs */}
      <section id="specs" className="container-x scroll-mt-24 py-16">
        <Reveal><Heading num="01.1" kicker="Specifications" title="Verified specification cards">Only data checked by the responsible division lead is marked verified. Targets are shown transparently as design targets.</Heading></Reveal>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{specMeta.map((m, i) => <Reveal key={m.key} delay={i * 50}><SpecCard label={m.label} spec={a.specs[m.key]} unitHint={m.unitHint} /></Reveal>)}</div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <Reveal><div className="border border-line bg-elev p-6"><div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-faint"><span>Fig. — general arrangement (schematic)</span><span>Not the certified drawing</span></div><AircraftWireframe className="mx-auto mt-4 h-56 w-full text-fg" /><div className="mt-2 flex justify-between"><MeasureLine label={a.specs.wingspan ? `b = ${a.specs.wingspan.value}` : "b = TBC"} /><MeasureLine label={a.specs.length ? `l = ${a.specs.length.value}` : "l = TBC"} /></div></div></Reveal>
          <Reveal delay={100}><div className="border border-line bg-elev p-6"><div className="font-mono text-[10px] uppercase tracking-widest text-faint">Fig. — wing section</div><WingSection className="mt-4 w-full text-fg" label={`${a.designation} root section`} /><div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-faint">Mission objectives</div><ul className="mt-2 space-y-1.5 text-sm text-muted">{a.mission.map((m) => <li key={m} className="flex gap-2"><span className="mt-2 h-px w-3 shrink-0 bg-[var(--accent)]" />{m}</li>)}</ul></div></Reveal>
        </div>
      </section>

      {/* Gallery + tests + divisions */}
      <section className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><Heading num="01.2" kicker="Gallery" title="Aircraft gallery" className="mb-6" /></Reveal>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">{a.images.map((img, i) => <Reveal key={img} delay={i * 60}><button onClick={() => setMedia(img)} className="img-mask block w-full border border-line"><Picture id={img} alt={`${a.name} image ${i + 1}`} ratio="4/3" sizes="(min-width:1024px) 20vw, 50vw" /></button></Reveal>)}</div>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-widest text-faint">Placeholder imagery — replace in /public/images/aircraft/</p>
          </div>
          <div className="lg:col-span-5">
            <Reveal><Heading num="01.3" kicker="Test history" title="Ground & flight tests" className="mb-6" /></Reveal>
            <ul className="divide-y divide-[var(--line)] border-y border-line">{a.tests.map((t) => <li key={t.type} className="py-3"><div className="flex items-center justify-between"><span className="text-sm font-medium">{t.type}</span><span className={cn("font-mono text-[10px] uppercase tracking-widest", t.result === "pass" ? "text-emerald-500" : t.result === "partial" ? "text-amber-500" : "text-faint")}>{t.result}</span></div><div className="mt-1 text-xs text-muted">{t.note}</div><div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-faint">{t.date ?? "Date pending confirmation"}</div></li>)}</ul>
            <div className="mt-8 font-mono text-[10px] uppercase tracking-widest text-faint">Related engineering divisions</div>
            <div className="mt-3 flex flex-wrap gap-2">{a.divisions.map((d) => { const dv = divisionById(d); return dv && <Link key={d} to={`/engineering/${d}`} className="btn-arrow inline-flex items-center gap-2 border border-line px-3 py-2 text-xs hover:border-[var(--accent)] hover:text-accent"><span className="h-2 w-2 rounded-full" style={{ background: dv.color }} />{dv.name}<ArrowRight className="h-3 w-3" /></Link>; })}</div>
          </div>
        </div>
      </section>

      {/* Other aircraft */}
      <section className="container-x pb-24">
        <div className="grid gap-4 md:grid-cols-2">{others.map((o) => <Link key={o.id} to={`/aircraft?a=${o.id}`} className="card-lift group relative overflow-hidden border border-line bg-elev"><Picture id={o.hero} alt={o.name} ratio="21/9" imgClassName="opacity-80" /><div className="p-6"><EngineeringLabel>Gen {o.generation} · {o.year}</EngineeringLabel><h3 className="mt-2 text-xl font-semibold group-hover:text-accent">{o.designation} · {o.name}</h3><p className="mt-1 line-clamp-2 text-sm text-muted">{o.summary}</p></div></Link>)}</div>
      </section>

      {/* Compare modal */}
      <Modal open={compare} onClose={() => setCompare(false)} title="Compare aircraft generations" wide>
        <div className="p-6 md:p-8"><h3 className="text-xl font-semibold">Design-generation comparison</h3>
          <div className="mt-6 overflow-x-auto"><table className="w-full min-w-[560px] text-sm"><thead><tr className="border-b border-line text-left font-mono text-[10px] uppercase tracking-widest text-faint"><th className="py-2 pr-4">Specification</th>{aircraft.map((x) => <th key={x.id} className="py-2 pr-4">{x.designation} · Gen {x.generation}</th>)}</tr></thead>
            <tbody>{specMeta.map((m) => <tr key={m.key} className="border-b border-line"><td className="py-2.5 pr-4 text-muted">{m.label}</td>{aircraft.map((x) => { const s = x.specs[m.key]; return <td key={x.id} className="py-2.5 pr-4">{s ? <span>{s.value}{s.status === "target" && <span className="ml-2 font-mono text-[9px] uppercase text-amber-500">target</span>}</span> : <span className="text-faint">Pending verification</span>}</td>; })}</tr>)}
              <tr><td className="py-2.5 pr-4 text-muted">Status</td>{aircraft.map((x) => <td key={x.id} className="py-2.5 pr-4">{statusLabel[x.status].l}</td>)}</tr></tbody></table></div>
          <div className="mt-6"><Button onClick={() => setCompare(false)} variant="outline" arrow={false}>Close</Button></div></div>
      </Modal>

      {/* Full-screen media */}
      <Modal open={media !== null} onClose={() => setMedia(null)} title="Aircraft media" wide>
        {media && <img src={px(media, 1600)} alt={a.name} className="block h-auto w-full" width={1600} height={1067} />}
      </Modal>
    </>
  );
}
