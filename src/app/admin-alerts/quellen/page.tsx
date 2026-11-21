import type { Metadata } from 'next';
import TrafficClient from './TrafficClient';

export const metadata: Metadata = {
  title: 'Besucherquellen',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function TrafficPage() {
  return <TrafficClient />;
}
