'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { ArrowLeft, Phone, X } from 'lucide-react';
import { PHONE } from '@/lib/content';
import em from '../em/em.module.css';
import s from './ValuationPopup.module.css';

const KEY = 'afikey-valuation-popup';
const DAY = 24 * 60 * 60 * 1000;

/**
 * The original site's "free valuation" pop-up (same copy, same trigger: once a day, after scrolling a quarter of
 * the page down), drawn in this site's style: the brand petrol panel with the copy, a photo of Psagot Afek with
 * Yossi's card on it. A modal <dialog>: Esc, the close button or a click outside closes it.
 */
export function ValuationPopup() {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    let seen = 0;
    try { seen = Number(localStorage.getItem(KEY)) || 0; } catch {}
    if (Date.now() - seen < DAY) return;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (max > 0 && scrollY / max >= 0.25) {
        removeEventListener('scroll', onScroll);
        if (document.querySelector('dialog[open]')) return; // never on top of another panel
        ref.current?.showModal();
        try { localStorage.setItem(KEY, String(Date.now())); } catch {}
      }
    };
    addEventListener('scroll', onScroll, { passive: true });
    return () => removeEventListener('scroll', onScroll);
  }, []);
  const close = () => ref.current?.close();
  const tel = PHONE.replace(/-/g, '');

  return (
    <dialog ref={ref} className={`${em.page} ${s.pop}`} aria-labelledby="valuation-title" onClick={(e) => { if (e.target === ref.current) close(); }}>
      <div className={s.grid}>
        <div className={s.copy}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.logo} src="/media/brand/logo.png" alt="אפיקי נדל״ן" />
          <h2 id="valuation-title" className={s.title}>אצלנו הנכסים נמכרים הכי מהר בעיר, <strong>ובמחירים שמגיעים לכם!</strong></h2>
          <p className={s.text}>אפיקי נדל״ן מובילים את שוק הנדל״ן המקומי עם שיאי מכירה מהירים ותוצאות מוכחות. רוצים לדעת בכמה תוכלו למכור את הנכס שלכם? דברו איתנו.</p>
          <Link className={s.cta} href="/sell#talk-title" onClick={close}>הערכת שווי חינם<ArrowLeft aria-hidden strokeWidth={1.6} /></Link>
          <a className={s.tel} href={`tel:${tel}`}><Phone aria-hidden strokeWidth={1.5} />יוסי חיים <span dir="ltr">{PHONE}</span></a>
        </div>
        <div className={s.media} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/psagot/fly-1.jpg" alt="" />
          <span className={s.card}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/team/yossi.jpg" alt="" />
            <span><b>יוסי חיים</b>מייסד אפיקי נדל״ן</span>
          </span>
        </div>
      </div>
      <button type="button" className={s.close} onClick={close} aria-label="סגירה"><X aria-hidden strokeWidth={1.5} /></button>
    </dialog>
  );
}
