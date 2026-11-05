import type { Metadata, Viewport } from 'next';
import { Rubik, Frank_Ruhl_Libre, Noto_Sans_Hebrew } from 'next/font/google';
import './globals.css';

// Rubik: matched to the design by letterforms (rounded ה/ת, curved ע). Variable weights, no faux bold.
const rubik = Rubik({ subsets: ['hebrew', 'latin'], variable: '--font-rubik', display: 'swap' });
// Serif: search bar title (hero) and the display headings of the dark sections (Emerald-style).
const serif = Frank_Ruhl_Libre({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '500'], variable: '--font-serif', display: 'swap' });
// Inner pages (Emerald structure): Emerald sets everything in a licensed condensed sans (Mikmoret).
// Noto Sans Hebrew has a width axis, so it runs condensed at the same sizes without copying their font.
const narrow = Noto_Sans_Hebrew({ subsets: ['hebrew', 'latin'], axes: ['wdth'], variable: '--font-narrow', display: 'swap' });

export const metadata: Metadata = {
  title: 'אפיקי נדל״ן — כאן מתחיל העתיד',
  description: 'אפיקי נדל״ן — הכתובת שלכם לבית בראש העין.',
  robots: { index: false, follow: false },
  icons: { icon: '/media/brand/favicon.png' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#e9e4da' };

// The hero photo is drawn on a 1536×1024 canvas (the approved design) scaled to cover one screen.
// Set the scale before first paint so there is no jump.
const scaleScript = `(function(){function f(){var w=document.documentElement.clientWidth,h=Math.max(600,innerHeight);document.documentElement.style.setProperty('--hs',String(Math.max(w/1536,h/1024)));}f();addEventListener('resize',f);})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${rubik.variable} ${serif.variable} ${narrow.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scaleScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
