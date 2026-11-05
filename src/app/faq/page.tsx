import type { Metadata } from 'next';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { Faq } from '@/components/em/Faq';
import { Rule } from '@/components/em/Rule';
import { articleQuestions } from '@/lib/data';
import em from '@/components/em/em.module.css';
import s from '../info.module.css';

export const metadata: Metadata = { title: 'שאלות ותשובות | אפיקי נדל״ן' };

/** Emerald's FAQ block (urban-renewal) as a page. Afikey's site has no FAQ: the questions are the ones its own
 * articles ask, each answered by the article's next paragraph and linked to it. */
export default function FaqPage() {
  return (
    <div className={em.page}>
      <EmHeader />
      <main className={s.top}>
        <div className={em.wrap}>
          <Rule kicker="אפיקי נדל״ן" title="שאלות ותשובות" as="h1" />
          <p className={s.lede}>שאלות שעולות שוב ושוב בקנייה, במכירה ובמשכנתא, עם התשובות מתוך המאמרים של המשרד.</p>
        </div>
        <Faq items={articleQuestions.slice(0, 9)} title="מהמאמרים שלנו" kicker="שאלות נפוצות" />
      </main>
      <EmFooter />
    </div>
  );
}
