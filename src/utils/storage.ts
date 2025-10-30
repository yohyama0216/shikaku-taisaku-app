import { QuestionProgress } from '@/types/quiz';

const STORAGE_KEY = 'hazmat-quiz-progress';

export const getQuestionProgress = (questionId: number): QuestionProgress | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return null;
    
    const allProgress: Record<number, QuestionProgress> = JSON.parse(data);
    return allProgress[questionId] || null;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

export const saveQuestionProgress = (questionId: number, isCorrect: boolean): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    const allProgress: Record<number, QuestionProgress> = data ? JSON.parse(data) : {};
    
    const existing = allProgress[questionId];
    
    if (existing) {
      allProgress[questionId] = {
        questionId,
        correctCount: existing.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: existing.incorrectCount + (isCorrect ? 0 : 1),
        lastAttemptCorrect: isCorrect,
      };
    } else {
      allProgress[questionId] = {
        questionId,
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: isCorrect ? 0 : 1,
        lastAttemptCorrect: isCorrect,
      };
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
  }
};

export const getAllProgress = (): Record<number, QuestionProgress> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return {};
  }
};

export const clearAllProgress = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};

export const shouldShowQuestion = (questionId: number): boolean => {
  const progress = getQuestionProgress(questionId);
  if (!progress) return true;
  
  // Don't show questions that have been answered correctly 4 or more times
  return progress.correctCount < 4;
};
