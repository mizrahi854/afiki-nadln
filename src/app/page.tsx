import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { HoodScene } from '@/components/HoodScene';
import { Hoods } from '@/components/Hoods';
import { Testimonials } from '@/components/home/Testimonials';
import { MortgageFab } from '@/components/home/MortgageFab';
import { CyprusTeaser } from '@/components/home/CyprusTeaser';
import { SellBand } from '@/components/home/SellBand';
import { AskYossi } from '@/components/home/AskYossi';
import { ValuationPopup } from '@/components/home/ValuationPopup';
import { SoldStrip } from '@/components/home/SoldStrip';
import { type Preset } from '@/components/em/Calculator';
import { EmHeader } from '@/components/em/EmHeader';
import { EmFooter } from '@/components/em/EmFooter';
import { EmCard } from '@/components/em/EmCard';
import { SlantStrips, type Strip } from '@/components/em/SlantStrips';
import { ContactFrame } from '@/components/em/ContactFrame';
import { Counter } from '@/components/em/motion';
import { forSale, kindOf, price, articles, dateHe, aboutSections, hoodPages } from '@/lib/data';
import em from '@/components/em/em.module.css';
import b from '@/components/em/blocks.module.css';
import g from './neighborhoods/hoods.module.css';
import h from './home.module.css';

const facts = (l: (typeof forSale)[number]) => [price(l.price), l.rooms && `${l.rooms} חד׳`, l.size && `${l.size} מ״ר`].filter(Boolean).join(' · ');
// 9340's cover is the same balcony as 9378's (same building), so it would read as a repeated card
const picks = forSale.filter((l) => l.images.length > 3 && kindOf(l) !== 'land' && l.id !== 9340).slice(0, 6);
const presets: Preset[] = forSale.filter((l) => l.price && kindOf(l) !== 'land').map((l) => ({ id: l.id, label: l.title, price: l.price! }));
/* 10: three guides for buying and selling, photos without printed text */
const guides = [8326, 8226, 4424].map((id) => articles.find((a) => Number(a.id) === id)).filter((a): a is (typeof articles)[number] => !!a && !!a.img);
const areas = Array.from(new Set(forSale.map((l) => l.area).filter((a): a is string => !!a)));
const lede = aboutSections[0].p[0].split(/(?<=[.!])\s+/).slice(0, 3).join(' ');

/* 7: the three ways in; copy from afikeynadlan.co.il's home page */
const services: Strip[] = [
  { title: 'קונים בית', img: '/media/listings/9364-0.jpg', href: '/properties', text: `נכסים חמים מהמדף עם המלצה שלנו: ${forSale.length} נכסים למכירה עכשיו.`, cta: 'לכל הנכסים' },
  { title: 'מוכרים נכס', img: '/media/listings/9237-0.jpg', href: '/sell', text: 'הנכס שלכם מקבל אלפי צפיות באתר וברשתות, ואנחנו משתפים פעולה עם משרדי תיווך בעיר ומחוצה לה.', cta: 'איך אנחנו מוכרים' },
  { title: 'מחפשים משהו מסוים?', img: '/media/hoods/givat-tal.webp', href: '/#talk-title', text: 'ספרו לנו מה אתם מחפשים: שכונה, גודל ותקציב, ויוסי יחזור אליכם עם מה שמתאים.', cta: 'ספרו לנו' },
];

export default function Page() {
  return (
    <div className={em.page}>
      <EmHeader />
      <main>
        {/* 1 */}
        <Hero areas={areas} />

        {/* 2 */}
        <section id="featured" className={`${em.wrap} ${h.listings}`} aria-labelledby="featured-title">
          <div className={em.headRow}>
            <h2 id="featured-title">נכסים שכדאי להכיר.</h2>
            <span className={em.rule} />
            <Link className={em.poly} href="/properties"><ArrowLeft aria-hidden strokeWidth={1.4} />לכל {forSale.length} הנכסים</Link>
          </div>
          <div className={g.grid}>
            {picks.map((l) => <EmCard key={l.id} href={`/properties/${l.id}`} img={l.images[0]} name={l.title} place={l.area ?? l.city} desc={facts(l)} />)}
          </div>
        </section>

        {/* 3 */}
        <SoldStrip />

        {/* 3b: the original site's "want to sell?" band */}
        <SellBand />

        {/* 4 — the counters sit beside the about text */}
        <section id="about" className={b.split} aria-labelledby="about-title">
          <div className={h.about}>
            <p className={em.kicker}>מי אנחנו</p>
            <h2 id="about-title" className={h.aboutTitle}>
              <span className={h.aboutLead}>משרד התיווך</span>
              <strong>בראש העין</strong>
            </h2>
            <p className={h.aboutText}>{lede}</p>
            <ul className={h.stats}>
              <li><b><Counter to={20} suffix="+" /></b><span>שנים של תיווך בראש העין</span></li>
              <li><b><Counter to={forSale.length} /></b><span>נכסים למכירה עכשיו</span></li>
              <li><b><Counter to={hoodPages.length} /></b><span>מדריכי שכונות באתר</span></li>
            </ul>
            <Link className={em.poly} href="/about"><ArrowLeft aria-hidden strokeWidth={1.4} />להכיר את אפיקי</Link>
          </div>
          <div className={b.chamfer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/team/yossi.jpg" alt="יוסי חיים, מייסד אפיקי נדל״ן" loading="lazy" />
          </div>
        </section>

        {/* 5 */}
        <Hoods />

        {/* 6 */}
        <HoodScene />

        {/* 7 — slides up over the last screen of the pinned scene */}
        <section id="services" className={`${h.services} ${h.overStage}`} aria-labelledby="services-title">
          <div className={em.splitHead}>
            <h2 id="services-title">איך אפשר לעזור לכם?</h2>
            <span className={em.rule} /><i className={em.diamond} /><span className={em.rule} />
            <p>קנייה, מכירה וליווי עד החתימה, בראש העין והסביבה.</p>
          </div>
          <SlantStrips items={services} />
        </section>

        {/* 8 */}
        <Testimonials />

        {/* 10 */}
        <section id="guides" className={`${em.wrap} ${h.blog}`} aria-labelledby="blog-title">
          <div className={em.headRow}>
            <h2 id="blog-title">מדריכים נבחרים.</h2>
            <span className={em.rule} />
            <Link className={em.poly} href="/articles"><ArrowLeft aria-hidden strokeWidth={1.4} />לכל המאמרים</Link>
          </div>
          <div className={g.grid}>
            {guides.map((a) => (
              <EmCard key={a.id} href={`/articles/${a.slug}`} img={a.img!} name={a.title} place={dateHe(a.date)} desc={a.excerpt.slice(0, 70) + '…'} mark={false} />
            ))}
          </div>
        </section>

        {/* 11 */}
        <CyprusTeaser />

        {/* 11b: the original site's dark Q&A band with Yossi */}
        <AskYossi />

        {/* 12 */}
        <ContactFrame title="בואו נמצא לכם את הבית הבא" />
      </main>
      <EmFooter />
      <MortgageFab presets={presets} />
      <ValuationPopup />
    </div>
  );
}
