'use client';

import { useRef, useState } from 'react';
import { ArrowLeft, ArrowDown, MapPin, Home, LayoutGrid, Wallet, ChevronDown, Search } from 'lucide-react';
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
/**
 * The approved hero image, fitted to one screen: the photo and everything pinned to it (the word, the kicker,
 * and the Psagot Afek tag) sit on a 1536×1024 canvas that covers the viewport from the top; the search sits on
 * the screen itself, above its bottom edge. The header is the shared site header.
 */
export function Hero({ areas }: { areas: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  const fields = fieldsFor(areas);
  const [tab, setTab] = useState<(typeof tabs)[number]['id']>('sale');

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

    </section>
  );
}
