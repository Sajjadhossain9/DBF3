import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { gallery, galleryCategories, type GalleryCategory, type GalleryItem } from "@/data/gallery";
import { px } from "@/data/media";
import { useLocation } from "react-router-dom";
import { useCopy, useKey } from "@/hooks";
import { absUrl } from "@/utils/url";
import { Picture, Tag, Close } from "./ui";
import { EngineeringLabel } from "./graphics";

const PAGE = 9;
const srcOf = (g: GalleryItem, w = 1600) => g.src ?? px(g.pexelsId!, w);

function Lightbox({ items, index, onClose, onNav }: { items: GalleryItem[]; index: number; onClose: () => void; onNav: (i: number) => void }) {
  const it = items[index];
  const { copied, copy } = useCopy();
  const start = useRef<number | null>(null);
  const prev = useCallback(() => onNav((index - 1 + items.length) % items.length), [index, items.length, onNav]);
  const next = useCallback(() => onNav((index + 1) % items.length), [index, items.length, onNav]);
  useKey(useCallback((e: KeyboardEvent) => { if (e.key === "Escape") onClose(); if (e.key === "ArrowLeft") prev(); if (e.key === "ArrowRight") next(); }, [onClose, prev, next]));
  useEffect(() => { const p = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = p; }; }, []);
  const share = async () => {
    const url = absUrl("/gallery", it.id);
    if (navigator.share) { try { await navigator.share({ title: it.caption, url }); return; } catch { /* cancelled */ } }
    copy(url);
  };
  return (
    <div role="dialog" aria-modal="true" aria-label="Media viewer" className="fixed inset-0 z-[90] flex flex-col bg-navy-950/95 text-white backdrop-blur-sm anim-fade-in"
      onTouchStart={(e) => { start.current = e.touches[0].clientX; }} onTouchEnd={(e) => { if (start.current == null) return; const dx = e.changedTouches[0].clientX - start.current; if (Math.abs(dx) > 50) (dx > 0 ? prev : next)(); start.current = null; }}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="font-mono text-[11px] uppercase tracking-widest text-white/60">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")} · {it.category}</div>
        <div className="flex items-center gap-1">
          <button onClick={share} className="h-10 border border-white/25 px-3 font-mono text-[10px] uppercase tracking-widest hover:border-white/60">{copied ? "Link copied ✓" : "Share"}</button>
          {it.downloadable && <a href={srcOf(it, 1600)} download className="h-10 border border-white/25 px-3 font-mono text-[10px] uppercase leading-10 tracking-widest hover:border-white/60">Download</a>}
          <button onClick={onClose} aria-label="Close" className="grid h-10 w-10 place-items-center border border-white/25 hover:border-white/60"><Close /></button>
        </div>
      </div>
      <div className="relative flex flex-1 items-center justify-center px-4 md:px-16">
        <button onClick={prev} aria-label="Previous" className="absolute left-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/25 glass md:left-4"><svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 6l-6 6 6 6" /></svg></button>
        <div key={it.id} className="max-h-[70vh] w-full max-w-6xl anim-fade-up" style={{ aspectRatio: `${it.w}/${it.h}` }}>
          {it.type === "video" ? <video src={it.src} poster={it.poster} controls playsInline preload="metadata" className="h-full w-full object-contain" /> : <img src={srcOf(it, 1600)} alt={it.caption} className="h-full w-full object-contain" />}
        </div>
        <button onClick={next} aria-label="Next" className="absolute right-2 top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center border border-white/25 glass md:right-4"><svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M9 6l6 6-6 6" /></svg></button>
      </div>
      <div className="px-4 py-4 md:px-16"><p className="text-sm md:text-base">{it.caption}</p><p className="mt-1 font-mono text-[10px] uppercase tracking-widest text-white/50">{it.date}{it.credit && ` · ${it.credit}`}{!it.downloadable && " · Download not permitted"}</p></div>
    </div>
  );
}

export default function Gallery({ initial = "All", limit }: { initial?: GalleryCategory; limit?: number }) {
  const [cat, setCat] = useState<GalleryCategory>(initial);
  const [shown, setShown] = useState(limit ?? PAGE);
  const [open, setOpen] = useState<number | null>(null);
  const { hash } = useLocation();
  const items = useMemo(() => (cat === "All" ? gallery : gallery.filter((g) => g.category === cat)), [cat]);
  useEffect(() => { setShown(limit ?? PAGE); }, [cat, limit]);
  useEffect(() => { const id = hash.slice(1); const i = items.findIndex((g) => g.id === id); if (i >= 0) setOpen(i); }, [items, hash]);
  const visible = items.slice(0, shown);
  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-1.5" role="tablist" aria-label="Gallery filters">
        {galleryCategories.map((c) => <Tag key={c} active={cat === c} onClick={() => setCat(c)}>{c}</Tag>)}
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4 [&>*]:break-inside-avoid">
        {visible.map((g, i) => (
          <button key={g.id} onClick={() => setOpen(i)} className="group block w-full text-left anim-fade-up" style={{ animationDelay: `${(i % PAGE) * 40}ms` }}>
            <div className="img-mask relative border border-line">
              {g.type === "video" ? <div className="relative" style={{ aspectRatio: `${g.w}/${g.h}` }}><img src={g.poster} alt={g.caption} loading="lazy" className="absolute inset-0 h-full w-full object-cover" width={1200} height={675} /><span className="absolute inset-0 grid place-items-center"><span className="grid h-14 w-14 place-items-center rounded-full border border-white/60 bg-black/40 text-white backdrop-blur-sm transition-transform duration-500 group-hover:scale-110"><svg aria-hidden="true" className="ml-1 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></span></span></div>
                : <Picture id={g.pexelsId} src={g.src} alt={g.caption} ratio={`${g.w}/${g.h}`} sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw" />}
              <div className="absolute left-3 top-3 flex gap-1.5"><EngineeringLabel className="glass">{g.category}</EngineeringLabel></div>
            </div>
            <div className="flex items-start justify-between gap-3 py-3"><p className="text-sm text-muted transition-colors group-hover:text-fg">{g.caption}</p><span className="shrink-0 font-mono text-[10px] uppercase tracking-widest text-faint">{g.date === "Pending confirmation" ? "Date TBC" : g.date}</span></div>
          </button>
        ))}
      </div>
      {!limit && shown < items.length && <div className="mt-6 text-center"><button onClick={() => setShown((s) => s + PAGE)} className="min-h-11 border border-line px-6 font-mono text-[11px] uppercase tracking-widest text-muted hover:border-line-strong hover:text-fg">Load more ({items.length - shown})</button></div>}
      {open !== null && items[open] && <Lightbox items={items} index={open} onClose={() => { setOpen(null); if (hash) history.replaceState(null, "", location.href.replace(/#[^#/][^#]*$/, "")); }} onNav={setOpen} />}
      <p className={cn("mt-6 font-mono text-[10px] uppercase tracking-widest text-faint")}>Upload team media to /public/images/gallery and /public/videos/engineering, then register it in src/data/gallery.ts.</p>
    </div>
  );
}
