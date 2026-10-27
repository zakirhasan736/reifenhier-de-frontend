import SeasonLanding, { seasonMetadata } from '@/components/seo/SeasonLanding';

export const revalidate = 1800;

export function generateMetadata() {
  return seasonMetadata('ganzjahresreifen');
}

export default function Page() {
  return <SeasonLanding slug="ganzjahresreifen" />;
}
