import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';
import s from './PhotoCard.module.css';

/**
 * Emerald's project card: photo with a smoked info bar (name, place); on hover the photo blurs and darkens,
 * a diamond mark appears, and a detail line opens inside the bar.
 */
export function PhotoCard({ href, img, name, meta, side, line, badge, tall }: {
  href: string; img: string; name: string; meta?: string; side?: string; line?: string; badge?: string; tall?: boolean;
}) {
  return (
    <Link className={s.card} href={href} data-r="img" data-tall={tall || undefined}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={img} alt="" loading="lazy" />
      <span className={s.veil} aria-hidden />
      <span className={s.mark} aria-hidden><ArrowLeft size={22} strokeWidth={1.4} /></span>
      {badge && <span className={s.badge}>{badge}</span>}
      <span className={s.bar}>
        <span className={s.top}>
          <span className={s.name}>{name}</span>
          {side ? <span className={s.side}>{side}</span> : meta && <span className={s.city}><MapPin size={16} strokeWidth={1.4} aria-hidden />{meta}</span>}
        </span>
        {side && meta && <span className={s.sub}><MapPin size={13} strokeWidth={1.5} aria-hidden />{meta}</span>}
        {line && <span className={s.line}><span>{line}</span></span>}
      </span>
    </Link>
  );
}
