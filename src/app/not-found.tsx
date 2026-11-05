import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import em from '@/components/em/em.module.css';
import s from './info.module.css';
import n from './not-found.module.css';

/** 404 in the inner pages' language: the outlined octagon with a serif number, and the way back. */
export default function NotFound() {
  return (
    <div className={em.page}>
      <EmHeader />
      <main className={s.top}>
        <section className={`${em.wrap} ${n.box}`}>
          <div className={`${em.frame} ${em.frameWide} ${n.frame}`}>
            <p className={n.num} aria-hidden>404</p>
            <div className={em.ruleRow}><i className={em.diamond} /><span className={em.line} /><h1>העמוד לא נמצא</h1><span className={em.line} /><i className={em.diamond} /></div>
            <p className={n.text}>ייתכן שהנכס כבר נמכר או שהכתובת השתנתה. אפשר להמשיך מכאן:</p>
            <div className={n.links}>
              <Link className={em.poly} href="/properties"><ArrowLeft aria-hidden strokeWidth={1.4} />לכל הנכסים למכירה</Link>
              <Link className={`${em.poly} ${n.ghost}`} href="/">לעמוד הבית</Link>
            </div>
          </div>
        </section>
      </main>
      <EmFooter />
    </div>
  );
}
