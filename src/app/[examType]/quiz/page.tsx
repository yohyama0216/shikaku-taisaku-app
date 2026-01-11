import QuizContentWrapper from './QuizContentWrapper';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'land-surveyor' },
    { examType: 'real-estate-appraiser' }
  ];
}

export default function QuizPage() {
  return <QuizContentWrapper />;
}
