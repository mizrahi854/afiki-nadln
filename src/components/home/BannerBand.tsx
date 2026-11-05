'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import em from '../em/em.module.css';
import s from './BannerBand.module.css';

const places = ['פסגות אפק', 'גבעת טל', 'נווה אפק', 'גבעת הסלעים', 'נופרים', 'מצפה אפק'];

/**
 * The original site's home banner (Psagot Afek from across the road) as a full-bleed band: the photo opens
 * from a narrow window as the band scrolls in and drifts slower than the page, and the neighborhood in the
 * line swaps every 2.6s through a blur.
 */
export function BannerBand() {
  const root = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const t = setInterval(() => setI((x) => (x + 1) % places.length), 2600);
    return () => clearInterval(t);
  }, []);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      const img = root.current!.querySelector('img');
      gsap.fromTo(root.current!.querySelector('[data-window]'), { clipPath: 'inset(16% 12% 16% 12%)' },
        { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: root.current, start: 'top 95%', end: 'top 25%', scrub: true } });
      gsap.fromTo(img, { yPercent: -10, scale: 1.18 }, { yPercent: 10, scale: 1.05, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }, { scope: root });

  return (
    <section ref={root} className={s.band} aria-labelledby="band-title" data-no-motion>
      <div className={s.window} data-window>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/banners/home-banner.jpg" alt="המגדלים ומרכז המסחר בשכונת פסגות אפק, ראש העין" loading="lazy" />
        <span className={s.shade} aria-hidden />
      </div>
      <div className={s.text}>
        <p className={s.kicker}>אפיקי נדל״ן · ראש העין</p>
        <h2 id="band-title" className={s.title}>
          הבית הבא שלכם
          <span className={s.swap} aria-live="off">
            <span className={s.word} key={places[i]}>ב{places[i]}</span>
          </span>
        </h2>
        <Link className={`${em.poly} ${s.cta}`} data-tone="light" href="/neighborhoods"><ArrowLeft aria-hidden strokeWidth={1.4} />למדריכי השכונות</Link>
      </div>
    </section>
  );
}
