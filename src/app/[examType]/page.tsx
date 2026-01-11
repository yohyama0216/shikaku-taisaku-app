import ExamPageClient from './ExamPageClient';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'land-surveyor' },
    { examType: 'real-estate-appraiser' }
  ];
}

export default function ExamPage() {
  return <ExamPageClient />;
}
