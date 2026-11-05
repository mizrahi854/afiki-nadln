import type { Metadata } from 'next';
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { ContactFrame } from '@/components/em/ContactFrame';
import { Rule } from '@/components/em/Rule';
import { PHONE } from '@/lib/content';
import { EMAIL, ADDRESS, AGENT } from '@/lib/data';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';
import s from '../info.module.css';

export const metadata: Metadata = { title: 'צרו קשר | אפיקי נדל״ן' };

/** Emerald's contact page was not measured; built from the measured pieces: the title row, the numbers boxes
 * (as contact tiles) and the "LET'S TALK" frame. Details as published on afikeynadlan.co.il. */
export default function ContactPage() {
  const tel = PHONE.replace(/-/g, '');
  const tiles = [
    { icon: Phone, k: 'טלפון', v: PHONE, href: `tel:${tel}`, ltr: true },
    { icon: MessageCircle, k: 'וואטסאפ', v: 'שליחת הודעה', href: `https://wa.me/972${tel.slice(1)}` },
    { icon: Mail, k: 'אימייל', v: EMAIL, href: `mailto:${EMAIL}` },
    { icon: MapPin, k: 'המשרד', v: ADDRESS },
  ];
  return (
    <div className={em.page}>
      <EmHeader />
      <main className={s.top}>
        <div className={em.wrap}>
          <Rule kicker="אפיקי נדל״ן" title="צרו קשר" as="h1" />
          <p className={s.lede}>{AGENT}, יועץ נדל״ן ובעלי המשרד, זמין בטלפון, בוואטסאפ ובאימייל.</p>
          <ul className={s.tiles}>
            {tiles.map(({ icon: I, k, v, href, ltr }) => {
              const inner = <><I aria-hidden strokeWidth={1.3} /><span>{k}</span><b dir={ltr ? 'ltr' : undefined}>{v}</b></>;
              return <li key={k} className={em.frame}>{href ? <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">{inner}</a> : <div>{inner}</div>}</li>;
            })}
          </ul>
        </div>
        <ContactFrame title="השאירו פרטים ונחזור אליכם" />
      </main>
      <EmFooter />
    </div>
  );
}
