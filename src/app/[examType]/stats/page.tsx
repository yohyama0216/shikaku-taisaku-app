import StatsPageClient from './StatsPageClient';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'land-surveyor' },
    { examType: 'real-estate-appraiser' },
    { examType: 'rental-property-manager' },
    { examType: 'condominium-manager' },
    { examType: 'web-design-3' }
  ];
}

export default function StatsPage() {
  return <StatsPageClient />;
}
