import { ExamType } from '@/types/quiz';

export const EXAM_INFO: Record<ExamType, { title: string; description: string; shortName: string }> = {
  'takken': {
    title: '宅建試験対策クイズ',
    description: '宅地建物取引士試験の学習用アプリです。',
    shortName: '宅建試験'
  },
  'land-surveyor': {
    title: '土地家屋調査士試験対策クイズ',
    description: '土地家屋調査士試験の学習用アプリです。',
    shortName: '土地家屋調査士'
  },
  'real-estate-appraiser': {
    title: '不動産鑑定士試験対策クイズ',
    description: '不動産鑑定士試験の学習用アプリです。',
    shortName: '不動産鑑定士'
  }
};

export function getExamTypeFromSlug(slug: string): ExamType | null {
  // Since slug and examType are the same, just validate
  if (slug === 'takken' || slug === 'land-surveyor' || slug === 'real-estate-appraiser') {
    return slug as ExamType;
  }
  return null;
}

export function getSlugFromExamType(examType: ExamType): string {
  // Since slug and examType are the same, just return it
  return examType;
}
