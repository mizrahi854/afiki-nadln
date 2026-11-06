'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap } from '@/lib/gsap';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { type Listing, kindLabels, kindOf, price, type Kind } from '@/lib/core';
import { EmCard } from './EmCard';
import s from './ListingBrowser.module.css';

const facts = (l: Listing) => [price(l.price), l.rooms && `${l.rooms} חד׳`, l.size && `${l.size} מ״ר`].filter(Boolean).join(' · ');
const areaOf = (l: Listing) => l.area ?? l.city;

/**
 * Listings grid with Afikey's own search fields (free text "לדוגמא: 5 חדרים בפסגות אפק", city), plus type and
 * neighborhood. Emerald's projects page has no filters; the row is built from Emerald's own pieces (links at 50%
 * that go full with a stroke, 1px rules), and the state lives in the URL so the page doubles as search results.
 */
export function ListingBrowser({ items, noun = 'נכסים למכירה' }: { items: Listing[]; noun?: string }) {
  const params = useSearchParams();
  const grid = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  // The site-wide entrance hides cards below the fold until they scroll in. A filter moves those cards up into
  // view without any scrolling, so show whatever is still waiting, in the same rise-and-unblur language.
  const key = params.toString();
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    const waiting = grid.current?.querySelectorAll<HTMLElement>('[style]');
    if (waiting?.length) gsap.to(waiting, { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', clipPath: 'inset(0% 0% 0% 0%)', duration: 0.7, ease: 'power3.out', stagger: 0.04, overwrite: true, clearProps: 'all' });
  }, [key]);
  const router = useRouter();
  const path = usePathname();
  const [q, setQ] = useState(params.get('q') ?? '');
  const kind = (params.get('kind') ?? 'all') as 'all' | Kind;
  const city = params.get('city') ?? 'all';
  const area = params.get('area') ?? 'all';
  // set by the home page search
  const rooms = Number(params.get('rooms')) || 0;
  const max = Number(params.get('max')) || 0;

  const set = (k: string, v: string) => {
    const p = new URLSearchParams(params.toString());
    if (!v || v === 'all') p.delete(k); else p.set(k, v);
    router.replace(`${path}${p.size ? `?${p}` : ''}#all`, { scroll: false });
  };

  const cities = useMemo(() => Array.from(new Set(items.map((l) => l.city))).sort(), [items]);
  const areas = useMemo(() => Array.from(new Set(items.filter((l) => city === 'all' || l.city === city).map(areaOf))), [items, city]);
  const kinds = kindLabels.filter((k) => k.id === 'all' || items.some((l) => kindOf(l) === k.id));
  const words = (params.get('q') ?? '').trim().split(/\s+/).filter(Boolean);
  const shown = items.filter((l) => {
    if (kind !== 'all' && kindOf(l) !== kind) return false;
    if (city !== 'all' && l.city !== city) return false;
    if (area !== 'all' && areaOf(l) !== area) return false;
    if (rooms && (l.rooms ?? 0) < rooms) return false;
    if (max && (!l.price || l.price > max)) return false;
    const hay = [l.title, l.area, l.city, l.types.join(' '), l.rooms && `${l.rooms} חדרים`].join(' ');
    return words.every((w) => hay.includes(w));
  });
  const any = kind !== 'all' || city !== 'all' || area !== 'all' || rooms > 0 || max > 0 || words.length > 0;

  return (
    <div className={s.root}>
      <form className={s.bar} role="search" aria-label="חיפוש נכסים" onSubmit={(e) => { e.preventDefault(); set('q', q.trim()); }}>
        <div className={s.kinds} role="radiogroup" aria-label="סוג נכס">
          {kinds.map((k) => (
            <button key={k.id} type="button" role="radio" aria-checked={kind === k.id} onClick={() => set('kind', k.id)}>{k.label}</button>
          ))}
        </div>
        <label className={s.field}>
          <span className="sr-only">היכן מחפשים?</span>
          <select value={city} onChange={(e) => { set('city', e.target.value); }}>
            <option value="all">היכן מחפשים?</option>
            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label className={s.field}>
          <span className="sr-only">שכונה</span>
          <select value={area} onChange={(e) => set('area', e.target.value)}>
            <option value="all">כל השכונות</option>
            {areas.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </label>
        <label className={`${s.field} ${s.text}`}>
          <span className="sr-only">חיפוש חופשי</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="חיפוש חופשי, לדוגמה: 5 חדרים בפסגות אפק" />
          <button type="submit" aria-label="חיפוש"><Search aria-hidden strokeWidth={1.5} /></button>
        </label>
      </form>
      <div className={s.meta}>
        <p aria-live="polite">{shown.length === items.length ? `${items.length} ${noun}` : `${shown.length} מתוך ${items.length} נכסים`}</p>
        {any && <button type="button" onClick={() => { setQ(''); router.replace(`${path}#all`, { scroll: false }); }}><X aria-hidden strokeWidth={1.5} />ניקוי הסינון</button>}
      </div>

      {shown.length ? (
        <div ref={grid} className={s.grid}>
          {shown.map((l) => (
            <EmCard key={l.id} href={`/properties/${l.id}`} img={l.images[0]} name={l.title} place={areaOf(l)} desc={facts(l)} />
          ))}
        </div>
      ) : (
        <div className={s.empty}>
          <p>לא מצאנו נכס שמתאים לחיפוש הזה.</p>
          <p>נסו מילה אחרת, או השאירו פרטים ויוסי יחזור אליכם כשייכנס נכס מתאים.</p>
          <button type="button" onClick={() => { setQ(''); router.replace(`${path}#all`, { scroll: false }); }}>לכל הנכסים</button>
        </div>
      )}
    </div>
  );
}
