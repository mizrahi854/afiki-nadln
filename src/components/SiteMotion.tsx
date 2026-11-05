'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap, ScrollTrigger } from '@/lib/gsap';

/* Anything that already has its own motion (hero, flight, carousels, marquees, word-split headings,
   the reveal systems) is left alone, and so is everything inside it. */
const OWN = [
  'header', 'dialog', 'form', '[data-no-motion]', '[data-fade]', '[data-r]', '[data-w]', '[data-s]', '[data-a]', '[data-card]',
  '[class*="Hero_"]', '[class*="HoodScene_"]', '[class*="Testimonials_"]', '[class*="HScroll_"]', '[class*="MarqueeHero_col"]',
  '[class*="MarqueeHero_strip"]', '[class*="blocks_car"]', '[class*="CyprusTeaser_mosaic"]', '[class*="Collage"]', '[class*="blocks_piece"]',
].join(',');
const free = (el: Element) => !el.closest(OWN);

/**
 * The site-wide entrance language, applied to every page's <main> after each navigation:
 *  headings  come in from a soft blur, rising 24px
 *  text      paragraphs and list items rise 14px and fade in, a beat after their heading
 *  photos    unblur and settle from 1.12 scale (clipped photos keep their shape; plain ones also open from a band)
 *  cards     tiles rise 40px in a short stagger
 * Each plays once at "top 88%" and clears its inline styles, so hover states are untouched afterwards.
 * Reduced motion: nothing is touched.
 */
export function SiteMotion() {
  const path = usePathname();
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let ctx: gsap.Context | undefined;
    const t = setTimeout(() => {
      const main = document.querySelector('main');
      if (!main) return;
      ctx = gsap.context(() => {
        const pick = (sel: string) => [...main.querySelectorAll<HTMLElement>(sel)].filter(free).filter((e) => e.getBoundingClientRect().top > innerHeight * 0.9);
        const play = (els: HTMLElement[], from: gsap.TweenVars, to: gsap.TweenVars, stagger: number) => {
          if (!els.length) return;
          gsap.set(els, from);
          ScrollTrigger.batch(els, {
            start: 'top 88%', once: true,
            onEnter: (b) => gsap.to(b, { ...to, stagger, overwrite: true, clearProps: 'all' }),
          });
        };

        play(pick('h1, h2, h3, [class*="em_kicker"], [class*="em_ruleRow"] > p'),
          { opacity: 0, y: 24, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, 0.08);

        play(pick('[class*="em_prose"] > p, [class*="em_prose"] > ul, [class*="em_prose"] > blockquote, main section > p, main section > div > p, [class*="facts"] > li, [class*="steps"] > li, [class*="list"] > li'),
          { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.12 }, 0.05);

        const imgs = pick('img').filter((i) => i.getBoundingClientRect().width > 120);
        // the settle-in zoom only where the frame hides overflow, or it widens the page on phones
        const contained = (i: HTMLElement) => /hidden|clip/.test(getComputedStyle(i.parentElement!).overflow);
        const clipped = imgs.filter((i) => getComputedStyle(i).clipPath !== 'none' || getComputedStyle(i.parentElement!).clipPath !== 'none');
        const zoom = (_: number, i: HTMLElement) => (contained(i) ? 1.12 : 1);
        play(clipped, { opacity: 0, scale: zoom, filter: 'blur(10px)' }, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out' }, 0.1);
        play(imgs.filter((i) => !clipped.includes(i)),
          { clipPath: 'inset(14% 0% 14% 0%)', scale: zoom, filter: 'blur(10px)' }, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, filter: 'blur(0px)', duration: 1.4, ease: 'expo.out' }, 0.1);

        play(pick('[class*="EmCard_card"], [class*="em_frame"]:not(form):not(section), [class*="blocks_boxes"] > li, [class*="counters"] > li, [class*="services"] li, [class*="tiles"] > li'),
          { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, 0.09);
      }, main);
      ScrollTrigger.refresh();
    }, 120);
    return () => { clearTimeout(t); ctx?.revert(); };
  }, [path]);
  return null;
}
