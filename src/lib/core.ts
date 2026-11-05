/* JSON-free pieces of the data layer, safe to import from client components without shipping the listings,
   articles and pages to the browser. data.ts re-exports all of it. */

export type Listing = {
  id: number; slug: string; title: string; area: string | null; city: string;
  status: string[]; types: string[]; labels: string[]; features: string[];
  price: number | null; size: number | null; rooms: number | null; baths: number | null;
  address: string; body: string[]; link: string; images: string[];
};
export const isLand = (l: Listing) => l.status.includes('מגרשים למכירה');

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

export const EMAIL = 'yosi@afikeynadlan.co.il';
export const ADDRESS = 'שדרות שלמה המלך 2, ראש העין';
export const AGENT = 'יוסי חיים';
export const RIGHTS = 'כל הזכויות באתר שמורות לאפיקי נדל״ן. אין לצלם, להעתיק או להציג תמונות וחומרים גרפיים מהאתר למעט שיתוף נכסים בדרכים המקובלות.';
export const DISCLAIMER = 'כל המידע באתר הינו בגדר הבעת דעה ואין להתייחס אליו בגדר המלצות לפעולה.';

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
