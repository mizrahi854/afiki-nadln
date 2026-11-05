import type { ReactNode } from 'react';
import em from './em.module.css';
import s from './PhotoHero.module.css';

/**
 * Emerald's urban-renewal opening: a full-bleed photo cut on both bottom corners, a serif kicker between
 * diamonds and rules, a large bold H1 under it, a short text and the octagon button (fade-up), centred.
 */
export function PhotoHero({ img, kicker, title, children, action }: { img: string; kicker: string; title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <section className={s.hero}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className={s.bg} src={img} alt="" />
      <div className={s.inner}>
        <div className={`${em.ruleRow} ${s.kick}`}><i className={em.diamond} /><span className={em.line} /><p>{kicker}</p><span className={em.line} /><i className={em.diamond} /></div>
        <h1 className={s.title} style={{ ['--tl' as string]: title.length }}>{title}</h1>
        {children && <div className={s.text}>{children}</div>}
        {action && <div className={s.action}>{action}</div>}
      </div>
    </section>
  );
}
