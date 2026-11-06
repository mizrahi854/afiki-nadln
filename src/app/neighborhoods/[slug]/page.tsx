import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Home, Trees, MapPin, Building2 } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { MortgageFab } from '@/components/home/MortgageFab';
import { PhotoHero } from '@/components/em/PhotoHero';
import { EmCard } from '@/components/em/EmCard';
import { HScroll, type Step } from '@/components/em/HScroll';
import { ContactFrame } from '@/components/em/ContactFrame';
import { Rule } from '@/components/em/Rule';
import { FadeUp, Counter } from '@/components/em/motion';
import { hoodPages, hoodCards, getHood, listingsIn, price } from '@/lib/data';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';
import s from './hood.module.css';

export function generateStaticParams() {
  return hoodPages.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const h = getHood((await params).slug);
  return { title: h ? `${h.name} | אפיקי נדל״ן` : 'שכונה | אפיקי נדל״ן' };
}

const icons = [Home, Trees, Building2, MapPin];

/** Built on Emerald's urban-renewal page: photo opening, title + text, the area's listings, the price cards
 * (where the guide has prices), the pinned sideways story, counters, and the contact frame. */
export default async function HoodPage({ params }: { params: Promise<{ slug: string }> }) {
  const h = getHood((await params).slug);
  if (!h) notFound();
  const homes = listingsIn(h.slug);
  const card = hoodCards[h.slug];
  const pics = h.gallery.length ? h.gallery : [card?.img].filter(Boolean) as string[];
  const [first, ...rest] = h.sections;
  const steps: Step[] = rest.flatMap((sec) => sec.p.map((p, i) => ({ title: i === 0 ? sec.h : undefined, text: p })));
  if (steps.length < 3 && first) steps.unshift(...first.p.slice(1).map((p) => ({ text: p })));
  const quote = h.sections.find((x) => x.quote)?.quote;
  const prices = homes.map((l) => l.price).filter((x): x is number => !!x);

  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <PhotoHero img={card?.img ?? pics[0]} kicker="ראש העין" title={h.name}
          action={<a className={em.poly} href="#homes"><ArrowLeft aria-hidden strokeWidth={1.4} />לנכסים בשכונה</a>}>
          <p>{h.intro}</p>
        </PhotoHero>

        {first && (
          <section id="about" className={`${em.wrap} ${s.about}`}>
            <Rule kicker={h.name} title={first.h} split className={s.aboutHead} />
            <div className={em.prose}>
              {(steps.length >= 3 ? first.p : first.p.slice(0, 1)).map((p, i) => <p key={i}>{p}</p>)}
              {first.quote && <blockquote>{first.quote}</blockquote>}
            </div>
          </section>
        )}

        <section id="homes" className={`${em.wrap} ${s.homes}`} aria-labelledby="homes-title">
          <Rule title={homes.length ? 'נכסים למכירה בשכונה' : 'נכסים בשכונה'} long id="homes-title" />
          {homes.length ? (
            <div className={s.grid}>
              {homes.slice(0, 3).map((l) => (
                <EmCard key={l.id} href={`/properties/${l.id}`} img={l.images[0]} name={l.title} place={l.area ?? l.city}
                  desc={[price(l.price), l.rooms && `${l.rooms} חד׳`, l.size && `${l.size} מ״ר`].filter(Boolean).join(' · ')} />
              ))}
            </div>
          ) : (
            <p className={s.none}>אין כרגע נכס למכירה בשכונה הזאת. <Link href="/#talk-title">השאירו פרטים</Link> ויוסי יעדכן כשייכנס נכס.</p>
          )}
          <div className={s.center}>
            <Link className={em.poly} href={homes.length ? `/properties?area=${encodeURIComponent(homes[0].area ?? '')}#all` : '/properties'}>
              <ArrowLeft aria-hidden strokeWidth={1.4} />{homes.length > 3 ? `לכל ${homes.length} הנכסים בשכונה` : 'לכל הנכסים למכירה'}
            </Link>
          </div>
        </section>

        {h.prices && (
          <section id="prices" className={`${em.wrap} ${s.prices}`} aria-labelledby="prices-title">
            <div className={em.headRow}>
              <h2 id="prices-title">מחירים ב{h.name}</h2>
              <span className={em.rule} /><i className={em.diamond} /><span className={em.rule} />
              <p className={s.note}>טווחי המחירים כפי שהם מופיעים במדריך השכונה של אפיקי נדל״ן.</p>
            </div>
            <ul className={b.cards5} style={{ gridTemplateColumns: `repeat(${h.prices.length}, 15.5vw)` }}>
              {h.prices.map(([k, v], i) => {
                const I = icons[i % icons.length];
                return (
                  <FadeUp as="li" key={k} delay={i * 100} className={`${em.frame} ${b.vcard}`}>
                    <span className={b.badge}><I aria-hidden strokeWidth={1.4} /></span>
                    <h3>{k}</h3>
                    <p dir="rtl">{v}</p>
                  </FadeUp>
                );
              })}
            </ul>
          </section>
        )}

        {steps.length >= 3 && <HScroll kicker={h.name} title="מה חשוב לדעת" img={pics[1] ?? pics[0]} steps={steps} />}

        {homes.length > 0 && (
          <ul className={b.counters}>
            <li><b><Counter to={homes.length} /></b><span>נכסים למכירה עכשיו בשכונה</span></li>
            {prices.length > 0 && <li><b><Counter to={Math.min(...prices)} prefix="₪" /></b><span>המחיר הנמוך בשכונה כרגע</span></li>}
            <li><b><Counter to={pics.length} /></b><span>צילומים בגלריית השכונה</span></li>
          </ul>
        )}

        {quote && pics[2] && (
          <section id="story" className={b.story}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={pics[2]} alt="" loading="lazy" />
            <div className={`${em.frame} ${b.storyPanel}`}>
              <Rule kicker="מתוך המדריך" title={h.name} />
              <div className={em.prose}><p>{quote}</p></div>
              <Link className={em.poly} href="/neighborhoods"><ArrowLeft aria-hidden strokeWidth={1.4} />לשאר השכונות</Link>
            </div>
          </section>
        )}

        <ContactFrame title={`מחפשים בית ב${h.name}?`} subject={`נכס ב${h.name}`} />
      </main>
      <EmFooter />
      <MortgageFab presets={(homes.some((l) => l.price) ? homes : undefined)?.filter((l) => l.price).map((l) => ({ id: l.id, label: l.title, price: l.price! }))} />
    </div>
  );
}
