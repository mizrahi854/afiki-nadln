'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { PHONE } from '@/lib/content';
import s from './SiteHeader.module.css';

export const nav = [
  { label: 'נכסים למכירה', href: '/properties' },
  { label: 'השכונות', href: '/neighborhoods' },
  { label: 'פסגות אפק', href: '/neighborhoods/psagot-afek' },
  { label: 'אודות', href: '/about' },
];

/** Inner pages: the hero's header language (dark pill nav, separate contact button) on black, fixed. */
export function SiteHeader() {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const f = () => setSolid(window.scrollY > 24);
    f();
    addEventListener('scroll', f, { passive: true });
    return () => removeEventListener('scroll', f);
  }, []);
  useEffect(() => setOpen(false), [path]);

  return (
    <header className={s.bar} data-solid={solid || undefined} data-open={open || undefined}>
      <Link className={s.logo} href="/" aria-label="אפיקי נדל״ן, לדף הבית">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/brand/logo.png" alt="" />
      </Link>
      <nav className={s.nav} aria-label="ניווט ראשי">
        {nav.map((n) => (
          <Link key={n.href} href={n.href} aria-current={path === n.href ? 'page' : undefined}>{n.label}</Link>
        ))}
      </nav>
      <a className={s.contact} href={`tel:${PHONE.replace(/-/g, '')}`}><Phone size={15} strokeWidth={1.7} aria-hidden />צור קשר</a>
      <button type="button" className={s.toggle} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? 'סגירת התפריט' : 'פתיחת התפריט'} onClick={() => setOpen((o) => !o)}>
        {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
      </button>
      <div id="mobile-nav" className={s.sheet} hidden={!open}>
        {nav.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
        <a href={`tel:${PHONE.replace(/-/g, '')}`} dir="ltr">{PHONE}</a>
      </div>
    </header>
  );
}
