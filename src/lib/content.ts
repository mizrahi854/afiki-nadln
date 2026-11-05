/* Real content, taken from afikeynadlan.co.il (listings, neighborhoods, about, client reviews). */
export const SITE = 'https://www.afikeynadlan.co.il';
export const PHONE = '054-3107444';

export type Kind = 'garden' | 'penthouse' | 'house';
export type Listing = {
  title: string; place: string; price: number; img: string; badge: string; kind: Kind; href: string;
  area?: number; rooms?: number; baths?: number;
};

/** The first entry is the large card. */
export const featured: Listing[] = [
  { title: 'דו משפחתי מפואר', place: 'אורנית', price: 5990000, img: '/media/props/oranit.webp', badge: 'בלעדי', kind: 'house',
    area: 290, rooms: 8.5, baths: 4, href: '/properties/9350' },
  { title: 'מיני פנטהאוז 4.5 חדרים', place: 'פסגות אפק, ראש העין', price: 2680000, img: '/media/props/psagot-ph.webp', badge: 'חדש בשוק', kind: 'penthouse',
    href: '/properties/9378' },
  { title: 'טריפלקס משפחתי', place: 'פסגת טל, ראש העין', price: 4700000, img: '/media/props/tal-triplex.webp', badge: 'בלעדי', kind: 'house',
    href: '/properties/9409' },
  { title: 'דירת גן 5 חדרים', place: 'מצפה אפק, ראש העין', price: 2820000, img: '/media/props/mitzpe-garden.webp', badge: 'חדש בשוק', kind: 'garden',
    href: '/properties/9211' },
  { title: 'בית פרטי יוקרתי', place: 'גבעת טל, ראש העין', price: 6950000, img: '/media/props/givat-tal.webp', badge: 'בלעדי', kind: 'house',
    href: '/properties/9237' },
];

export const kinds: { id: 'all' | Kind; label: string }[] = [
  { id: 'all', label: 'הכל' },
  { id: 'garden', label: 'דירות גן' },
  { id: 'penthouse', label: 'פנטהאוזים' },
  { id: 'house', label: 'בתים פרטיים' },
];

export const hoods = [
  { slug: 'givat-tal', name: 'גבעת טל', img: '/media/hoods/givat-tal.webp', line: 'השכונה המבוקשת בעיר: בתים פרטיים על מגרשים של עד דונם.' },
  { slug: 'psagot-afek', name: 'פסגות אפק', img: '/media/hoods/psagot.webp', line: 'דירות חדשות בסטנדרט גבוה, מוקד לזוגות צעירים ומשפרי דיור.' },
  { slug: 'nofarim', name: 'נופרים (נצבא)', img: '/media/hoods/nofarim.webp', line: '19 בניינים של עד 18 קומות סביב פארק ירוק.' },
  { slug: '', name: 'ותיקה ומשכנות המוזיקה', img: '/media/hoods/vatika.webp', line: 'בנייה חדשה בלב העיר הוותיקה, פארק ואמפיתיאטרון.' },
  { slug: 'givat-haslaim', name: 'גבעת הסלעים', img: '/media/hoods/givat-haslaim.webp', line: 'שכונה שקטה ומבוססת, כ־3,000 תושבים.' },
];

export const reviews = [
  { name: 'דוד שילוח', text: 'מכר לנו את הדירה בפחות מחודש וחצי. דאג לבצע את העסקה על הצד הטוב ביותר בכל ההיבטים. יש ערך אמיתי למתווך מקצועי.' },
  { name: 'מירב לוי', text: 'ליוו אותנו בקניית דירה ומכירה במקביל, עם לוחות זמנים צפופים. מקצועיים, סבלניים ושירותיים — ממש יד ביד עד הצלחת העסקה.' },
  { name: 'סהר ברעם', text: 'אנשים אדיבים שנותנים מעל ומעבר. נהניתי להיעזר בהם בייעוץ והכוונה בראש העין. תודה.' },
];

export const ils = (n: number) => `₪${n.toLocaleString('en-US')}`;
