import Link from 'next/link';
import { MapPin } from 'lucide-react';
import s from './EmCard.module.css';

/**
 * Emerald's project card. Photo fills the frame; a one-line glass bar sits on the bottom edge with the name on
 * the right and the place on the left. Hover (0.5s): the photo zooms to 1.1 with blur(5px) brightness(1.2),
 * the mark fades in from 0.9, and a description line opens inside the bar (opacity 0.5s, max-height 1s).
 */
export function EmCard({ href, img, name, place, desc, mark = true }: {
  href: string; img: string; name: string; place?: string; desc?: string; mark?: boolean;
}) {
  return (
    <Link className={s.card} href={href}>
      <span className={s.photo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt="" loading="lazy" />
      </span>
      {mark && (
        <span className={s.mark} aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/media/brand/logo.png" alt="" />
        </span>
      )}
      <span className={s.bar}>
        <span className={s.row}>
          <span className={s.name}>{name}</span>
          {place && <span className={s.place}><MapPin aria-hidden strokeWidth={1.4} />{place}</span>}
        </span>
        {desc && <span className={s.desc}>{desc}</span>}
      </span>
    </Link>
  );
}
