'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import { hoods } from '@/lib/content';
import { useReveal } from '@/lib/reveal';
import s from './Hoods.module.css';

type Hood = (typeof hoods)[number];

/* Hover (adapted from ANIMTD "image-hover-zoom-card"): the photo's window opens from a 10px inset to the card's
   edges (700ms), the photo zooms to 1.08 and drifts up to 10px against the pointer, and the strip reveals one
   line about the place 120ms later, with the arrow stepping forward. Keyboard focus does the same; reduced
   motion keeps only the line, as a short fade. */
function Card({ h }: { h: Hood }) {
  const move = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
    e.currentTarget.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
  };
  const leave = (e: React.PointerEvent<HTMLAnchorElement>) => { e.currentTarget.style.setProperty('--mx', '0'); e.currentTarget.style.setProperty('--my', '0'); };
  return (
    <Link className={s.card} href={h.slug ? `/neighborhoods/${h.slug}` : '/neighborhoods'} data-r="img" onPointerMove={move} onPointerLeave={leave}>
      <span className={s.win}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={h.img} alt="" loading="lazy" />
      </span>
      <span className={s.bar}>
        <span className={s.top}>
          <span className={s.name}>{h.name}</span>
          <span className={s.city}><MapPin size={17} strokeWidth={1.4} aria-hidden />ראש העין</span>
        </span>
        <span className={s.line}><span>{h.line}<ArrowLeft size={18} strokeWidth={1.5} aria-hidden /></span></span>
      </span>
    </Link>
  );
}

/** Neighborhoods, laid out like Emerald's projects grid: title + two cards, then three cards of varied widths. */
export function Hoods({ overlap = false }: { overlap?: boolean }) {
  const root = useRef<HTMLElement>(null);
  useReveal(root);
  const [tal, psagot, nofarim, vatika, slaim] = hoods;

  return (
    <section id="neighborhoods" className={overlap ? `${s.section} ${s.overlap}` : s.section} ref={root} aria-labelledby="hoods-title">
      <div className={s.rowA}>
        <h2 id="hoods-title" className={s.title} data-r="up">
          <span className={s.first}>השכונות</span>
          <span>של ראש העין</span>
        </h2>
        <Card h={psagot} />
        <Card h={tal} />
      </div>
      <div className={s.rowB}>
        <Card h={vatika} />
        <Card h={slaim} />
        <Card h={nofarim} />
      </div>
      <Link className={s.all} href="/neighborhoods" data-r="up">לכל השכונות<ArrowLeft size={16} strokeWidth={1.8} aria-hidden /></Link>
    </section>
  );
}
