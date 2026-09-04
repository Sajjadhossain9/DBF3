import { useState, type FormEvent } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/utils/cn";
import { site } from "@/data/site";
import Gallery from "@/components/Gallery";
import { Button, PageHeader, Reveal } from "@/components/ui";
import { BlueprintGrid, EngineeringLabel, AircraftWireframe, RadarSweep } from "@/components/graphics";
import { useCopy } from "@/hooks";

/* ---------- Gallery ---------- */
export function GalleryPage() {
  return (
    <>
      <PageHeader num="04" kicker="Gallery" title="Media archive">Filter by discipline or milestone. Open any item for full-screen viewing; use arrow keys or swipe to navigate.</PageHeader>
      <section className="container-x py-12"><Gallery /></section>
    </>
  );
}

/* ---------- Contact ---------- */
const topics = ["General", "Sponsorship", "Media", "Join the team", "Technical"];
export function ContactPage() {
  const [params] = useSearchParams();
  const initialTopic = topics.find((t) => t.toLowerCase().includes(params.get("topic") ?? "§")) ?? "General";
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { copied, copy } = useCopy();
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = "Please enter your name.";
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(data.email ?? "")) errs.email = "Please enter a valid email.";
    if ((data.message ?? "").trim().length < 20) errs.message = "Please write at least 20 characters.";
    if (data.website) return; // honeypot
    setErrors(errs); if (Object.keys(errs).length) { setState("error"); return; }
    setState("sending");
    try {
      if (site.formEndpoint) {
        const r = await fetch(site.formEndpoint, { method: "POST", headers: { Accept: "application/json" }, body: fd });
        if (!r.ok) throw new Error("bad");
      } else {
        const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(`[${data.topic}] Airborne Phoenix enquiry`)}&body=${body}`;
      }
      setState("ok"); e.currentTarget.reset();
    } catch { setState("error"); setErrors({ form: "Sending failed. Please email us directly." }); }
  };
  const field = "mt-1 w-full border border-line bg-elev px-3 py-2.5 text-sm outline-none transition-colors focus:border-[var(--accent)]";
  return (
    <>
      <PageHeader num="08" kicker="Contact" title="Talk to the team">Sponsorship, media, recruitment or technical collaboration — we respond from a shared team inbox.</PageHeader>
      <section className="container-x grid gap-10 py-12 lg:grid-cols-12">
        <form onSubmit={submit} noValidate className="lg:col-span-7" aria-describedby="form-status">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-xs font-medium">Name<input name="name" className={cn(field, errors.name && "border-red-500")} autoComplete="name" />{errors.name && <span className="mt-1 block text-xs text-red-500">{errors.name}</span>}</label>
            <label className="text-xs font-medium">Email<input name="email" type="email" className={cn(field, errors.email && "border-red-500")} autoComplete="email" />{errors.email && <span className="mt-1 block text-xs text-red-500">{errors.email}</span>}</label>
            <label className="text-xs font-medium sm:col-span-2">Topic<select name="topic" defaultValue={initialTopic} className={field}>{topics.map((t) => <option key={t}>{t}</option>)}</select></label>
            <label className="text-xs font-medium sm:col-span-2">Message<textarea name="message" rows={6} className={cn(field, errors.message && "border-red-500")} />{errors.message && <span className="mt-1 block text-xs text-red-500">{errors.message}</span>}</label>
            <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button type="submit" disabled={state === "sending"}>{state === "sending" ? "Sending…" : "Send message"}</Button>
            <span id="form-status" role="status" aria-live="polite" className={cn("text-sm", state === "ok" && "text-emerald-500", state === "error" && "text-red-500")}>{state === "ok" && "Message prepared — thank you. We'll reply as soon as we can."}{state === "error" && (errors.form ?? "Please correct the highlighted fields.")}</span>
          </div>
          <p className="mt-4 text-xs text-faint">{site.formEndpoint ? "This form is processed by a third-party provider; see the privacy notice." : "No third-party form service is configured — submitting opens your email client."} <Link to="/privacy" className="underline">Privacy notice</Link></p>
        </form>
        <aside className="lg:col-span-5">
          <Reveal><div className="relative overflow-hidden border border-line bg-elev p-6"><BlueprintGrid className="opacity-50" /><div className="relative">
            <div className="flex items-center justify-between"><EngineeringLabel>Direct</EngineeringLabel><RadarSweep size={44} /></div>
            <button onClick={() => copy(site.email)} className="mt-4 flex w-full items-center justify-between border border-line px-4 py-3 text-left text-sm hover:border-[var(--accent)]"><span className="font-medium">{site.email}</span><span className={cn("font-mono text-[10px] uppercase tracking-widest", copied ? "text-emerald-500" : "text-faint")}>{copied ? "Copied ✓" : "Copy"}</span></button>
            <dl className="mt-5 space-y-2 text-sm"><div className="flex justify-between border-b border-line pb-2"><dt className="text-faint">University</dt><dd className="text-right">{site.university.split(" (")[0]}</dd></div><div className="flex justify-between border-b border-line pb-2"><dt className="text-faint">Location</dt><dd>{site.location}</dd></div><div className="flex justify-between"><dt className="text-faint">Season</dt><dd>2025–26</dd></div></dl>
            <div className="mt-5 flex flex-wrap gap-2">{Object.entries(site.social).map(([k, v]) => <a key={k} href={v} target="_blank" rel="noreferrer" className="h-9 border border-line px-3 font-mono text-[10px] uppercase leading-9 tracking-widest text-muted hover:border-[var(--accent)] hover:text-fg">{k}</a>)}</div>
          </div></div></Reveal>
        </aside>
      </section>
    </>
  );
}

/* ---------- Privacy ---------- */
export function PrivacyPage() {
  return (
    <>
      <PageHeader num="—" kicker="Legal" title="Privacy notice">How this website handles data.</PageHeader>
      <section className="container-x max-w-3xl space-y-6 py-12 text-muted">
        <p><strong className="text-fg">Analytics.</strong> {site.analytics.enabled ? `This site uses privacy-respecting analytics (${site.analytics.provider}) without cookies or cross-site tracking.` : "No analytics or tracking scripts are currently enabled on this site."}</p>
        <p><strong className="text-fg">Forms.</strong> {site.formEndpoint ? "Contact form submissions are processed by a third-party form provider. Data is used only to respond to your enquiry." : "The contact form opens your own email client; no data is transmitted to a third party by this website."}</p>
        <p><strong className="text-fg">Local storage.</strong> Your theme and motion preferences are stored in your browser only.</p>
        <p><strong className="text-fg">Media.</strong> Placeholder imagery is loaded from Pexels; embedded fonts are loaded from Google Fonts. These providers may log standard request data.</p>
        <p><strong className="text-fg">Offline support.</strong> A service worker caches the application shell so the site remains reachable offline.</p>
        <p>Questions: <a className="text-accent" href={`mailto:${site.email}`}>{site.email}</a></p>
      </section>
    </>
  );
}

/* ---------- 404 ---------- */
export function NotFound() {
  return (
    <section className="relative flex min-h-[80vh] items-center overflow-hidden">
      <BlueprintGrid className="opacity-60" />
      <div className="container-x relative grid items-center gap-10 py-32 md:grid-cols-2">
        <div><div className="font-mono text-[11px] uppercase tracking-[.3em] text-accent">Error 404 · Off course</div><h1 className="mt-4 text-5xl font-semibold tracking-tight">Waypoint not found.</h1><p className="mt-4 text-muted">The page you requested is not on the flight plan. Return to base or open the aircraft explorer.</p><div className="mt-6 flex gap-3"><Button to="/">Return home</Button><Button to="/aircraft" variant="outline">Aircraft</Button></div></div>
        <AircraftWireframe className="mx-auto w-full max-w-md text-faint" />
      </div>
    </section>
  );
}
