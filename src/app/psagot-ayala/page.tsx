import type { Metadata } from 'next';
import { ExtraPage } from '@/components/em/ExtraPage';
import { listingsIn } from '@/lib/data';

export const metadata: Metadata = { title: 'פסגות אילה | אפיקי נדל״ן' };
const homes = listingsIn('psagot-afek').slice(0, 6);
export default function Page() {
  return <ExtraPage id="psagot-ayala" hero="/media/banners/home-banner.jpg" kicker="פסגות אפק · רובע A" listings={homes} subject="פסגות אילה" />;
}
