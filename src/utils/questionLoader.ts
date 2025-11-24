import { Question, ExamType } from '@/types/quiz';

// Import all question files
import takkenQuestions from '@/data/takken.json';
import bookkeepingQuestions from '@/data/bookkeeping-elementary.json';
import webCreatorQuestions from '@/data/web-creator.json';

// Map of exam types to their questions
const questionsMap: Record<ExamType, Question[]> = {
  'takken': takkenQuestions as Question[],
  'bookkeeping-elementary': bookkeepingQuestions as Question[],
  'web-creator': webCreatorQuestions as Question[],
};

/**
 * Get questions for a specific exam type
 * @param examType - The exam type to get questions for
 * @returns Array of questions for the specified exam type
 */
export function getQuestionsByExamType(examType: ExamType): Question[] {
  return questionsMap[examType] || [];
}

/**
 * Get all questions from all exam types
 * @returns Array of all questions
 */
export function getAllQuestions(): Question[] {
  return Object.values(questionsMap).flat();
}

/**
 * Get questions for multiple exam types
 * @param examTypes - Array of exam types to get questions for
 * @returns Array of questions for the specified exam types
 */
export function getQuestionsByExamTypes(examTypes: ExamType[]): Question[] {
  return examTypes.flatMap(examType => getQuestionsByExamType(examType));
}
