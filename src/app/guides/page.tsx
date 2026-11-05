import type { Metadata } from 'next';
import { ExtraPage } from '@/components/em/ExtraPage';
import { articles } from '@/lib/data';
import { EmCard } from '@/components/em/EmCard';
import { Rule } from '@/components/em/Rule';
import em from '@/components/em/em.module.css';
import s from '../info.module.css';

export const metadata: Metadata = { title: 'מדריכים מקצועיים | אפיקי נדל״ן' };
const guides = articles.filter((a) => a.img).slice(0, 9);

export default function Page() {
  return (
    <ExtraPage id="guides" hero="/media/listings/9237-0.jpg" kicker="קנייה ומכירה בראש העין" subject="מדריכים">
      <section className={`${em.wrap} ${s.more}`} aria-labelledby="guides-list">
        <Rule title="המדריכים והמאמרים שלנו" id="guides-list" />
        <div className={s.grid}>
          {guides.map((a) => <EmCard key={a.id} href={`/articles/${a.slug}`} img={a.img!} name={a.title} place={new Date(a.date).toLocaleDateString('he-IL')} desc={a.excerpt.slice(0, 70) + '…'} mark={false} />)}
        </div>
      </section>
    </ExtraPage>
  );
}
