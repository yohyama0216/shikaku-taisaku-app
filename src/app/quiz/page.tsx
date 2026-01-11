'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Question, ExamType } from '@/types/quiz';
import { saveQuestionProgress, shouldShowQuestion, saveLastExamType, getLastExamType } from '@/utils/storageDB';
import { getSlugFromExamType } from '@/utils/examMapping';
import { getQuestionsByExamType } from '@/utils/questionLoader';

function QuizContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const category = searchParams.get('category') || 'all';
  const difficulty = searchParams.get('difficulty') || 'all';
  const examType = (searchParams.get('examType') || 'takken') as ExamType;

  const [availableQuestions, setAvailableQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [shuffledChoices, setShuffledChoices] = useState<Array<{ text: string; originalIndex: number }>>([]);

  // Get questions for the exam type
  const questions = getQuestionsByExamType(examType);
  
  // Get unique categories for dropdown filtered by examType
  const allCategories = Array.from(new Set(questions.map(q => q.category)));

  // Save the exam type to localStorage when it changes (only if different from stored value)
  useEffect(() => {
    const storedExamType = getLastExamType();
    if (storedExamType !== examType) {
      saveLastExamType(examType);
    }
  }, [examType]);

  // Shuffle choices whenever the current question changes
  useEffect(() => {
    if (availableQuestions.length > 0 && availableQuestions[currentQuestionIndex]) {
      const currentQuestion = availableQuestions[currentQuestionIndex];
      const choicesWithIndices = currentQuestion.choices.map((text, index) => ({
        text,
        originalIndex: index
      }));
      
      // Fisher-Yates shuffle algorithm
      const shuffled = [...choicesWithIndices];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      
      setShuffledChoices(shuffled);
    }
  }, [currentQuestionIndex, availableQuestions.length]);

  // Filter questions by category, difficulty and availability
  useEffect(() => {
    const filterQuestions = async () => {
      const filtered = [];
      for (const q of questions) {
        const matchesCategory = category === 'all' || q.category === category;
        const matchesDifficulty = difficulty === 'all' || q.difficulty === difficulty;
        const shouldShow = await shouldShowQuestion(q.id);
        if (matchesCategory && matchesDifficulty && shouldShow) {
          filtered.push(q);
        }
      }

      if (filtered.length === 0) {
        // No more questions available
        const examSlug = getSlugFromExamType(examType);
        router.push(`/${examSlug}/stats`);
        return;
      }

      setAvailableQuestions(filtered);
    };

    filterQuestions();
  }, [examType, category, difficulty, router]);

  // Timer countdown
  useEffect(() => {
    if (showResult || availableQuestions.length === 0) return;

    if (timeLeft === 0) {
      setIsTimeUp(true);
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult, availableQuestions.length]);

  const handleTimeUp = async () => {
    const currentQuestion = availableQuestions[currentQuestionIndex];
    if (currentQuestion) {
      await saveQuestionProgress(currentQuestion.id, false, examType);
      setShowResult(true);
    }
  };

  const handleAnswer = async (shuffledIndex: number) => {
    if (showResult || isTimeUp || shuffledIndex >= shuffledChoices.length) return;

    const originalIndex = shuffledChoices[shuffledIndex].originalIndex;
    setSelectedAnswer(shuffledIndex);
    const currentQuestion = availableQuestions[currentQuestionIndex];
    const isCorrect = originalIndex === currentQuestion.correctAnswer;
    
    await saveQuestionProgress(currentQuestion.id, isCorrect, examType);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < availableQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(20);
      setIsTimeUp(false);
    } else {
      const examSlug = getSlugFromExamType(examType);
      router.push(`/${examSlug}/stats`);
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDifficulty = e.target.value;
    router.push(`/quiz?difficulty=${newDifficulty}&category=${category}&examType=${examType}`);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    router.push(`/quiz?difficulty=${difficulty}&category=${encodeURIComponent(newCategory)}&examType=${examType}`);
  };

  if (availableQuestions.length === 0) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
      </div>
    );
  }

  const currentQuestion = availableQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer !== null && selectedAnswer < shuffledChoices.length && shuffledChoices[selectedAnswer].originalIndex === currentQuestion.correctAnswer;
  
  // Get difficulty badge color
  const getDifficultyBadge = (difficulty?: string) => {
    switch (difficulty) {
      case 'exam':
        return { color: 'bg-danger', label: '試験' };
      case 'basic':
        return { color: 'bg-success', label: '基礎' };
      case 'comparison':
        return { color: 'bg-warning', label: '比較' };
      case 'terminology':
        return { color: 'bg-info', label: '用語' };
      default:
        return { color: 'bg-secondary', label: '不明' };
    }
  };
  
  const difficultyBadge = getDifficultyBadge(currentQuestion.difficulty);
  const difficultyBadgeColor = difficultyBadge.color;
  const difficultyLabel = difficultyBadge.label;

  return (
    <main>
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="h5 mb-0">
              問題 {currentQuestionIndex + 1} / {availableQuestions.length}
            </h2>
            <div>
              <span className={`badge ${difficultyBadgeColor} me-2`}>{difficultyLabel}</span>
              <span className="badge bg-secondary me-2">{currentQuestion.category}</span>
              {!showResult && (
                <span className={`badge ${timeLeft <= 5 ? 'bg-danger' : 'bg-primary'} fs-6`}>
                  残り{timeLeft}秒
                </span>
              )}
            </div>
          </div>

          {/* Settings Panel */}
          <div className="card mb-3 border-info">
            <div className="card-body py-2">
              <div className="row g-2">
                <div className="col-md-6">
                  <label htmlFor="difficulty-select" className="form-label small mb-1">難易度</label>
                  <select 
                    id="difficulty-select"
                    className="form-select form-select-sm"
                    value={difficulty}
                    onChange={handleDifficultyChange}
                  >
                    <option value="all">すべて</option>
                    <option value="terminology">用語定義</option>
                    <option value="basic">基礎レベル</option>
                    <option value="comparison">比較問題</option>
                    <option value="exam">試験レベル</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="category-select" className="form-label small mb-1">カテゴリ</label>
                  <select 
                    id="category-select"
                    className="form-select form-select-sm"
                    value={category}
                    onChange={handleCategoryChange}
                  >
                    <option value="all">すべて</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="card-title h5 mb-4">{currentQuestion.question}</h3>

              <div className="d-grid gap-2">
                {shuffledChoices.map((choice, shuffledIndex) => {
                  let buttonClass = 'btn btn-outline-primary text-start';
                  
                  if (showResult) {
                    if (choice.originalIndex === currentQuestion.correctAnswer) {
                      buttonClass = 'btn btn-success text-start';
                    } else if (shuffledIndex === selectedAnswer) {
                      buttonClass = 'btn btn-danger text-start';
                    } else {
                      buttonClass = 'btn btn-outline-secondary text-start';
                    }
                  } else if (selectedAnswer === shuffledIndex) {
                    buttonClass = 'btn btn-primary text-start';
                  }

                  return (
                    <button
                      key={shuffledIndex}
                      className={buttonClass}
                      onClick={() => handleAnswer(shuffledIndex)}
                      disabled={showResult}
                    >
                      {choice.text}
                    </button>
                  );
                })}
              </div>

              {showResult && (
                <div className="mt-4">
                  <div className={`alert ${isTimeUp ? 'alert-warning' : (isCorrect ? 'alert-success' : 'alert-danger')}`}>
                    <h5 className="alert-heading">
                      {isTimeUp ? '⏰ 時間切れ' : (isCorrect ? '✓ 正解！' : '✗ 不正解')}
                    </h5>
                    <hr />
                    <p className="mb-0">
                      <strong>解説：</strong> {currentQuestion.explanation}
                    </p>
                  </div>

                  <button
                    className="btn btn-primary btn-lg w-100"
                    onClick={handleNext}
                  >
                    {currentQuestionIndex < availableQuestions.length - 1 ? '次の問題へ' : '統計を表示'}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3">
            <button
              className="btn btn-outline-secondary"
              onClick={() => router.push('/')}
            >
              ← ホームに戻る
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">読み込み中...</span>
        </div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
