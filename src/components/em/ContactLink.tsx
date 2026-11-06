'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * "צרו קשר" now points at the contact block at the bottom of the page (id "talk-title"). If the current page
 * has no such block, it goes to the one on the home page.
 */
export function ContactLink({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <Link href="/#talk-title" className={className} onClick={(e) => {
      onClick?.();
      const el = document.getElementById('talk-title');
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center' });
    }}>{children}</Link>
  );
}
