'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import s from './blocks.module.css';

/**
 * Emerald's project gallery: a full-width strip showing two photos at a time (three on phones), infinite,
 * advancing every 3s with a 1s slide, paused on hover and after any interaction; diamond arrows on both edges.
 * Phones: one large photo at a time below the header bar.
 */
export function EmCarousel({ images, label }: { images: string[]; label: string }) {
  const [per, setPer] = useState(2);
  const n = images.length;
  const loop = n > per;
  const [i, setI] = useState(per);
  const [anim, setAnim] = useState(true);
  const paused = useRef(false);
  const touched = useRef(false);

  useEffect(() => {
    const m = matchMedia('(max-width: 767px)');
    const f = () => { const p = m.matches ? 1 : 2; setPer(p); setAnim(false); setI(p); };
    f(); m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);

  const go = useCallback((d: number) => { setAnim(true); setI((x) => x + d); }, []);
  useEffect(() => {
    if (!loop || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => { if (!paused.current && !touched.current) go(1); }, 3000);
    return () => clearInterval(t);
  }, [go, loop]);

  const slides = loop ? [...images.slice(-per), ...images, ...images.slice(0, per)] : images;
  const onEnd = () => {
    if (!loop) return;
    if (i >= n + per) { setAnim(false); setI(i - n); }
    if (i < per) { setAnim(false); setI(i + n); }
  };
  useEffect(() => { if (!anim) { const r = requestAnimationFrame(() => setAnim(true)); return () => cancelAnimationFrame(r); } }, [anim]);

  const user = (d: number) => { touched.current = true; go(d); };
  const shown = ((i - per) % n + n) % n;

  return (
    <section className={s.car} aria-roledescription="carousel" aria-label={label}
      onMouseEnter={() => (paused.current = true)} onMouseLeave={() => (paused.current = false)}>
      <div className={s.carView}>
        <div className={s.carTrack} onTransitionEnd={onEnd}
          style={{ transform: `translateX(${(loop ? i : 0) * (100 / per)}%)`, transition: anim ? 'transform 1s ease' : 'none', ['--per' as string]: per }}>
          {slides.map((src, k) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={k} src={src} alt={k - (loop ? per : 0) >= 0 && k - (loop ? per : 0) < n ? `${label}, תמונה ${k - (loop ? per : 0) + 1}` : ''} loading={k < per * 2 ? 'eager' : 'lazy'} />
          ))}
        </div>
      </div>
      {loop && (
        <>
          <button type="button" className={`${s.carBtn} ${s.carPrev}`} aria-label="התמונה הקודמת" onClick={() => user(-1)}><span><ArrowRight aria-hidden strokeWidth={1.4} /></span></button>
          <button type="button" className={`${s.carBtn} ${s.carNext}`} aria-label="התמונה הבאה" onClick={() => user(1)}><span><ArrowLeft aria-hidden strokeWidth={1.4} /></span></button>
          <p className="sr-only" aria-live="polite">תמונה {shown + 1} מתוך {n}</p>
        </>
      )}
    </section>
  );
}
