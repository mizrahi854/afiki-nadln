'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, MapPin, Home, LayoutGrid, Wallet, ChevronDown, Play, Search, X } from 'lucide-react';
import { SITE } from '@/lib/content';
import { kindLabels } from '@/lib/core';
import { gsap, useGSAP } from '@/lib/gsap';
import em from './em/em.module.css';
import s from './Hero.module.css';

/* Sale searches run on the local listings page (its filters live in the URL); rentals are only on the live site. */
const tabs = [
  { id: 'sale', label: 'למכירה', action: '/properties#all' },
  { id: 'rent', label: 'להשכרה', action: `${SITE}/for-rent/` },
] as const;
/** The four search fields; the neighborhoods come from the listings (passed in by the page, so the data stays on the server) */
const fieldsFor = (areas: string[]) => [
  { id: 'area', icon: MapPin, label: 'שכונה', options: [['all', 'כל השכונות'], ...areas.map((a) => [a, a])] },
  { id: 'kind', icon: Home, label: 'סוג הנכס', options: kindLabels.map((k) => [k.id, k.id === 'all' ? 'כל הנכסים' : k.label]) },
  { id: 'rooms', icon: LayoutGrid, label: 'חדרים', options: [['all', 'לבחירתכם'], ['3', '3+ חדרים'], ['4', '4+ חדרים'], ['5', '5+ חדרים'], ['6', '6+ חדרים']] },
  { id: 'max', icon: Wallet, label: 'תקציב', options: [['all', 'ללא הגבלה'], ['2500000', 'עד 2.5 מיליון ₪'], ['3000000', 'עד 3 מיליון ₪'], ['4000000', 'עד 4 מיליון ₪'], ['6000000', 'עד 6 מיליון ₪']] },
];
/** Three real videos published on afikeynadlan.co.il (behind "01 / 03"). Captions say what each one shows. */
const videos = [
  { kind: 'mp4' as const, src: '/media/video/psagot-afek-garden.mp4', id: '', caption: 'דירת גן בפסגות אפק B — מתוך מודעה באתר אפיקי נדל״ן' },
  { kind: 'youtube' as const, src: '', id: 'HEYIIO90TKc', caption: '5 חדרים בפסגות אפק — סרטון מערוץ אפיקי נדל״ן' },
  { kind: 'youtube' as const, src: '', id: 'ViJEXgE1l74', caption: 'מצפה אפק — סרטון מערוץ אפיקי נדל״ן' },
];
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * The approved hero image, fitted to one screen: the photo and everything pinned to it (the word, the kicker,
 * the Psagot Afek tag) sit on a 1536×1024 canvas that covers the viewport from the top; the video card, the line
 * and the search sit on the screen itself, above its bottom edge. The header is the shared site header.
 */
export function Hero({ areas }: { areas: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const fields = fieldsFor(areas);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('sale');
  const [video, setVideo] = useState(0);
  const [open, setOpen] = useState(false);

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);
        gsap.timeline({ defaults: { ease: 'power3.out', clearProps: 'transform,opacity' } })
          .from(q('[data-a="photo"]'), { scale: 1.04, duration: 1.1, ease: 'power2.out', transformOrigin: '50% 70%' }, 0)
          .from(q('[data-a="word"]'), { yPercent: 26, opacity: 0, duration: 1 }, 0.1)
          .from(q('[data-a="kicker"]'), { y: 26, opacity: 0, duration: 0.8 }, 0.25)
          .from(q('[data-a="ui"]'), { y: 18, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.45)
          .from(q('[data-a="search"]'), { y: 40, opacity: 0, duration: 0.8 }, 0.35);
      });
    },
    { scope: root },
  );

  const go = (d: number) => setVideo((x) => (x + d + videos.length) % videos.length);
  const v = videos[video];
  const sale = tab === 'sale';

  return (
    <section className={s.viewport} aria-labelledby="hero-title" ref={root}>
      <h1 id="hero-title" className="sr-only">אפיקי נדל״ן — כאן מתחיל העתיד. הכתובת שלכם לבית בראש העין.</h1>

      <div className={s.canvas}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img data-a="photo" className={s.photo} src="/media/hero/background.jpg" alt="מגדלי מגורים בראש העין בשעת שקיעה" fetchPriority="high" />
        <div className={s.word} aria-hidden="true"><span data-a="word">העתיד</span></div>
        <div className={s.kicker} aria-hidden="true" data-a="kicker">כאן מתחיל</div>
        <div className={s.pin} aria-hidden="true" data-a="ui">
          <span className={s.pinLabel}>פסגות אפק</span>
          <svg className={s.pinLine} viewBox="0 0 80 64" width="80" height="64"><line x1="78" y1="2" x2="4" y2="62" stroke="#fff" strokeWidth="1.6" /></svg>
          <span className={s.pinDot} />
        </div>
      </div>

      <div className={s.dock}>
        <div className={s.above}>
          <p className={s.tagline} data-a="ui">הכתובת שלכם לבית בראש העין.</p>
          <div className={s.media} data-a="ui">
            <div className={s.counter} aria-hidden="true">
              <span>{pad(video + 1)} / {pad(videos.length)}</span>
              <span className={s.dashes}>{videos.map((x, i) => <i key={i} data-on={i === video || undefined} />)}</span>
            </div>
            <button
              ref={opener}
              className={s.reel}
              onClick={() => { setOpen(true); dialog.current?.showModal(); }}
              aria-label={`מבט על השכונה — ניגון סרטון ${video + 1} מתוך ${videos.length}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/media/hero/background-768.jpg" alt="" className={s.reelImg} />
              <span className={s.reelShade} />
              <span className={s.play}><Play size={17} fill="currentColor" aria-hidden /></span>
              <span className={s.reelText}>מבט על השכונה</span>
            </button>
          </div>
        </div>

        {/* Search, in the inner pages' language: double-outlined octagon over frosted glass, the type switch
            like the header links, the action as the octagon button. */}
        <form className={`${em.frame} ${s.search}`} role="search" aria-label="חיפוש נכסים" data-a="search"
          action={tabs.find((t) => t.id === tab)!.action} method="get">
          <div className={s.searchHead}>
            <h2 className={s.searchTitle}>מוצאים את המקום שלכם</h2>
            <div className={s.tabs} role="radiogroup" aria-label="סוג חיפוש">
              {tabs.map((t) => (
                <button key={t.id} type="button" role="radio" aria-checked={tab === t.id} className={s.tab} onClick={() => setTab(t.id)}>{t.label}</button>
              ))}
            </div>
          </div>
          <div className={s.row}>
            <div className={s.fields}>
              {fields.map((f) => (
                <div key={f.id} className={s.field}>
                  <label htmlFor={`f-${f.id}`} className={s.label}><f.icon strokeWidth={1.4} aria-hidden />{f.label}</label>
                  <div className={s.control}>
                    <select id={`f-${f.id}`} name={sale ? f.id : undefined} defaultValue="all" disabled={!sale && f.id !== 'area'}>
                      {f.options.map(([val, txt]) => <option key={val} value={val}>{txt}</option>)}
                    </select>
                    <ChevronDown strokeWidth={1.5} aria-hidden />
                  </div>
                </div>
              ))}
            </div>
            <button type="submit" className={`${em.poly} ${s.submit}`}><Search aria-hidden strokeWidth={1.6} />חיפוש נכסים<ArrowLeft aria-hidden strokeWidth={1.6} /></button>
          </div>
        </form>

        <a className={s.down} href="#featured-title" aria-label="גלילה לנכסים" data-a="ui"><ArrowDown strokeWidth={1.4} aria-hidden /></a>
      </div>

      <dialog
        ref={dialog}
        className={s.dialog}
        aria-label="מבט על השכונה — סרטונים"
        onClose={() => { setOpen(false); opener.current?.focus(); }}
        onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}
      >
        <figure className={s.figure}>
          {open && (v.kind === 'mp4' ? (
            <video key={v.src} src={v.src} controls autoPlay playsInline />
          ) : (
            <iframe
              key={v.id}
              src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
              title={v.caption}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ))}
          <figcaption>{v.caption}</figcaption>
        </figure>
        <div className={s.dbar}>
          <span>{pad(video + 1)} / {pad(videos.length)}</span>
          <div>
            <button onClick={() => go(-1)}><ArrowRight size={18} aria-hidden /><span className="sr-only">הסרטון הקודם</span></button>
            <button onClick={() => go(1)}><ArrowLeft size={18} aria-hidden /><span className="sr-only">הסרטון הבא</span></button>
            <button onClick={() => dialog.current?.close()} autoFocus><X size={18} aria-hidden /><span className="sr-only">סגירה</span></button>
          </div>
        </div>
      </dialog>
    </section>
  );
}
