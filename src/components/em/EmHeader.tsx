'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, Mail, MapPin, X, ChevronDown } from 'lucide-react';
import { PHONE } from '@/lib/content';
import { EMAIL, ADDRESS } from '@/lib/data';
import { gsap, useGSAP } from '@/lib/gsap';
import { nav, type NavItem } from './nav';
import em from './em.module.css';
import s from './EmHeader.module.css';

const tel = `tel:${PHONE.replace(/-/g, '')}`;

/**
 * Emerald's header: fixed, transparent over the page top; over the first 100px of scroll it scrubs to a
 * frosted bar (white 80% + blur 5px here) and shrinks to 4vw, the logo to 0.9. Over a photo (onPhoto) the logo
 * starts white and takes its own colors as the bar fills in, the reverse of Emerald's light-on-dark logo.
 * Links sit at 50% opacity; hover and the current page go to full with a thin text stroke. Groups (the original
 * site's menu) open a double-outlined octagon panel on hover or focus; the chevron toggles it for keyboard and touch.
 * Phones: logo + burger, the menu opens as an octagon panel with a double outline.
 */
export function EmHeader({ onPhoto = false }: { onPhoto?: boolean }) {
  const path = usePathname();
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [drop, setDrop] = useState<string | null>(null);
  const [sub, setSub] = useState<string | null>(null);
  useEffect(() => { setOpen(false); setDrop(null); }, [path]);
  useEffect(() => {
    if (!drop) return;
    const out = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setDrop(null); };
    addEventListener('pointerdown', out);
    return () => removeEventListener('pointerdown', out);
  }, [drop]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', k);
    document.documentElement.style.overflow = 'hidden';
    return () => { removeEventListener('keydown', k); document.documentElement.style.overflow = ''; };
  }, [open]);

  useGSAP(() => {
    const st = { trigger: document.documentElement, start: 0, end: 100, scrub: true };
    gsap.to(root.current, { '--hb': 0.8, '--lb': 1, '--li': 0, '--blur': '5px', height: () => (innerWidth > 1280 ? innerWidth * 0.04 : 50), ease: 'none', scrollTrigger: st });
    gsap.to(`.${s.logo} img`, { scale: 0.9, ease: 'none', scrollTrigger: st });
  }, { scope: root });

  const here = (href: string) => (href === '/' ? path === '/' : path === href || path.startsWith(href + '/'));
  const hereIn = (n: NavItem) => here(n.href) || !!n.children?.some((c) => here(c.href.split(/[?#]/)[0]));

  return (
    <header ref={root} className={s.bar} data-photo={onPhoto || undefined}>
      <Link className={s.logo} href="/" aria-label="אפיקי נדל״ן, לעמוד הבית">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/media/brand/logo.png" alt="" />
      </Link>
      <nav className={s.nav} aria-label="ניווט ראשי" onKeyDown={(e) => e.key === 'Escape' && setDrop(null)}>
        {nav.map((n) => n.children ? (
          <div key={n.href} className={s.item} data-open={drop === n.href || undefined}
            onMouseLeave={() => setDrop((d) => (d === n.href ? null : d))}
            onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDrop((d) => (d === n.href ? null : d)); }}>
            <Link href={n.href} aria-current={hereIn(n) ? 'page' : undefined}>{n.label}</Link>
            <button type="button" className={s.caret} aria-expanded={drop === n.href} aria-controls={`drop-${n.href}`} aria-label={`תפריט ${n.label}`}
              onClick={() => setDrop((d) => (d === n.href ? null : n.href))}>
              <ChevronDown aria-hidden strokeWidth={1.6} />
            </button>
            <div id={`drop-${n.href}`} className={`${em.frame} ${s.drop}`}>
              <ul>
                {n.children.map((c) => <li key={c.href}><Link href={c.href} onClick={() => setDrop(null)}>{c.label}</Link></li>)}
              </ul>
            </div>
          </div>
        ) : (
          <Link key={n.href} href={n.href} aria-current={here(n.href) ? 'page' : undefined}>{n.label}</Link>
        ))}
      </nav>
      <a className={`${em.poly} ${s.call}`} href={tel} aria-label={`חייגו ${PHONE}`}><Phone aria-hidden strokeWidth={1.6} /><span className={s.callWord}>חייגו </span><span dir="ltr">{PHONE}</span></a>
      <button type="button" className={s.burger} aria-expanded={open} aria-controls="em-menu" aria-label="פתיחת התפריט" onClick={() => setOpen(true)}>
        <span /><span /><span />
      </button>

      <div id="em-menu" className={s.menu} hidden={!open} role="dialog" aria-modal="true" aria-label="תפריט">
        <div className={s.panel}>
          <button type="button" className={s.close} aria-label="סגירת התפריט" onClick={() => setOpen(false)}><X aria-hidden /></button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className={s.menuLogo} src="/media/brand/logo.png" alt="אפיקי נדל״ן" />
          <nav aria-label="ניווט במובייל" className={s.menuNav}>
            {nav.map((n) => n.children ? (
              <div key={n.href} className={s.menuGroup} data-open={sub === n.href || undefined}>
                <div className={s.menuRow}>
                  <Link href={n.href} aria-current={hereIn(n) ? 'page' : undefined}>{n.label}</Link>
                  <button type="button" aria-expanded={sub === n.href} aria-controls={`sub-${n.href}`} aria-label={`פתיחת ${n.label}`}
                    onClick={() => setSub((x) => (x === n.href ? null : n.href))}><ChevronDown aria-hidden strokeWidth={1.6} /></button>
                </div>
                <ul id={`sub-${n.href}`} hidden={sub !== n.href}>
                  {n.children.map((c) => <li key={c.href}><Link href={c.href} onClick={() => setOpen(false)}>{c.label}</Link></li>)}
                </ul>
              </div>
            ) : <Link key={n.href} href={n.href} aria-current={here(n.href) ? 'page' : undefined}>{n.label}</Link>)}
          </nav>
          <div className={s.menuInfo}>
            <a href={`mailto:${EMAIL}`}><Mail aria-hidden strokeWidth={1.4} />{EMAIL}</a>
            <span><MapPin aria-hidden strokeWidth={1.4} />{ADDRESS}</span>
          </div>
          <a className={`${em.poly} ${s.menuCall}`} href={tel}><Phone aria-hidden strokeWidth={1.6} />חייגו {PHONE}</a>
        </div>
      </div>
    </header>
  );
}
