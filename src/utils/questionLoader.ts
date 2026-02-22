import { Question, ExamType } from '@/types/quiz';

// Import all question files
import webDesign3Questions from '@/data/web-design-3.json';
import juniorHighEnglishQuestions from '@/data/junior-high-english.json';

// Map of exam types to their questions
const questionsMap: Record<ExamType, Question[]> = {
  'web-design-3': webDesign3Questions as Question[],
  'junior-high-english': juniorHighEnglishQuestions as Question[],
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
