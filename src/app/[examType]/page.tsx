import ExamPageClient from './ExamPageClient';

export function generateStaticParams() {
  return [
    { examType: 'web-design-3' },
    { examType: 'junior-high-english' }
  ];
}

export default function ExamPage() {
  return <ExamPageClient />;
}
