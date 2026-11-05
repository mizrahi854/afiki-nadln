'use client';

import { createElement, useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap';

/**
 * Emerald's `.gsap-heading`: words split, each revealed from clipPath inset(100% 0 0 0) and opacity 0,
 * stagger 0.5, scrubbed (scrub 1) between "top 85%" and "top 65%".
 */
export function SplitWords({ text, as = 'h2', className, id }: { text: string; as?: 'h1' | 'h2' | 'h3' | 'p'; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
      const words = ref.current!.querySelectorAll('[data-w]');
      gsap.from(words, {
        clipPath: 'inset(100% 0% 0% 0%)', opacity: 0, stagger: 0.5, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top 85%', end: 'top 65%', scrub: 1 },
      });
    });
  }, { scope: ref });
  const parts = text.split(' ');
  return createElement(as, { ref, className, id, 'aria-label': text },
    parts.map((w, i) => (
      <span key={i} aria-hidden data-w="" style={{ display: 'inline-block' }}>{w}{i < parts.length - 1 ? ' ' : ''}</span>
    )));
}

/** Elementor fadeInUp on entering the viewport; `step` staggers siblings (source: 0, 100, 200… ms). */
export function FadeUp({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'article' }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current!;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { el.dataset.fade = 'in'; io.disconnect(); } }, { rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return createElement(as, { ref, className, 'data-fade': '', style: { ['--d' as string]: `${delay}ms` } }, children);
}

/** Elementor counter: counts from 0 to the value over 2s once it scrolls into view. */
export function Counter({ to, prefix = '', suffix = '', className }: { to: number; prefix?: string; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(to);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setN(0);
    const st = ScrollTrigger.create({
      trigger: ref.current, start: 'top 90%', once: true,
      onEnter: () => { const o = { v: 0 }; gsap.to(o, { v: to, duration: 2, ease: 'power1.out', onUpdate: () => setN(Math.round(o.v)) }); },
    });
    return () => st.kill();
  }, [to]);
  return <span ref={ref} className={className} aria-label={`${prefix}${to.toLocaleString('en-US')}${suffix}`}><span aria-hidden>{prefix}{n.toLocaleString('en-US')}{suffix}</span></span>;
}
