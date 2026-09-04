import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { HERO_VIDEO } from "@/data/media";
import { site, t } from "@/data/site";
import { useCapability, useReducedMotion } from "@/hooks";
import { Button } from "../ui";
import { CoordinateTicks, Emblem, FlightStageIndicator, StatusDot } from "../graphics";

const STAGES = ["Design", "Build", "Test", "Fly"];

export default function Hero() {
  const cap = useCapability();
  const { reduced, toggle: toggleMotion, userReduced } = useReducedMotion();
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);       // video can play
  const [failed, setFailed] = useState(false);     // all sources failed
  const [playing, setPlaying] = useState(true);
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  const useVideo = !reduced && !cap.saveData && !failed;

  /* Section progress + flight stage (rAF-throttled) */
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0; const el = sectionRef.current; if (!el) return;
        const p = Math.min(1, Math.max(0, window.scrollY / Math.max(1, el.offsetHeight - 80)));
        setProgress(p);
      });
    };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => { if (reduced) return; const id = setInterval(() => setStage((s) => (s + 1) % STAGES.length), 2600); return () => clearInterval(id); }, [reduced]);

  /* Pause when out of view / tab hidden */
  useEffect(() => {
    const v = videoRef.current; if (!v) return;
    const io = new IntersectionObserver(([e]) => { if (!playing) return; if (e.isIntersecting) v.play().catch(() => undefined); else v.pause(); }, { threshold: 0.05 });
    io.observe(v);
    const onVis = () => { if (document.hidden) v.pause(); else if (playing) v.play().catch(() => undefined); };
    document.addEventListener("visibilitychange", onVis);
    return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [playing, useVideo]);

  /* Subtle mouse-responsive lighting (transform only) */
  useEffect(() => {
    if (cap.touch || reduced) return;
    let raf = 0; let tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 60; ty = (e.clientY / window.innerHeight - 0.5) * 40;
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; if (lightRef.current) lightRef.current.style.transform = `translate(${tx}px, ${ty}px)`; });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => { window.removeEventListener("mousemove", onMove); if (raf) cancelAnimationFrame(raf); };
  }, [cap.touch, reduced]);

  const togglePlay = () => { const v = videoRef.current; if (!v) return; if (v.paused) { v.play().catch(() => undefined); setPlaying(true); } else { v.pause(); setPlaying(false); } };

  const d = (ms: number) => ({ animationDelay: `${ms}ms` });

  return (
    <section ref={sectionRef} className="relative isolate flex min-h-[100svh] items-end overflow-hidden bg-navy-950 text-white film-grain" aria-label="Introduction">
      {/* Poster (always present — instant paint) */}
      <div aria-hidden="true" className="absolute inset-0">
        <img src={HERO_VIDEO.poster} onError={(e) => { (e.currentTarget as HTMLImageElement).src = HERO_VIDEO.fallbackPoster; }} alt="" width={1920} height={1080} fetchPriority="high" decoding="async" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/40 via-navy-900/40 to-navy-950" />
      </div>

      {/* Video */}
      {useVideo && (
        <video ref={videoRef} aria-hidden="true" className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}
          autoPlay muted loop playsInline preload={cap.mobile ? "metadata" : "auto"} disablePictureInPicture controls={false} controlsList="nodownload noplaybackrate nofullscreen"
          poster={HERO_VIDEO.poster} onCanPlay={() => setReady(true)} onError={() => { /* individual source errors bubble via last <source> */ }}>
          {cap.mobile ? <source src={HERO_VIDEO.mobile} type="video/mp4" /> : <><source src={HERO_VIDEO.webm} type="video/webm" /><source src={HERO_VIDEO.mp4} type="video/mp4" /></>}
          <source src={HERO_VIDEO.fallback} type="video/mp4" onError={() => setFailed(true)} />
        </video>
      )}

      {/* Colour grade + overlays */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-900/30 to-navy-950/95" />
      <div aria-hidden="true" className="absolute inset-0 mix-blend-soft-light bg-[radial-gradient(60%_50%_at_75%_30%,rgba(255,122,26,.55),transparent_70%),radial-gradient(50%_60%_at_20%_80%,rgba(34,53,95,.9),transparent_70%)]" />
      <div aria-hidden="true" className="absolute inset-0 vignette" />
      <div aria-hidden="true" className="absolute inset-0 blueprint-grid blueprint-grid-animated opacity-50 [--grid:rgba(255,255,255,.06)]" />
      {/* Mouse light */}
      <div ref={lightRef} aria-hidden="true" className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out will-change-transform">
        <div className="absolute left-[60%] top-[35%] h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,154,77,.18),transparent_60%)] blur-2xl" />
      </div>

      {/* Flight path (intro step 1) */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1440 800" preserveAspectRatio="none" fill="none">
        <path pathLength={1} d="M -40 620 C 260 560, 420 300, 760 330 S 1200 200, 1500 60" stroke="rgba(255,255,255,.35)" strokeWidth="1" className="anim-draw" />
        <path pathLength={1} d="M -40 620 C 260 560, 420 300, 760 330 S 1200 200, 1500 60" stroke="var(--accent)" strokeWidth="1.5" className="anim-trail" style={{ opacity: 0.8 }} />
        <g className="anim-fade-in" style={d(900)}>
          <circle cx="760" cy="330" r="3" fill="var(--accent)" /><circle cx="760" cy="330" r="10" stroke="var(--accent)" strokeOpacity=".5" />
          <text x="774" y="326" fontFamily="var(--font-mono)" fontSize="10" fill="rgba(255,255,255,.7)" letterSpacing="2">WPT 03 · 25.91N 89.44E</text>
        </g>
      </svg>

      {/* Telemetry frame */}
      <CoordinateTicks className="absolute left-16 right-16 top-20 hidden md:flex" count={12} />
      <CoordinateTicks className="absolute bottom-24 left-6 top-24 hidden xl:flex" count={8} vertical />
      <div aria-hidden="true" className="absolute right-6 top-24 hidden flex-col items-end gap-1 font-mono text-[10px] uppercase tracking-widest text-white/50 lg:flex">
        <span>ALT ——— 000 m</span><span>IAS ——— 00.0 m/s</span><span>HDG ——— 090°</span><span>LINK —— <span className="text-emerald-400">RSSI OK</span></span>
      </div>
      <FlightStageIndicator stages={STAGES} active={stage} className="absolute right-6 top-1/2 hidden -translate-y-1/2 lg:flex" />

      {/* Content */}
      <div className="container-x relative z-10 pb-24 pt-32 md:pb-28">
        <div className="max-w-4xl">
          <div className="anim-emblem inline-flex items-center gap-4" style={d(250)}>
            <Emblem size={44} />
            <div className="flex items-center gap-2 border border-white/20 bg-black/20 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[.3em] text-white/80 backdrop-blur-sm">
              <StatusDot status="active" /><span>{t("hero.status")}</span><span className="text-white">{site.team}</span>
            </div>
          </div>
          <h1 className="mt-6 overflow-hidden text-[clamp(2.6rem,9vw,7.5rem)] font-bold leading-[.95] tracking-[-0.02em]">
            <span className="anim-mask-up block" style={d(450)}>AIRBORNE</span>
            <span className="anim-mask-up block text-transparent [-webkit-text-stroke:1.5px_rgba(255,255,255,.9)]" style={d(550)}>PHOENIX</span>
          </h1>
          <p className="anim-fade-up mt-5 font-mono text-sm tracking-[.4em] text-[var(--accent)] md:text-base" style={d(800)}>{site.tagline}</p>
          <p className="anim-fade-up mt-6 max-w-xl text-base leading-relaxed text-white/80 md:text-lg" style={d(950)}>
            A student aerospace engineering team at {site.university.split(" (")[0]} designing, building and flying competition aircraft — from mission requirements to scored flight.
          </p>
          <div className="anim-fade-up mt-8 flex flex-wrap gap-3" style={d(1050)}>
            <Button to="/aircraft">{t("hero.cta.aircraft")}</Button>
            <Button to="/sponsors" variant="ghost">{t("hero.cta.sponsor")}</Button>
          </div>
          <dl className="anim-fade-up mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-5 font-mono text-[10px] uppercase tracking-widest text-white/60" style={d(1150)}>
            <div><dt>Programme</dt><dd className="mt-1 text-sm text-white">AP-2 · Mk II</dd></div>
            <div><dt>Season</dt><dd className="mt-1 text-sm text-white">2025–26</dd></div>
            <div><dt>Divisions</dt><dd className="mt-1 text-sm text-white">08 active</dd></div>
          </dl>
        </div>
      </div>

      {/* Bottom bar: scroll hint, progress, controls */}
      <div className="absolute inset-x-0 bottom-0 z-10">
        <div className="container-x flex items-center justify-between pb-5">
          <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[.3em] text-white/60">
            <span className="relative block h-8 w-px overflow-hidden bg-white/20"><span className="anim-scroll-hint absolute inset-x-0 top-0 h-3 bg-white" /></span>Scroll
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggleMotion} className="hidden h-9 items-center border border-white/25 px-3 font-mono text-[10px] uppercase tracking-widest text-white/80 hover:border-white/60 sm:inline-flex" aria-pressed={userReduced}>{userReduced ? "Motion reduced" : "Reduce motion"}</button>
            {useVideo && (
              <button onClick={togglePlay} aria-label={playing ? "Pause background video" : "Play background video"} aria-pressed={!playing} className="grid h-9 w-9 place-items-center border border-white/25 text-white/80 hover:border-white/60">
                {playing ? <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M7 5h4v14H7zM13 5h4v14h-4z" /></svg> : <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>}
              </button>
            )}
          </div>
        </div>
        <div aria-hidden="true" className="h-px w-full bg-white/10"><div className="h-full bg-[var(--accent)] transition-transform duration-150 ease-out origin-left" style={{ transform: `scaleX(${progress})` }} /></div>
      </div>
    </section>
  );
}
