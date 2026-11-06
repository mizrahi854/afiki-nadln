'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import s from './HoodScene.module.css';

/**
 * Scroll-driven neighborhood flight (reference: the opening of the Sonyya/AEVUM video). The stage is pinned,
 * darkened, and scrolling moves the camera through real drone photos of Psagot Afek from the site's gallery:
 * wide over the neighborhood → closing in on the towers → straight down over the park → down to the street,
 * facing a tower. Each view pushes in toward the point where the next one begins, and the next one arrives
 * slightly over-scaled and settles, so the cuts read as one continuous camera move.
 * The name sits on the first view and lifts away; one short centered line holds through the flight;
 * the closing copy and the two links arrive on the last view. The next section then slides up over the stage.
 */
const views = [
  { src: '/media/hoods/gallery/psagot-afek-4.jpg', at: '50% 62%', turn: 0, pos: '50% 0%' },
  { src: '/media/psagot/fly-2.jpg', at: '50% 52%', turn: -3 },
  { src: '/media/psagot/fly-3.jpg', at: '48% 50%', turn: -6 },
  { src: '/media/psagot/fly-4.jpg', at: '50% 46%', turn: 4 },
  { src: '/media/psagot/fly-5.jpg', at: '38% 42%', turn: 0 },
  { src: '/media/psagot/fly-6.jpg', at: '26% 40%', turn: 0 },
];

export function HoodScene() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);
        const frames = q('[data-v]');
        const n = frames.length;
        gsap.set(frames, { opacity: 0 });
        gsap.set(frames[0], { opacity: 1 });
        gsap.set(q('[data-s="mid"]'), { opacity: 0, y: 18 });
        gsap.set(q('[data-s="end"] > *'), { opacity: 0, y: 28 });

        // entrance of the opening view as the section arrives: the photo settles, the lines rise out of their masks
        gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 60%', once: true } })
          .from(q('[data-v] img')[0], { scale: 1.12, duration: 1.8, ease: 'expo.out' })
          .from(q('[data-in]'), { yPercent: 110, duration: 1.1, stagger: 0.09, ease: 'expo.out' }, 0.15)
          .from(q('[data-s="intro-bar"]'), { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out' }, 0.6);

        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: root.current, start: 'top top',
            // the last screen of the section is where the next section slides over the pinned stage
            end: () => `+=${(root.current?.offsetHeight ?? 0) - 2 * window.innerHeight}`,
            scrub: 0.8, invalidateOnRefresh: true,
          },
        });

        frames.forEach((f, i) => {
          const v = views[i];
          // push in on this view across its whole segment
          tl.fromTo(f, { scale: i === 0 ? 1.04 : 1.16, rotation: 0 }, { scale: i === n - 1 ? 1.06 : 1.22, rotation: v.turn, duration: i === 0 ? 1 : 1.35 }, i === 0 ? 0 : i - 0.35);
          // the next view dissolves in over the last third, still over-scaled, so the move continues
          if (i > 0) tl.to(f, { opacity: 1, duration: 0.35, ease: 'power1.inOut' }, i - 0.35);
        });
        const T = n; // total length in view units
        tl.fromTo(q('[data-s="night"]'), { opacity: 0.28 }, { opacity: 0.55, duration: 0.8 }, 0.1)
          .to(q('[data-s="intro"] > *'), { y: -60, opacity: 0, stagger: 0.04, duration: 0.6 }, 0.15)
          .to(q('[data-s="intro-bar"]'), { y: 30, opacity: 0, duration: 0.4 }, 0.15)
          .to(q('[data-s="mid"]'), { opacity: 1, y: 0, duration: 0.4 }, 0.9)
          .to(q('[data-s="mid"]'), { opacity: 0, y: -18, duration: 0.4 }, T - 1.6)
          .to(q('[data-s="night"]'), { opacity: 0.68, duration: 0.6 }, T - 1.4)
          .to(q('[data-s="end"] > *'), { opacity: 1, y: 0, stagger: 0.08, duration: 0.5, ease: 'power2.out' }, T - 1.1)
          .fromTo(q('[data-s="bar"]'), { scaleX: 0 }, { scaleX: 1, duration: T }, 0);

        // frame counter follows the view on screen
        const count = q('[data-s="count"]')[0];
        tl.eventCallback('onUpdate', () => {
          const k = Math.min(n, Math.max(1, Math.round(tl.time() + 0.65)));
          const txt = `${String(k).padStart(2, '0')} / ${String(n).padStart(2, '0')}`;
          if (count && count.textContent !== txt) count.textContent = txt;
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="drone-flight" className={s.scene} ref={root} aria-labelledby="scene-title">
      <div className={s.stage}>
        <div className={s.views}>
          {views.map((v, i) => (
            <div key={v.src} className={s.view} data-v style={{ transformOrigin: v.at }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={v.src} style={'pos' in v ? { objectPosition: v.pos } : undefined} alt={i === 0 ? 'שכונת פסגות אפק בראש העין, צילום רחפן' : ''} loading={i < 2 ? 'eager' : 'lazy'} />
            </div>
          ))}
        </div>
        <div className={s.night} data-s="night" />
        <div className={s.vignette} />

        {/* opening view: an editorial block on the lower right of the first photo; lines rise out of masks */}
        <div className={s.intro} data-s="intro">
          <p className={s.kick}><span className={s.mask}><span data-in>מבט מהאוויר</span></span></p>
          <h2 id="scene-title" className={s.name}><span className={s.mask}><span data-in>פסגות אפק</span></span></h2>
          <p className={s.lede}><span className={s.mask}><span data-in>דירות חדשות בסטנדרט גבוה, מוקד לזוגות צעירים ומשפרי דיור.</span></span></p>
        </div>
        <p className={s.cue} data-s="intro-bar"><span>ראש העין</span><span className={s.cueGo}>גללו לטיסה מעל השכונה<ArrowDown size={15} strokeWidth={1.6} aria-hidden /></span></p>

        <p className={s.mid} data-s="mid">
          מהמבט הראשון מהאוויר ועד הכניסה לבניין:<br />שכונה על גבעה, עם טיילת, פארקים ונוף להרים.
        </p>

        <div className={s.end} data-s="end">
          <p className={s.eyebrow}>ראש העין · פסגות אפק</p>
          <p className={s.heading}>דירות חדשות, <span>בסטנדרט גבוה</span></p>
          <p className={s.body}>מחירים נוחים ודירות חדשות בבניינים בסטנדרט גבוה הביאו לנהירה לשכונה, לפיתוח מואץ ולעליית מחירים.</p>
          <div className={s.actions}>
            <Link className={s.primary} href="/neighborhoods/psagot-afek">לנכסים בפסגות אפק<ArrowLeft size={17} strokeWidth={1.8} aria-hidden /></Link>
            <Link className={s.ghost} href="/neighborhoods">לכל השכונות</Link>
          </div>
        </div>

        <div className={s.foot} aria-hidden="true">
          <span data-s="count">01 / {String(views.length).padStart(2, '0')}</span>
          <span className={s.track}><i data-s="bar" /></span>
          <span>צילומי רחפן מתוך הגלריה של אפיקי נדל״ן</span>
        </div>
      </div>
    </section>
  );
}
