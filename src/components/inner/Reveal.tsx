'use client';

import { useRef, type ReactNode } from 'react';
import { useReveal } from '@/lib/reveal';

/** Wraps server-rendered markup so its [data-r] children get the site's shared entrance on scroll. */
export function Reveal({ as: Tag = 'section', className, children, ...rest }: { as?: 'section' | 'div' | 'main'; className?: string; children: ReactNode } & Record<string, unknown>) {
  const ref = useRef<HTMLElement>(null);
  useReveal(ref);
  return (
    // @ts-expect-error polymorphic ref
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
