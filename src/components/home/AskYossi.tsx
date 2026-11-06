'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { ArrowLeft, Play, X } from 'lucide-react';
import { gsap, useGSAP } from '@/lib/gsap';
import em from '../em/em.module.css';
import s from './AskYossi.module.css';

const VIDEO = 'jD5ooLdv-Qk'; // Yossi's video from the original site's home page

/**
 * "כל מה שחשבתם שרציתם לשאול" — the original site's dark band: the questions copy on one side, Yossi from his
 * video on the other with his name and role, one lime bar as the accent. The photo plays the video in a dialog
 * (YouTube's no-cookie player, loaded only on click). Motion: the lime bar grows from the bottom, the portrait
 * rises and the text follows, once at 70%. Reduced motion: static.
 */
export function AskYossi() {
  const root = useRef<HTMLElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [play, setPlay] = useState(false);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(root);
      const tl = gsap.timeline({ scrollTrigger: { trigger: root.current, start: 'top 70%', once: true } });
      tl.from(q('[data-a="bar"]'), { scaleY: 0, transformOrigin: '50% 100%', duration: 1, ease: 'expo.out' })
        .from(q('[data-a="pic"]'), { y: 40, opacity: 0, duration: 1, ease: 'expo.out' }, 0.1)
        .from(q('[data-a="txt"] > *'), { y: 20, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 0.25);
    });
  }, { scope: root });

  const open = () => { setPlay(true); dialog.current?.showModal(); };
  const close = () => { dialog.current?.close(); };

  return (
    <section ref={root} className={s.band} aria-labelledby="ask-title">
      <div className={s.txt} data-a="txt">
        <h2 id="ask-title" className={s.title}>כל מה שחשבתם<br />שרציתם לשאול</h2>
        <p className={s.text}>אספנו עבורכם כמעט את כל השאלות שעולות בדרך כלל מקונים ומוכרים, וענינו עליהן בהרחבה. יש לכם שאלות נוספות? מעוניינים למכור או לרכוש נכס? דברו איתנו.</p>
        <div className={s.links}>
          <Link className={em.poly} data-tone="light" href="/faq"><ArrowLeft aria-hidden strokeWidth={1.4} />לשאלות ותשובות</Link>
          <a className={s.plain} href="#talk-title">דברו איתנו</a>
        </div>
      </div>

      <button type="button" className={s.pic} data-a="pic" onClick={open} aria-label="צפייה בסרטון של יוסי חיים">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/video/yossi-video.jpg" alt="" loading="lazy" />
        <span className={s.play} aria-hidden><Play fill="currentColor" strokeWidth={0} /></span>
      </button>

      <div className={s.who}>
        <p className={s.name}>יוסי חיים</p>
        <p className={s.role}>מנכ״ל ומייסד<br />אפיקי נדל״ן</p>
      </div>
      <span className={s.bar} data-a="bar" aria-hidden />

      <dialog ref={dialog} className={s.dialog} aria-label="סרטון: יוסי חיים, אפיקי נדל״ן" onClose={() => setPlay(false)}
        onClick={(e) => { if (e.target === dialog.current) close(); }}>
        <div className={s.frame}>
          {play && <iframe src={`https://www.youtube-nocookie.com/embed/${VIDEO}?autoplay=1&rel=0`} title="יוסי חיים, אפיקי נדל״ן" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen />}
        </div>
        <button type="button" className={s.close} onClick={close} aria-label="סגירת הסרטון"><X aria-hidden strokeWidth={1.5} /></button>
      </dialog>
    </section>
  );
}
