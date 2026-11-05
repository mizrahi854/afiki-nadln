'use client';

import { useEffect, useRef, useState } from 'react';
import { Quote } from 'lucide-react';
import { reviews } from '@/lib/content';
import { useReveal } from '@/lib/reveal';
import s from './Voices.module.css';

const HOLD = 7000;

/**
 * Client reviews (real, from the live site), after the AEVUM reviews block: a two-tone heading with a short
 * note opposite, then a white quote card beside a large interior photo with the people row on the photo.
 * Auto-advances; pauses on hover/focus.
 */
export function Voices() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  useReveal(root);

  useEffect(() => {
    if (paused || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setTimeout(() => setI((x) => (x + 1) % reviews.length), HOLD);
    return () => clearTimeout(t);
  }, [i, paused]);

  const r = reviews[i];
  return (
    <section className={s.section} ref={root} aria-labelledby="voices-title">
      <header className={s.head}>
        <div>
          <p className={s.eyebrow} data-r="up">05 / לקוחות</p>
          <h2 id="voices-title" className={s.title} data-r="up">מה הלקוחות מספרים<br /><span>על העבודה איתנו</span></h2>
        </div>
        <p className={s.note} data-r="up">קונים ומוכרים שליווינו בראש העין, במילים שלהם, כפי שפורסמו באתר אפיקי נדל״ן.</p>
      </header>

      <div
        className={s.grid}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <figure className={s.card} data-r="up">
          <div className={s.cardTop}>
            <span className={s.tag}>סיפור לקוח</span>
            <span className={s.count} aria-hidden>{String(i + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}</span>
          </div>
          <Quote className={s.mark} size={30} strokeWidth={1.3} aria-hidden />
          <blockquote key={i} className={s.quote}>{r.text}</blockquote>
          <figcaption className={s.who}>
            <span className={s.initial} aria-hidden>{r.name[0]}</span>
            <span><b>{r.name}</b><small>לקוח של אפיקי נדל״ן</small></span>
          </figcaption>
          <span className={s.progress} aria-hidden><i key={`${i}-${paused}`} data-run={!paused || undefined} style={{ animationDuration: `${HOLD}ms` }} /></span>
        </figure>

        <div className={s.photo} data-r="img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/misc/living.webp" alt="סלון בבית בגבעת טל, מתוך נכס שאפיקי נדל״ן שיווקה" loading="lazy" />
          <div className={s.people} role="tablist" aria-label="בחירת המלצה">
            {reviews.map((x, n) => (
              <button key={x.name} role="tab" aria-selected={n === i} aria-label={x.name} onClick={() => setI(n)}>{x.name[0]}</button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
