import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import s from './inner.module.css';

/**
 * Opening of an inner page after Emerald's projects page: a centered two-line serif title (a light first line
 * set between two diamonds, a heavy second line), a short paragraph, and columns of photos bleeding off both
 * edges of the screen.
 */
export function PageHero({ lead, strong, children, right, left }: { lead: string; strong: string; children?: ReactNode; right: string[]; left: string[] }) {
  return (
    <Reveal as="section" className={s.hero}>
      <div className={`${s.heroCol} ${s.heroRight}`} aria-hidden>
        {right.map((src) => <div key={src} className={s.heroImg} data-r="img">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src} alt="" /></div>)}
      </div>
      <div className={s.heroText}>
        <h1 className={s.heroTitle} data-r="up">
          <span className={s.heroLead}><i aria-hidden />{lead}<i aria-hidden /></span>
          <strong>{strong}</strong>
        </h1>
        {children && <div className={s.heroBody} data-r="up">{children}</div>}
      </div>
      <div className={`${s.heroCol} ${s.heroLeft}`} aria-hidden>
        {left.map((src) => <div key={src} className={s.heroImg} data-r="img">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={src} alt="" /></div>)}
      </div>
    </Reveal>
  );
}

/** Emerald section heading: a word, a hairline ending in a diamond, and an optional second line. */
export function SectionHead({ title, sub, children, center }: { title: string; sub?: string; children?: ReactNode; center?: boolean }) {
  return (
    <div className={center ? `${s.head} ${s.headCenter}` : s.head}>
      <h2 className={s.headTitle} data-r="up">
        <span className={s.headFirst}>{title}<i aria-hidden /></span>
        {sub && <span className={s.headSub}>{sub}</span>}
      </h2>
      {children && <div className={s.headAside} data-r="up">{children}</div>}
    </div>
  );
}
