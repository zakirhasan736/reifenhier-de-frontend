import SeasonLanding, { seasonMetadata } from '@/components/seo/SeasonLanding';

export const revalidate = 1800;

export function generateMetadata() {
  return seasonMetadata('sommerreifen');
}

export default function Page() {
  return <SeasonLanding slug="sommerreifen" />;
}
