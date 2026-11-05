'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Phone, Mail } from 'lucide-react';
import { PHONE } from '@/lib/content';
import { EMAIL } from '@/lib/data';
import { Rule, Rich } from './Rule';
import em from './em.module.css';
import s from './blocks.module.css';

export type QA = { q: string; a: string; href?: string; from?: string };

/** Emerald's "GOT A QUESTION?" block: title, a line and the contact details on the right; questions under 1px rules
 * on the left, a plus that turns to a cross and an answer that opens under it. */
export function Faq({ items, title = 'שאלות נפוצות', kicker = 'יש שאלה?' }: { items: QA[]; title?: string; kicker?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className={`${em.wrap} ${s.faq}`} aria-label={title}>
      <div className={s.faqSide}>
        <Rule kicker={kicker} title={title} />
        <p><b>יש לכם שאלה שלא מופיעה כאן?</b><br />דברו איתנו ונשמח לעזור:</p>
        <a href={`tel:${PHONE.replace(/-/g, '')}`}><Phone aria-hidden strokeWidth={1.4} />{PHONE}</a>
        <a href={`mailto:${EMAIL}`}><Mail aria-hidden strokeWidth={1.4} />{EMAIL}</a>
      </div>
      <ul className={s.faqList}>
        {items.map((it, i) => (
          <li key={i} data-open={open === i || undefined}>
            <h3>
              <button type="button" aria-expanded={open === i} aria-controls={`qa-${i}`} onClick={() => setOpen(open === i ? null : i)}>
                <span>{it.q}</span><Plus aria-hidden strokeWidth={1.4} />
              </button>
            </h3>
            <div id={`qa-${i}`} className={s.answer} role="region" aria-label={it.q}>
              <div>
                <p><Rich text={it.a} /></p>
                {it.href && <p className={s.from}>מתוך: <Link href={it.href}>{it.from}</Link></p>}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
