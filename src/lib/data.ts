/* Real content pulled from afikeynadlan.co.il (listings API, neighborhood pages, about page). */
import listingsJson from './listings.json';
import hoodsJson from './hoods.json';
import aboutJson from './about.json';

export type Listing = {
  id: number; slug: string; title: string; area: string | null; city: string;
  status: string[]; types: string[]; labels: string[]; features: string[];
  price: number | null; size: number | null; rooms: number | null; baths: number | null;
  address: string; body: string[]; link: string; images: string[];
};
export type HoodSection = { h: string; p: string[]; quote?: string };
export type Hood = {
  slug: string; name: string; source: string; intro: string; sections: HoodSection[]; gallery: string[];
  prices?: [string, string][];
};

export const listings = listingsJson as Listing[];
export const hoodPages = hoodsJson as Hood[];
export const aboutSections = aboutJson as { h: string; p: string[] }[];

/** Neighborhood (as named on listings) → page slug */
const areaSlug: Record<string, string> = {
  'פסגות אפק': 'psagot-afek', 'גבעת טל': 'givat-tal', 'פסגת טל': 'givat-tal', 'גבעת הסלעים': 'givat-haslaim',
  'מצפה אפק': 'mitzpe-afek', 'נווה אפק': 'neve-afek', 'נופרים (נצבא)': 'nofarim',
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
};

/** listings.json holds only what is on the market now (sold ones were left out when it was built) */
export const forSale = listings;
export const isLand = (l: Listing) => l.status.includes('מגרשים למכירה');
export const getListing = (id: string) => listings.find((l) => String(l.id) === id);
export const getHood = (slug: string) => hoodPages.find((h) => h.slug === slug);
export const listingsIn = (slug: string) => listings.filter((l) => slugForArea(l.area) === slug);

/** Coarse kind for filters, from the site's own property types */
export type Kind = 'apartment' | 'garden' | 'penthouse' | 'house' | 'land';
export function kindOf(l: Listing): Kind {
  const t = l.types.join(' ') + ' ' + l.title;
  if (isLand(l) || /מגרש/.test(t)) return 'land';
  if (/פנטהאוז|פנטהאוס/.test(t)) return 'penthouse';
  if (/דירת גן|דירות גן|דופלקס גן|גינה פרטית/.test(t)) return 'garden';
  if (/קוטג|פרטי|דו משפחתי|טריפלקס|צמוד/.test(t)) return 'house';
  return 'apartment';
}
export const kindLabels: { id: 'all' | Kind; label: string }[] = [
  { id: 'all', label: 'הכל' }, { id: 'apartment', label: 'דירות' }, { id: 'garden', label: 'דירות גן' },
  { id: 'penthouse', label: 'פנטהאוזים' }, { id: 'house', label: 'בתים פרטיים' }, { id: 'land', label: 'מגרשים' },
];

export const place = (l: Listing) => [l.area, l.city].filter(Boolean).join(', ');
export const price = (n: number | null) => (n ? `₪${n.toLocaleString('en-US')}` : 'מחיר לפי פנייה');

/** Office details as published on afikeynadlan.co.il (contact page and footer) */
export const EMAIL = 'yosi@afikeynadlan.co.il';
export const ADDRESS = 'שדרות שלמה המלך 2, ראש העין';
export const AGENT = 'יוסי חיים';
export const RIGHTS = 'כל הזכויות באתר שמורות לאפיקי נדל״ן. אין לצלם, להעתיק או להציג תמונות וחומרים גרפיים מהאתר למעט שיתוף נכסים בדרכים המקובלות.';
export const DISCLAIMER = 'כל המידע באתר הינו בגדר הבעת דעה ואין להתייחס אליו בגדר המלצות לפעולה.';

/** Blog posts and legal/info pages scraped from the live site (WP REST), body as [kind, text] blocks */
import articlesJson from './articles.json';
import pagesJson from './pages.json';
export type Block = [string, string];
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
export const testimonials = [
  { name: 'סהר ברעם', text: 'אני מכיר את דגנית כבר תקופה ואת יוסי הכרתי לאחרונה. אני יכול להגיד על שניהם שמדובר באנשים אדיבים שנותנים מעל ומעבר. נהנתי להיעזר בהם בייעוץ והכוונה בראש העין. תודה.' },
  { name: 'דוד שילוח', text: 'המתווך הכי טוב בראש העין והסביבה. מכר לנו את הדירה בפחות מחודש וחצי. דאג לבצע את העסקה על הצד הטוב ביותר בכל ההיבטים שקשורים. יש ערך אמיתי למתווך מקצועי.' },
  { name: 'בני אהרון', text: 'אין מילים לתאר את המקצועיות, האמינות, האמון והיחס החם שקיבלתי מדגנית, מתחילת הדרך ועד לחתימה על החוזה. ממליץ בחום ואין לי ספק שדגנית תהיה גם המתווכת בעסקה הבאה שלי.' },
  { name: 'מירב לוי', text: 'יוסי ודגנית ליוו אותנו בקניית דירה ומכירה במקביל. עם אילוצים של לוחות זמנים צפופים ואתגרים לא פשוטים, הם היו מקצועיים, סבלניים ושירותיים. העניקו לנו ליווי צמוד, ממש יד ביד והובילו להצלחת העסקה. ממליצים בחום.' },
  { name: 'eyal e', text: 'אין מילים שיוכלו לתאר את האדם הנפלא בדמותה של מתווכת, שעשתה הכל כדי שנהיה מרוצים, מרגע יצירת הקשר ועד לחתימה. כשמגיע- מגיע! תודה גדולה/ענקית דגנית על כל הליווי, על תשומת הלב... לא מובן מאליו.' },
];

/** "השקעות בקפריסין" on afikeynadlan.co.il, verbatim. Photos are the page's "נכסים לדוגמא" gallery. */
export const cyprus = {
  source: 'https://www.afikeynadlan.co.il/השקעות-בקפריסין/',
  kicker: 'חברה בבעלות ישראלית',
  title: 'נכסים להשקעה בקפריסין',
  p: [
    'הי. שמי יוסי חיים מנכ״ל ובעלים של אפיקי נדל״ן. בשנים האחרונות פנו אלי עשרות לקוחות שביקשו ממני לחבר אותם למשקיעי נדל״ן בחו״ל, בעיקר בקפריסין.',
    'אז אני שמח לבשר שבימים אלו, נבחרתי לכהן כ- סמנכ״ל מכירות בחברת horizon property group הפעילה בפאפוס קפריסין משנת 2015. החברה עוסקת בליווי משקיעים לרכישת נדלן, סיוע בפתיחת חשבון בנק, שיפוץ, ריהוט ואבזור הנכס, בנייה, וניהול נכסים. יש לנו רקע נרחב בפתרונות מימון ואשראי בארץ ובקפריסין. ואנחנו מספקים חשיבה יצירתית ואסטרטגית ללקוחות מכל העולם. ברשות החברה עשרות פרויקטים להשקעה הנבחרים בקפידה ומתאימים למשקיע הישראלי. אנחנו מלווים את לקוחותינו בכל התהליך, החל משלב המיפוי ובדיקת הצרכים, דרך סיורי נכסים ובדיקת מסמכים ועד עריכת החוזה וניהול הנכס.',
    'אנו מחויבים לספק תקשורת שקופה וכנה לכל אורך התהליך, ולהבטיח שלקוחותינו יהיו מודעים ועם תחושת ביטחון בכל שלב בדרך.',
  ],
  /** What the company does, as listed in the second paragraph */
  services: ['ליווי משקיעים לרכישת נדל״ן', 'סיוע בפתיחת חשבון בנק', 'שיפוץ, ריהוט ואבזור הנכס', 'בנייה', 'ניהול נכסים', 'פתרונות מימון ואשראי בארץ ובקפריסין'],
  horizon: 'https://horizongroupp.com/',
  gallery: [27, 16, 2, 21, 18, 6, 24, 9, 3, 7, 15, 22, 19, 8, 26, 4, 11, 14, 23, 12, 17, 10, 13, 20, 5, 1].map((n) => `/media/cyprus/c${n}.jpg`),
};
