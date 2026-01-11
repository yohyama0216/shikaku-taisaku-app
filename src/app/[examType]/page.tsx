import ExamPageClient from './ExamPageClient';

export function generateStaticParams() {
  return [
    { examType: 'takken' },
    { examType: 'web-creator' }
  ];
}

export default function ExamPage() {
  return <ExamPageClient />;
}
