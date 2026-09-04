import { useEffect, useRef } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { articles } from "@/data/news";
import { site } from "@/data/site";
import { Button, Heading, PageHeader, Picture, Reveal, ArrowRight } from "@/components/ui";
import { EngineeringLabel } from "@/components/graphics";
import { useCopy, useScrollProgress } from "@/hooks";

export function NewsIndex() {
  const [first, ...rest] = articles;
  return (
    <>
      <PageHeader num="07" kicker="News & press" title="Programme updates and media resources">Engineering progress, competition news and resources for journalists.</PageHeader>
      <section className="container-x py-12">
        <Reveal><Link to={`/news/${first.slug}`} className="group grid gap-6 border border-line bg-elev lg:grid-cols-2"><Picture id={first.image} alt="" ratio="16/10" priority /><div className="p-6 md:p-10"><div className="flex gap-2"><EngineeringLabel>{first.category}</EngineeringLabel><span className="font-mono text-[10px] uppercase tracking-widest text-faint">{first.date === "Pending confirmation" ? "Date TBC" : first.date} · {first.readMinutes} min</span></div><h2 className="mt-4 text-2xl font-semibold tracking-tight group-hover:text-accent md:text-3xl">{first.title}</h2><p className="mt-3 text-muted">{first.excerpt}</p><span className="btn-arrow mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent">Read article <ArrowRight /></span></div></Link></Reveal>
        <div className="mt-6 grid gap-4 md:grid-cols-2">{rest.map((a, i) => <Reveal key={a.slug} delay={i * 60}><Link to={`/news/${a.slug}`} className="card-lift group block h-full border border-line bg-elev"><Picture id={a.image} alt="" ratio="16/9" /><div className="p-5"><div className="flex gap-2"><EngineeringLabel>{a.category}</EngineeringLabel><span className="font-mono text-[10px] uppercase tracking-widest text-faint">{a.readMinutes} min</span></div><h3 className="mt-3 text-lg font-semibold group-hover:text-accent">{a.title}</h3><p className="mt-1 text-sm text-muted">{a.excerpt}</p></div></Link></Reveal>)}</div>
      </section>
      <section id="press" className="container-x scroll-mt-24 pb-24">
        <Reveal><Heading num="07.1" kicker="Press kit" title="Downloadable press kit" className="mb-6">Logos, fact sheet, approved photography and leadership biographies.</Heading></Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {[{ t: "Logo pack", d: "SVG + PNG, dark/light variants", p: "/documents/press/logo-pack.zip" }, { t: "Fact sheet", d: "One-page team & aircraft summary", p: "/documents/press/fact-sheet.pdf" }, { t: "Approved photography", d: "High-resolution, credit required", p: "/documents/press/photos.zip" }].map((k) => (
            <div key={k.t} className="tech-border border border-line bg-elev p-5"><h3 className="font-semibold">{k.t}</h3><p className="mt-1 text-sm text-muted">{k.d}</p>{site.documents.pressKit.available ? <a href={k.p} download className="btn-arrow mt-4 inline-flex items-center gap-2 text-sm text-accent">Download <ArrowRight className="h-3.5 w-3.5" /></a> : <span className="mt-4 block font-mono text-[10px] uppercase tracking-widest text-faint">Upload pending — {k.p}</span>}</div>
          ))}
        </div>
        <div className="mt-6"><Button to="/contact?topic=media" variant="outline">Media enquiries</Button></div>
      </section>
    </>
  );
}

export function ArticlePage() {
  const { slug } = useParams();
  const a = articles.find((x) => x.slug === slug);
  const ref = useRef<HTMLElement>(null);
  const progress = useScrollProgress(ref);
  const { copied, copy } = useCopy();
  useEffect(() => { if (a) document.title = `${a.title} — Airborne Phoenix`; }, [a]);
  if (!a) return <Navigate to="/news" replace />;
  const idx = articles.indexOf(a); const next = articles[(idx + 1) % articles.length];
  return (
    <>
      <div aria-hidden="true" className="fixed left-0 top-0 z-[55] h-[2px] w-full"><div className="h-full origin-left bg-emerald-400/80" style={{ transform: `scaleX(${progress})` }} /></div>
      <PageHeader num="07" kicker={a.category} title={a.title} crumb={a.title}>{a.excerpt}</PageHeader>
      <article ref={ref} className="container-x grid gap-10 py-12 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Picture id={a.image} alt="" ratio="16/9" className="border border-line" priority />
          <div className="mt-8 max-w-2xl space-y-5 text-[17px] leading-relaxed text-muted">{a.body.map((p, i) => <p key={i} className={i === 0 ? "text-fg first-letter:float-left first-letter:mr-2 first-letter:text-5xl first-letter:font-semibold first-letter:leading-none first-letter:text-accent" : ""}>{p}</p>)}</div>
          <div className="mt-8 flex flex-wrap gap-1.5">{a.tags.map((t) => <EngineeringLabel key={t}>{t}</EngineeringLabel>)}</div>
        </div>
        <aside className="lg:col-span-4"><div className="sticky top-24 space-y-4">
          <div className="border border-line bg-elev p-5 font-mono text-[11px] uppercase tracking-widest"><div className="flex justify-between py-1.5"><span className="text-faint">Author</span><span>{a.author}</span></div><div className="flex justify-between py-1.5"><span className="text-faint">Date</span><span>{a.date === "Pending confirmation" ? "TBC" : a.date}</span></div><div className="flex justify-between py-1.5"><span className="text-faint">Read</span><span>{a.readMinutes} min</span></div><button onClick={() => copy(location.href)} className="mt-3 h-10 w-full border border-line hover:border-[var(--accent)]">{copied ? "Link copied ✓" : "Share article"}</button></div>
          <Link to={`/news/${next.slug}`} className="btn-arrow group block border border-line bg-elev p-5"><div className="font-mono text-[10px] uppercase tracking-widest text-faint">Next</div><div className="mt-1 font-semibold group-hover:text-accent">{next.title}</div><ArrowRight className="mt-2" /></Link>
        </div></aside>
      </article>
    </>
  );
}
