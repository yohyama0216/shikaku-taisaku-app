import { QuestionProgress, DailyStats, DailyActivity, ExamType } from '@/types/quiz';
import { checkAndAwardBadges } from './badges';

const EXAM_TYPES: ExamType[] = ['takken', 'land-surveyor', 'real-estate-appraiser', 'rental-property-manager', 'condominium-manager'];
const LAST_EXAM_TYPE_KEY = 'hazmat-quiz-last-exam-type';
const PROGRESS_STORAGE_KEY = 'shikaku-quiz-progress';
const DAILY_STATS_STORAGE_KEY = 'shikaku-quiz-daily-stats';
const DAILY_ACTIVITY_STORAGE_KEY = 'shikaku-quiz-daily-activity';

// Get today's date in YYYY-MM-DD format
function getTodayDate(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// LocalStorage-based storage functions
export const getQuestionProgress = async (questionId: number): Promise<QuestionProgress | null> => {
  if (typeof window === 'undefined') return null;
  
  try {
    const allProgress = await getAllProgress();
    return allProgress[questionId] || null;
  } catch (error) {
    console.error('Error fetching question progress:', error);
    return null;
  }
};

export const saveQuestionProgress = async (questionId: number, isCorrect: boolean, examType: ExamType): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
    // Get existing progress
    const allProgress = await getAllProgress();
    const existing = allProgress[questionId];

    if (existing) {
      // Update existing progress
      allProgress[questionId] = {
        questionId,
        correctCount: existing.correctCount + (isCorrect ? 1 : 0),
        incorrectCount: existing.incorrectCount + (isCorrect ? 0 : 1),
        lastAttemptCorrect: isCorrect,
      };
    } else {
      // Insert new progress
      allProgress[questionId] = {
        questionId,
        correctCount: isCorrect ? 1 : 0,
        incorrectCount: isCorrect ? 0 : 1,
        lastAttemptCorrect: isCorrect,
      };
    }

    // Save to localStorage
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));

    // Update daily stats
    await updateDailyStats(allProgress);

    // Update daily activity
    await updateDailyActivity(isCorrect, examType);

    // Check for new badges after saving
    const totalAnswered = Object.keys(allProgress).length;
    const totalMastered = Object.values(allProgress).filter(p => p.correctCount >= 4).length;
    const dailyStats = await getDailyStatsHistory();
    checkAndAwardBadges(totalAnswered, totalMastered, dailyStats);
  } catch (error) {
    console.error('Error saving question progress:', error);
  }
};

export const getAllProgress = async (): Promise<Record<number, QuestionProgress>> => {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!stored) return {};
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error fetching all progress:', error);
    return {};
  }
};

export const clearAllProgress = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(PROGRESS_STORAGE_KEY);
    localStorage.removeItem(DAILY_STATS_STORAGE_KEY);
    localStorage.removeItem(DAILY_ACTIVITY_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing progress:', error);
  }
};

// Helper function to update daily stats
async function updateDailyStats(allProgress: Record<number, QuestionProgress>) {
  if (typeof window === 'undefined') return;
  
  const today = getTodayDate();
  const answeredCount = Object.keys(allProgress).length;
  const masteredCount = Object.values(allProgress).filter(p => p.correctCount >= 4).length;

  try {
    const stored = localStorage.getItem(DAILY_STATS_STORAGE_KEY);
    const allStats: DailyStats[] = stored ? JSON.parse(stored) : [];

    // Find or create today's stats
    const existingIndex = allStats.findIndex(s => s.date === today);
    const todayStats: DailyStats = {
      date: today,
      answeredCount,
      masteredCount,
    };

    if (existingIndex >= 0) {
      allStats[existingIndex] = todayStats;
    } else {
      allStats.push(todayStats);
    }

    // Clean up old stats (keep last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
    const filteredStats = allStats.filter(s => s.date >= cutoffDate);

    localStorage.setItem(DAILY_STATS_STORAGE_KEY, JSON.stringify(filteredStats));
  } catch (error) {
    console.error('Error updating daily stats:', error);
  }
}

// Helper function to update daily activity
async function updateDailyActivity(isCorrect: boolean, examType: ExamType) {
  if (typeof window === 'undefined') return;
  
  const today = getTodayDate();

  try {
    const stored = localStorage.getItem(DAILY_ACTIVITY_STORAGE_KEY);
    const allActivities: DailyActivity[] = stored ? JSON.parse(stored) : [];

    // Find or create today's activity for this exam type
    const existingIndex = allActivities.findIndex(
      a => a.date === today && a.examType === examType
    );

    if (existingIndex >= 0) {
      // Update existing activity
      const existing = allActivities[existingIndex];
      allActivities[existingIndex] = {
        date: today,
        examType,
        questionsAnswered: existing.questionsAnswered + 1,
        correctAnswers: existing.correctAnswers + (isCorrect ? 1 : 0),
        incorrectAnswers: existing.incorrectAnswers + (isCorrect ? 0 : 1),
      };
    } else {
      // Insert new activity
      allActivities.push({
        date: today,
        examType,
        questionsAnswered: 1,
        correctAnswers: isCorrect ? 1 : 0,
        incorrectAnswers: isCorrect ? 0 : 1,
      });
    }

    // Clean up old activities (keep last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];
    const filteredActivities = allActivities.filter(a => a.date >= cutoffDate);

    localStorage.setItem(DAILY_ACTIVITY_STORAGE_KEY, JSON.stringify(filteredActivities));
  } catch (error) {
    console.error('Error updating daily activity:', error);
  }
}

export const shouldShowQuestion = async (questionId: number): Promise<boolean> => {
  const progress = await getQuestionProgress(questionId);
  if (!progress) return true;
  
  // Don't show questions that have been answered correctly 4 or more times
  return progress.correctCount < 4;
};

export const getDailyStatsHistory = async (): Promise<DailyStats[]> => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(DAILY_STATS_STORAGE_KEY);
    if (!stored) return [];
    const stats: DailyStats[] = JSON.parse(stored);
    // Sort by date ascending
    return stats.sort((a, b) => a.date.localeCompare(b.date));
  } catch (error) {
    console.error('Error fetching stats history:', error);
    return [];
  }
};

export const getDailyActivityHistory = async (): Promise<DailyActivity[]> => {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(DAILY_ACTIVITY_STORAGE_KEY);
    if (!stored) return [];
    const activities: DailyActivity[] = JSON.parse(stored);
    // Sort by date descending
    return activities.sort((a, b) => b.date.localeCompare(a.date));
  } catch (error) {
    console.error('Error fetching activity history:', error);
    return [];
  }
};

export const getTodayActivity = async (examType: ExamType): Promise<DailyActivity> => {
  const today = getTodayDate();
  
  if (typeof window === 'undefined') {
    return {
      date: today,
      examType,
      questionsAnswered: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    };
  }
  
  try {
    const stored = localStorage.getItem(DAILY_ACTIVITY_STORAGE_KEY);
    if (!stored) {
      return {
        date: today,
        examType,
        questionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
      };
    }
    
    const activities: DailyActivity[] = JSON.parse(stored);
    const todayActivity = activities.find(
      a => a.date === today && a.examType === examType
    );
    
    if (todayActivity) {
      return todayActivity;
    } else {
      return {
        date: today,
        examType,
        questionsAnswered: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
      };
    }
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
