import StatsPageClient from './StatsPageClient';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'land-surveyor' },
    { examType: 'real-estate-appraiser' }
  ];
}

export default function StatsPage() {
  return <StatsPageClient />;
}
