import { Question, ExamType } from '@/types/quiz';

// Import all question files
import takkenQuestions from '@/data/takken.json';
import landSurveyorQuestions from '@/data/land-surveyor.json';
import realEstateAppraiserQuestions from '@/data/real-estate-appraiser.json';
import rentalPropertyManagerQuestions from '@/data/rental-property-manager.json';
import condominiumManagerQuestions from '@/data/condominium-manager.json';
import webDesign3Questions from '@/data/web-design-3.json';

// Map of exam types to their questions
const questionsMap: Record<ExamType, Question[]> = {
  'takken': takkenQuestions as Question[],
  'land-surveyor': landSurveyorQuestions as Question[],
  'real-estate-appraiser': realEstateAppraiserQuestions as Question[],
  'rental-property-manager': rentalPropertyManagerQuestions as Question[],
  'condominium-manager': condominiumManagerQuestions as Question[],
  'web-design-3': webDesign3Questions as Question[],
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
