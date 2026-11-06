import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { MortgageFab } from '@/components/home/MortgageFab';
import { MarqueeHero } from '@/components/em/MarqueeHero';
import { EmCard } from '@/components/em/EmCard';
import { SlantStrips } from '@/components/em/SlantStrips';
import { hoodPages, hoodCards, listingsIn, forSale, kindOf } from '@/lib/data';
import em from '@/components/em/em.module.css';
import s from '../properties/properties.module.css';
import g from './hoods.module.css';

export const metadata: Metadata = { title: 'השכונות של ראש העין | אפיקי נדל״ן' };

const photos = hoodPages.flatMap((h) => h.gallery.slice(0, 3));
const left = photos.filter((_, i) => i % 2 === 0).slice(0, 6);
const right = photos.filter((_, i) => i % 2 === 1).slice(0, 6);

/** Emerald's projects page again (opening with photo columns, the 3-column card grid, the slanted panels),
 * filled with Afikey's neighborhood guides and their own photos. */
export default function NeighborhoodsPage() {
  const four = hoodPages.filter((h) => h.gallery.length).slice(0, 4);
  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <MarqueeHero lead="השכונות" strong="בראש העין" left={left} right={right}>
          <p>מדריכי השכונות של אפיקי נדל״ן: <b>מיקום, אופי, נוף ומחירים</b>, כמו שהם מופיעים באתר המשרד.</p>
          <p>לכל שכונה <b>עמוד משלה עם הנכסים שלה</b> שמשווקים עכשיו.</p>
        </MarqueeHero>

        <section className={`${em.wrap} ${s.list}`}>
          <div className={`${em.headRow} ${s.head}`}>
            <h2>{hoodPages.length} שכונות, עמוד לכל אחת.</h2>
            <span className={em.rule} />
            <Link className={em.poly} href="/properties"><ArrowLeft aria-hidden strokeWidth={1.4} />לכל הנכסים למכירה</Link>
          </div>
          <div className={g.grid}>
            {hoodPages.map((h) => {
              const n = listingsIn(h.slug).length;
              return (
                <EmCard key={h.slug} href={`/neighborhoods/${h.slug}`} img={hoodCards[h.slug]?.img ?? h.gallery[0]} name={h.name} place="ראש העין"
                  desc={n ? `${n} נכסים למכירה עכשיו` : hoodCards[h.slug]?.line} />
              );
            })}
          </div>
        </section>

        <section className={s.kinds} aria-labelledby="look-title">
          <div className={em.splitHead}>
            <h2 id="look-title">מבט מקרוב</h2>
            <span className={em.rule} /><i className={em.diamond} /><span className={em.rule} />
            <p>ארבע שכונות, מתוך הגלריות של אפיקי נדל״ן.</p>
          </div>
          <SlantStrips items={four.map((h) => ({ title: h.name, img: h.gallery[1] ?? h.gallery[0], href: `/neighborhoods/${h.slug}`, text: hoodCards[h.slug]?.line ?? h.intro.slice(0, 120), cta: 'למדריך השכונה' }))} />
        </section>
      </main>
      <EmFooter />
      <MortgageFab presets={forSale.filter((l) => l.price && kindOf(l) !== 'land').map((l) => ({ id: l.id, label: l.title, price: l.price! }))} />
    </div>
  );
}
