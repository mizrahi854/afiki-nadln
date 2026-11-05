'use client';

import type { RefObject } from 'react';
import { gsap, ScrollTrigger, useGSAP } from './gsap';

/**
 * Shared entrance language for the dark sections, played once as each block reaches the viewport:
 *  [data-r="up"]   text and controls rise 28px and fade in
 *  [data-r="img"]  photo frames rise 60px from 0.94 scale and fade in while the photo settles from 1.15 to 1
 *                  (the frame keeps its full shape, so a row never looks like cards of uneven height)
 * Elements in the same batch stagger. Reduced motion: nothing moves, everything is visible.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(scope);
        gsap.set(q('[data-r="up"]'), { y: 28, opacity: 0 });
        gsap.set(q('[data-r="img"]'), { y: 60, scale: 0.94, opacity: 0, transformOrigin: '50% 100%' });
        gsap.set(q('[data-r="img"] img'), { scale: 1.15 });

        ScrollTrigger.batch(q('[data-r="up"]'), {
          start: 'top 88%', once: true,
          onEnter: (els) => gsap.to(els, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.08, clearProps: 'transform,opacity' }),
        });
        ScrollTrigger.batch(q('[data-r="img"]'), {
          start: 'top 90%', once: true,
          onEnter: (els) => {
            gsap.to(els, { y: 0, scale: 1, opacity: 1, duration: 1.15, ease: 'expo.out', stagger: 0.12, clearProps: 'transform,opacity' });
            gsap.to(els.map((e) => e.querySelector('img')), { scale: 1, duration: 1.6, ease: 'expo.out', stagger: 0.12, clearProps: 'transform' });
          },
        });
      });
    },
    { scope },
  );
}
