import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";
import { timeline, type EventCategory } from "@/data/timeline";
import { PageHeader, Reveal, Tag, ArrowRight } from "@/components/ui";
import { EngineeringLabel, StatusDot, FlightPath } from "@/components/graphics";

const catColor: Record<EventCategory, string> = { Formation: "#94a3b8", Development: "#38bdf8", "Design Review": "#a78bfa", Manufacturing: "#f472b6", "Ground Test": "#facc15", "Flight Test": "#ff7a1a", Competition: "#34d399", Recognition: "#fbbf24", Media: "#60a5fa", Future: "#8ea0c9" };

export default function TimelinePage() {
  const years = useMemo(() => Array.from(new Set(timeline.map((t) => t.year))).sort(), []);
  const [year, setYear] = useState<number | "all">("all");
  const items = useMemo(() => timeline.filter((t) => year === "all" || t.year === year), [year]);
  const grouped = useMemo(() => years.filter((y) => year === "all" || y === year).map((y) => ({ y, items: items.filter((t) => t.year === y) })), [items, years, year]);
  const pending = timeline.filter((t) => !t.verified).length;
  return (
    <>
      <PageHeader num="05" kicker="Timeline & achievements" title="Milestones from formation to flight">From the team's founding to future missions. Only verified dates are shown as confirmed; everything else is marked for team confirmation.</PageHeader>
      <section className="container-x relative py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
          <div className="flex flex-wrap gap-1.5"><Tag active={year === "all"} onClick={() => setYear("all")}>All years</Tag>{years.map((y) => <Tag key={y} active={year === y} onClick={() => setYear(y)}>{y}</Tag>)}</div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-faint"><StatusDot status="pending" />{pending} entries awaiting date confirmation</div>
        </div>
        <div className="relative mt-10">
          <FlightPath className="opacity-30" d="M -50 50 C 300 20, 700 380, 1500 300" trail={false} />
          <div aria-hidden="true" className="absolute left-[19px] top-0 bottom-0 w-px bg-[var(--line)] md:left-1/2" />
          {grouped.map(({ y, items: evs }) => (
            <div key={y} className="relative">
              <div className="sticky top-20 z-10 mb-6 flex md:justify-center"><span className="ml-0 border border-line glass px-4 py-1.5 font-mono text-xs font-semibold tracking-widest md:ml-0">{y}</span></div>
              <ol>{evs.map((e, i) => {
                const left = i % 2 === 0;
                return (
                  <li key={e.id} className={cn("relative mb-8 pl-12 md:w-1/2 md:pl-0", left ? "md:pr-12 md:text-right" : "md:ml-auto md:pl-12")}>
                    <span aria-hidden="true" className={cn("absolute top-3 left-[15px] h-2.5 w-2.5 rounded-full border-2 border-[var(--bg)] md:left-auto", left ? "md:-right-[5px]" : "md:-left-[5px]")} style={{ background: catColor[e.category] }} />
                    <Reveal>
                      <article className="card-lift border border-line bg-elev p-5">
                        <div className={cn("flex flex-wrap items-center gap-2", left && "md:justify-end")}><EngineeringLabel><span style={{ color: catColor[e.category] }}>●</span>&nbsp;{e.category}</EngineeringLabel><span className={cn("font-mono text-[10px] uppercase tracking-widest", e.date ? "text-fg" : "text-amber-500")}>{e.date ?? "Date — team confirmation required"}</span></div>
                        <h3 className="mt-2 text-lg font-semibold">{e.title}</h3>
                        <p className="mt-1 text-sm text-muted">{e.body}</p>
                        {e.link && <Link to={e.link} className={cn("btn-arrow mt-3 inline-flex items-center gap-2 text-xs font-medium text-accent", left && "md:flex-row-reverse")}>Related page <ArrowRight className="h-3.5 w-3.5" /></Link>}
                      </article>
                    </Reveal>
                  </li>
                );
              })}</ol>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
