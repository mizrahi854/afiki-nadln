'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useReveal } from '@/lib/reveal';
import s from './About.module.css';

/** Short about on the home page; facts from the live about page. */
export function About() {
  const root = useRef<HTMLElement>(null);
  useReveal(root);

  return (
    <section className={s.section} ref={root} aria-labelledby="about-title">
      <div className={s.copy}>
        <p className={s.eyebrow} data-r="up">04 / אודות</p>
        <h2 id="about-title" className={s.title} data-r="up">
          <span className={s.lead}>מכירים את העיר.<i aria-hidden /></span>
          <strong>מלווים את האנשים.</strong>
        </h2>
        <p className={s.body} data-r="up">
          אפיקי נדל״ן הוקמה לפני כ־20 שנה על ידי <b>יוסי חיים</b>, יועץ נדל״ן בכיר ומגשר מוסמך. משרד בוטיק שמתמחה
          בדירות יד שנייה ובדירות חדשות מקבלן בראש העין, עם <b>מאות עסקאות מוצלחות</b> ולקוחות מרוצים.
        </p>
        <dl className={s.facts} data-r="up">
          <div><dt>כ־20</dt><dd>שנות פעילות בעיר</dd></div>
          <div><dt>6</dt><dd>שכונות שאנחנו מכירים לעומק</dd></div>
          <div><dt>360°</dt><dd>ליווי מלא עד החתימה</dd></div>
        </dl>
        <Link className={s.cta} href="/about" data-r="up">להכיר את אפיקי<ArrowLeft size={16} strokeWidth={1.8} aria-hidden /></Link>
      </div>
      <figure className={s.media}>
        <span className={s.frame} aria-hidden />
        <div className={s.photo} data-r="img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/misc/rosh-haayin.webp" alt="מבט מהאוויר על ראש העין" loading="lazy" />
        </div>
      </figure>
    </section>
  );
}
