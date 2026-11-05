'use client';

import { useEffect, useRef } from 'react';
import s from './blocks.module.css';

/**
 * Emerald's about-page collage: five photos in 1px frames with a 0.5vw inset, scattered on the left of the opening,
 * each following the mouse at its own speed and direction (source: 0.3, −0.3, 0.1, −0.1, −0.5).
 */
const speeds = [0.3, -0.3, 0.1, -0.1, -0.5];
export function Collage({ images }: { images: string[] }) {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce), (hover: none)').matches) return;
    const els = [...root.current!.children] as HTMLElement[];
    let raf = 0;
    const move = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const dx = e.clientX / innerWidth - 0.5, dy = e.clientY / innerHeight - 0.5;
        els.forEach((el, i) => { el.style.translate = `${dx * speeds[i] * 120}px ${dy * speeds[i] * 120}px`; });
      });
    };
    addEventListener('mousemove', move);
    return () => { removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div ref={root} className={s.collage} aria-hidden>
      {images.slice(0, 5).map((src, i) => (
        <figure key={i} className={s.piece}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt="" />
        </figure>
      ))}
    </div>
  );
}
