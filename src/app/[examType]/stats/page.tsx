import StatsPageClient from './StatsPageClient';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'web-creator' }
  ];
}

export default function StatsPage() {
  return <StatsPageClient />;
}
