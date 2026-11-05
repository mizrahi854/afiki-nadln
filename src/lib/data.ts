/* Real content pulled from afikeynadlan.co.il (listings API, neighborhood pages, about page). */
import listingsJson from './listings.json';
import hoodsJson from './hoods.json';
import aboutJson from './about.json';
import soldJson from './sold.json';
import extraJson from './extra-pages.json';
import { isLand, type Listing } from './core';

export * from './core';

export type HoodSection = { h: string; p: string[]; quote?: string };
export type Hood = {
  slug: string; name: string; source: string; intro: string; sections: HoodSection[]; gallery: string[];
  prices?: [string, string][];
};

export const listings = listingsJson as Listing[];
/** Sold properties (status "נמכר" on the original site), newest first, up to 4 photos each */
export const sold = soldJson as (Listing & { date: string })[];
export const isSold = (l: Listing) => l.status.includes('נמכר');

export type Block = [string, string];
/** Original-site pages that have no counterpart yet: Matan, Psagot Ayala, offices, gardens, guides, Vatika */
export const extraPages = extraJson as unknown as Record<'matan' | 'psagot-ayala' | 'offices' | 'gardens' | 'guides' | 'vatika', { title: string; source: string; body: Block[]; images: string[] }>;

/** Vatika / Mishkenot HaMuzika: built from its original page (heading → paragraphs) */
function hoodFrom(slug: string, name: string, page: (typeof extraPages)['vatika']): Hood {
  const sections: HoodSection[] = [];
  for (const [k, t] of page.body) {
    if (k === 'h') sections.push({ h: t, p: [] });
    else if (sections.length) sections[sections.length - 1].p.push(t);
  }
  const full = sections.filter((x) => x.p.length);
  return { slug, name, source: page.source, intro: full[0]?.p[0] ?? '', sections: full, gallery: [] };
}
export const hoodPages = [...(hoodsJson as Hood[]), hoodFrom('vatika', 'משכנות המוזיקה (ותיקה)', extraPages.vatika)];
export const aboutSections = aboutJson as { h: string; p: string[] }[];

/** Neighborhood (as named on listings) → page slug */
const areaSlug: Record<string, string> = {
  'פסגות אפק': 'psagot-afek', 'גבעת טל': 'givat-tal', 'פסגת טל': 'givat-tal', 'גבעת הסלעים': 'givat-haslaim',
  'מצפה אפק': 'mitzpe-afek', 'נווה אפק': 'neve-afek', 'נופרים (נצבא)': 'nofarim', 'משכנות המוזיקה (ותיקה)': 'vatika',
};
export const slugForArea = (a: string | null) => (a ? areaSlug[a] : undefined);

/** Card photo and one line for each neighborhood page */
export const hoodCards: Record<string, { img: string; line: string }> = {
  'psagot-afek': { img: '/media/hoods/psagot.webp', line: 'דירות חדשות בסטנדרט גבוה, מוקד לזוגות צעירים ומשפרי דיור.' },
  'givat-tal': { img: '/media/hoods/givat-tal.webp', line: 'השכונה המבוקשת בעיר: בתים פרטיים על מגרשים של עד דונם.' },
  'givat-haslaim': { img: '/media/hoods/givat-haslaim.webp', line: 'שכונה שקטה ומבוססת, כ־3,000 תושבים, ליד אגם הצלילים.' },
  'mitzpe-afek': { img: '/media/listings/9211-0.jpg', line: 'שכונה ותיקה בדרום העיר, סמוכה לכבישים 6, 444 ו־5.' },
  'neve-afek': { img: '/media/listings/9201-0.jpg', line: 'שכונה שקטה במזרח העיר, דירות ובתים פרטיים לצד פארקים.' },
  'nofarim': { img: '/media/hoods/nofarim.webp', line: '19 בניינים של עד 18 קומות סביב פארק ירוק.' },
  'vatika': { img: '/media/hoods/vatika.webp', line: 'בנייה חדשה בלב העיר הוותיקה, פארק ואמפיתיאטרון.' },
};

/** listings.json holds only what is on the market now (sold ones were left out when it was built) */
export const forSale = listings;
export const getListing = (id: string) => listings.find((l) => String(l.id) === id) ?? sold.find((l) => String(l.id) === id);
export const getHood = (slug: string) => hoodPages.find((h) => h.slug === slug);
export const listingsIn = (slug: string) => listings.filter((l) => slugForArea(l.area) === slug);



/** Office details as published on afikeynadlan.co.il (contact page and footer) */


/** Blog posts and legal/info pages scraped from the live site (WP REST), body as [kind, text] blocks */
import articlesJson from './articles.json';
import pagesJson from './pages.json';
export type Article = { id: number; slug: string; title: string; date: string; excerpt: string; img: string | null; body: Block[]; source: string };
export const articles = articlesJson as Article[];
export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
export const infoPages = pagesJson as Record<'accessibility' | 'sell' | 'privacy', { title: string; source: string; body: Block[] }>;
export const dateHe = (d: string) => new Date(d).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });

/** Questions that Afikey's own articles ask as headings, each with the paragraph that answers it */
export const articleQuestions = articles.flatMap((a) =>
  a.body.flatMap(([k, t], i) => {
    const next = a.body[i + 1];
    return k === 'h' && t.trim().endsWith('?') && !/^(ו|אז |למה דווקא|מה קורה אם)/.test(t) && next && next[0] === 'p' && next[1].length > 60 && t !== a.title
      ? [{ q: t.replace(/\s+/g, ' ').trim(), a: next[1].length < 140 && a.body[i + 2]?.[0] === 'p' ? `${next[1]} ${a.body[i + 2][1]}` : next[1], href: `/articles/${a.slug}`, from: a.title }]
      : [];
  }),
);

/** Client reviews, word for word from the "מה לקוחות מספרים?" block on afikeynadlan.co.il/אודות (emoji left out) */
