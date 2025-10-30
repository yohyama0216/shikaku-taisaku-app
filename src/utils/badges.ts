import { Badge, BadgeType, BadgeProgress, DailyStats } from '@/types/quiz';

const BADGE_STORAGE_KEY = 'hazmat-quiz-badges';

// Badge definitions
export const BADGE_DEFINITIONS: Omit<Badge, 'achieved' | 'achievedDate'>[] = [
  // Questions Answered badges
  {
    id: 'answered_10',
    type: 'questions_answered',
    name: '初心者',
    description: '10問回答した',
    icon: '🎯',
    threshold: 10,
  },
  {
    id: 'answered_50',
    type: 'questions_answered',
    name: '学習者',
    description: '50問回答した',
    icon: '📚',
    threshold: 50,
  },
  {
    id: 'answered_100',
    type: 'questions_answered',
    name: '熱心な学習者',
    description: '100問回答した',
    icon: '🔥',
    threshold: 100,
  },
  {
    id: 'answered_200',
    type: 'questions_answered',
    name: 'エキスパート',
    description: '200問回答した',
    icon: '⭐',
    threshold: 200,
  },
  
  // Questions Mastered badges
  {
    id: 'mastered_5',
    type: 'questions_mastered',
    name: 'マスター初級',
    description: '5問達成済みにした',
    icon: '🏅',
    threshold: 5,
  },
  {
    id: 'mastered_20',
    type: 'questions_mastered',
    name: 'マスター中級',
    description: '20問達成済みにした',
    icon: '🥈',
    threshold: 20,
  },
  {
    id: 'mastered_50',
    type: 'questions_mastered',
    name: 'マスター上級',
    description: '50問達成済みにした',
    icon: '🥇',
    threshold: 50,
  },
  
  // Daily Target badges
  {
    id: 'daily_20',
    type: 'daily_target',
    name: '1日20問',
    description: '1日で20問回答した',
    icon: '💪',
    threshold: 20,
  },
  {
    id: 'daily_50',
    type: 'daily_target',
    name: '1日50問',
    description: '1日で50問回答した',
    icon: '🚀',
    threshold: 50,
  },
  
  // Daily Streak badges
  {
    id: 'streak_3',
    type: 'daily_streak',
    name: '3日連続',
    description: '3日連続で学習した',
    icon: '🔗',
    threshold: 3,
  },
  {
    id: 'streak_7',
    type: 'daily_streak',
    name: '1週間連続',
    description: '7日連続で学習した',
    icon: '✨',
    threshold: 7,
  },
  {
    id: 'streak_30',
    type: 'daily_streak',
    name: '1ヶ月連続',
    description: '30日連続で学習した',
    icon: '👑',
    threshold: 30,
  },
  
  // Weekly Target badges
  {
    id: 'weekly_100',
    type: 'weekly_target',
    name: '週100問',
    description: '1週間で100問回答した',
    icon: '🎖️',
    threshold: 100,
  },
];

// Get badge progress from localStorage
export const getBadgeProgress = (): BadgeProgress => {
  if (typeof window === 'undefined') return { earnedBadges: [] };
  
  try {
    const data = localStorage.getItem(BADGE_STORAGE_KEY);
    return data ? JSON.parse(data) : { earnedBadges: [] };
  } catch (error) {
    console.error('Error reading badge progress:', error);
    return { earnedBadges: [] };
  }
};

// Save badge progress to localStorage
const saveBadgeProgress = (progress: BadgeProgress): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(BADGE_STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving badge progress:', error);
  }
};

// Award a badge
const awardBadge = (badgeId: string): boolean => {
  const progress = getBadgeProgress();
  
  if (progress.earnedBadges.includes(badgeId)) {
    return false; // Already earned
  }
  
  progress.earnedBadges.push(badgeId);
  saveBadgeProgress(progress);
  return true; // Newly earned
};

// Get today's date
const getTodayDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Calculate streak from daily stats
const calculateStreak = (dailyStats: DailyStats[]): number => {
  if (dailyStats.length === 0) return 0;
  
  const sortedStats = [...dailyStats].sort((a, b) => b.date.localeCompare(a.date));
  const today = getTodayDate();
  let streak = 0;
  
  for (let i = 0; i < sortedStats.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expectedDateStr = expectedDate.toISOString().split('T')[0];
    
    if (sortedStats[i].date === expectedDateStr) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Calculate answers in the last 7 days
const calculateWeeklyAnswers = (dailyStats: DailyStats[]): number => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return dailyStats
    .filter(stat => new Date(stat.date) >= sevenDaysAgo)
    .reduce((sum, stat) => sum + stat.answeredCount, 0);
};

// Check and award badges based on current stats
export const checkAndAwardBadges = (
  totalAnswered: number,
  totalMastered: number,
  dailyStats: DailyStats[]
): string[] => {
  const newBadges: string[] = [];
  
  // Check questions answered badges
  BADGE_DEFINITIONS
    .filter(badge => badge.type === 'questions_answered')
    .forEach(badge => {
      if (totalAnswered >= badge.threshold) {
        if (awardBadge(badge.id)) {
          newBadges.push(badge.id);
        }
      }
    });
  
  // Check questions mastered badges
  BADGE_DEFINITIONS
    .filter(badge => badge.type === 'questions_mastered')
    .forEach(badge => {
      if (totalMastered >= badge.threshold) {
        if (awardBadge(badge.id)) {
          newBadges.push(badge.id);
        }
      }
    });
  
  // Check daily target badges (today's answers)
  const todayStats = dailyStats.find(stat => stat.date === getTodayDate());
  if (todayStats) {
    BADGE_DEFINITIONS
      .filter(badge => badge.type === 'daily_target')
      .forEach(badge => {
        if (todayStats.answeredCount >= badge.threshold) {
          if (awardBadge(badge.id)) {
            newBadges.push(badge.id);
          }
        }
      });
  }
  
  // Check daily streak badges
  const currentStreak = calculateStreak(dailyStats);
  BADGE_DEFINITIONS
    .filter(badge => badge.type === 'daily_streak')
    .forEach(badge => {
      if (currentStreak >= badge.threshold) {
        if (awardBadge(badge.id)) {
          newBadges.push(badge.id);
        }
      }
    });
  
  // Check weekly target badges
  const weeklyAnswers = calculateWeeklyAnswers(dailyStats);
  BADGE_DEFINITIONS
    .filter(badge => badge.type === 'weekly_target')
    .forEach(badge => {
      if (weeklyAnswers >= badge.threshold) {
        if (awardBadge(badge.id)) {
          newBadges.push(badge.id);
        }
      }
    });
  
  return newBadges;
};

// Get all badges with achievement status
export const getAllBadges = (
  totalAnswered: number,
  totalMastered: number,
  dailyStats: DailyStats[]
): Badge[] => {
  const progress = getBadgeProgress();
  const todayStats = dailyStats.find(stat => stat.date === getTodayDate());
  const currentStreak = calculateStreak(dailyStats);
  const weeklyAnswers = calculateWeeklyAnswers(dailyStats);
  
  return BADGE_DEFINITIONS.map(badge => {
    const achieved = progress.earnedBadges.includes(badge.id);
    
    return {
      ...badge,
      achieved,
      achievedDate: achieved ? undefined : undefined, // Could be enhanced to store actual date
    };
  });
};

// Get current progress for each badge type
export const getBadgeStats = (
  totalAnswered: number,
  totalMastered: number,
  dailyStats: DailyStats[]
): Record<string, number> => {
  const todayStats = dailyStats.find(stat => stat.date === getTodayDate());
  
  return {
    totalAnswered,
    totalMastered,
    todayAnswers: todayStats?.answeredCount || 0,
    currentStreak: calculateStreak(dailyStats),
    weeklyAnswers: calculateWeeklyAnswers(dailyStats),
  };
};
