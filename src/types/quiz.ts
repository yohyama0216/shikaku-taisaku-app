export type ExamType = 'takken' | 'land-surveyor' | 'real-estate-appraiser' | 'rental-property-manager' | 'condominium-manager' | 'web-design-3';

export interface Question {
  id: number;
  examType: ExamType; // Type of exam
  category: string;
  question: string;
  choices: string[];
  correctAnswer: number; // 0-3 index of correct choice
  explanation: string;
  difficulty?: 'exam' | 'basic' | 'comparison' | 'terminology'; // exam level, basic level, comparison (similar terms/concepts), or terminology (simple definitions)
}

export interface QuestionProgress {
  questionId: number;
  correctCount: number;
  incorrectCount: number;
  lastAttemptCorrect: boolean;
}

export interface CategoryStats {
  category: string;
  totalQuestions: number;
  answeredQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface DailyStats {
  date: string; // ISO date string (YYYY-MM-DD)
  answeredCount: number; // Total number of questions answered at least once
  masteredCount: number; // Total number of questions with 4+ correct answers
}

export interface DailyActivity {
  date: string; // ISO date string (YYYY-MM-DD)
  examType: ExamType; // Type of exam
  questionsAnswered: number; // Number of questions answered on this day
  correctAnswers: number; // Number of correct answers on this day
  incorrectAnswers: number; // Number of incorrect answers on this day
}

export type BadgeType = 
  | 'questions_answered'
  | 'questions_mastered'
  | 'daily_streak'
  | 'daily_target'
  | 'weekly_target';

export interface Badge {
  id: string;
  type: BadgeType;
  name: string;
  description: string;
  icon: string;
  threshold: number;
  achieved: boolean;
  achievedDate?: string;
}

export interface BadgeProgress {
  earnedBadges: string[]; // Badge IDs
  lastActivityDate?: string; // For streak tracking
}
