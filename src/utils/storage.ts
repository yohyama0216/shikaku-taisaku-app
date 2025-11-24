import { QuestionProgress, DailyStats, DailyActivity, ExamType } from '@/types/quiz';
import { checkAndAwardBadges } from './badges';

const STORAGE_KEY = 'hazmat-quiz-progress';
const STATS_HISTORY_KEY = 'hazmat-quiz-stats-history';
const DAILY_ACTIVITY_KEY = 'hazmat-quiz-daily-activity';
const LAST_EXAM_TYPE_KEY = 'hazmat-quiz-last-exam-type';

const EXAM_TYPES: ExamType[] = ['takken', 'bookkeeping-elementary', 'web-creator'];

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

export const saveQuestionProgress = (questionId: number, isCorrect: boolean, examType: ExamType): void => {
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
    
    // Update daily statistics after saving progress
    updateDailyStats(allProgress);
    
    // Update daily activity with examType
    updateDailyActivity(isCorrect, examType);
    
    // Check for new badges
    const totalAnswered = Object.keys(allProgress).length;
    const totalMastered = Object.values(allProgress).filter(p => p.correctCount >= 4).length;
    const dailyStats = getDailyStatsHistory();
    checkAndAwardBadges(totalAnswered, totalMastered, dailyStats);
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

// Get today's date in YYYY-MM-DD format using local timezone
const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Update daily statistics
const updateDailyStats = (allProgress: Record<number, QuestionProgress>): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const today = getTodayDate();
    const answeredCount = Object.keys(allProgress).length;
    const masteredCount = Object.values(allProgress).filter(p => p.correctCount >= 4).length;
    
    const historyData = localStorage.getItem(STATS_HISTORY_KEY);
    const history: DailyStats[] = historyData ? JSON.parse(historyData) : [];
    
    // Check if today's stats already exist
    const todayIndex = history.findIndex(stat => stat.date === today);
    
    if (todayIndex >= 0) {
      // Update today's stats
      history[todayIndex] = {
        date: today,
        answeredCount,
        masteredCount,
      };
    } else {
      // Add new entry for today
      history.push({
        date: today,
        answeredCount,
        masteredCount,
      });
      
      // Sort and keep only last 30 days of data
      history.sort((a, b) => a.date.localeCompare(b.date));
      if (history.length > 30) {
        history.splice(0, history.length - 30);
      }
    }
    
    localStorage.setItem(STATS_HISTORY_KEY, JSON.stringify(history));
  } catch (error) {
    console.error('Error updating daily stats:', error);
  }
};

// Get daily statistics history
export const getDailyStatsHistory = (): DailyStats[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(STATS_HISTORY_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading stats history:', error);
    return [];
  }
};

// Update daily activity tracking
const updateDailyActivity = (isCorrect: boolean, examType: ExamType): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const today = getTodayDate();
    const activityData = localStorage.getItem(DAILY_ACTIVITY_KEY);
    const activities: DailyActivity[] = activityData ? JSON.parse(activityData) : [];
    
    // Check if today's activity for this examType already exists
    const todayIndex = activities.findIndex(activity => activity.date === today && activity.examType === examType);
    
    if (todayIndex >= 0) {
      // Update today's activity for this exam type
      activities[todayIndex] = {
        date: today,
        examType: examType,
        questionsAnswered: activities[todayIndex].questionsAnswered + 1,
        correctAnswers: activities[todayIndex].correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: activities[todayIndex].incorrectAnswers + (isCorrect ? 0 : 1),
      };
    } else {
      // Add new entry for today and this exam type
      activities.push({
        date: today,
        examType: examType,
        questionsAnswered: 1,
        correctAnswers: isCorrect ? 1 : 0,
        incorrectAnswers: isCorrect ? 0 : 1,
      });
      
      // Sort and keep only last 30 days of data
      activities.sort((a, b) => b.date.localeCompare(a.date));
      if (activities.length > 90) { // Keep 30 days * 3 exam types max
        activities.splice(90);
      }
    }
    
    localStorage.setItem(DAILY_ACTIVITY_KEY, JSON.stringify(activities));
  } catch (error) {
    console.error('Error updating daily activity:', error);
  }
};

// Get daily activity history (last 30 days)
export const getDailyActivityHistory = (): DailyActivity[] => {
  if (typeof window === 'undefined') return [];
  
  try {
    const data = localStorage.getItem(DAILY_ACTIVITY_KEY);
    const activities: DailyActivity[] = data ? JSON.parse(data) : [];
    
    // Sort by date descending (newest first)
    return activities.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('Error reading daily activity history:', error);
    return [];
  }
};

// Get today's activity statistics for a specific exam type
export const getTodayActivity = (examType: ExamType): DailyActivity => {
  if (typeof window === 'undefined') {
    return {
      date: getTodayDate(),
      examType: examType,
      questionsAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  }
  
  try {
    const today = getTodayDate();
    const activities = getDailyActivityHistory();
    const todayActivity = activities.find(activity => activity.date === today && activity.examType === examType);
    
    return todayActivity || {
      date: today,
      examType: examType,
      questionsAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  } catch (error) {
    console.error('Error reading today activity:', error);
    return {
      date: getTodayDate(),
      examType: examType,
      questionsAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  }
};

// Save the last selected exam type
export const saveLastExamType = (examType: ExamType): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(LAST_EXAM_TYPE_KEY, examType);
  } catch (error) {
    console.error('Error saving last exam type:', error);
  }
};

// Get the last selected exam type
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
