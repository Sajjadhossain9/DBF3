import { sponsors, sponsorTiers, contributionCategories, mediaReach, partnershipBenefits } from "@/data/sponsors";
import { site } from "@/data/site";
import { Button, Heading, PageHeader, Reveal, CountUp } from "@/components/ui";
import { BlueprintGrid, EngineeringLabel, StatusDot, RadarSweep } from "@/components/graphics";
import { divisions } from "@/data/divisions";
import { team } from "@/data/team";

const Icon = ({ name }: { name: string }) => {
  const p: Record<string, string> = { coin: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v10M9 9.5h4.5a1.5 1.5 0 0 1 0 3h-3a1.5 1.5 0 0 0 0 3H15", layers: "M12 3 3 8l9 5 9-5-9-5ZM3 12l9 5 9-5M3 16l9 5 9-5", chip: "M8 8h8v8H8zM5 5h14v14H5zM9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3", bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z", tool: "M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.1-2.1 2.7-2.5Z", code: "m8 8-4 4 4 4M16 8l4 4-4 4M14 4l-4 16", plane: "M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5Z", camera: "M4 8h3l2-3h6l2 3h3v11H4V8Zm8 9a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" };
  return <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"><path d={p[name] ?? p.coin} /></svg>;
};

export default function SponsorsPage() {
  return (
    <>
      <PageHeader num="06" kicker="Sponsorship" title="Partner with a team that flies">Airborne Phoenix depends on partners who believe student engineers should design, build and fly real aircraft. Here is what we do, what we need and how partners are recognised.</PageHeader>

      <section className="container-x grid gap-10 py-16 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <Reveal><Heading num="06.1" kicker="Team mission" title="Why support Airborne Phoenix" className="mb-6" /></Reveal>
          <Reveal delay={80}><p className="text-lg leading-relaxed text-muted">We are the Design • Build • Fly team of {site.university}. Each season we take a competition rulebook and deliver a flying, scored aircraft through a full engineering cycle — requirements, CAD, CFD, structural analysis, composite manufacturing, avionics and flight testing. Partners gain access to a pipeline of hands-on aerospace talent and a story worth telling.</p></Reveal>
          <Reveal delay={160} className="mt-8 grid grid-cols-3 gap-4 border-y border-line py-6">
            {[{ v: team.filter((m) => m.season === "2025-26").length, l: "Student engineers" }, { v: divisions.length, l: "Divisions" }, { v: 11, l: "Pipeline stages" }].map((s) => <div key={s.l}><div className="font-mono text-3xl font-semibold"><CountUp to={s.v} /></div><div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-faint">{s.l}</div></div>)}
          </Reveal>
          <Reveal delay={200} className="mt-8"><div className="font-mono text-[10px] uppercase tracking-widest text-faint">Competition goals</div><ul className="mt-3 grid gap-2 sm:grid-cols-2">{["Complete technical inspection at first attempt", "Fly every scored mission safely", "Deliver a design report that reflects real engineering rigour", "Build a repeatable manufacturing capability for future seasons"].map((g, i) => <li key={g} className="flex gap-3 border border-line p-3 text-sm"><span className="font-mono text-[10px] text-accent">{String(i + 1).padStart(2, "0")}</span>{g}</li>)}</ul></Reveal>
        </div>
        <aside className="lg:col-span-5">
          <Reveal delay={120}><div className="relative overflow-hidden border border-line bg-navy-950 p-6 text-white"><BlueprintGrid className="opacity-50 [--grid:rgba(255,255,255,.06)]" /><div className="relative">
            <div className="flex items-center justify-between"><EngineeringLabel className="border-white/30 text-white/80">Audience & impact</EngineeringLabel><RadarSweep size={48} /></div>
            <dl className="mt-4 divide-y divide-white/10">{mediaReach.map((m) => <div key={m.label} className="flex items-center justify-between py-2.5 text-sm"><dt className="text-white/60">{m.label}</dt><dd className="font-mono text-[11px] uppercase tracking-widest">{m.value ?? <span className="text-amber-300">Pending approval</span>}</dd></div>)}</dl>
            <p className="mt-4 text-xs text-white/50">Reach figures are published only after measurement and team approval — no estimates.</p>
          </div></div></Reveal>
        </aside>
      </section>

      <section className="border-y border-line bg-sunk py-16">
        <div className="container-x">
          <Reveal><Heading num="06.2" kicker="Support requirements" title="Ways to contribute">Every category below directly removes a bottleneck in the aircraft programme.</Heading></Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{contributionCategories.map((c, i) => <Reveal key={c.id} delay={i * 50}><div className="tech-border h-full border border-line bg-elev p-5"><div className="text-accent"><Icon name={c.icon} /></div><h3 className="mt-3 font-semibold">{c.name}</h3><p className="mt-1 text-sm text-muted">{c.detail}</p></div></Reveal>)}</div>
        </div>
      </section>

      <section className="container-x grid gap-10 py-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <Reveal><Heading num="06.3" kicker="Categories" title="Sponsorship tiers" className="mb-6" /></Reveal>
          <div className="divide-y divide-[var(--line)] border-y border-line">{sponsorTiers.map((t) => <div key={t.id} className="flex items-center justify-between py-4"><div><div className="font-semibold">{t.name}</div><div className="text-xs text-muted">{t.note}</div></div><span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-amber-500"><StatusDot status="pending" />Awaiting approval</span></div>)}</div>
          <p className="mt-3 text-xs text-faint">Pricing and tier benefits are not published until approved by the team and faculty advisor.</p>
        </div>
        <div className="lg:col-span-6">
          <Reveal><Heading num="06.4" kicker="Benefits" title="Partnership benefits" className="mb-6" /></Reveal>
          <ul className="space-y-2">{partnershipBenefits.map((b) => <li key={b} className="flex gap-3 border border-line p-3 text-sm"><span className="mt-2 h-px w-3 shrink-0 bg-[var(--accent)]" />{b}</li>)}</ul>
        </div>
      </section>

      <section className="container-x py-8">
        <Reveal><Heading num="06.5" kicker="Recognition" title="Partners & previous recognition" className="mb-6" /></Reveal>
        {sponsors.length ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{sponsors.map((s) => <a key={s.id} href={s.url} target="_blank" rel="noreferrer" className="card-lift grid aspect-[3/2] place-items-center border border-line bg-elev p-6">{s.logo ? <img src={s.logo} alt={s.name} className="max-h-12 w-auto dark:brightness-0 dark:invert" loading="lazy" /> : <span className="text-sm font-medium">{s.name}</span>}</a>)}</div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="grid aspect-[3/2] place-items-center border border-dashed border-line-strong text-center font-mono text-[10px] uppercase tracking-widest text-faint">Partner logo<br />slot {String(i + 1).padStart(2, "0")}</div>)}</div>
        )}
        <p className="mt-3 text-xs text-faint">Add partners in src/data/sponsors.ts and logos in /public/images/sponsors/.</p>
      </section>

      <section id="deck" className="container-x scroll-mt-24 pb-24 pt-8">
        <div className="relative overflow-hidden border border-line bg-elev p-8 md:p-12"><BlueprintGrid className="opacity-50" />
          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div><div className="font-mono text-[10px] uppercase tracking-[.3em] text-faint">Sponsorship deck</div><h3 className="mt-3 text-2xl font-semibold md:text-3xl">Request the partnership deck</h3><p className="mt-3 text-muted">The deck covers the aircraft programme, season schedule, recognition options and contact details.</p></div>
            <div className="flex flex-wrap gap-3 md:justify-end">
              {site.documents.sponsorshipDeck.available ? <Button href={site.documents.sponsorshipDeck.path} download>Download deck (PDF)</Button> : <span className="inline-flex min-h-11 items-center border border-dashed border-line-strong px-4 font-mono text-[10px] uppercase tracking-widest text-faint">Deck upload pending — /documents/sponsorship-deck.pdf</span>}
              <Button to="/contact?topic=sponsorship" variant="outline">Contact the team</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
