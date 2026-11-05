'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, X, Images } from 'lucide-react';
import s from './pages.module.css';

/** Mosaic of one large photo and four small ones (the reference's property page); any photo opens a full-screen viewer. */
export function Gallery({ images, title }: { images: string[]; title: string }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [i, setI] = useState<number | null>(null);
  const n = images.length;

  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (i === null) { if (d.open) d.close(); return; }
    if (!d.open) d.showModal();
  }, [i]);

  const go = (k: number) => setI((x) => (x === null ? x : (x + k + n) % n));

  return (
    <>
      <div className={s.mosaic} data-count={Math.min(n, 5)}>
        {images.slice(0, 5).map((src, k) => (
          <button key={src} type="button" className={s.tile} data-r="img" onClick={() => setI(k)} aria-label={`פתיחת תמונה ${k + 1} מתוך ${n}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={k === 0 ? title : ''} loading={k === 0 ? 'eager' : 'lazy'} />
            {k === 4 && n > 5 && <span className={s.more}><Images size={16} strokeWidth={1.6} aria-hidden />כל {n} התמונות</span>}
          </button>
        ))}
      </div>

      <dialog
        ref={dlg}
        className={s.viewer}
        aria-label={`תמונות: ${title}`}
        onClose={() => setI(null)}
        onKeyDown={(e) => { if (e.key === 'ArrowLeft') go(1); if (e.key === 'ArrowRight') go(-1); }}
      >
        {i !== null && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[i]} alt={`${title}, תמונה ${i + 1}`} />
            <figcaption dir="ltr">{i + 1} / {n}</figcaption>
          </figure>
        )}
        <div className={s.viewerBar}>
          <button type="button" onClick={() => go(-1)} aria-label="התמונה הקודמת"><ArrowRight size={20} aria-hidden /></button>
          <button type="button" onClick={() => setI(null)} aria-label="סגירה"><X size={20} aria-hidden /></button>
          <button type="button" onClick={() => go(1)} aria-label="התמונה הבאה"><ArrowLeft size={20} aria-hidden /></button>
        </div>
      </dialog>
    </>
  );
}
