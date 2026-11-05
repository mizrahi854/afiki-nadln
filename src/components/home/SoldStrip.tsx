import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { sold } from '@/lib/data';
import em from '../em/em.module.css';
import s from './SoldStrip.module.css';

const row = sold.filter((l) => l.images.length).slice(0, 14);

/**
 * "נמכרו לאחרונה": the sold listings as an endless row that drifts sideways (paused on hover and focus),
 * each photo stamped with a petrol "נמכר" corner. The row is doubled for the loop; the copy is hidden
 * from assistive tech and from tabbing.
 */
export function SoldStrip() {
  const card = (l: (typeof row)[number], dup: boolean) => (
    <li key={`${dup ? 'b' : 'a'}${l.id}`} aria-hidden={dup || undefined}>
      <Link href={`/properties/${l.id}`} className={s.card} tabIndex={dup ? -1 : undefined}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={l.images[0]} alt="" loading="lazy" />
        <span className={s.stamp}>נמכר</span>
        <span className={s.info}><b>{l.title}</b><span>{l.area ?? l.city}</span></span>
      </Link>
    </li>
  );
  return (
    <section className={s.section} aria-labelledby="sold-title" data-no-motion>
      <div className={`${em.wrap} ${em.headRow}`}>
        <h2 id="sold-title">נמכרו לאחרונה.</h2>
        <span className={em.rule} />
        <Link className={em.poly} href="/sold"><ArrowLeft aria-hidden strokeWidth={1.4} />לכל {sold.length} הנכסים שנמכרו</Link>
      </div>
      <div className={s.view}>
        <ul className={s.track} style={{ ['--n' as string]: row.length }}>
          {row.map((l) => card(l, false))}
          {row.map((l) => card(l, true))}
        </ul>
      </div>
    </section>
  );
}
