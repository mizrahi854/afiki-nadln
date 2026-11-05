import type { Metadata } from 'next';
import { ExtraPage } from '@/components/em/ExtraPage';
import { forSale, kindOf } from '@/lib/data';

export const metadata: Metadata = { title: 'בתים עם גינה | אפיקי נדל״ן' };
const homes = forSale.filter((l) => ['garden', 'house'].includes(kindOf(l))).slice(0, 9);
// the original page lists its properties under their own titles; its text stops at the first one
const isListing = (t: string) => /חדרים|טריפלקס|דופלקס|קוטג|דו משפחתי|פרטי/.test(t);

export default function Page() {
  return <ExtraPage id="gardens" hero="/media/listings/9201-0.jpg" kicker="דירות גן ובתים פרטיים" listings={homes} stop={isListing} subject="בתים עם גינה" />;
}
