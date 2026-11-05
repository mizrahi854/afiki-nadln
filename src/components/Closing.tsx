'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ChevronUp, Phone, Mail } from 'lucide-react';
import { PHONE } from '@/lib/content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import { useReveal } from '@/lib/reveal';
import s from './Closing.module.css';

const nav = [
  { label: 'דף הבית', href: '/' },
  { label: 'נכסים למכירה', href: '/properties' },
  { label: 'השכונות בראש העין', href: '/neighborhoods' },
  { label: 'פסגות אפק', href: '/neighborhoods/psagot-afek' },
  { label: 'אודות', href: '/about' },
];
const tel = `tel:${PHONE.replace(/-/g, '')}`;
const WORD = 'אפיקי נדל״ן';

/**
 * Closing, after the AEVUM ending: a centered two-tone call over black, a house photo that surfaces out of
 * the dark toward the bottom, a smoked footer panel, and the brand name in giant type at the very bottom.
 * The name rises letter by letter as the page reaches its end (ANIMTD "footer-giant-wordmark", scrubbed).
 */
export function Closing() {
  const root = useRef<HTMLElement>(null);
  const word = useRef<HTMLDivElement>(null);
  useReveal(root);

  useGSAP(
    () => {
      const el = word.current;
      if (!el) return;
      // fit the name to the content width: measure at 100px, scale to the box
      const fit = () => {
        const inner = el.firstElementChild as HTMLElement;
        inner.style.fontSize = '100px';
        const w = inner.getBoundingClientRect().width;
        inner.style.fontSize = `${(100 * el.clientWidth) / w}px`;
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(el);

      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const letters = gsap.utils.toArray<HTMLElement>('[data-l]', el);
        const n = letters.length;
        const set = letters.map((l) => gsap.quickSetter(l, 'yPercent'));
        const draw = (p: number) =>
          set.forEach((fn, i) => {
            const start = (i * 0.36) / (n - 1);
            const t = gsap.utils.clamp(0, 1, (p - start) / 0.55);
            fn(92 * (1 - t) ** 2);
          });
        draw(0);
        ScrollTrigger.create({
          trigger: root.current, start: 'top bottom', end: 'bottom bottom', scrub: 0.5,
          onUpdate: (st) => draw(st.progress),
        });
        return () => gsap.set(letters, { clearProps: 'transform' });
      });
      return () => ro.disconnect();
    },
    { scope: root },
  );

  return (
    <footer className={s.wrap} ref={root}>
      <div className={s.bg} aria-hidden>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/props/givat-tal.webp" alt="" loading="lazy" />
      </div>

      <section className={s.cta} aria-labelledby="cta-title">
        <p className={s.eyebrow} data-r="up">נדל״ן בראש העין והסביבה</p>
        <h2 id="cta-title" className={s.title} data-r="up">בואו נמצא את <span>הבית הבא שלכם</span></h2>
        <i className={s.dot} aria-hidden data-r="up" />
        <p className={s.body} data-r="up">ספרו לנו מה אתם מחפשים, ונחזור אליכם עם נכסים שמתאימים לאורח החיים, לתקציב ולתוכניות שלכם.</p>
        <a className={s.link} href={tel} data-r="up"><span>לשיחה עם יוסי</span><i aria-hidden /></a>
      </section>

      <div className={s.panel}>
        <div className={s.lead}>
          <p className={s.panelTitle}>מתחילים לחפש</p>
          <p className={s.panelText}>משרד בוטיק לנדל״ן בראש העין, כ־20 שנה בעיר. דירות יד שנייה, דירות חדשות מקבלן ובתים פרטיים.</p>
          <p className={s.legal}>© אפיקי נדל״ן. כל הזכויות שמורות.</p>
        </div>
        <nav className={s.col} aria-label="ניווט בתחתית העמוד">
          <p>ניווט</p>
          {nav.map((n) => <Link key={n.label} href={n.href}>{n.label}</Link>)}
        </nav>
        <div className={s.col}>
          <p>יצירת קשר</p>
          <a href={tel}><Phone size={15} strokeWidth={1.6} aria-hidden /><span dir="ltr">{PHONE}</span></a>
          <a href="mailto:yosi@afikeynadlan.co.il"><Mail size={15} strokeWidth={1.6} aria-hidden /><span>yosi@afikeynadlan.co.il</span></a>
          <span className={s.muted}>ראש העין</span>
        </div>
      </div>

      <div className={s.word} ref={word} aria-hidden>
        <div className={s.wordInner}>
          {[...WORD].map((ch, i) => (
            <span key={i} data-l className={ch === ' ' ? s.space : undefined}>{ch}</span>
          ))}
        </div>
      </div>

      <BackToTop />
    </footer>
  );
}

/** AEVUM's small light "up" tab at the bottom center; shown once the hero is behind. */
function BackToTop() {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const f = () => setOn(window.scrollY > window.innerHeight * 1.1);
    f();
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  return (
    <button
      type="button"
      className={s.up}
      data-on={on || undefined}
      tabIndex={on ? 0 : -1}
      aria-hidden={!on || undefined}
      aria-label="חזרה לראש העמוד"
      onClick={() => window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })}
    >
      <ChevronUp size={18} strokeWidth={1.8} aria-hidden />
    </button>
  );
}
