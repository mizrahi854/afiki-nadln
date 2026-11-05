'use client';

import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import em from './em.module.css';
import s from './blocks.module.css';

export type Step = { title?: string; text: string };

/**
 * Emerald's "BUILDING THE FUTURE" process: above 1025px the block pins and the numbered steps travel sideways
 * (x → scrollWidth − innerWidth, scrubbed; pinned for 1.1× that distance) while the photo on the left is revealed
 * from the bottom by a moving mask. Phones: steps stack, the photo reveals over the block's height.
 * The source also draws an outline of the building in SVG over the photo; there is no such drawing for Afikey.
 */
export function HScroll({ kicker, title, img, steps }: { kicker: string; title: string; img: string; steps: Step[] }) {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    const el = root.current!;
    const track = el.querySelector<HTMLElement>(`.${s.steps}`)!;
    const pic = el.querySelector<HTMLElement>(`.${s.procImg}`)!;
    const mm = gsap.matchMedia();
    mm.add('(min-width: 1026px) and (prefers-reduced-motion: no-preference)', () => {
      const dist = () => Math.max(0, track.scrollWidth - innerWidth);
      gsap.to(track, { x: dist, ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true } });
      ScrollTrigger.create({ trigger: el, start: 'top top', end: () => `+=${dist() * 1.1}`, pin: true, anticipatePin: 1 });
      gsap.fromTo(pic, { '--reveal': '0%' }, { '--reveal': '100%', ease: 'none', scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist() * 1.1}`, scrub: true } });
    });
    mm.add('(max-width: 1025px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo(pic, { '--reveal': '0%' }, { '--reveal': '100%', ease: 'none', scrollTrigger: { trigger: el, start: 'top 70%', end: 'bottom bottom', scrub: true } });
    });
  }, { scope: root });

  return (
    <section ref={root} className={s.proc} aria-label={title}>
      <div className={s.procPic} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={s.procImg} src={img} alt="" />
      </div>
      <div className={`${em.frame} ${s.procHead}`}>
        <p className={em.kicker}>{kicker}</p>
        <div className={em.ruleRow}><i className={em.diamond} /><span className={em.line} /><h2>{title}</h2><span className={em.line} /><i className={em.diamond} /></div>
      </div>
      <ol className={s.steps}>
        {steps.map((st, i) => (
          <li key={i} className={s.step}>
            <span className={s.num}>{String(i + 1).padStart(2, '0')}</span>
            <div>
              {st.title && <h3>{st.title}</h3>}
              <p>{st.text}</p>
            </div>
            <span className={s.stem} aria-hidden><i className={em.diamond} /></span>
          </li>
        ))}
      </ol>
      <span className={s.base} aria-hidden />
    </section>
  );
}
