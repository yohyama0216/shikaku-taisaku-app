export interface Question {
  id: number;
  category: string;
  question: string;
  choices: string[];
  correctAnswer: number; // 0-3 index of correct choice
  explanation: string;
  difficulty?: 'exam' | 'basic'; // exam level or basic level
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
