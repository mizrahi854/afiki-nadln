'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { cyprus } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap';
import em from '../em/em.module.css';
import s from './CyprusTeaser.module.css';

/**
 * Home teaser for the Cyprus page: the about block's title language on one side, three of the page's example
 * photos in chamfered frames on the other. The photos drift at different speeds while the section scrolls by.
 */
export function CyprusTeaser() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference) and (min-width: 1025px)', () => {
      root.current!.querySelectorAll<HTMLElement>('[data-drift]').forEach((el) => {
        gsap.fromTo(el, { yPercent: Number(el.dataset.drift) }, { yPercent: -Number(el.dataset.drift), ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
      });
    });
  }, { scope: root });

  return (
    <section ref={root} className={`${em.wrap} ${s.section}`} aria-labelledby="cyprus-home-title">
      <div className={s.text}>
        <p className={em.kicker}>{cyprus.kicker}</p>
        <h2 id="cyprus-home-title" className={s.title}>
          <span className={s.lead}><i className={em.diamond} aria-hidden /><span aria-hidden />השקעות</span>
          <strong>בקפריסין</strong>
        </h2>
        <p className={s.lede}>{cyprus.p[0]} יוסי מכהן היום כסמנכ״ל מכירות ב־Horizon Property Group, הפעילה בפאפוס משנת 2015.</p>
        <ul className={s.list}>
          {cyprus.services.slice(0, 5).map((t) => <li key={t}><i className={em.diamond} aria-hidden />{t}</li>)}
        </ul>
        <Link className={em.poly} href="/cyprus"><ArrowLeft aria-hidden strokeWidth={1.4} />לנכסים בקפריסין</Link>
      </div>
      <div className={s.mosaic} aria-hidden>
        {[0, 1, 8].map((n, i) => (
          <figure key={n} className={s.pic} data-drift={[4, 10, 7][i]}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cyprus.gallery[n]} alt="" loading="lazy" />
          </figure>
        ))}
        <span className={s.badge}>פאפוס · קפריסין</span>
      </div>
    </section>
  );
}
