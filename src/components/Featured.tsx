'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import { Maximize2, BedDouble, Bath, ArrowUpLeft } from 'lucide-react';
import { featured, kinds, ils, type Kind } from '@/lib/content';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';
import s from './Featured.module.css';

/**
 * Directly after the hero: one large listing and four small ones (reference: the AEVUM collection grid).
 * Entrance follows the Liven reference: the header rises first, then the cards arrive one after another,
 * each settling from a slightly smaller scale while its photo eases in, and the caption follows its card.
 */
export function Featured() {
  const root = useRef<HTMLElement>(null);
  const [kind, setKind] = useState<'all' | Kind>('all');

  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(root);
        const cards = q('[data-card]');
        gsap.set(q('[data-up]'), { y: 28, opacity: 0 });
        gsap.set(cards, { y: 56, scale: 0.92, opacity: 0, transformOrigin: '50% 100%' });
        gsap.set(q('[data-card] img'), { scale: 1.18 });
        gsap.set(q('[data-card] [data-cap]'), { y: 16, opacity: 0 });

        ScrollTrigger.create({
          trigger: root.current, start: 'top 72%', once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
            tl.to(q('[data-up]'), { y: 0, opacity: 1, duration: 0.9, stagger: 0.07, ease: 'power3.out', clearProps: 'transform,opacity' }, 0);
            // RTL reading order: the large card (right) first, then the small ones right → left, top → bottom
            cards.forEach((c, i) => {
              const at = 0.25 + i * 0.14;
              tl.to(c, { y: 0, scale: 1, opacity: 1, duration: 1.15, clearProps: 'transform,opacity' }, at)
                .to(c.querySelector('img'), { scale: 1, duration: 1.6, clearProps: 'transform' }, at)
                .to(c.querySelectorAll('[data-cap]'), { y: 0, opacity: 1, duration: 0.8, stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity' }, at + 0.35);
            });
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section className={s.section} ref={root} aria-labelledby="featured-title">
      <header className={s.head}>
        <div>
          <p className={s.eyebrow} data-up>02 / נכסים נבחרים</p>
          <h2 id="featured-title" className={s.title} data-up>
            נכסים שעברו סינון,<br />ששווה <span>להכיר מקרוב</span>
          </h2>
        </div>
        <div className={s.filters} role="radiogroup" aria-label="סינון לפי סוג נכס" data-up>
          {kinds.map((k) => (
            <button key={k.id} type="button" role="radio" aria-checked={kind === k.id} onClick={() => setKind(k.id)}>
              {k.label}
            </button>
          ))}
        </div>
      </header>

      <ul className={s.grid}>
        {featured.map((l, i) => {
          const off = kind !== 'all' && l.kind !== kind;
          return (
            <li key={l.href} className={i === 0 ? s.big : s.small} data-off={off || undefined} data-card>
              <Link href={l.href} className={s.card} tabIndex={off ? -1 : undefined} aria-hidden={off || undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={l.img} alt="" loading="lazy" />
                <span className={s.shade} />
                <span className={s.badge} data-cap>{l.badge}</span>
                <span className={s.go} aria-hidden><ArrowUpLeft size={16} strokeWidth={1.8} /></span>
                <span className={s.info}>
                  <span className={s.row} data-cap>
                    <span className={s.name}>{l.title}</span>
                    <span className={s.price}>{ils(l.price)}</span>
                  </span>
                  <span className={s.place} data-cap>{l.place}</span>
                  {i === 0 && (
                    <span className={s.specs} data-cap>
                      <span><Maximize2 size={14} strokeWidth={1.6} aria-hidden />{l.area} מ״ר</span>
                      <span><BedDouble size={14} strokeWidth={1.6} aria-hidden />{l.rooms} חדרים</span>
                      <span><Bath size={14} strokeWidth={1.6} aria-hidden />{l.baths} חדרי רחצה</span>
                    </span>
                  )}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <Link className={s.more} href="/properties" data-up>
        <span>לכל הנכסים</span>
        <i aria-hidden />
      </Link>
    </section>
  );
}
