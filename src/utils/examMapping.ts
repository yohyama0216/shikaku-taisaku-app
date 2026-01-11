import { ExamType } from '@/types/quiz';

export const EXAM_INFO: Record<ExamType, { title: string; description: string; shortName: string }> = {
  'takken': {
    title: '宅建試験対策クイズ',
    description: '宅地建物取引士試験の学習用アプリです。',
    shortName: '宅建試験'
  },
  'web-creator': {
    title: 'Webクリエイター能力認定試験対策クイズ',
    description: 'Webクリエイター能力認定試験の学習用アプリです。',
    shortName: 'Webクリエイター'
  }
};

export function getExamTypeFromSlug(slug: string): ExamType | null {
  // Since slug and examType are the same, just validate
  if (slug === 'takken' || slug === 'web-creator') {
    return slug as ExamType;
  }
  return null;
}

export function getSlugFromExamType(examType: ExamType): string {
  // Since slug and examType are the same, just return it
  return examType;
}
