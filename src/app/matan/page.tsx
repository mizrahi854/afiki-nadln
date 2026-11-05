import type { Metadata } from 'next';
import { ExtraPage } from '@/components/em/ExtraPage';
import { forSale, sold } from '@/lib/data';

export const metadata: Metadata = { title: 'מתן | אפיקי נדל״ן' };
const homes = [...forSale, ...sold].filter((l) => l.city === 'מתן').slice(0, 6);
export default function Page() {
  return <ExtraPage id="matan" hero="/media/pages/matan-0.jpg" kicker="יישוב קהילתי בדרום השרון" listings={homes} subject="הישוב מתן" />;
}
