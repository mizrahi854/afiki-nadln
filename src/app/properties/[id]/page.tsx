import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { MapPin, Home, Tag, Check, Phone, MessageCircle, Calculator as CalcIcon } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { EmCarousel } from '@/components/em/EmCarousel';
import { EmCard } from '@/components/em/EmCard';
import { ContactFrame } from '@/components/em/ContactFrame';
import { Rule } from '@/components/em/Rule';
import { Calculator } from '@/components/em/Calculator';
import { MortgageFab } from '@/components/home/MortgageFab';
import { listings, forSale, getListing, place, price, slugForArea } from '@/lib/data';
import { PHONE } from '@/lib/content';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';
import s from './property.module.css';

export function generateStaticParams() {
  return listings.map((l) => ({ id: String(l.id) }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const l = getListing((await params).id);
  return { title: l ? `${l.title} | אפיקי נדל״ן` : 'נכס | אפיקי נדל״ן' };
}

/** Built on Emerald's single-project page (projects/moria): gallery strip, title frame + text, framed photo with
 * the numbers, the contact frame, and three more cards. */
export default async function PropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const l = getListing((await params).id);
  if (!l) notFound();
  const more = forSale.filter((x) => x.id !== l.id && x.area === l.area).concat(forSale.filter((x) => x.id !== l.id && x.area !== l.area)).slice(0, 3);
  const nums = ([[l.rooms, 'חדרים'], [l.size, 'מ״ר'], [l.baths, 'חדרי רחצה']] as [number | null, string][]).filter(([v]) => v);
  const hood = slugForArea(l.area);
  const wa = `https://wa.me/972${PHONE.replace(/-/g, '').slice(1)}?text=${encodeURIComponent(`שלום, אשמח לפרטים על הנכס: ${l.title}`)}`;
  const gallery = l.images.length > 1 ? l.images : [...l.images, ...l.images];

  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <EmCarousel images={gallery} label={l.title} />

        <section className={`${em.wrap} ${b.intro}`}>
          <div>
            <div className={`${em.frame} ${b.titleBox}`}>
              <div className={em.ruleRow}><i className={em.diamond} /><span className={em.line} /><h1>{l.title}</h1><span className={em.line} /><i className={em.diamond} /></div>
            </div>
            <p className={s.price}>{price(l.price)}</p>
            <div className={s.actions}>
              <a className={em.poly} href={`tel:${PHONE.replace(/-/g, '')}`}><Phone aria-hidden strokeWidth={1.4} />חייגו {PHONE}</a>
              <a className={`${em.poly} ${s.ghost}`} href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle aria-hidden strokeWidth={1.4} />וואטסאפ</a>
              {l.price && <a className={`${em.poly} ${s.ghost}`} href="#mortgage"><CalcIcon aria-hidden strokeWidth={1.4} />חישוב משכנתא</a>}
            </div>
          </div>
          <div>
            <div className={em.prose}>{l.body.map((p, i) => <p key={i}>{p}</p>)}</div>
            <ul className={b.facts}>
              <li><MapPin aria-hidden strokeWidth={1.3} /><b>מיקום:</b> {[l.address, place(l)].filter(Boolean).join(', ')}</li>
              {l.types.length > 0 && <li><Home aria-hidden strokeWidth={1.3} /><b>סוג הנכס:</b> {l.types.join(', ')}</li>}
              {l.labels.length > 0 && <li><Tag aria-hidden strokeWidth={1.3} /><b>סטטוס:</b> {l.labels.join(', ')}</li>}
            </ul>
          </div>
        </section>

        {(nums.length > 0 || l.features.length > 0) && (
          <section className={b.split}>
            <div className={b.numbers}>
              <Rule title={hood && l.area ? l.area : 'פרטי הנכס'} />
              {nums.length > 0 && <>
                <p>הנכס במספרים:</p>
                <ul className={b.boxes}>
                  {nums.map(([v, k]) => <li key={k} className={em.frame}><b>{v}</b><span>{k}</span></li>)}
                </ul>
              </>}
              {l.features.length > 0 && (
                <ul className={s.features} aria-label="מה יש בנכס">
                  {l.features.map((f) => <li key={f}><Check aria-hidden strokeWidth={1.4} />{f}</li>)}
                </ul>
              )}
            </div>
            <div className={b.chamfer}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={l.images[1] ?? l.images[0]} alt="" loading="lazy" />
            </div>
          </section>
        )}

        {l.price && (
          <section id="mortgage" className={`${em.wrap} ${s.mortgage}`} aria-labelledby="mortgage-title" data-mortgage-inline>
            <Rule kicker="כמה זה יעלה לי בחודש?" title="מחשבון משכנתא לנכס" id="mortgage-title" />
            <p className={s.mortgageLede}>המחשבון כבר מוזן במחיר הנכס, {price(l.price)}, עם 25% הון עצמי. שנו את המספרים ותראו את ההחזר החודשי.</p>
            <Calculator defaultPrice={l.price} />
          </section>
        )}

        <ContactFrame title="מתעניינים בנכס הזה?" subject={l.title} />

        <section className={`${em.wrap} ${s.more}`} aria-labelledby="more-title">
          <Rule title="נכסים נוספים" id="more-title" />
          <div className={s.grid}>
            {more.map((x) => (
              <EmCard key={x.id} href={`/properties/${x.id}`} img={x.images[0]} name={x.title} place={x.area ?? x.city}
                desc={[price(x.price), x.rooms && `${x.rooms} חד׳`, x.size && `${x.size} מ״ר`].filter(Boolean).join(' · ')} />
            ))}
          </div>
        </section>
      </main>
      <EmFooter />
      {l.price && <MortgageFab base={{ price: l.price, title: l.title }} />}
    </div>
  );
}
