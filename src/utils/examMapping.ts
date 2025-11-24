import { ExamType } from '@/types/quiz';

export const EXAM_SLUG_MAP: Record<ExamType, string> = {
  'takken': 'takken',
  'bookkeeping-elementary': 'bookkeeping-elementary',
  'web-creator': 'web-creator'
};

export const SLUG_EXAM_MAP: Record<string, ExamType> = {
  'takken': 'takken',
  'bookkeeping-elementary': 'bookkeeping-elementary',
  'web-creator': 'web-creator'
};

export const EXAM_INFO: Record<ExamType, { title: string; description: string; shortName: string }> = {
  'takken': {
    title: '宅建試験対策クイズ',
    description: '宅地建物取引士試験の学習用アプリです。',
    shortName: '宅建試験'
  },
  'bookkeeping-elementary': {
    title: '簿記初級対策クイズ',
    description: '簿記初級試験の学習用アプリです。',
    shortName: '簿記初級'
  },
  'web-creator': {
    title: 'Webクリエイター能力認定試験対策クイズ',
    description: 'Webクリエイター能力認定試験の学習用アプリです。',
    shortName: 'Webクリエイター'
  }
};

export function getExamTypeFromSlug(slug: string): ExamType | null {
  return SLUG_EXAM_MAP[slug] || null;
}

export function getSlugFromExamType(examType: ExamType): string {
  return EXAM_SLUG_MAP[examType];
}
