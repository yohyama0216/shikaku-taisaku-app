import { ExamType } from '@/types/quiz';

export const EXAM_INFO: Record<ExamType, { title: string; description: string; shortName: string }> = {
  'web-design-3': {
    title: 'Webデザイン技能検定3級対策クイズ',
    description: 'Webデザイン技能検定3級試験の学習用アプリです。',
    shortName: 'Webデザイン技能検定3級'
  },
  'junior-high-english': {
    title: '中学生レベル日常英語クイズ',
    description: '日本人が言い間違いやすい日常英会話表現を中心に学べるクイズです。',
    shortName: '中学英語・日常会話'
  }
};

export function getExamTypeFromSlug(slug: string): ExamType | null {
  // Since slug and examType are the same, just validate
  if (slug === 'web-design-3' || slug === 'junior-high-english') {
    return slug as ExamType;
  }
  return null;
}

export function getSlugFromExamType(examType: ExamType): string {
  // Since slug and examType are the same, just return it
  return examType;
}
