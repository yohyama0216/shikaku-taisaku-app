import QuizContentWrapper from './QuizContentWrapper';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'bookkeeping-elementary' },
    { examType: 'web-creator' }
  ];
}

export default function QuizPage() {
  return <QuizContentWrapper />;
}
