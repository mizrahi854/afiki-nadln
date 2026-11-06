import type { Metadata } from 'next';
import { ArrowLeft } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { PhotoHero } from '@/components/em/PhotoHero';
import { HScroll, type Step } from '@/components/em/HScroll';
import { ContactFrame } from '@/components/em/ContactFrame';
import { Rule, Rich } from '@/components/em/Rule';
import { infoPages } from '@/lib/data';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';

export const metadata: Metadata = { title: 'מוכרים נכס? | אפיקי נדל״ן' };

/** No Emerald counterpart: assembled from the urban-renewal opening, its pinned process and its story panel,
 * with the text of Afikey's "מוכרים נכס?" page. */
export default function SellPage() {
  const body = infoPages.sell.body;
  const lead = body.find(([k], i) => k === 'h' && i > 0)?.[1];
  const steps: Step[] = body.flatMap(([k, t], i) => (k === 'h' && body[i + 1]?.[0] === 'p' && !t.includes('לקוח מרוצה') ? [{ title: t.replace(/\*$/, ''), text: body[i + 1][1].replace(/\*\*/g, '') }] : []));
  const closing = body.find(([, t]) => t.includes('לקוח מרוצה'))?.[1];
  const note = body.find(([, t]) => t.startsWith('*'))?.[1];
  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <PhotoHero img="/media/listings/9223-0.jpg" kicker="אפיקי נדל״ן" title="מוכרים נכס?"
          action={<a className={em.poly} href="#talk-title"><ArrowLeft aria-hidden strokeWidth={1.4} />לתיאום הערכת שווי</a>}>
          {lead && <p><b>{lead.replace(/\s+/g, ' ')}</b></p>}
        </PhotoHero>
        <HScroll kicker="השיטה שלנו" title="איך מוכרים איתנו" img="/media/listings/9237-1.jpg" steps={steps} />
        {closing && (
          <section id="reviews" className={b.story}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/psagot/fly-3.jpg" alt="" loading="lazy" />
            <div className={`${em.frame} ${b.storyPanel}`}>
              <Rule kicker="אפיקי נדל״ן" title="לקוחות ממליצים" />
              <div className={em.prose}><p>{closing}</p>{note && <p><small><Rich text={note} /></small></p>}</div>
              <a className={em.poly} href="#talk-title"><ArrowLeft aria-hidden strokeWidth={1.4} />השאירו פרטים</a>
            </div>
          </section>
        )}
        <ContactFrame title="רוצים לדעת כמה שווה הנכס שלכם?" subject="מכירת נכס" />
      </main>
      <EmFooter />
    </div>
  );
}
