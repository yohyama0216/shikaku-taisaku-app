import { QuestionProgress, DailyStats, DailyActivity, ExamType } from '@/types/quiz';
import { checkAndAwardBadges } from './badges';

const EXAM_TYPES: ExamType[] = ['takken', 'land-surveyor', 'real-estate-appraiser', 'rental-property-manager', 'condominium-manager'];
const LAST_EXAM_TYPE_KEY = 'hazmat-quiz-last-exam-type';

// API-based storage functions
export const getQuestionProgress = async (questionId: number): Promise<QuestionProgress | null> => {
  try {
    const response = await fetch(`/api/progress?questionId=${questionId}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching question progress:', error);
    return null;
  }
};

export const saveQuestionProgress = async (questionId: number, isCorrect: boolean, examType: ExamType): Promise<void> => {
  try {
    const response = await fetch('/api/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ questionId, isCorrect, examType }),
    });

    if (!response.ok) {
      throw new Error('Failed to save progress');
    }

    // Check for new badges after saving
    const allProgress = await getAllProgress();
    const totalAnswered = Object.keys(allProgress).length;
    const totalMastered = Object.values(allProgress).filter(p => p.correctCount >= 4).length;
    const dailyStats = await getDailyStatsHistory();
    checkAndAwardBadges(totalAnswered, totalMastered, dailyStats);
  } catch (error) {
    console.error('Error saving question progress:', error);
  }
};

export const getAllProgress = async (): Promise<Record<number, QuestionProgress>> => {
  try {
    const response = await fetch('/api/progress');
    if (!response.ok) return {};
    return await response.json();
  } catch (error) {
    console.error('Error fetching all progress:', error);
    return {};
  }
};

export const clearAllProgress = async (): Promise<void> => {
  try {
    const response = await fetch('/api/progress', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to clear progress');
    }
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
};

export const shouldShowQuestion = async (questionId: number): Promise<boolean> => {
  const progress = await getQuestionProgress(questionId);
  if (!progress) return true;
  
  // Don't show questions that have been answered correctly 4 or more times
  return progress.correctCount < 4;
};

export const getDailyStatsHistory = async (): Promise<DailyStats[]> => {
  try {
    const response = await fetch('/api/stats?type=history');
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching stats history:', error);
    return [];
  }
};

export const getDailyActivityHistory = async (): Promise<DailyActivity[]> => {
  try {
    const response = await fetch('/api/stats?type=activity');
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return [];
  }
};

export const getTodayActivity = async (examType: ExamType): Promise<DailyActivity> => {
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const response = await fetch(`/api/stats?type=today&examType=${examType}`);
    if (!response.ok) {
      return {
        date: today,
        examType,
        questionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
      };
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching today activity:', error);
    return {
      date: today,
      examType,
      questionsAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  }
};

// Keep localStorage for last exam type (non-critical data)
export const saveLastExamType = (examType: ExamType): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LAST_EXAM_TYPE_KEY, examType);
  } catch (error) {
    console.error('Error saving last exam type:', error);
  }
};

export const getLastExamType = (): ExamType | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const examType = localStorage.getItem(LAST_EXAM_TYPE_KEY);
    if (examType && EXAM_TYPES.includes(examType as ExamType)) {
      return examType as ExamType;
    }
    return null;
  } catch (error) {
    console.error('Error reading last exam type:', error);
    return null;
  }
};
