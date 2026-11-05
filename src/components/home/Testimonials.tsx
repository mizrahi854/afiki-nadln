'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { testimonials } from '@/lib/core';
import { gsap, useGSAP } from '@/lib/gsap';
import { Rule } from '../em/Rule';
import em from '../em/em.module.css';
import s from './Testimonials.module.css';

const HOLD = 8000;
const pad = (n: number) => String(n).padStart(2, '0');

/**
 * Client reviews in the inner pages' language: one quote at a time inside a wide double-outlined octagon,
 * diamond arrows on its edges, the names underneath as a switch (header-link treatment), and a 1px rule that
 * fills while the quote holds. A new quote comes in word by word with the same bottom-up clip as the
 * scrolled headings. Pauses on hover and focus.
 */
export function Testimonials() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = testimonials.length;
  const go = (d: number) => setI((x) => (x + d + n) % n);

  useEffect(() => {
    if (paused || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % n), HOLD);
    return () => clearTimeout(t);
  }, [i, paused, n]);

  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from(root.current!.querySelectorAll('[data-w]'), { clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, y: 8, duration: 0.6, stagger: 0.025, ease: 'power2.out', clearProps: 'all' });
      gsap.from(root.current!.querySelectorAll('[data-who]'), { opacity: 0, y: 10, duration: 0.6, delay: 0.3, ease: 'power2.out', clearProps: 'all' });
    });
  }, { scope: root, dependencies: [i] });

  const r = testimonials[i];
  return (
    <section className={`${s.section} ${em.lines}`} ref={root} aria-labelledby="voices-title" aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <Rule kicker="מה לקוחות מספרים?" title="המלצות" id="voices-title" />

      <div className={s.stage}>
        <button type="button" className={`${s.arrow} ${s.prev}`} aria-label="ההמלצה הקודמת" onClick={() => go(-1)}><span><ArrowRight aria-hidden strokeWidth={1.4} /></span></button>
        <figure className={`${em.frame} ${s.card}`} aria-live={paused ? 'polite' : 'off'}>
          <span className={s.mark} aria-hidden>”</span>
          <blockquote className={s.quote} key={i}>
            {r.text.split(' ').map((w, k) => <span key={k} data-w>{w} </span>)}
          </blockquote>
          <figcaption className={em.ruleRow} data-who>
            <i className={em.diamond} /><span className={em.line} />
            <p className={s.name}>{r.name}</p>
            <span className={em.line} /><i className={em.diamond} />
          </figcaption>
          <span className={s.src}>לקוח של אפיקי נדל״ן · מתוך עמוד האודות באתר המשרד</span>
        </figure>
        <button type="button" className={`${s.arrow} ${s.next}`} aria-label="ההמלצה הבאה" onClick={() => go(1)}><span><ArrowLeft aria-hidden strokeWidth={1.4} /></span></button>
      </div>

      <div className={s.foot}>
        <span className={s.count} aria-hidden>{pad(i + 1)} / {pad(n)}</span>
        <span className={s.track} aria-hidden><i key={`${i}-${paused}`} data-run={!paused || undefined} style={{ animationDuration: `${HOLD}ms` }} /></span>
        <div className={s.names} role="tablist" aria-label="בחירת המלצה">
          {testimonials.map((t, k) => (
            <button key={t.name} type="button" role="tab" aria-selected={k === i} onClick={() => setI(k)}>{t.name}</button>
          ))}
        </div>
      </div>
    </section>
  );
}
