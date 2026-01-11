import ExamPageClient from './ExamPageClient';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'land-surveyor' },
    { examType: 'real-estate-appraiser' },
    { examType: 'rental-property-manager' },
    { examType: 'condominium-manager' }
  ];
}

export default function ExamPage() {
  return <ExamPageClient />;
}
