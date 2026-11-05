import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { EmCard } from '@/components/em/EmCard';
import { ContactFrame } from '@/components/em/ContactFrame';
import { Rule, Blocks } from '@/components/em/Rule';
import { articles, getArticle, dateHe } from '@/lib/data';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';
import s from '../../info.module.css';

export function generateStaticParams() { return articles.map((a) => ({ slug: a.slug })); }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const a = getArticle((await params).slug);
  return { title: a ? `${a.title} | אפיקי נדל״ן` : 'מאמר | אפיקי נדל״ן' };
}

/** No Emerald counterpart: the single-project layout (photo strip, title frame right, text left, more cards). */
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const a = getArticle((await params).slug);
  if (!a) notFound();
  const body = a.body[0]?.[0] === 'h' && a.body[0][1] === a.title ? a.body.slice(1) : a.body;
  const more = articles.filter((x) => x.id !== a.id).slice(0, 3);
  return (
    <div className={em.page}>
      <EmHeader onPhoto={!!a.img} />
      <main className={a.img ? undefined : s.top}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {a.img && <img className={s.hero} src={a.img} alt="" />}
        <article className={`${em.wrap} ${b.intro}`}>
          <div className={s.side}>
            <div className={`${em.frame} ${b.titleBox}`}>
              <div className={em.ruleRow}><i className={em.diamond} /><span className={em.line} /><h1>{a.title}</h1><span className={em.line} /><i className={em.diamond} /></div>
            </div>
            <p className={s.meta}><time dateTime={a.date}>{dateHe(a.date)}</time> · מתוך <a href={a.source} target="_blank" rel="noopener noreferrer">הבלוג של אפיקי נדל״ן</a></p>
          </div>
          <div className={em.prose}><Blocks body={body} /></div>
        </article>
        <section className={`${em.wrap} ${s.more}`} aria-labelledby="more-title">
          <Rule title="מאמרים נוספים" id="more-title" />
          <div className={s.grid}>
            {more.map((x) => <EmCard key={x.id} href={`/articles/${x.slug}`} img={x.img ?? '/media/psagot/fly-1.jpg'} name={x.title} place={dateHe(x.date)} mark={false} />)}
          </div>
        </section>
        <ContactFrame title="רוצים לדבר על זה?" />
      </main>
      <EmFooter />
    </div>
  );
}
