import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { PHONE } from '@/lib/content';
import { EMAIL, ADDRESS, RIGHTS, DISCLAIMER, hoodPages } from '@/lib/data';
import { nav } from './nav';
import { ContactLink } from './ContactLink';
import s from './EmFooter.module.css';

/**
 * Emerald's footer: logo and contact list on the right, two link columns on the left,
 * a small-print row (rights, disclaimer, legal links) under a rule.
 * Emerald's "projects in marketing" column becomes Afikey's neighborhood pages.
 */
export function EmFooter() {
  return (
    <footer className={s.foot}>
      <div className={s.top}>
        <div className={s.brand}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/logo.png" alt="אפיקי נדל״ן" />
          <ul>
            <li><a href={`tel:${PHONE.replace(/-/g, '')}`} dir="ltr"><Phone aria-hidden strokeWidth={1.4} /><span>{PHONE}</span></a></li>
            <li><a href={`mailto:${EMAIL}`}><Mail aria-hidden strokeWidth={1.4} /><span>{EMAIL}</span></a></li>
            <li><span className={s.row}><MapPin aria-hidden strokeWidth={1.4} /><span>{ADDRESS}</span></span></li>
          </ul>
        </div>
        <nav className={s.col} aria-label="ניווט באתר">
          <p>ניווט באתר</p>
          <ul>{nav.map((n) => <li key={n.href}>{n.href.includes('#talk-title') ? <ContactLink>{n.label}</ContactLink> : <Link href={n.href}>{n.label}</Link>}</li>)}</ul>
        </nav>
        <nav className={s.col} aria-label="שכונות בראש העין">
          <p>שכונות בראש העין</p>
          <ul>{hoodPages.map((h) => <li key={h.slug}><Link href={`/neighborhoods/${h.slug}`}>{h.name}</Link></li>)}</ul>
        </nav>
      </div>
      <div className={s.small}>
        <p>© {RIGHTS}</p>
        <p>{DISCLAIMER}</p>
        <ul>
          <li><Link href="/accessibility">הצהרת נגישות</Link></li>
          <li><Link href="/privacy">מדיניות פרטיות</Link></li>
          <li><Link href="/faq">שאלות ותשובות</Link></li>
          <li><Link href="/calculator">מחשבון משכנתא</Link></li>
        </ul>
      </div>
    </footer>
  );
}
