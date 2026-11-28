import type { Metadata } from 'next';
import OpsDesk from './OpsDesk';

export const metadata: Metadata = {
  title: 'Ops',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function OpsPage() {
  return <OpsDesk />;
}
