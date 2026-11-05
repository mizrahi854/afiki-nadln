import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ArrowLeft } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { MarqueeHero } from '@/components/em/MarqueeHero';
import { ListingBrowser } from '@/components/em/ListingBrowser';
import { ContactFrame } from '@/components/em/ContactFrame';
import { sold } from '@/lib/data';
import em from '@/components/em/em.module.css';
import s from '../properties/properties.module.css';

export const metadata: Metadata = { title: 'נכסים שנמכרו | אפיקי נדל״ן' };

const pics = sold.filter((l) => l.images.length > 1);
const left = pics.filter((_, i) => i % 2 === 0).slice(0, 6).map((l) => l.images[0]);
const right = pics.filter((_, i) => i % 2 === 1).slice(0, 6).map((l) => l.images[0]);
const areas = new Set(sold.map((l) => l.area ?? l.city)).size;

/** The original site's "נכסים שנמכרו": the same opening and browser as the for-sale page, over the sold listings. */
export default function SoldPage() {
  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <MarqueeHero lead="נכסים" strong="שנמכרו" left={left} right={right}>
          <p><b>{sold.length} נכסים</b> שאפיקי נדל״ן מכרה, ב־{areas} שכונות ויישובים.</p>
          <p>לכל נכס התמונות והפרטים מהמודעה המקורית.</p>
        </MarqueeHero>

        <section id="all" className={`${em.wrap} ${s.list}`}>
          <div className={`${em.headRow} ${s.head}`}>
            <h2>הנכסים שמכרנו.</h2>
            <span className={em.rule} />
            <Link className={em.poly} href="/sell"><ArrowLeft aria-hidden strokeWidth={1.4} />רוצים שנמכור גם את שלכם?</Link>
          </div>
          <Suspense fallback={<div className={s.wait} />}>
            <ListingBrowser items={sold} noun="נכסים שנמכרו" />
          </Suspense>
        </section>

        <ContactFrame title="רוצים לדעת כמה שווה הנכס שלכם?" subject="הערכת שווי" />
      </main>
      <EmFooter />
    </div>
  );
}
