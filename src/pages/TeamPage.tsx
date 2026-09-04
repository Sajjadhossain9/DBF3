import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import { team, seasons, tierLabel, tierOrder, rosterVerified, type Member, type Tier } from "@/data/team";
import { divisions, divisionById } from "@/data/divisions";
import { Heading, Modal, PageHeader, Reveal, Tag, ArrowRight } from "@/components/ui";
import { EngineeringLabel, StatusDot } from "@/components/graphics";
import { useCopy } from "@/hooks";
import { absUrl } from "@/utils/url";

function Portrait({ m, className }: { m: Member; className?: string }) {
  const initials = m.name.split(" ").filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join("") || "AP";
  const d = divisionById(m.division);
  return (
    <div className={cn("relative overflow-hidden bg-sunk", className)} style={{ aspectRatio: "4/5" }}>
      {m.portrait ? <img src={m.portrait} alt={m.name} loading="lazy" className="absolute inset-0 h-full w-full object-cover grayscale-[.2]" width={800} height={1000} />
        : (<div className="absolute inset-0 grid place-items-center" style={{ background: `linear-gradient(160deg, ${d?.color ?? "#ff7a1a"}22, var(--bg-sunk))` }}><div aria-hidden="true" className="absolute inset-0 blueprint-grid opacity-60" /><span className="relative font-mono text-3xl font-semibold text-muted">{initials}</span></div>)}
      <span className="absolute left-2 top-2 h-1.5 w-1.5 rounded-full" style={{ background: d?.color }} />
    </div>
  );
}

function MemberCard({ m, featured = false }: { m: Member; featured?: boolean }) {
  const d = divisionById(m.division);
  return (
    <Link to={`/team/${m.slug}`} className={cn("card-lift group block border border-line bg-elev", featured && "tech-border")}>
      <Portrait m={m} />
      <div className={cn("p-4", featured && "p-5")}>
        <div className="font-mono text-[10px] uppercase tracking-widest text-faint">{tierLabel[m.tier]}</div>
        <div className={cn("mt-1 font-semibold leading-snug group-hover:text-accent", featured ? "text-lg" : "text-sm")}>{m.name}</div>
        <div className="mt-0.5 text-xs text-muted">{m.role} · {d?.short}</div>
      </div>
    </Link>
  );
}

/* Animated org map (SVG) */
function OrgMap({ members }: { members: Member[] }) {
  const lead = members.find((m) => m.tier === "lead"), co = members.find((m) => m.tier === "co-lead"), chief = members.find((m) => m.tier === "chief"), adv = members.find((m) => m.tier === "advisor");
  const leads = divisions.map((d) => ({ d, m: members.find((x) => x.division === d.id && x.tier === "dept-lead"), n: members.filter((x) => x.division === d.id && x.tier === "member").length }));
  const W = 1000, H = 360;
  return (
    <div className="overflow-x-auto border border-line bg-elev">
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[760px] w-full" role="img" aria-label="Organisation map">
        <defs><marker id="dot" viewBox="0 0 4 4" refX="2" refY="2" markerWidth="4" markerHeight="4"><circle cx="2" cy="2" r="1.5" fill="var(--accent)" /></marker></defs>
        {/* lines */}
        <g stroke="var(--line-strong)" fill="none" strokeWidth="1">
          <path d={`M${W / 2} 70 V 120`} /><path d={`M${W / 2 - 180} 150 H ${W / 2 + 180}`} /><path d={`M${W / 2} 120 V 150`} />
          <path d={`M${W / 2 - 180} 150 V 180 M${W / 2} 150 V 180 M${W / 2 + 180} 150 V 180`} />
          <path d={`M${W / 2} 210 V 240 M 80 240 H ${W - 80}`} className="anim-flight-dash" stroke="var(--accent)" strokeOpacity=".6" />
          {leads.map((_, i) => <path key={i} d={`M${80 + i * ((W - 160) / 7)} 240 V 270`} />)}
        </g>
        {/* boxes */}
        {[{ x: W / 2, y: 40, t: adv?.name ?? "Faculty advisor", s: "Faculty advisor", w: 240 }, { x: W / 2 - 180, y: 195, t: co?.name ?? "Co-lead", s: "Co-lead", w: 200 }, { x: W / 2, y: 195, t: lead?.name ?? "Team lead", s: "Team lead", w: 200, hi: true }, { x: W / 2 + 180, y: 195, t: chief?.name ?? "Chief engineer", s: "Chief engineer", w: 200 }].map((b) => (
          <g key={b.s}><rect x={b.x - b.w / 2} y={b.y - 22} width={b.w} height={44} fill={b.hi ? "var(--accent)" : "var(--bg)"} stroke={b.hi ? "var(--accent)" : "var(--line-strong)"} /><text x={b.x} y={b.y - 4} textAnchor="middle" fontSize="11" fontWeight="600" fill={b.hi ? "#fff" : "var(--fg)"} fontFamily="var(--font-sans)">{b.t.replace(/ \(.*\)/, "")}</text><text x={b.x} y={b.y + 11} textAnchor="middle" fontSize="8" fill={b.hi ? "rgba(255,255,255,.8)" : "var(--fg-faint)"} fontFamily="var(--font-mono)" letterSpacing="1.5">{b.s.toUpperCase()}</text></g>
        ))}
        {leads.map(({ d, m, n }, i) => { const x = 80 + i * ((W - 160) / 7); return (
          <g key={d.id}><rect x={x - 58} y={270} width={116} height={56} fill="var(--bg)" stroke={d.color} /><text x={x} y={289} textAnchor="middle" fontSize="9" fontWeight="600" fill="var(--fg)" fontFamily="var(--font-sans)">{d.short}</text><text x={x} y={303} textAnchor="middle" fontSize="8" fill="var(--fg-muted)" fontFamily="var(--font-sans)">{m ? m.name.replace(/ \(.*\)/, "").slice(0, 20) : "Lead TBC"}</text><text x={x} y={317} textAnchor="middle" fontSize="7.5" fill="var(--fg-faint)" fontFamily="var(--font-mono)" letterSpacing="1">{n} MEMBERS</text></g>); })}
      </svg>
    </div>
  );
}

export default function TeamPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [season, setSeason] = useState(seasons[0]);
  const [dept, setDept] = useState<string>("all");
  const [q, setQ] = useState("");
  const { copied, copy } = useCopy();
  const members = useMemo(() => team.filter((m) => m.season === season && (dept === "all" || m.division === dept) && `${m.name} ${m.role} ${m.skills?.join(" ") ?? ""}`.toLowerCase().includes(q.toLowerCase())), [season, dept, q]);
  const byTier = (t: Tier) => members.filter((m) => m.tier === t);
  const sel = slug ? team.find((m) => m.slug === slug) : undefined;
  useEffect(() => { document.title = sel ? `${sel.name} — Airborne Phoenix` : "Team — Airborne Phoenix"; }, [sel]);
  const selDiv = sel && divisionById(sel.division);

  return (
    <>
      <PageHeader num="03" kicker="Team" title="The people behind the aircraft">Students across aerospace, mechanical, electrical and management disciplines — led by a faculty advisor and a leadership core.</PageHeader>
      {!rosterVerified && <div className="container-x pt-6"><div className="flex items-center gap-3 border border-amber-400/40 bg-amber-400/10 px-4 py-2.5 font-mono text-[10px] uppercase tracking-[.2em] text-amber-600 dark:text-amber-200"><StatusDot status="pending" />Roster shown with placeholder names — pending official confirmation (src/data/team.ts)</div></div>}

      <section className="container-x py-12">
        <Reveal><Heading num="03.1" kicker="Organisation" title="Leadership structure" className="mb-6" /></Reveal>
        <Reveal><OrgMap members={team.filter((m) => m.season === season)} /></Reveal>
      </section>

      <section className="container-x pb-24">
        <div className="flex flex-col gap-4 border-y border-line py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5"><Tag active={dept === "all"} onClick={() => setDept("all")}>All divisions</Tag>{divisions.map((d) => <Tag key={d.id} active={dept === d.id} onClick={() => setDept(d.id)}>{d.short}</Tag>)}</div>
          <div className="flex gap-2">
            <select value={season} onChange={(e) => setSeason(e.target.value)} aria-label="Season" className="h-9 border border-line bg-elev px-2 font-mono text-[11px] uppercase tracking-widest text-fg">{seasons.map((s) => <option key={s} value={s}>{s}{s !== seasons[0] ? " (archive)" : ""}</option>)}</select>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search members…" aria-label="Search members" className="h-9 w-48 border border-line bg-elev px-3 text-sm outline-none focus:border-[var(--accent)]" />
          </div>
        </div>

        {(["advisor", "lead", "co-lead", "chief"] as Tier[]).some((t) => byTier(t).length) && (
          <div className="mt-10"><div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-faint">Leadership</div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">{(["advisor", "lead", "co-lead", "chief"] as Tier[]).flatMap((t) => byTier(t)).map((m, i) => <Reveal key={m.slug} delay={i * 50}><MemberCard m={m} featured /></Reveal>)}</div></div>
        )}
        {byTier("dept-lead").length > 0 && (
          <div className="mt-12"><div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-faint">Department leads</div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{byTier("dept-lead").map((m, i) => <Reveal key={m.slug} delay={i * 40}><MemberCard m={m} /></Reveal>)}</div></div>
        )}
        {byTier("member").length > 0 && (
          <div className="mt-12"><div className="mb-4 font-mono text-[10px] uppercase tracking-widest text-faint">Members</div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">{byTier("member").map((m, i) => <Reveal key={m.slug} delay={(i % 6) * 40}><MemberCard m={m} /></Reveal>)}</div></div>
        )}
        {members.length === 0 && <p className="py-16 text-center text-muted">No members match this filter.</p>}
      </section>

      <Modal open={!!sel} onClose={() => navigate("/team")} title={sel?.name} wide>
        {sel && (
          <div className="grid md:grid-cols-[280px_1fr]">
            <Portrait m={sel} className="md:h-full" />
            <div className="p-6 md:p-8">
              <EngineeringLabel>{tierLabel[sel.tier]} · {sel.season}</EngineeringLabel>
              <h3 className="mt-3 text-2xl font-semibold">{sel.name}</h3>
              <p className="text-muted">{sel.role}</p>
              {selDiv && <Link to={`/engineering/${selDiv.id}`} className="btn-arrow mt-3 inline-flex items-center gap-2 text-sm text-accent"><span className="h-2 w-2 rounded-full" style={{ background: selDiv.color }} />{selDiv.name} division <ArrowRight className="h-3.5 w-3.5" /></Link>}
              {sel.contribution && <><div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-faint">Project contribution</div><p className="mt-1 text-sm leading-relaxed">{sel.contribution}</p></>}
              {sel.skills && <><div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-faint">Skills</div><div className="mt-2 flex flex-wrap gap-1.5">{sel.skills.map((s) => <EngineeringLabel key={s}>{s}</EngineeringLabel>)}</div></>}
              <div className="mt-6 flex flex-wrap gap-2">
                {sel.linkedin && <a href={sel.linkedin} target="_blank" rel="noreferrer" className="h-10 border border-line px-4 font-mono text-[10px] uppercase leading-10 tracking-widest hover:border-[var(--accent)]">LinkedIn</a>}
                <button onClick={() => copy(absUrl(`/team/${sel.slug}`))} className="h-10 border border-line px-4 font-mono text-[10px] uppercase tracking-widest hover:border-[var(--accent)]">{copied ? "Link copied ✓" : "Share profile"}</button>
              </div>
              {tierOrder.indexOf(sel.tier) <= 3 && <p className="mt-6 text-xs text-faint">Leadership profile. Portraits: /public/images/team/{sel.slug}.webp</p>}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
