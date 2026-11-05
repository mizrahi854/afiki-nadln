import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { MarqueeHero } from '@/components/em/MarqueeHero';
import { EmCard } from '@/components/em/EmCard';
import { articles, dateHe } from '@/lib/data';
import em from '@/components/em/em.module.css';
import s from '../properties/properties.module.css';
import g from '../neighborhoods/hoods.module.css';

export const metadata: Metadata = { title: 'מאמרים ומדריכים | אפיקי נדל״ן' };

/** No Emerald counterpart: the projects-page structure (photo columns, title row, card grid) for Afikey's blog. */
export default function ArticlesPage() {
  const withImg = articles.filter((a) => a.img);
  return (
    <div className={em.page}>
      <EmHeader onPhoto />
      <main>
        <MarqueeHero lead="מאמרים" strong="ומדריכים" left={withImg.filter((_, i) => i % 2 === 0).map((a) => a.img!)} right={withImg.filter((_, i) => i % 2 === 1).map((a) => a.img!)}>
          <p>מהבלוג של אפיקי נדל״ן: <b>שוק הנדל״ן, משכנתאות, קנייה ומכירה</b>, ומה שקורה בראש העין.</p>
          <p>{articles.length} המאמרים האחרונים, בנוסח המלא שלהם.</p>
        </MarqueeHero>
        <section className={`${em.wrap} ${s.list}`}>
          <div className={`${em.headRow} ${s.head}`}>
            <h2>מה חדש בשוק.</h2>
            <span className={em.rule} />
            <Link className={em.poly} href="/faq"><ArrowLeft aria-hidden strokeWidth={1.4} />שאלות ותשובות</Link>
          </div>
          <div className={g.grid}>
            {articles.map((a) => (
              <EmCard key={a.id} href={`/articles/${a.slug}`} img={a.img ?? '/media/psagot/fly-1.jpg'} name={a.title} place={dateHe(a.date)} desc={a.excerpt.slice(0, 70) + '…'} mark={false} />
            ))}
          </div>
        </section>
      </main>
      <EmFooter />
    </div>
  );
}
