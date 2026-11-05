import type { Metadata, Viewport } from 'next';
import { Heebo, Frank_Ruhl_Libre } from 'next/font/google';
import './globals.css';
import { SiteMotion } from '@/components/SiteMotion';

// Heebo: the site's one sans (Hebrew and Latin), chosen by the client. Variable 100–900, no faux bold.
const heebo = Heebo({ subsets: ['hebrew', 'latin'], variable: '--font-heebo', display: 'swap' });
// Serif: search bar title (hero) and the display headings of the dark sections (Emerald-style).
const serif = Frank_Ruhl_Libre({ subsets: ['hebrew', 'latin'], weight: ['300', '400', '500'], variable: '--font-serif', display: 'swap' });

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
    <html lang="he" dir="rtl" className={`${heebo.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: scaleScript }} />
      </head>
      <body>{children}<SiteMotion /></body>
    </html>
  );
}
