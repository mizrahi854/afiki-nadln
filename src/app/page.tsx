import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Hero } from '@/components/Hero';
import { HoodScene } from '@/components/HoodScene';
import { Hoods } from '@/components/Hoods';
import { Testimonials } from '@/components/home/Testimonials';
import { MortgageFab } from '@/components/home/MortgageFab';
import { CyprusTeaser } from '@/components/home/CyprusTeaser';
import { SoldStrip } from '@/components/home/SoldStrip';
import { BannerBand } from '@/components/home/BannerBand';
import { Calculator, type Preset } from '@/components/em/Calculator';
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
const guide = articles.find((a) => a.title.includes('משכנתא'));
const areas = Array.from(new Set(forSale.map((l) => l.area).filter((a): a is string => !!a)));
const lede = aboutSections[0].p[0].split(/(?<=[.!])\s+/).slice(0, 3).join(' ');

/* What the office does; every line is the home page copy on afikeynadlan.co.il */
const services: Strip[] = [
  { title: 'קונים בית', img: '/media/listings/9364-0.jpg', href: '/properties', text: `נכסים חמים מהמדף עם המלצה שלנו: ${forSale.length} נכסים למכירה עכשיו.`, cta: 'לכל הנכסים' },
  { title: 'מוכרים נכס', img: '/media/listings/9237-0.jpg', href: '/sell', text: 'הנכס שלכם מקבל אלפי צפיות באתר וברשתות, ואנחנו משתפים פעולה עם משרדי תיווך בעיר ומחוצה לה.', cta: 'איך אנחנו מוכרים' },
  { title: 'בוחרים שכונה', img: '/media/hoods/givat-tal.webp', href: '/neighborhoods', text: 'מה השכונה שמתאימה לכם? כל המידע על השכונות בעיר והנכסים המוצעים בהן.', cta: 'למדריכי השכונות' },
  { title: 'שואלים אותנו', img: '/media/psagot/g31.jpg', href: '/faq', text: 'אספנו כמעט את כל השאלות שעולות מקונים ומוכרים, וענינו עליהן בהרחבה.', cta: 'לשאלות ותשובות' },
];

export default function Page() {
  return (
    <div className={em.page}>
      <EmHeader />
      <main>
        <Hero areas={areas} />

        <section className={`${em.wrap} ${h.listings}`} aria-labelledby="featured-title">
          <div className={em.headRow}>
            <h2 id="featured-title">נכסים חמים מהמדף, עם המלצה שלנו.</h2>
            <span className={em.rule} />
            <Link className={em.poly} href="/properties"><ArrowLeft aria-hidden strokeWidth={1.4} />לכל {forSale.length} הנכסים</Link>
          </div>
          <div className={g.grid}>
            {picks.map((l) => <EmCard key={l.id} href={`/properties/${l.id}`} img={l.images[0]} name={l.title} place={l.area ?? l.city} desc={facts(l)} />)}
          </div>
        </section>

        <SoldStrip />

        <HoodScene />
        <Hoods overlap />

        <section className={`${em.wrap} ${h.mortgage}`} aria-labelledby="mortgage-home-title" data-mortgage-inline>
          <div className={h.mortgageText}>
            <p className={em.kicker}>כמה זה יעלה לי בחודש?</p>
            <h2 id="mortgage-home-title" className={h.aboutTitle}>
              <span className={h.aboutLead}><i className={em.diamond} aria-hidden /><span aria-hidden />מחשבון</span>
              <strong>משכנתא</strong>
            </h2>
            <p className={h.aboutText}>בחרו נכס מהמדף או הזינו מחיר משלכם, ותראו מיד את ההחזר החודשי, את סכום ההלוואה ואת אחוז המימון.</p>
            <ol className={h.steps}>
              <li><b>01</b><span>בוחרים נכס או מזינים מחיר</span></li>
              <li><b>02</b><span>מעדכנים הון עצמי, תקופה וריבית</span></li>
              <li><b>03</b><span>מדברים איתנו על המספרים</span></li>
            </ol>
            <div className={h.mortgageLinks}>
              <Link className={em.poly} href="/contact"><ArrowLeft aria-hidden strokeWidth={1.4} />לייעוץ אישי</Link>
              {guide && <Link href={`/articles/${guide.slug}`}>המדריך שלנו למשכנתא</Link>}
            </div>
          </div>
          <Calculator compact presets={presets} />
        </section>

        <CyprusTeaser />

        <BannerBand />

        <section className={h.services} aria-labelledby="services-title">
          <div className={em.splitHead}>
            <h2 id="services-title">מה אנחנו עושים</h2>
            <span className={em.rule} /><i className={em.diamond} /><span className={em.rule} />
            <p>קנייה, מכירה וליווי עד החתימה, בראש העין והסביבה.</p>
          </div>
          <SlantStrips items={services} />
        </section>

        <section className={b.split} aria-labelledby="about-title">
          <div className={h.about}>
            <p className={em.kicker}>מי אנחנו</p>
            <h2 id="about-title" className={h.aboutTitle}>
              <span className={h.aboutLead}><i className={em.diamond} aria-hidden /><span aria-hidden />משרד התיווך</span>
              <strong>בראש העין</strong>
            </h2>
            <p className={h.aboutText}>{lede}</p>
            <Link className={em.poly} href="/about"><ArrowLeft aria-hidden strokeWidth={1.4} />להכיר את אפיקי</Link>
          </div>
          <div className={b.chamfer}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/media/team/yossi.jpg" alt="יוסי חיים, מייסד אפיקי נדל״ן" loading="lazy" />
          </div>
        </section>

        <ul className={b.counters}>
          <li><b><Counter to={20} suffix="+" /></b><span>שנים של תיווך בראש העין</span></li>
          <li><b><Counter to={forSale.length} /></b><span>נכסים למכירה עכשיו</span></li>
          <li><b><Counter to={hoodPages.length} /></b><span>מדריכי שכונות באתר</span></li>
        </ul>

        <Testimonials />

        <section className={`${em.wrap} ${h.blog}`} aria-labelledby="blog-title">
          <div className={em.headRow}>
            <h2 id="blog-title">מהבלוג שלנו.</h2>
            <span className={em.rule} />
            <Link className={em.poly} href="/articles"><ArrowLeft aria-hidden strokeWidth={1.4} />לכל המאמרים</Link>
          </div>
          <div className={g.grid}>
            {articles.filter((a) => a.img).slice(0, 3).map((a) => (
              <EmCard key={a.id} href={`/articles/${a.slug}`} img={a.img!} name={a.title} place={dateHe(a.date)} desc={a.excerpt.slice(0, 70) + '…'} mark={false} />
            ))}
          </div>
        </section>

        <ContactFrame title="בואו נמצא לכם את הבית הבא" />
      </main>
      <EmFooter />
      <MortgageFab presets={presets} />
    </div>
  );
}
