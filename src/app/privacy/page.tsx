import type { Metadata } from 'next';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { Blocks } from '@/components/em/Rule';
import { infoPages } from '@/lib/data';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';
import s from '../info.module.css';

const page = infoPages.privacy;
const title = page.body[0]?.[0] === 'h' ? page.body[0][1].replace(/ – .*/, '') : page.title;
export const metadata: Metadata = { title: `${title} | אפיקי נדל״ן` };

/** Text page in Emerald's intro grid (title frame right, text left). Text as published on afikeynadlan.co.il. */
export default function Page() {
  return (
    <div className={em.page}>
      <EmHeader />
      <main className={s.top}>
        <article className={`${em.wrap} ${b.intro}`}>
          <div className={s.side}>
            <div className={`${em.frame} ${b.titleBox}`}>
              <div className={em.ruleRow}><i className={em.diamond} /><span className={em.line} /><h1>{title}</h1><span className={em.line} /><i className={em.diamond} /></div>
            </div>
            <p className={s.meta}>הנוסח כפי שהוא מופיע <a href={page.source} target="_blank" rel="noopener noreferrer">באתר אפיקי נדל״ן</a>.</p>
          </div>
          <div className={em.prose}><Blocks body={page.body[0]?.[0] === 'h' ? page.body.slice(1) : page.body} /></div>
        </article>
      </main>
      <EmFooter />
    </div>
  );
}
