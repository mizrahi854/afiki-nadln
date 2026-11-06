import type { Metadata } from 'next';
import { ExternalLink, Phone } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { PhotoHero } from '@/components/em/PhotoHero';
import { EmCarousel } from '@/components/em/EmCarousel';
import { ContactFrame } from '@/components/em/ContactFrame';
import { Rule } from '@/components/em/Rule';
import { cyprus } from '@/lib/data';
import { PHONE } from '@/lib/content';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';
import s from './cyprus.module.css';

export const metadata: Metadata = { title: 'השקעות בקפריסין | אפיקי נדל״ן' };
const tel = `tel:${PHONE.replace(/-/g, '')}`;

/** Afikey's "השקעות בקפריסין" page: the urban-renewal opening, the story split with the framed photo,
 * the six services as numbered octagons, the example-properties gallery strip and the contact frame. */
export default function CyprusPage() {
  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <PhotoHero img={cyprus.gallery[0]} kicker={cyprus.kicker} title={cyprus.title}
          action={<a className={em.poly} href={tel}><Phone aria-hidden strokeWidth={1.4} />דברו איתי - {PHONE}</a>}>
          <p>{cyprus.p[0]}</p>
        </PhotoHero>

        <section className={`${b.split} ${s.story}`} aria-labelledby="horizon-title">
          <div className={s.text}>
            <p className={em.kicker}>פאפוס, קפריסין · מאז 2015</p>
            <h2 id="horizon-title" className={s.title}>
              <span className={s.lead}>מהמיפוי</span>
              <strong>ועד ניהול הנכס</strong>
            </h2>
            <div className={em.prose}>{cyprus.p.slice(1).map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</div>
            <div className={s.actions}>
              <a className={em.poly} href={tel}><Phone aria-hidden strokeWidth={1.4} />דברו איתי - {PHONE}</a>
              <a className={`${em.poly} ${s.ghost}`} href={cyprus.horizon} target="_blank" rel="noopener noreferrer"><ExternalLink aria-hidden strokeWidth={1.4} />מעבר ל־horizon group</a>
            </div>
          </div>
          <div className={b.chamfer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cyprus.gallery[4]} alt="" loading="lazy" />
          </div>
        </section>

        <section className={`${em.wrap} ${s.services}`} aria-labelledby="cy-services-title">
          <Rule kicker="מה החברה עושה" title="ליווי מלא בקפריסין" id="cy-services-title" />
          <ol>
            {cyprus.services.map((t, i) => (
              <li key={t} className={em.frame}><b>{String(i + 1).padStart(2, '0')}</b><span>{t}</span></li>
            ))}
          </ol>
        </section>

        <section className={s.gallery} aria-labelledby="cy-gallery-title">
          <div className={em.wrap}><Rule kicker="פאפוס, קפריסין" title="נכסים לדוגמא" id="cy-gallery-title" /></div>
          <EmCarousel images={cyprus.gallery.slice(1)} label="נכסים לדוגמא בקפריסין" />
        </section>

        <ContactFrame title="רוצים לשמוע על השקעה בקפריסין?" subject="השקעות בקפריסין" />
      </main>
      <EmFooter />
    </div>
  );
}
