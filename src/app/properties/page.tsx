import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { MortgageFab } from '@/components/home/MortgageFab';
import { MarqueeHero } from '@/components/em/MarqueeHero';
import { ListingBrowser } from '@/components/em/ListingBrowser';
import { SlantStrips, type Strip } from '@/components/em/SlantStrips';
import { forSale, kindOf, type Kind } from '@/lib/data';
import em from '@/components/em/em.module.css';
import s from './properties.module.css';

export const metadata: Metadata = { title: 'נכסים למכירה בראש העין | אפיקי נדל״ן' };

const pics = forSale.filter((l) => l.images.length > 2);
const left = pics.filter((_, i) => i % 2 === 0).slice(0, 6).map((l) => l.images[0]);
const right = pics.filter((_, i) => i % 2 === 1).slice(0, 6).map((l) => l.images[0]);

/** One panel per kind of home on the market now; numbers and places come straight from the listings. */
function strip(kinds: Kind[], title: string, img: string, href: string): Strip {
  const ls = forSale.filter((l) => kinds.includes(kindOf(l)));
  const places = Array.from(new Set(ls.map((l) => l.area ?? l.city))).slice(0, 3).join(', ');
  return { title, img, href, text: `${ls.length} נכסים למכירה עכשיו, ב${places}.`, cta: 'לכל הנכסים מהסוג הזה' };
}
const strips: Strip[] = [
  strip(['apartment', 'penthouse'], 'דירות ופנטהאוזים', '/media/listings/9364-0.jpg', '/properties?kind=apartment#all'),
  strip(['garden'], 'דירות גן', '/media/listings/9201-0.jpg', '/properties?kind=garden#all'),
  strip(['house'], 'בתים פרטיים', '/media/listings/9237-0.jpg', '/properties?kind=house#all'),
  strip(['land'], 'מגרשים לבנייה', '/media/listings/9332-0.jpg', '/properties?kind=land#all'),
];

export default function PropertiesPage() {
  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <MarqueeHero lead="נכסים" strong="למכירה" left={left} right={right}>
          <p>אפיקי נדל״ן משווקת עכשיו <b>{forSale.length} נכסים: דירות יד שנייה, דירות גן, פנטהאוזים, בתים פרטיים ומגרשים</b>, ברובם בראש העין.</p>
          <p>לכל נכס <b>מחיר, גודל ותמונות מהמודעה המקורית</b>, ופרטים מלאים בעמוד שלו.</p>
        </MarqueeHero>

        <section id="all" className={`${em.wrap} ${s.list}`}>
          <div className={`${em.headRow} ${s.head}`}>
            <h2>הכתובת שלכם לבית בראש העין.</h2>
            <span className={em.rule} />
            <Link className={em.poly} href="/sell"><ArrowLeft aria-hidden strokeWidth={1.4} />מוכרים נכס? דברו איתנו</Link>
          </div>
          <Suspense fallback={<div className={s.wait} />}>
            <ListingBrowser items={forSale} />
          </Suspense>
        </section>

        <section id="by-kind" className={s.kinds} aria-labelledby="kinds-title">
          <div className={em.splitHead}>
            <h2 id="kinds-title">לפי סוג נכס</h2>
            <span className={em.rule} />
            <i className={em.diamond} />
            <span className={em.rule} />
            <p>דירות, דירות גן, בתים פרטיים ומגרשים, בראש העין והסביבה.</p>
          </div>
          <SlantStrips items={strips} />
        </section>
      </main>
      <EmFooter />
      <MortgageFab presets={forSale.filter((l) => l.price && kindOf(l) !== 'land').map((l) => ({ id: l.id, label: l.title, price: l.price! }))} />
    </div>
  );
}
