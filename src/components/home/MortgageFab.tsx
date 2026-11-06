'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator as CalcIcon, X } from 'lucide-react';
import { Calculator, type Preset } from '../em/Calculator';
import { MORTGAGE_EVENT, type MortgageDetail } from '@/lib/mortgage';
import em from '../em/em.module.css';
import s from './MortgageFab.module.css';

/**
 * Floating mortgage button. Appears once the hero is scrolled past, opens the calculator in a side panel
 * (a modal <dialog>, so focus and Esc come for free). Any part of the page can open it priced for a listing
 * through openMortgage(); on a property page `base` prices it for that property.
 */
export function MortgageFab({ presets, base = {} }: { presets?: Preset[]; base?: MortgageDetail }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [shown, setShown] = useState(false);
  const [deal, setDeal] = useState<MortgageDetail>({});
  const [run, setRun] = useState(0);

  useEffect(() => {
    // hidden over the hero and while the page's own calculator is on screen
    let inline = false;
    const onScroll = () => setShown(scrollY > innerHeight * 0.7 && !inline);
    const io = new IntersectionObserver(([e]) => { inline = e.isIntersecting; onScroll(); });
    const own = document.querySelector('[data-mortgage-inline]');
    if (own) io.observe(own);
    onScroll();
    addEventListener('scroll', onScroll, { passive: true });
    const onOpen = (e: Event) => open((e as CustomEvent<MortgageDetail>).detail ?? {});
    addEventListener(MORTGAGE_EVENT, onOpen);
    return () => { io.disconnect(); removeEventListener('scroll', onScroll); removeEventListener(MORTGAGE_EVENT, onOpen); };
  }, []);

  function open(d: MortgageDetail) {
    setDeal(d);
    setRun((n) => n + 1); // fresh calculator for each opening, priced for the listing if one was passed
    if (!dialog.current?.open) dialog.current?.showModal();
  }

  return (
    <>
      <button type="button" className={`${em.poly} ${s.fab}`} data-shown={shown || undefined} aria-hidden={!shown} tabIndex={shown ? 0 : -1} onClick={() => open(base)}>
        <CalcIcon aria-hidden strokeWidth={1.5} />
        <span>כמה זה יעלה לי בחודש?</span>
      </button>

      <dialog ref={dialog} className={`${em.page} ${s.panel}`} aria-labelledby="mortgage-title"
        onClick={(e) => { if (e.target === dialog.current) dialog.current?.close(); }}>
        <div className={s.inner}>
          <header className={s.top}>
            <div>
              <p className={s.kicker}>מחשבון משכנתא</p>
              <h2 id="mortgage-title" className={s.title}>כמה זה יעלה לי בחודש?</h2>
              {deal.title && <p className={s.for}>מחושב לנכס: <b>{deal.title}</b></p>}
            </div>
            <button type="button" className={s.close} onClick={() => dialog.current?.close()} aria-label="סגירת המחשבון"><X aria-hidden strokeWidth={1.5} /></button>
          </header>
          <Calculator key={run} compact defaultPrice={deal.price ?? 2500000} presets={deal.title ? undefined : presets} />
          <div className={s.links}>
            <Link className={em.poly} href="/#talk-title" onClick={() => dialog.current?.close()}><ArrowLeft aria-hidden strokeWidth={1.4} />לשיחה עם יוסי</Link>
            <Link href="/calculator" className={s.full} onClick={() => dialog.current?.close()}>למחשבון המלא</Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
