import QuizContentWrapper from './QuizContentWrapper';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'land-surveyor' },
    { examType: 'real-estate-appraiser' },
    { examType: 'rental-property-manager' },
    { examType: 'condominium-manager' }
  ];
}

export default function QuizPage() {
  return <QuizContentWrapper />;
}
