'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import em from '../em/em.module.css';
import s from './SellBand.module.css';

/**
 * "מעוניינים למכור את הנכס שלכם?" — the original site's band (a wide interior photo with a solid colour box on
 * it), in this site's colours: the box is the brand petrol with a lime hairline. Copy from afikeynadlan.co.il.
 * Motion: the box opens from its right edge (clip-path, 0.9s expo-out) and its text rises in a short stagger
 * once the band is 70% in view; the photo drifts 6% against the scroll. Reduced motion: static.
 */
export function SellBand() {
  const root = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
      tl.from(q('[data-a="box"]'), { clipPath: 'inset(0% 0% 0% 100%)', duration: 0.9, ease: 'expo.out' })
        .from(q('[data-a="box"] > *'), { opacity: 0, y: 22, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.25);
      gsap.fromTo(q('[data-a="bg"]'), { yPercent: -6 }, { yPercent: 6, ease: 'none', scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true } });
    });
  }, { scope: root });

  return (
    <section id="sell" ref={root} className={s.band} aria-labelledby="sell-band-title">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img data-a="bg" className={s.bg} src="/media/misc/living.webp" alt="" loading="lazy" />
      <div className={s.box} data-a="box">
        <h2 id="sell-band-title" className={s.title}>מעוניינים למכור<br />את הנכס שלכם?</h2>
        <p className={s.text}>אפיקי נדל״ן מחזיקה בנכסים אינטרנטיים בעלי טראפיק מהגבוהים בתחום, והנכס שלכם מקבל אלפי צפיות באתר וברשתות החברתיות המקושרות למשרד. בנוסף, אנחנו משתפים פעולה באופן מלא עם משרדי תיווך נוספים בעיר ומחוצה לה, כדי שהנכס שלכם יגיע לעיניים הנכונות בזמן קצר.</p>
        <Link className={`${em.poly} ${s.btn}`} href="/sell" data-tone="light"><ArrowLeft aria-hidden strokeWidth={1.4} />אז מה אתם מקבלים מאיתנו?</Link>
      </div>
    </section>
  );
}
