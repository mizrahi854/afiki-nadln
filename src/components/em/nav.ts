/** Site navigation (header with dropdowns, mobile menu, footer). The groups follow the menu on afikeynadlan.co.il. */
export type NavLink = { label: string; href: string };
export type NavItem = NavLink & { children?: NavLink[] };

export const nav: NavItem[] = [
  { label: 'עמוד הבית', href: '/' },
  {
    label: 'נכסים למכירה', href: '/properties', children: [
      { label: 'כל הנכסים הפעילים', href: '/properties' },
      { label: 'דירות', href: '/properties?kind=apartment#all' },
      { label: 'דירות גן', href: '/properties?kind=garden#all' },
      { label: 'פנטהאוזים', href: '/properties?kind=penthouse#all' },
      { label: 'בתים פרטיים וקוטג׳ים', href: '/properties?kind=house#all' },
      { label: 'בתים עם גינה', href: '/gardens' },
      { label: 'פסגות אילה – מכירה מוקדמת', href: '/psagot-ayala' },
      { label: 'משרדים וחנויות בפסגות אפק', href: '/offices' },
      { label: 'נכסים שנמכרו', href: '/sold' },
      { label: 'מחשבון משכנתא', href: '/calculator' },
    ],
  },
  {
    label: 'מוכרים נכס?', href: '/sell', children: [
      { label: 'איך אנחנו מוכרים', href: '/sell' },
      { label: 'הערכת שווי נכס', href: '/sell#talk-title' },
      { label: 'נכסים שנמכרו', href: '/sold' },
      { label: 'איך מוכרים דירה כשיש עוד 10 כמוה', href: '/articles/9186' },
    ],
  },
  {
    label: 'שכונות בראש העין', href: '/neighborhoods', children: [
      { label: 'פסגות אפק', href: '/neighborhoods/psagot-afek' },
      { label: 'גבעת טל', href: '/neighborhoods/givat-tal' },
      { label: 'נופרים (נצבא)', href: '/neighborhoods/nofarim' },
      { label: 'נווה אפק', href: '/neighborhoods/neve-afek' },
      { label: 'גבעת הסלעים', href: '/neighborhoods/givat-haslaim' },
      { label: 'מצפה אפק', href: '/neighborhoods/mitzpe-afek' },
      { label: 'משכנות המוזיקה (ותיקה)', href: '/neighborhoods/vatika' },
      { label: 'הישוב מתן', href: '/matan' },
    ],
  },
  { label: 'השקעות בקפריסין', href: '/cyprus' },
  {
    label: 'מדריכים ובלוג', href: '/articles', children: [
      { label: 'מדריכים מקצועיים', href: '/guides' },
      { label: 'כך תבצעו עסקת נדל״ן נכונה', href: '/articles/8326' },
      { label: 'דירה להשקעה: מה לבדוק', href: '/articles/9387' },
      { label: 'מחזור משכנתא', href: '/articles/9147' },
      { label: 'שאלות ותשובות', href: '/faq' },
      { label: 'כל המאמרים', href: '/articles' },
    ],
  },
  { label: 'אודות', href: '/about' },
  { label: 'צרו קשר', href: '/#talk-title' }, // the contact block at the bottom of the page (see ContactLink)
];
