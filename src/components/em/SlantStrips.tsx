import Link from 'next/link';
import s from './SlantStrips.module.css';

export type Strip = { title: string; text: string; img: string; href?: string; cta?: string };

/**
 * Emerald's "WHAT WE DO" row: four full-height photo panels cut on a slant and overlapping, 540px tall @1440.
 * Hovering one widens it to 50vw (1s) while the others give way; its photo blurs under a darker veil,
 * the glass title chip rises from the middle and the text fades up under it.
 * Below 1025px the panels stack, as in the source.
 */
export function SlantStrips({ items }: { items: Strip[] }) {
  return (
    <div className={s.row} data-n={items.length}>
      {items.map((it) => {
        const Tag = it.href ? Link : 'div';
        return (
          <Tag key={it.title} className={s.item} href={it.href ?? ''} style={{ backgroundImage: `url(${it.img})` }}>
            <span className={s.title}><span>{it.title}</span></span>
            <span className={s.content}>
              <span>{it.text}</span>
              {it.cta && <span className={s.cta}>{it.cta}</span>}
            </span>
          </Tag>
        );
      })}
    </div>
  );
}
