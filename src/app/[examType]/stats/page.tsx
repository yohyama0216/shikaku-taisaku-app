import StatsPageClient from './StatsPageClient';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'bookkeeping-elementary' },
    { examType: 'web-creator' }
  ];
}

export default function StatsPage() {
  return <StatsPageClient />;
}
