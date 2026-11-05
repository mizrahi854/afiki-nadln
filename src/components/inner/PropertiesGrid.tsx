'use client';

import { useMemo, useRef, useState } from 'react';
import { type Listing, kindLabels, kindOf, place, price, type Kind } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap';
import { PhotoCard } from './PhotoCard';
import s from './pages.module.css';

const facts = (l: Listing) => [l.rooms && `${l.rooms} חדרים`, l.size && `${l.size} מ״ר`, l.baths && `${l.baths} חדרי רחצה`].filter(Boolean).join(' · ');

/** All listings in Emerald's three-column grid, filtered by kind and neighborhood. Cards re-enter on each filter change. */
export function PropertiesGrid({ items, initialArea = 'all' }: { items: Listing[]; initialArea?: string }) {
  const root = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<'all' | Kind>('all');
  const [area, setArea] = useState(initialArea);
  const areas = useMemo(() => ['all', ...Array.from(new Set(items.map((l) => l.area ?? l.city)))], [items]);
  const shown = items.filter((l) => (kind === 'all' || kindOf(l) === kind) && (area === 'all' || (l.area ?? l.city) === area));
  const kinds = kindLabels.filter((k) => k.id === 'all' || items.some((l) => kindOf(l) === k.id));

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo('[data-r="img"]', { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'expo.out', stagger: 0.06, clearProps: 'transform,opacity' });
      });
    },
    { scope: root, dependencies: [kind, area] },
  );

  return (
    <div ref={root}>
      <div className={s.filters}>
        <div role="radiogroup" aria-label="סוג נכס" className={s.pills}>
          {kinds.map((k) => (
            <button key={k.id} type="button" role="radio" aria-checked={kind === k.id} onClick={() => setKind(k.id)}>{k.label}</button>
          ))}
        </div>
        <label className={s.select}>
          <span>שכונה</span>
          <select value={area} onChange={(e) => setArea(e.target.value)}>
            {areas.map((a) => <option key={a} value={a}>{a === 'all' ? 'כל השכונות' : a}</option>)}
          </select>
        </label>
        <p className={s.count} aria-live="polite">{shown.length} נכסים</p>
      </div>

      {shown.length ? (
        <div className={s.grid3}>
          {shown.map((l) => (
            <PhotoCard key={l.id} href={`/properties/${l.id}`} img={l.images[0]} name={l.title} side={price(l.price)} meta={place(l)}
              line={facts(l) || l.types.slice(0, 2).join(' · ')} badge={l.labels.find((x) => /בלעדי/.test(x)) ? 'בלעדי' : l.labels.find((x) => /חדש/.test(x)) ? 'חדש בשוק' : undefined} />
          ))}
        </div>
      ) : (
        <div className={s.empty}>
          <p>אין כרגע נכסים שמתאימים לסינון הזה.</p>
          <button type="button" onClick={() => { setKind('all'); setArea('all'); }}>לכל הנכסים</button>
        </div>
      )}
    </div>
  );
}
