'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { MapPin, ArrowLeft } from 'lucide-react';
import { hoods } from '@/lib/content';
import { useReveal } from '@/lib/reveal';
import s from './Hoods.module.css';

type Hood = (typeof hoods)[number];

/* Hover follows Emerald's project cards: the photo blurs and darkens, a diamond mark appears in the
   middle, and one line about the place opens inside the info bar. */
function Card({ h }: { h: Hood }) {
  return (
    <Link className={s.card} href={h.slug ? `/neighborhoods/${h.slug}` : '/neighborhoods'} data-r="img">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={h.img} alt="" loading="lazy" />
      <span className={s.veil} aria-hidden />
      <span className={s.mark} aria-hidden><ArrowLeft size={22} strokeWidth={1.4} /></span>
      <span className={s.bar}>
        <span className={s.top}>
          <span className={s.name}>{h.name}</span>
          <span className={s.city}><MapPin size={17} strokeWidth={1.4} aria-hidden />ראש העין</span>
        </span>
        <span className={s.line}><span>{h.line}</span></span>
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
    <section className={overlap ? `${s.section} ${s.overlap}` : s.section} ref={root} aria-labelledby="hoods-title">
      <div className={s.rowA}>
        <h2 id="hoods-title" className={s.title} data-r="up">
          <span className={s.first}>השכונות<i aria-hidden /></span>
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
