import type { Metadata } from 'next';
import { ExtraPage } from '@/components/em/ExtraPage';

export const metadata: Metadata = { title: 'משרדים בפסגות אפק | אפיקי נדל״ן' };

export default function Page() {
  return <ExtraPage id="offices" hero="/media/pages/offices-0.jpg" kicker="חנויות ומשרדים" subject="משרדים בפסגות אפק" />;
}
