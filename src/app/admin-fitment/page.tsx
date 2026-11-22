import FitmentAdmin from './FitmentAdmin';

export const metadata = { title: 'Auto-API Verwaltung', robots: { index: false, follow: false } };

export default function AdminFitmentPage() {
  return <FitmentAdmin api={process.env.NEXT_PUBLIC_API_URL || 'https://api.reifexa.de'} />;
}
