import QuizContentWrapper from './QuizContentWrapper';

export function generateStaticParams() {
  return [
    { examType: 'web-design-3' },
    { examType: 'junior-high-english' }
  ];
}

export default function QuizPage() {
  return <QuizContentWrapper />;
}
