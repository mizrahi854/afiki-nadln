import type { ReactNode } from 'react';
import em from './em.module.css';
import s from './MarqueeHero.module.css';

/**
 * Emerald's projects-page opening: a centred two-size title flanked by diamonds and a short text,
 * between two endless columns of square photos (left column travels up, right one down, 6s per photo,
 * paused on hover) that fade out towards the bottom. Phones: one tilted strip above the title.
 */
export function MarqueeHero({ lead, strong, children, left, right }: {
  lead: string; strong: string; children: ReactNode; left: string[]; right: string[];
}) {
  const col = (imgs: string[], dir: 'up' | 'down', cls: string) => (
    <div className={`${s.col} ${cls}`} aria-hidden>
      <div className={s.track} data-dir={dir} style={{ ['--n' as string]: imgs.length }}>
        {[...imgs, ...imgs].map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img key={i} src={src} alt="" loading={i < 3 ? 'eager' : 'lazy'} />
        ))}
      </div>
    </div>
  );
  return (
    <section className={`${s.hero} ${em.lines}`}>
      {col(left, 'up', s.left)}
      {col(right, 'down', s.right)}
      <div className={s.strip} aria-hidden>
        <div className={s.stripTrack} style={{ ['--n' as string]: left.length }}>
          {[...left, ...left].map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" />
          ))}
        </div>
      </div>
      <div className={s.center}>
        {/* --ll/--sl: letter counts, so each line is sized to fit the centre column whatever the word */}
        <h1 className={s.title} style={{ ['--ll' as string]: lead.length, ['--sl' as string]: strong.length }}>
          <span className={s.lead}><i className={em.diamond} />{lead}<i className={em.diamond} /></span>
          <span className={s.big}>{strong}</span>
        </h1>
        <div className={s.text}>{children}</div>
      </div>
    </section>
  );
}
