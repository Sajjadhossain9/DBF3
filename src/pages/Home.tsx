import { lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import Hero from "@/components/home/Hero";
import Story from "@/components/home/Story";
import CommandCentre from "@/components/home/CommandCentre";
import AircraftViewer from "@/components/aircraft/AircraftViewer";
import { Button, CountUp, Heading, Picture, Reveal, ArrowRight } from "@/components/ui";
import { BlueprintGrid, EnergyTrail, FlightPath, MissionBadge, WindParticles, WingSection, EngineeringLabel } from "@/components/graphics";
import { aircraft } from "@/data/aircraft";
import { divisions } from "@/data/divisions";
import { team } from "@/data/team";
import { articles } from "@/data/news";
import { useCapability } from "@/hooks";
import { PageFallback } from "@/components/layout";

const MissionControl = lazy(() => import("@/components/home/MissionControl"));
const Gallery = lazy(() => import("@/components/Gallery"));

export default function Home() {
  const cap = useCapability();
  const ap2 = aircraft[1];
  return (
    <>
      <Hero />

      {/* 01 Mission */}
      <section className="relative overflow-hidden border-b border-line py-24 md:py-32">
        <BlueprintGrid className="opacity-50 [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_70%)]" />
        <FlightPath className="opacity-70" />
        <WindParticles enabled={!cap.lowPower && !cap.mobile} density={cap.mobile ? 20 : 50} className="opacity-60" />
        <div className="container-x relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><Heading num="01" kicker="Mission" title="Engineering aircraft that must fly, not just render." className="mb-6" /></Reveal>
            <Reveal delay={100}><p className="max-w-2xl text-lg leading-relaxed text-muted">Airborne Phoenix is the Design • Build • Fly team of {" "}<span className="text-fg">Aviation and Aerospace University, Bangladesh</span>. We take a competition rulebook and turn it into a flying, scored aircraft — through requirements, simulation, composite manufacturing, avionics integration and disciplined flight testing.</p></Reveal>
            <Reveal delay={200} className="mt-8 flex flex-wrap gap-2">
              <MissionBadge code="DBF" label="Design • Build • Fly" /><MissionBadge code="AP-2" label="Mk II in development" /><MissionBadge code="2026" label="Competition target" />
            </Reveal>
            <Reveal delay={300} className="mt-10 grid grid-cols-2 gap-6 border-t border-line pt-8 sm:grid-cols-4">
              {[{ v: divisions.length, l: "Engineering divisions" }, { v: team.filter((m) => m.season === "2025-26").length, l: "Active members" }, { v: aircraft.length, l: "Aircraft generations" }, { v: 11, l: "Pipeline stages" }].map((s) => (
                <div key={s.l}><div className="font-mono text-3xl font-semibold tabular-nums md:text-4xl"><CountUp to={s.v} /></div><div className="mt-1 font-mono text-[10px] uppercase tracking-widest text-faint">{s.l}</div></div>
              ))}
            </Reveal>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={150} mask>
              <div className="relative border border-line bg-elev p-6">
                <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-faint"><span>Fig. 01 — root section</span><span>NOT TO SCALE</span></div>
                <WingSection className="mt-4 w-full text-fg" />
                <EnergyTrail className="absolute -bottom-6 -right-10 w-64 opacity-70" />
                <p className="mt-4 text-sm leading-relaxed text-muted">Every decision traces back to mission score: airfoil, span, structure, battery and payload procedure are chosen together, not in isolation.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Aircraft preview */}
      <section className="relative py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal><Heading num="03" kicker="Aircraft" title={`${ap2.designation} — ${ap2.name}`} className="mb-0">{ap2.summary}</Heading></Reveal>
            <Reveal delay={100}><Button to="/aircraft" variant="outline">Open aircraft explorer</Button></Reveal>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            <Reveal className="lg:col-span-8"><AircraftViewer modelPath={ap2.modelPath} /></Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:col-span-4 lg:grid-cols-1">
              {ap2.mission.slice(0, 3).map((m, i) => (
                <Reveal key={m} delay={i * 80}><div className="tech-border h-full border border-line bg-elev p-5"><div className="font-mono text-[10px] uppercase tracking-widest text-faint">Objective {String(i + 1).padStart(2, "0")}</div><div className="mt-2 text-sm font-medium leading-snug">{m}</div></div></Reveal>
              ))}
              <Reveal delay={240}><Link to="/aircraft#specs" className="btn-arrow flex h-full items-center justify-between border border-line bg-accent-soft p-5 text-sm font-medium text-accent">Verified specifications <ArrowRight /></Link></Reveal>
            </div>
          </div>
        </div>
      </section>

      <Story />

      <Suspense fallback={<div className="bg-navy-950 py-32" />}><MissionControl /></Suspense>

      <CommandCentre />

      {/* Gallery preview */}
      <section className="border-t border-line py-24 md:py-32">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <Reveal><Heading num="06" kicker="Gallery" title="Workshop to airfield." className="mb-0">A running visual log of the programme — design reviews, layups, bench tests and flight days.</Heading></Reveal>
            <Reveal delay={100}><Button to="/gallery" variant="outline">Full gallery</Button></Reveal>
          </div>
          <div className="mt-10"><Suspense fallback={<PageFallback />}><Gallery limit={6} /></Suspense></div>
        </div>
      </section>

      {/* News + Sponsor CTA */}
      <section className="relative overflow-hidden border-t border-line bg-sunk py-24 md:py-32">
        <BlueprintGrid className="opacity-40" />
        <div className="container-x relative grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal><Heading num="07" kicker="Latest" title="Programme updates" className="mb-8" /></Reveal>
            <div className="divide-y divide-[var(--line)] border-y border-line">
              {articles.map((a, i) => (
                <Reveal key={a.slug} delay={i * 80}>
                  <Link to={`/news/${a.slug}`} className="group grid grid-cols-[96px_1fr] items-center gap-5 py-4 sm:grid-cols-[140px_1fr]">
                    <Picture id={a.image} alt="" ratio="4/3" className="border border-line" sizes="140px" />
                    <div><div className="flex gap-2"><EngineeringLabel>{a.category}</EngineeringLabel><span className="font-mono text-[10px] uppercase tracking-widest text-faint">{a.date === "Pending confirmation" ? "Date TBC" : a.date}</span></div><h3 className="mt-2 text-base font-semibold leading-snug group-hover:text-accent sm:text-lg">{a.title}</h3></div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
          <div className="lg:col-span-5">
            <Reveal delay={150}>
              <div className="relative h-full border border-line bg-navy-950 p-8 text-white">
                <div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-60 [--grid:rgba(255,255,255,.06)]" />
                <div className="relative">
                  <div className="font-mono text-[10px] uppercase tracking-[.3em] text-white/60">Partnership</div>
                  <h3 className="mt-3 text-3xl font-semibold tracking-tight">Put your name on an aircraft that flies.</h3>
                  <p className="mt-4 text-white/70">Financial, material, software and media partners make each season possible. Support a student team building real aerospace capability in Bangladesh.</p>
                  <div className="mt-6 flex flex-wrap gap-3"><Button to="/sponsors">Sponsorship</Button><Button to="/contact" variant="ghost">Contact the team</Button></div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
