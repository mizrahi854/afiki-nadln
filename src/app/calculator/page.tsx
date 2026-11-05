import type { Metadata } from 'next';
import Link from 'next/link';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { Calculator } from '@/components/em/Calculator';
import { Rule } from '@/components/em/Rule';
import { articles } from '@/lib/data';
import em from '@/components/em/em.module.css';
import s from '../info.module.css';

export const metadata: Metadata = { title: 'מחשבון משכנתא | אפיקי נדל״ן' };

export default function CalculatorPage() {
  const guide = articles.find((a) => a.title.includes('משכנתא'));
  return (
    <div className={em.page}>
      <EmHeader />
      <main className={s.top}>
        <div className={em.wrap}>
          <Rule kicker="כלים" title="מחשבון משכנתא" as="h1" />
          <p className={s.lede}>כמה תשלמו בכל חודש? הזינו מחיר, הון עצמי, תקופה וריבית.{guide && <> לקריאה נוספת: <Link href={`/articles/${guide.slug}`} style={{ textDecoration: 'underline' }}>{guide.title}</Link>.</>}</p>
        </div>
        <section className={`${em.wrap} ${s.more}`} style={{ paddingTop: '3vw' }}>
          <Calculator />
        </section>
      </main>
      <EmFooter />
    </div>
  );
}
