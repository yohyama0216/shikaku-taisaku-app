import StatsPageClient from './StatsPageClient';

export function generateStaticParams() {
  return [
    { examType: 'web-design-3' },
    { examType: 'junior-high-english' }
  ];
}

export default function StatsPage() {
  return <StatsPageClient />;
}
