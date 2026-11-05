import type { Metadata } from 'next';
import { Search, Users, Megaphone, Handshake, Heart } from 'lucide-react';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { Collage } from '@/components/em/Collage';
import { ContactFrame } from '@/components/em/ContactFrame';
import { Rule } from '@/components/em/Rule';
import { FadeUp, Counter } from '@/components/em/motion';
import { aboutSections, infoPages, forSale, hoodPages } from '@/lib/data';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';
import s from './about.module.css';

export const metadata: Metadata = { title: 'אודות | אפיקי נדל״ן' };

const sentences = (t: string) => t.replace(/\*\*/g, '').split(/(?<=[.!])\s+/);
const first = (t: string) => { const w = sentences(t)[0].split(' '); return w.length > 18 ? w.slice(0, 18).join(' ') + '…' : w.join(' '); };
/** The five value cards: the four steps of Afikey's selling method (sell page) and the clients section (about page) */
const sell = infoPages.sell.body;
const method = sell.flatMap(([k, t], i) => (k === 'h' && sell[i + 1]?.[0] === 'p' ? [{ h: t.replace(/\*$/, ''), p: first(sell[i + 1][1]) }] : [])).slice(0, 4);
const clients = aboutSections.find((x) => x.h.includes('לקוחות'));
const values = [...method, ...(clients ? [{ h: clients.h, p: first(clients.p[0]) }] : [])].slice(0, 5);
const icons = [Search, Users, Megaphone, Handshake, Heart];

/** Emerald's about page: title and text right with the framed photo collage left (mouse parallax), the vision row,
 * the value cards over a photo band, counters, the contact frame. */
export default function AboutPage() {
  const [intro, unique, belief] = aboutSections;
  const all = intro.p.flatMap(sentences);
  const lede = all.slice(0, 2).join(' ');
  const restIntro = all.slice(2).join(' ');
  return (
    <div className={em.page}>
      <EmHeader />
      <main>
        <section className={`${s.hero} ${em.lines}`}>
          <Collage images={['/media/team/yossi.jpg', '/media/psagot/fly-2.jpg', '/media/listings/9237-0.jpg', '/media/team/moran.jpg', '/media/hoods/givat-tal.webp']} />
          <div className={s.heroText}>
            <h1 className={s.title}>
              <span className={s.lead}><span className={s.mark} aria-hidden><i className={em.diamond} /><span /></span>משרד התיווך</span>
              <span className={s.big}>בראש העין</span>
            </h1>
            <div className={s.text}><p>{lede}</p></div>
          </div>
        </section>

        <section className={`${em.wrap} ${s.vision}`}>
          <Rule kicker="אני מאמין" title={unique.h} />
          <div className={em.prose}>
            {restIntro && <p>{restIntro}</p>}
            {unique.p.map((p, i) => <p key={i}>{p}</p>)}
            {belief.p.map((p, i) => <p key={`b${i}`}>{p}</p>)}
          </div>
        </section>

        <section className={b.values} style={{ ['--band' as string]: 'url(/media/psagot/fly-4.jpg)' }} aria-labelledby="values-title">
          <div className={em.wrap}>
            <Rule kicker="השיטה שלנו" title="איך אנחנו עובדים" id="values-title" />
            <ul className={b.cards5}>
              {values.map((v, i) => {
                const I = icons[i];
                return (
                  <FadeUp as="li" key={v.h} delay={i * 100} className={`${em.frame} ${b.vcard}`}>
                    <span className={b.badge}><I aria-hidden strokeWidth={1.4} /></span>
                    <h3>{v.h}</h3>
                    <p>{v.p}</p>
                  </FadeUp>
                );
              })}
            </ul>
          </div>
        </section>

        <ul className={b.counters}>
          <li><b><Counter to={20} suffix="+" /></b><span>שנים של תיווך בראש העין</span></li>
          <li><b><Counter to={forSale.length} /></b><span>נכסים למכירה עכשיו</span></li>
          <li><b><Counter to={hoodPages.length} /></b><span>מדריכי שכונות באתר</span></li>
        </ul>

        <ContactFrame title="בואו נדבר על הבית הבא שלכם" />
      </main>
      <EmFooter />
    </div>
  );
}
