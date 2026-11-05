import type { ReactNode } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EmHeader } from './EmHeader';
import { EmFooter } from './EmFooter';
import { PhotoHero } from './PhotoHero';
import { EmCard } from './EmCard';
import { ContactFrame } from './ContactFrame';
import { Rule, Blocks } from './Rule';
import { extraPages, price, type Listing } from '@/lib/data';
import em from './em.module.css';
import b from './blocks.module.css';
import s from '@/app/info.module.css';

type Key = keyof typeof extraPages;

/**
 * One of the original site's standalone pages (Matan, Psagot Ayala, offices, gardens, guides): the photo
 * opening with its first heading and paragraph, the rest of its text in the intro grid, its photos,
 * optionally the matching listings, and the contact frame.
 */
export function ExtraPage({ id, hero, kicker, stop, listings, children, subject }: {
  id: Key; hero: string; kicker: string; stop?: (t: string) => boolean; listings?: Listing[]; children?: ReactNode; subject?: string;
}) {
  const page = extraPages[id];
  // the original pages embed listing widgets; their text ends where the first listing starts
  const cut = stop ? page.body.findIndex(([k, t], i) => i > 1 && k === 'h' && stop(t)) : -1;
  const body = cut > 0 ? page.body.slice(0, cut) : page.body;
  const title = body[0]?.[0] === 'h' ? body[0][1] : page.title;
  const lead = body.find(([k], i) => i > 0 && k === 'p')?.[1];
  const rest = body.filter((x, i) => i > 0 && x[1] !== lead);
  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <PhotoHero img={hero} kicker={kicker} title={title}
          action={<a className={em.poly} href="#talk-title"><ArrowLeft aria-hidden strokeWidth={1.4} />לשיחה עם יוסי</a>}>
          {lead && <p>{lead}</p>}
        </PhotoHero>

        {rest.length > 0 && (
          <article className={`${em.wrap} ${s.intro}`} style={{ paddingTop: '5vw' }}>
            <div className={s.side}>
              <div className={`${em.frame} ${b.titleBox}`}>
                <div className={em.ruleRow}><i className={em.diamond} /><span className={em.line} /><h2>{page.title}</h2><span className={em.line} /><i className={em.diamond} /></div>
              </div>
              <p className={s.meta}>מתוך <a href={page.source} target="_blank" rel="noopener noreferrer">העמוד באתר אפיקי נדל״ן</a>.</p>
            </div>
            <div className={em.prose} data-reveal="text"><Blocks body={rest} /></div>
          </article>
        )}

        {page.images.length > 1 && (
          <section className={`${em.wrap} ${s.more}`}>
            <div className={s.grid}>
              {page.images.map((src) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={src} src={src} alt="" loading="lazy" className={s.photo} data-reveal="img" />
              ))}
            </div>
          </section>
        )}

        {listings && listings.length > 0 && (
          <section className={`${em.wrap} ${s.more}`} aria-labelledby="extra-homes">
            <Rule title="נכסים מתאימים עכשיו" id="extra-homes" />
            <div className={s.grid}>
              {listings.map((l) => (
                <EmCard key={l.id} href={`/properties/${l.id}`} img={l.images[0]} name={l.title} place={l.area ?? l.city}
                  desc={[price(l.price), l.rooms && `${l.rooms} חד׳`, l.size && `${l.size} מ״ר`].filter(Boolean).join(' · ')} />
              ))}
            </div>
          </section>
        )}
        {children}
        <ContactFrame title="רוצים לשמוע עוד?" subject={subject ?? page.title} />
      </main>
      <EmFooter />
    </div>
  );
}
